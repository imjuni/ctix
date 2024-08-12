import { ProgressBar } from '#/cli/ux/ProgressBar';
import { Reasoner } from '#/cli/ux/Reasoner';
import { Spinner } from '#/cli/ux/Spinner';
import { CE_INLINE_COMMENT_KEYWORD } from '#/comments/const-enum/CE_INLINE_COMMENT_KEYWORD';
import { getInlineCommentedFiles } from '#/comments/getInlineCommentedFiles';
import { getSourceFileComments } from '#/comments/getSourceFileComments';
import type { ISourceFileComments } from '#/comments/interfaces/ISourceFileComments';
import { StatementTable } from '#/compilers/StatementTable';
import { getExportStatement } from '#/compilers/getExportStatement';
import type { IExportStatement } from '#/compilers/interfaces/IExportStatement';
import { isDeclarationFile } from '#/compilers/isDeclarationFile';
import { getExtendOptions } from '#/configs/getExtendOptions';
import type { TBundleOptions } from '#/configs/interfaces/TBundleOptions';
import type { TCommandBuildOptions } from '#/configs/interfaces/TCommandBuildOptions';
import { ProjectContainer } from '#/modules/file/ProjectContainer';
import { checkOutputFile } from '#/modules/file/checkOutputFile';
import { getTsExcludeFiles } from '#/modules/file/getTsExcludeFiles';
import { getTsIncludeFiles } from '#/modules/file/getTsIncludeFiles';
import { addCurrentDirPrefix } from '#/modules/path/addCurrentDirPrefix';
import { posixJoin } from '#/modules/path/modules/posixJoin';
import { posixRelative } from '#/modules/path/modules/posixRelative';
import { posixResolve } from '#/modules/path/modules/posixResolve';
import { ExcludeContainer } from '#/modules/scope/ExcludeContainer';
import { IncludeContainer } from '#/modules/scope/IncludeContainer';
import { getBanner } from '#/modules/writes/getBanner';
import { indexWrites } from '#/modules/writes/indexWrites';
import { CE_TEMPLATE_NAME } from '#/templates/const-enum/CE_TEMPLATE_NAME';
import type { IIndexFileWriteParams } from '#/templates/interfaces/IIndexFileWriteParams';
import type { IIndexRenderData } from '#/templates/interfaces/IIndexRenderData';
import { TemplateContainer } from '#/templates/modules/TemplateContainer';
import { getRenderData } from '#/templates/modules/getRenderData';
import { getSelectStyle } from '#/templates/modules/getSelectStyle';
import chalk from 'chalk';
import dayjs from 'dayjs';
import { replaceSepToPosix } from 'my-node-fp';
import path from 'node:path';
import type * as tsm from 'ts-morph';

export async function bundling(buildOptions: TCommandBuildOptions, bundleOption: TBundleOptions) {
  Spinner.it.start("ctix 'bundle' mode start, ...");

  if (
    'from' in buildOptions &&
    buildOptions.from &&
    typeof buildOptions.from === 'string' &&
    buildOptions.from !== 'none'
  ) {
    Spinner.it.succeed(`ctix 'bundle' mode configuration reading from '${buildOptions.from}'`);
  }

  await TemplateContainer.bootstrap();

  const extendOptions = await getExtendOptions(bundleOption.project);
  const project = ProjectContainer.project(bundleOption.project);

  Spinner.it.succeed(`[${bundleOption.project}] loading compelete!`);
  Spinner.it.update('include, exclude config');

  const output = posixResolve(posixJoin(bundleOption.output, bundleOption.exportFilename));
  const filePaths = project
    .getSourceFiles()
    .map((sourceFile) => sourceFile.getFilePath().toString());

  const include = new IncludeContainer({
    config: { include: getTsIncludeFiles({ config: bundleOption, extend: extendOptions }) },
    cwd: extendOptions.resolved.projectDirPath,
  });

  const inlineExcludeds = getInlineCommentedFiles({
    project,
    filePaths,
    keyword: CE_INLINE_COMMENT_KEYWORD.FILE_EXCLUDE_KEYWORD,
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
    cwd: extendOptions.resolved.projectDirPath,
  });

  const inlineDeclarations = getInlineCommentedFiles({
    project,
    filePaths,
    keyword: CE_INLINE_COMMENT_KEYWORD.FILE_DECLARATION_KEYWORD,
  }).filter((declaration) => {
    const sourceFile = project.getSourceFile(declaration.filePath);
    if (sourceFile == null) {
      return false;
    }

    return isDeclarationFile(sourceFile);
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

  const statementMap = new Map<string, IExportStatement[]>();
  const statementTable = new StatementTable();

  statementTable.inserts(statements);

  Spinner.it.start(`build ${`"${chalk.green(bundleOption.exportFilename)}"`} file start`);

  statements
    .filter((statement) => !statementTable.isDuplicate(statement))
    .forEach((statement) => {
      const filePath = posixJoin(statement.path.dirPath, statement.path.filename);
      const accessed = statementMap.get(filePath);

      if (accessed == null) {
        statementMap.set(filePath, [statement]);
      } else {
        accessed.push(statement);
        statementMap.set(filePath, accessed);
      }
    });

  const commentMap = new Map<string, ISourceFileComments>(
    Array.from(statementMap.keys())
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
  ProgressBar.it.head = '  export ';
  ProgressBar.it.start(statements.length, 0);

  const datas = Array.from(statementMap.entries())
    .map(([filePath, exportStatements]) => {
      const data = getRenderData(bundleOption, filePath, exportStatements, bundleOption.output);
      return data;
    })
    .filter((renderData): renderData is IIndexRenderData => renderData != null)
    .map((renderData) => {
      const comment = commentMap.get(renderData.filePath)?.comments.at(0);
      const style = getSelectStyle({
        comment,
        options: { style: bundleOption.generationStyle },
        renderData,
      });

      ProgressBar.it.increment();

      return { renderData, ...style };
    });

  const inlineDeclarationsRendered = await TemplateContainer.evaluate(
    CE_TEMPLATE_NAME.DECLARATION_FILE_TEMPLATE,
    {
      options: { quote: bundleOption.quote },
      declarations: await Promise.all(
        inlineDeclarations
          .filter((inlineDeclaration) => statementMap.get(inlineDeclaration.filePath) == null)
          .map((declaration) => {
            const relativePath =
              bundleOption.output != null
                ? addCurrentDirPrefix(
                    posixRelative(
                      bundleOption.output,
                      path.join(
                        path.dirname(declaration.filePath),
                        path.basename(declaration.filePath, path.extname(declaration.filePath)),
                      ),
                    ),
                  )
                : replaceSepToPosix(
                    `.${path.posix.sep}${path.join(
                      path.dirname(declaration.filePath),
                      path.basename(declaration.filePath, path.extname(declaration.filePath)),
                    )}`,
                  );
            return { ...declaration, relativePath };
          }),
      ),
    },
  );

  const exportsRendered = (
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
  outputMap.set(output, [inlineDeclarationsRendered, ...exportsRendered].join('\n'));
  const fileExistReason = await checkOutputFile(outputMap);

  if (!bundleOption.overwrite && !bundleOption.backup && fileExistReason.length > 0) {
    Spinner.it.fail("ctix 'bundle' mode incomplete ...");
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
            directive: bundleOption.directive,
            banner: getBanner(bundleOption, dayjs()),
            eol: extendOptions.eol,
            content: file.fileContent,
          } satisfies IIndexFileWriteParams),
        };
      }),
  );

  await indexWrites(indexFiles, bundleOption, extendOptions);

  ProjectContainer.addSourceFilesAtPaths(bundleOption.project, Array.from(outputMap.keys()));

  Spinner.it.succeed(`${output} file build completed!`);
  Spinner.it.succeed("ctix 'bundle' mode completed!");

  Reasoner.it.start(statementTable.getDuplicateReason());
}
