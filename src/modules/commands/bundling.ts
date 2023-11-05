import { ProgressBar } from '#/cli/ux/ProgressBar';
import { Reasoner } from '#/cli/ux/Reasoner';
import { Spinner } from '#/cli/ux/Spinner';
import { getInlineExcludedFiles } from '#/comments/getInlineExcludedFiles';
import { SymbolTable } from '#/compilers/SymbolTable';
import { getExportStatement } from '#/compilers/getExportStatement';
import type { IExportStatement } from '#/compilers/interfaces/IExportStatement';
import { CE_GENERATION_STYLE } from '#/configs/const-enum/CE_GENERATION_STYLE';
import { getExtendOptions } from '#/configs/getExtendOptions';
import type { TBundleOptions } from '#/configs/interfaces/TBundleOptions';
import type { TCommandBuildOptions } from '#/configs/interfaces/TCommandBuildOptions';
import { ProjectContainer } from '#/modules/file/ProjectContainer';
import { checkOutputFile } from '#/modules/file/checkOutputFile';
import { getTsExcludeFiles } from '#/modules/file/getTsExcludeFiles';
import { getTsIncludeFiles } from '#/modules/file/getTsIncludeFiles';
import { ExcludeContainer } from '#/modules/scope/ExcludeContainer';
import { IncludeContainer } from '#/modules/scope/IncludeContainer';
import { indexWrites } from '#/modules/writes/indexWrites';
import { CE_AUTO_RENDER_CASE } from '#/templates/const-enum/CE_AUTO_RENDER_CASE';
import type { IIndexRenderData } from '#/templates/interfaces/IIndexRenderData';
import { TemplateContainer } from '#/templates/modules/TemplateContainer';
import { getAutoRenderCase } from '#/templates/modules/getAutoRenderCase';
import { getRenderData } from '#/templates/modules/getRenderData';
import chalk from 'chalk';
import path from 'node:path';
import type * as tsm from 'ts-morph';

export async function bundling(_buildOptions: TCommandBuildOptions, bundleOption: TBundleOptions) {
  Spinner.it.start("ctix 'bundle' mode start, ...");

  await TemplateContainer.bootstrap();

  const extendOptions = await getExtendOptions(bundleOption.project);
  const project = ProjectContainer.project(bundleOption.project);

  Spinner.it.succeed(`[${bundleOption.project}] loading compelete!`);
  Spinner.it.update('include, exclude config');

  const output = path.resolve(path.join(bundleOption.output, bundleOption.exportFilename));

  const include = new IncludeContainer({
    config: { include: getTsIncludeFiles({ config: bundleOption, extend: extendOptions }) },
  });

  const inlineExcludeds = getInlineExcludedFiles({
    project,
    extendOptions,
    filePaths: extendOptions.tsconfig.fileNames,
  });

  /**
   * SourceCode를 읽어서 inline file exclude 된 파일을 별도로 전달한다. 이렇게 하는 이유는, 이 파일은 왜 포함되지
   * 않았지? 라는 등의 리포트를 생성할 때 한 곳에서 이 정보를 다 관리해야 리포트를 생성해서 보여줄 수 있기 때문이다
   */
  const exclude = new ExcludeContainer({
    config: {
      exclude: [...getTsExcludeFiles({ config: bundleOption, extend: extendOptions }), ...[output]],
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
          const exportStatement = getExportStatement(sourceFile, bundleOption, extendOptions);
          ProgressBar.it.increment();

          return exportStatement;
        }),
    )
  ).flat();

  ProgressBar.it.stop();

  const map = new Map<string, IExportStatement[]>();
  const symbolTable = new SymbolTable();

  symbolTable.inserts(statements);

  Spinner.it.start(`build ${`"${chalk.green(bundleOption.exportFilename)}"`} file start`);

  statements
    .filter((statement) => !symbolTable.isDuplicate(statement))
    .forEach((statement) => {
      const filePath = path.join(statement.path.dirPath, statement.path.filename);
      const accessed = map.get(filePath);

      if (accessed == null) {
        map.set(filePath, [statement]);
      } else {
        accessed.push(statement);
        map.set(filePath, accessed);
      }
    });

  Spinner.it.stop();
  ProgressBar.it.head = '  export ';
  ProgressBar.it.start(statements.length, 0);

  const datas = Array.from(map.entries())
    .map(([filePath, exportStatements]) => {
      const data = getRenderData(bundleOption, filePath, exportStatements, bundleOption.output);
      return data;
    })
    .filter((renderData): renderData is IIndexRenderData => renderData != null)
    .map((renderData) => {
      const style =
        bundleOption.generationStyle === CE_GENERATION_STYLE.AUTO
          ? getAutoRenderCase(renderData)
          : ({
              case: CE_AUTO_RENDER_CASE.UNKNOWN,
              style: bundleOption.generationStyle,
            } satisfies ReturnType<typeof getAutoRenderCase>);

      ProgressBar.it.increment();

      return { renderData, ...style };
    });

  const rendered = (
    await Promise.all(
      datas.map(async (data) => {
        const evaluated = await TemplateContainer.evaluate(data.style, data.renderData);
        return evaluated;
      }),
    )
  ).filter((line): line is string => line != null);

  ProgressBar.it.stop();
  Spinner.it.start('output file exists check, ...');

  const outputMap = new Map<string, string>();
  outputMap.set(output, rendered.join('\n'));
  const fileExistReason = await checkOutputFile(outputMap);

  if (!bundleOption.overwrite && !bundleOption.backup && fileExistReason.length > 0) {
    Spinner.it.fail("ctix 'bundle' mode incomplete ...");
    Reasoner.it.start([...fileExistReason, ...symbolTable.getDuplicateReason()]);
    return;
  }

  await indexWrites(outputMap, bundleOption, extendOptions);

  ProjectContainer.addSourceFilesAtPaths(bundleOption.project, Array.from(outputMap.keys()));

  Spinner.it.succeed(`${output} file build completed!`);
  Spinner.it.succeed("ctix 'bundle' mode completed!");

  Reasoner.it.start(symbolTable.getDuplicateReason());
}
