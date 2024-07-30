import { ProgressBar } from '#/cli/ux/ProgressBar';
import { Reasoner } from '#/cli/ux/Reasoner';
import { Spinner } from '#/cli/ux/Spinner';
import { CE_INLINE_COMMENT_KEYWORD } from '#/comments/const-enum/CE_INLINE_COMMENT_KEYWORD';
import { getInlineCommentedFiles } from '#/comments/getInlineCommentedFiles';
import { getExtendOptions } from '#/configs/getExtendOptions';
import type { TCommandBuildOptions } from '#/configs/interfaces/TCommandBuildOptions';
import type { TModuleOptions } from '#/configs/interfaces/TModuleOptions';
import { ProjectContainer } from '#/modules/file/ProjectContainer';
import { checkOutputFile } from '#/modules/file/checkOutputFile';
import { getTsExcludeFiles } from '#/modules/file/getTsExcludeFiles';
import { getTsIncludeFiles } from '#/modules/file/getTsIncludeFiles';
import { posixJoin } from '#/modules/path/modules/posixJoin';
import { posixResolve } from '#/modules/path/modules/posixResolve';
import { ExcludeContainer } from '#/modules/scope/ExcludeContainer';
import { IncludeContainer } from '#/modules/scope/IncludeContainer';
import { getBanner } from '#/modules/writes/getBanner';
import { indexWrites } from '#/modules/writes/indexWrites';
import { CE_TEMPLATE_NAME } from '#/templates/const-enum/CE_TEMPLATE_NAME';
import type { IIndexFileWriteParams } from '#/templates/interfaces/IIndexFileWriteParams';
import type { IIndexRenderData } from '#/templates/interfaces/IIndexRenderData';
import { TemplateContainer } from '#/templates/modules/TemplateContainer';
import { getModuleRenderData } from '#/templates/modules/getModuleRenderData';
import dayjs from 'dayjs';

export async function moduling(_buildOptions: TCommandBuildOptions, moduleOption: TModuleOptions) {
  Spinner.it.start("ctix 'module' mode start, ...");

  await TemplateContainer.bootstrap();

  const extendOptions = await getExtendOptions(moduleOption.project);
  const project = ProjectContainer.project(moduleOption.project);

  Spinner.it.succeed(`[${moduleOption.project}] loading compelete!`);
  Spinner.it.update('include, exclude config');

  const output = posixResolve(posixJoin(moduleOption.output, moduleOption.exportFilename));

  const include = new IncludeContainer({
    config: { include: getTsIncludeFiles({ config: moduleOption, extend: extendOptions }) },
    cwd: extendOptions.resolved.projectDirPath,
  });

  const inlineExcludeds = getInlineCommentedFiles({
    project,
    filePaths: extendOptions.tsconfig.fileNames,
    keyword: CE_INLINE_COMMENT_KEYWORD.FILE_EXCLUDE_KEYWORD,
  });

  /**
   * SourceCode를 읽어서 inline file exclude 된 파일을 별도로 전달한다. 이렇게 하는 이유는, 이 파일은 왜 포함되지
   * 않았지? 라는 등의 리포트를 생성할 때 한 곳에서 이 정보를 다 관리해야 리포트를 생성해서 보여줄 수 있기 때문이다
   */
  const exclude = new ExcludeContainer({
    config: {
      exclude: [...getTsExcludeFiles({ config: moduleOption, extend: extendOptions }), ...[output]],
    },
    inlineExcludeds,
    cwd: extendOptions.resolved.projectDirPath,
  });

  const filenames = include.files().filter((filename) => !exclude.isExclude(filename));

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

  const datas = (
    await Promise.all(
      filenames.map(async (filename) => {
        const renderData = await getModuleRenderData(moduleOption, filename, moduleOption.output);

        ProgressBar.it.increment();

        return renderData;
      }),
    )
  ).filter((data): data is IIndexRenderData => data != null);

  const rendered = await TemplateContainer.evaluate(CE_TEMPLATE_NAME.MODULE_INDEX_FILE_TEMPLATE, {
    datas,
    options: moduleOption,
  });

  ProgressBar.it.stop();
  Spinner.it.start('output file exists check, ...');

  const outputMap = new Map<string, string>();
  outputMap.set(output, rendered);
  const fileExistReason = await checkOutputFile(outputMap);

  if (!moduleOption.overwrite && !moduleOption.backup && fileExistReason.length > 0) {
    Spinner.it.fail("ctix 'bundle' mode incomplete ...");
    Reasoner.it.start(fileExistReason);
    return;
  }

  const indexFiles = await Promise.all(
    Array.from(outputMap.entries())
      .map(([filePath, fileContent]) => ({ filePath, fileContent }))
      .map(async (file) => {
        return {
          path: file.filePath,
          content: await TemplateContainer.evaluate(CE_TEMPLATE_NAME.INDEX_FILE_TEMPLATE, {
            directive: moduleOption.directive,
            banner: getBanner(moduleOption, dayjs()),
            eol: extendOptions.eol,
            content: file.fileContent,
          } satisfies IIndexFileWriteParams),
        };
      }),
  );

  await indexWrites(indexFiles, moduleOption, extendOptions);

  // index 파일을 쓰고 나면 이걸 project에 등록해줘야 한다
  ProjectContainer.addSourceFilesAtPaths(moduleOption.project, Array.from(outputMap.keys()));

  Spinner.it.succeed(`${output} file build completed!`);
  Spinner.it.succeed("ctix 'bundle' mode completed!");
}
