import { ProgressBar } from '#/cli/ux/ProgressBar';
import { Reasoner } from '#/cli/ux/Reasoner';
import { Spinner } from '#/cli/ux/Spinner';
import { getInlineExcludedFiles } from '#/comments/getInlineExcludedFiles';
import { getOutputExcludedFiles } from '#/comments/getOutputExcludedFiles';
import { SymbolTable } from '#/compilers/SymbolTable';
import { getExportStatement } from '#/compilers/getExportStatement';
import type { IExportStatement } from '#/compilers/interfaces/IExportStatement';
import { CE_GENERATION_STYLE } from '#/configs/const-enum/CE_GENERATION_STYLE';
import { getExtendOptions } from '#/configs/getExtendOptions';
import type { TCommandBuildOptions } from '#/configs/interfaces/TCommandBuildOptions';
import type { TCreateOptions } from '#/configs/interfaces/TCreateOptions';
import { getAllParentDir } from '#/modules//path/getAllParentDir';
import { ProjectContainer } from '#/modules/file/ProjectContainer';
import { checkOutputFile } from '#/modules/file/checkOutputFile';
import { getTsExcludeFiles } from '#/modules/file/getTsExcludeFiles';
import { getTsIncludeFiles } from '#/modules/file/getTsIncludeFiles';
import { dfsWalk } from '#/modules/file/walk';
import { addCurrentDirPrefix } from '#/modules/path/addCurrentDirPrefix';
import { getDepth } from '#/modules/path/getDepth';
import { getImportStatementExtname } from '#/modules/path/getImportStatementExtname';
import { getParentDir } from '#/modules/path/getParentDir';
import { ExcludeContainer } from '#/modules/scope/ExcludeContainer';
import { IncludeContainer } from '#/modules/scope/IncludeContainer';
import { indexWrites } from '#/modules/writes/indexWrites';
import { CE_AUTO_RENDER_CASE } from '#/templates/const-enum/CE_AUTO_RENDER_CASE';
import type { IIndexRenderData } from '#/templates/interfaces/IIndexRenderData';
import { TemplateContainer } from '#/templates/modules/TemplateContainer';
import { createRenderData } from '#/templates/modules/createRenderData';
import { getAutoRenderCase } from '#/templates/modules/getAutoRenderCase';
import { getRenderData } from '#/templates/modules/getRenderData';
import chalk from 'chalk';
import { getDirnameSync } from 'my-node-fp';
import path from 'node:path';
import type * as tsm from 'ts-morph';

export async function creating(_buildOptions: TCommandBuildOptions, createOption: TCreateOptions) {
  Spinner.it.start("ctix 'create' mode start, ...");

  await TemplateContainer.bootstrap();
  const extendOptions = await getExtendOptions(createOption.project);
  const project = ProjectContainer.project(createOption.project);

  Spinner.it.succeed(`${createOption.project} loading complete!`);
  Spinner.it.update('include, exclude config');

  const include = new IncludeContainer({
    config: { include: getTsIncludeFiles({ config: createOption, extend: extendOptions }) },
  });

  const inlineExcludeds = getInlineExcludedFiles({
    project,
    extendOptions,
    filePaths: extendOptions.tsconfig.fileNames,
  });

  const outputExcludeds = await getOutputExcludedFiles({
    project,
    filePaths: extendOptions.tsconfig.fileNames,
    extendOptions,
    exportFilename: createOption.exportFilename,
  });

  /**
   * SourceCode를 읽어서 inline file exclude 된 파일을 별도로 전달한다. 이렇게 하는 이유는, 이 파일은 왜 포함되지
   * 않았지? 라는 등의 리포트를 생성할 때 한 곳에서 이 정보를 다 관리해야 리포트를 생성해서 보여줄 수 있기 때문이다
   */
  const exclude = new ExcludeContainer({
    config: {
      exclude: [
        ...getTsExcludeFiles({ config: createOption, extend: extendOptions }),
        ...outputExcludeds,
      ],
    },
    inlineExcludeds,
  });

  const filenames = extendOptions.tsconfig.fileNames
    .filter((filename) => include.isInclude(filename))
    .filter((filename) => !exclude.isExclude(filename));

  Spinner.it.succeed('analysis export statements completed!');
  Spinner.it.stop();

  ProgressBar.it.head = '    file ';
  ProgressBar.it.start(filenames.length, 0);

  const statements = (
    await Promise.all(
      filenames
        .map((filename) => project.getSourceFile(filename))
        .filter((sourceFile): sourceFile is tsm.SourceFile => sourceFile != null)
        .map(async (sourceFile) => {
          const statement = await getExportStatement(sourceFile, createOption, extendOptions);
          return statement;
        }),
    )
  ).flat();

  ProgressBar.it.stop();

  const filePathMap = new Map<string, IExportStatement[]>();
  const dirPathMap = new Map<string, IExportStatement[]>();
  const symbolTable = new SymbolTable();

  symbolTable.inserts(statements);

  Spinner.it.start(`build ${`"${chalk.green(createOption.exportFilename)}"`} file start`);

  statements
    .filter((statement) => !symbolTable.isDuplicate(statement))
    .forEach((statement) => {
      const filePath = path.join(statement.path.dirPath, statement.path.filename);
      const filePathAccessed = filePathMap.get(filePath);

      if (filePathAccessed == null) {
        filePathMap.set(filePath, [statement]);
      } else {
        filePathAccessed.push(statement);
        filePathMap.set(filePath, filePathAccessed);
      }

      const dirPathAccessed = dirPathMap.get(statement.path.dirPath);

      if (dirPathAccessed == null) {
        dirPathMap.set(statement.path.dirPath, [statement]);
      } else {
        dirPathAccessed.push(statement);
        dirPathMap.set(statement.path.dirPath, dirPathAccessed);
      }
    });

  Spinner.it.stop();
  ProgressBar.it.head = '  export ';
  ProgressBar.it.start(statements.length, 0);

  const renderDataMap = new Map<
    string,
    { case: CE_AUTO_RENDER_CASE; style: CE_GENERATION_STYLE; renderData: IIndexRenderData }[]
  >();

  Array.from(filePathMap.entries())
    .map(([filePath, exportStatements]) => getRenderData(createOption, filePath, exportStatements))
    .filter((renderData): renderData is IIndexRenderData => renderData != null)
    .map((renderData) => {
      const style =
        createOption.generationStyle === CE_GENERATION_STYLE.AUTO
          ? getAutoRenderCase(renderData)
          : ({
              case: CE_AUTO_RENDER_CASE.UNKNOWN,
              style: createOption.generationStyle,
            } satisfies ReturnType<typeof getAutoRenderCase>);

      return { renderData, ...style };
    })
    .forEach((data) => {
      const key = getDirnameSync(data.renderData.filePath);
      const prev = renderDataMap.get(key);

      if (prev == null) {
        renderDataMap.set(key, [data]);
      } else {
        renderDataMap.set(key, [...prev, data]);
      }

      ProgressBar.it.increment();
    });

  await dfsWalk(createOption.startFrom, (params) => {
    // 상위 디렉터리에 하위 디렉터리 정보를 추가하는 작업이기 때문에, 최상위 디렉터리는 별도의 작업이 필요없다
    // Since we're adding subdirectory information to a parent directory,
    // the top-level directory doesn't need to do anything.
    if (createOption.startFrom === params.dirPath) {
      return;
    }

    const parentDir = getParentDir(params.dirPath);

    if (parentDir == null) {
      return;
    }

    if (createOption.skipEmptyDir) {
      if ((dirPathMap.get(params.dirPath) ?? []).length <= 0) {
        return;
      }

      const parentDirs = getAllParentDir(createOption.startFrom, params.dirPath);
      const firstExistDir = parentDirs
        .sort((l, r) => getDepth(r) - getDepth(l))
        .find((dir) => {
          return (dirPathMap.get(dir) ?? []).length > 0;
        });

      if (firstExistDir == null) {
        throw new Error('Cannot find the parent directory where the export statement is existed');
      }

      // index.ts 파일을 생성하기 위한 render data를 생성한다
      // Generate render data to create an `index.ts` file
      const indexRednerData = createRenderData(
        CE_AUTO_RENDER_CASE.DEFAULT_NAMED,
        CE_GENERATION_STYLE.DEFAULT_STAR_NAMED_STAR,
        createOption,
        path.join(firstExistDir, createOption.exportFilename),
        {
          importPath: addCurrentDirPrefix(path.relative(firstExistDir, params.dirPath)),
          extname: {
            origin: '.ts',
            render: getImportStatementExtname(createOption.fileExt, '.ts'),
          },
          isHasDefault: false,
          isHasPartialExclude: false,
          default: undefined,
          named: dirPathMap.get(params.dirPath) ?? [],
        },
      );

      const prev = renderDataMap.get(firstExistDir);

      if (prev == null) {
        renderDataMap.set(firstExistDir, [indexRednerData]);
      } else {
        renderDataMap.set(firstExistDir, [...prev, indexRednerData]);
      }
    } else {
      const currentDirStatements = dirPathMap.get(params.dirPath) ?? [];

      // index.ts 파일을 생성하기 위한 render data를 생성한다
      const indexRednerData = createRenderData(
        CE_AUTO_RENDER_CASE.DEFAULT_NAMED,
        CE_GENERATION_STYLE.DEFAULT_STAR_NAMED_STAR,
        createOption,
        path.join(params.dirPath, createOption.exportFilename),
        {
          importPath: addCurrentDirPrefix(path.relative(parentDir, params.dirPath)),
          extname: {
            origin: '.ts',
            render: getImportStatementExtname(createOption.fileExt, '.ts'),
          },
          isHasDefault: false,
          isHasPartialExclude: false,
          default: undefined,
          named: currentDirStatements,
        },
      );

      const prev = renderDataMap.get(parentDir);

      if (prev == null) {
        renderDataMap.set(parentDir, [indexRednerData]);
      } else {
        renderDataMap.set(parentDir, [...prev, indexRednerData]);
      }
    }
  });

  const renders = await Promise.all(
    Array.from(renderDataMap.entries()).map(async ([dirPath, datas]) => {
      const indexFilePath = path.join(dirPath, createOption.exportFilename);
      const rendered = await Promise.all(
        datas.map(async (data) => {
          const evaluated = await TemplateContainer.evaluate(data.style, data.renderData);
          return evaluated;
        }),
      );

      return {
        filePath: indexFilePath,
        rendered: rendered.filter((line) => line != null && line !== ''),
      };
    }),
  );

  ProgressBar.it.stop();
  Spinner.it.start('output file exists check, ...');

  const outputMap: Map<string, string> = new Map<string, string>(
    renders.map((render) => {
      return [render.filePath, render.rendered.join('\n')];
    }),
  );

  const fileExistReason = await checkOutputFile(outputMap);

  if (!createOption.overwrite && !createOption.backup && fileExistReason.length > 0) {
    Spinner.it.fail("ctix 'create' mode incomplete ...");
    Reasoner.it.start([...fileExistReason, ...symbolTable.getDuplicateReason()]);
    return;
  }

  await indexWrites(outputMap, createOption, extendOptions);

  Reasoner.it.start(symbolTable.getDuplicateReason());
  Spinner.it.succeed("ctix 'create' mode complete!");
}
