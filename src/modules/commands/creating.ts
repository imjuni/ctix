import { ProgressBar } from '#/cli/ux/ProgressBar';
import { Reasoner } from '#/cli/ux/Reasoner';
import { Spinner } from '#/cli/ux/Spinner';
import { CE_INLINE_COMMENT_KEYWORD } from '#/comments/const-enum/CE_INLINE_COMMENT_KEYWORD';
import { getInlineCommentedFiles } from '#/comments/getInlineCommentedFiles';
import { getOutputExcludedFiles } from '#/comments/getOutputExcludedFiles';
import { getSourceFileComments } from '#/comments/getSourceFileComments';
import type { ISourceFileComments } from '#/comments/interfaces/ISourceFileComments';
import { StatementTable } from '#/compilers/StatementTable';
import { getExportStatement } from '#/compilers/getExportStatement';
import type { IExportStatement } from '#/compilers/interfaces/IExportStatement';
import type { CE_GENERATION_STYLE } from '#/configs/const-enum/CE_GENERATION_STYLE';
import { getExtendOptions } from '#/configs/getExtendOptions';
import type { TCommandBuildOptions } from '#/configs/interfaces/TCommandBuildOptions';
import type { TCreateOptions } from '#/configs/interfaces/TCreateOptions';
import { NotFoundExportedKind } from '#/errors/NotFoundExportedKind';
import { ProjectContainer } from '#/modules/file/ProjectContainer';
import { checkOutputFile } from '#/modules/file/checkOutputFile';
import { getCreateModeFileTree } from '#/modules/file/getCreateModeFileTree';
import { getExportStatementFromMap } from '#/modules/file/getExportStatementFromMap';
import { getTsExcludeFiles } from '#/modules/file/getTsExcludeFiles';
import { getTsIncludeFiles } from '#/modules/file/getTsIncludeFiles';
import { processSkipEmptyDirOnFileTree } from '#/modules/file/processSkipEmptyDirOnFileTree';
import { addCurrentDirPrefix } from '#/modules/path/addCurrentDirPrefix';
import { filenamify } from '#/modules/path/filenamify';
import { getExtname } from '#/modules/path/getExtname';
import { getImportStatementExtname } from '#/modules/path/getImportStatementExtname';
import { posixJoin } from '#/modules/path/modules/posixJoin';
import { posixRelative } from '#/modules/path/modules/posixRelative';
import { ExcludeContainer } from '#/modules/scope/ExcludeContainer';
import { IncludeContainer } from '#/modules/scope/IncludeContainer';
import { getBanner } from '#/modules/writes/getBanner';
import { indexWrites } from '#/modules/writes/indexWrites';
import { CE_AUTO_RENDER_CASE } from '#/templates/const-enum/CE_AUTO_RENDER_CASE';
import { CE_TEMPLATE_NAME } from '#/templates/const-enum/CE_TEMPLATE_NAME';
import type { IIndexFileWriteParams } from '#/templates/interfaces/IIndexFileWriteParams';
import type { IIndexRenderData } from '#/templates/interfaces/IIndexRenderData';
import { TemplateContainer } from '#/templates/modules/TemplateContainer';
import { createRenderData } from '#/templates/modules/createRenderData';
import { getSelectStyle } from '#/templates/modules/getSelectStyle';
import chalk from 'chalk';
import dayjs from 'dayjs';
import { isError } from 'my-easy-fp';
import { basenames } from 'my-node-fp';
import { fail, pass } from 'my-only-either';
import type * as tsm from 'ts-morph';

export async function creating(_buildOptions: TCommandBuildOptions, createOption: TCreateOptions) {
  Spinner.it.start("ctix 'create' mode start, ...");

  await TemplateContainer.bootstrap();
  const extendOptions = await getExtendOptions(createOption.project);
  const project = ProjectContainer.project(createOption.project);

  Spinner.it.succeed(`${createOption.project} loading complete!`);
  Spinner.it.update('include, exclude config');

  const filePaths = project
    .getSourceFiles()
    .map((sourceFile) => sourceFile.getFilePath().toString());

  const include = new IncludeContainer({
    config: { include: getTsIncludeFiles({ config: createOption, extend: extendOptions }) },
    cwd: extendOptions.resolved.projectDirPath,
  });

  const inlineExcludeds = getInlineCommentedFiles({
    project,
    filePaths,
    keyword: CE_INLINE_COMMENT_KEYWORD.FILE_EXCLUDE_KEYWORD,
  });

  const outputExcludeds = await getOutputExcludedFiles({
    project,
    filePaths,
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
    cwd: extendOptions.resolved.projectDirPath,
    inlineExcludeds,
  });

  const filenames = filePaths
    .filter((filename) => include.isInclude(filename))
    .filter((filename) => !exclude.isExclude(filename));

  Spinner.it.succeed('analysis export statements completed!');
  Spinner.it.stop();

  if (filenames.length <= 0) {
    Spinner.it.fail(
      'Cannot find target files. Please add --include option or add include section in .ctirc file',
    );
    Spinner.it.stop();
    return;
  }

  ProgressBar.it.head = '    file ';
  ProgressBar.it.start(filenames.length, 0);

  const statementEithers = await Promise.all(
    filenames
      .map((filename) => project.getSourceFile(filename))
      .filter((sourceFile): sourceFile is tsm.SourceFile => sourceFile != null)
      .map(async (sourceFile) => {
        ProgressBar.it.increment();

        try {
          const statement = await getExportStatement(sourceFile, createOption, extendOptions);
          return pass(statement);
        } catch (caught) {
          const err = isError(caught, new Error('unknown error raised'));
          return fail(err);
        }
      }),
  );

  ProgressBar.it.stop();

  const filePathMap = new Map<string, IExportStatement[]>();
  const dirPathMap = new Map<string, IExportStatement[]>();
  const statementTable = new StatementTable();

  const failStatements = statementEithers
    .filter((statementEither) => statementEither.type === 'fail')
    .map((statementEither) => statementEither.fail)
    .filter((err) => err != null);

  const statements = statementEithers
    .filter((statementEither) => statementEither.type === 'pass')
    .map((statementEither) => statementEither.pass)
    .filter((statement) => statement != null)
    .flat();

  statementTable.inserts(statements);

  if (failStatements.length > 0) {
    Spinner.it.fail("ctix 'create' mode incomplete ...");
    Spinner.it.stop();

    const reasons = failStatements
      .filter((err) => err instanceof NotFoundExportedKind)
      .map((err) => err.createReason());

    Reasoner.it.start(reasons);
    Reasoner.it.displayNewIssueMessage();

    return;
  }

  Spinner.it.start(`build ${`"${chalk.green(createOption.exportFilename)}"`} file start`);

  statements
    .filter((statement) => !statementTable.isDuplicate(statement))
    .forEach((statement) => {
      const filePath = posixJoin(statement.path.dirPath, statement.path.filename);
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

  const commentMap = new Map<string, ISourceFileComments>(
    Array.from(filePathMap.keys())
      .map((filePath) => {
        const sourceFile = project.getSourceFile(filePath);

        if (sourceFile != null) {
          const comments = getSourceFileComments(sourceFile);
          return [filePath, comments];
        }

        return undefined;
      })
      .filter((comment): comment is [string, ISourceFileComments] => comment != null),
  );

  Spinner.it.stop();

  const renderDataMap = new Map<
    string,
    { case: CE_AUTO_RENDER_CASE; style: CE_GENERATION_STYLE; renderData: IIndexRenderData }[]
  >();

  const originFilePathTree = await getCreateModeFileTree(createOption.startFrom);
  const filePathTree = processSkipEmptyDirOnFileTree({
    tree: originFilePathTree,
    dirPathMap,
    skipEmptyDir: createOption.skipEmptyDir,
  });
  const createModeFiles = [
    {
      path: originFilePathTree.root.path,
      children: originFilePathTree.root.children.map((child) => child.path),
    },
    ...filePathTree,
  ];

  ProgressBar.it.head = '  export ';
  ProgressBar.it.start(createModeFiles.length, 0);

  createModeFiles.forEach((dirPath) => {
    const dirPathStatements = getExportStatementFromMap(dirPath.path, dirPathMap);
    const dirPathRenderDatas = dirPathStatements.map((statement) => {
      const filePath = posixJoin(statement.path.dirPath, filenamify(statement.path.filename));
      const importFilePath = posixJoin(
        statement.path.dirPath,
        basenames(statement.path.filename, getExtname(statement.path.filename)),
      );

      const renderData = createRenderData(
        CE_AUTO_RENDER_CASE.DEFAULT_NAMED,
        createOption.generationStyle,
        createOption,
        posixJoin(dirPath.path, createOption.exportFilename),
        {
          importPath: addCurrentDirPrefix(posixRelative(dirPath.path, importFilePath)),
          extname: {
            origin: '.ts',
            render: getImportStatementExtname(createOption.fileExt, '.ts'),
          },
          isHasDefault: false,
          isHasPartialExclude: false,
          default: undefined,
          named: dirPathMap.get(dirPath.path) ?? [],
        },
      );

      const comment = commentMap.get(filePath)?.comments.at(0);
      const selectedStyle = getSelectStyle({
        comment,
        options: { style: createOption.generationStyle },
        renderData: renderData.renderData,
      });

      renderData.case = selectedStyle.case;
      renderData.style = selectedStyle.style;

      return renderData;
    });

    const childrenRenderDatas = dirPath.children.map((child) => {
      const renderData = createRenderData(
        CE_AUTO_RENDER_CASE.DEFAULT_NAMED,
        createOption.generationStyle,
        createOption,
        posixJoin(child, createOption.exportFilename),
        {
          importPath: addCurrentDirPrefix(posixRelative(dirPath.path, child)),
          extname: {
            origin: '.ts',
            render: getImportStatementExtname(createOption.fileExt, '.ts'),
          },
          isHasDefault: false,
          isHasPartialExclude: false,
          default: undefined,
          named: dirPathMap.get(child) ?? [],
        },
      );

      const comment = commentMap.get(child)?.comments.at(0);
      const selectedStyle = getSelectStyle({
        comment,
        options: { style: createOption.generationStyle },
        renderData: renderData.renderData,
      });

      renderData.case = selectedStyle.case;
      renderData.style = selectedStyle.style;

      return renderData;
    });

    renderDataMap.set(dirPath.path, [...dirPathRenderDatas, ...childrenRenderDatas]);
    ProgressBar.it.increment();
  });

  const rendereds = await Promise.all(
    Array.from(renderDataMap.entries()).map(async ([dirPath, datas]) => {
      const indexFilePath = posixJoin(dirPath, createOption.exportFilename);
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
    rendereds.map((render) => {
      return [render.filePath, render.rendered.join('\n')];
    }),
  );

  const fileExistReason = await checkOutputFile(outputMap);

  if (!createOption.overwrite && !createOption.backup && fileExistReason.length > 0) {
    Spinner.it.fail("ctix 'create' mode incomplete ...");
    Reasoner.it.start([...fileExistReason, ...statementTable.getDuplicateReason()]);
    return;
  }

  const indexFiles = await Promise.all(
    Array.from(outputMap.entries())
      .map(([filePath, fileContent]) => ({ filePath, fileContent }))
      .map(async (file) => {
        return {
          path: file.filePath,
          content: await TemplateContainer.evaluate(CE_TEMPLATE_NAME.INDEX_FILE_TEMPLATE, {
            directive: createOption.directive,
            banner: getBanner(createOption, dayjs()),
            eol: extendOptions.eol,
            content: file.fileContent,
          } satisfies IIndexFileWriteParams),
        };
      }),
  );

  await indexWrites(indexFiles, createOption, extendOptions);

  ProjectContainer.addSourceFilesAtPaths(createOption.project, Array.from(outputMap.keys()));

  Reasoner.it.start(statementTable.getDuplicateReason());
  Spinner.it.succeed("ctix 'create' mode complete!");
}
