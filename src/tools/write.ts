import { INonNullableOptionObjectProps } from '@interfaces/IConfigObjectProps';
import {
  exists,
  fpRefinePathSep,
  fpRefineStartSlash,
  fpRemoveExt,
  fpRemoveExtWithTSX,
  fpTimes,
  settify,
} from '@tools/misc';
import { getTypeScriptExportStatement } from '@tools/tsfiles';
import { TResolvedEither, TResolvedPromise } from '@tools/typehelper';
import { camelCase } from 'change-case';
import dayjs from 'dayjs';
import debug from 'debug';
import * as TEI from 'fp-ts/Either';
import { flow } from 'fp-ts/function';
import * as TPI from 'fp-ts/pipeable';
import * as TTE from 'fp-ts/TaskEither';
import * as fs from 'fs';
import { isEmpty, isNotEmpty, isTrue } from 'my-easy-fp';
import * as path from 'path';
import { defaultOption } from './cticonfig';

const log = debug('ctix:write');

interface IExportContent {
  dirname: string;
  content: string | undefined;
}

function createExportContents({
  filename,
  getDirname,
  replacer,
  configMap,
}: {
  filename: string;
  replacer: (args: { dirname: string; filename: string; project: string }) => string;
  getDirname: (args: { filename: string; project: string }) => string;
  configMap: Map<string, INonNullableOptionObjectProps>;
}): IExportContent {
  const dirname = path.dirname(filename);

  try {
    const configObject = configMap.get(dirname);
    const project = configObject?.option.project ?? path.join(process.cwd(), 'tsconfig.json');
    const quote = configObject?.option.quote ?? "'";
    const replaced = replacer({ dirname, filename, project });
    const refined = flow(fpRefinePathSep, fpRemoveExt, fpRefineStartSlash)(replaced);
    const exportFileContent = `export * from ${quote}./${refined}${quote}`;

    return { dirname: getDirname({ filename, project }), content: exportFileContent };
  } catch (err) {
    log(err.message);
    log(err.stack);
    return { dirname: path.dirname(filename), content: undefined };
  }
}

function createDefaultExportContents({
  filename,
  replacer,
  getDirname,
  configMap,
}: {
  filename: string;
  getDirname: (args: { filename: string; project: string }) => string;
  replacer: (args: { dirname: string; filename: string; project: string }) => string;
  configMap: Map<string, INonNullableOptionObjectProps>;
}): IExportContent {
  const dirname = path.dirname(filename);

  try {
    const configObject = configMap.get(dirname);
    const project = configObject?.option.project ?? path.join(process.cwd(), 'tsconfig.json');
    const quote = configObject?.option.quote ?? "'";
    const replaced = replacer({ dirname, filename, project });
    const refined = flow(fpRefinePathSep, fpRemoveExt, fpRefineStartSlash)(replaced);
    const refinedAlias = flow(fpRefinePathSep, fpRemoveExtWithTSX)(replaced);

    const defaultExportFileContent = `export { default as ${camelCase(
      refinedAlias,
    )} } from ${quote}./${refined}${quote}`;

    return { dirname: getDirname({ filename, project }), content: defaultExportFileContent };
  } catch (err) {
    log(err.message);
    log(err.stack);

    return { dirname, content: undefined };
  }
}

export function getModuleDir({
  project,
  configMap,
  filenames,
}: {
  project: string;
  configMap: Map<string, INonNullableOptionObjectProps>;
  filenames: string[];
}): IExportContent[] {
  const dirs = filenames
    .map((filename) => {
      const dirname = path.dirname(filename);
      return { depth: dirname.replace(project, '').split(path.sep).length - 1, dirname, filename };
    })
    .sort((left, right) => {
      const diff = right.depth - left.depth;
      return diff === 0 ? right.filename.localeCompare(left.filename) : diff;
    });

  const [lastDir] = dirs;
  const maxDepth = lastDir.depth;
  log('dirs: ', maxDepth, dirs);

  // exclude last depth
  const modules = fpTimes(maxDepth)
    .map((depth) => {
      const currentDirs = dirs.filter((dir) => dir.depth === depth);
      log('current depth: ', depth);

      return currentDirs.map((currentDir) => {
        const children = dirs.filter(
          (dir) =>
            dir.dirname.indexOf(currentDir.dirname) >= 0 &&
            dir.dirname !== currentDir.dirname &&
            dir.depth - depth === 1,
        );

        const configObject = configMap.get(currentDir.dirname);
        const options = configObject?.option ?? defaultOption();
        const quote = configObject?.option.quote ?? "'";
        const contents = settify(children.map((child) => path.dirname(child.filename)));

        if (options.exportFilename === 'index.ts' || options.exportFilename === 'index.d.ts') {
          const writableContent = contents.map((content) => {
            const refined = flow(
              fpRefinePathSep,
              fpRemoveExt,
              fpRefineStartSlash,
            )(content.replace(currentDir.dirname, ''));

            const exportFileContent = `export * from ${quote}./${refined}${quote}`;
            return exportFileContent;
          });

          return {
            dirname: currentDir.dirname,
            content: writableContent,
          };
        }

        const writableContentWithExportFilename = contents.map((content) => {
          const refined = flow(
            fpRefinePathSep,
            fpRemoveExt,
            fpRefineStartSlash,
          )(path.join(content.replace(currentDir.dirname, ''), options.exportFilename));

          const exportFileContent = `export * from ${quote}./${refined}${quote}`;
          return exportFileContent;
        });

        return {
          dirname: currentDir.dirname,
          content: writableContentWithExportFilename,
        };
      });
    })
    .flatMap((dir) => dir);

  const moduleMap = new Map(modules.map((module) => [module.dirname, module.content]));

  const refinedModule = Array.from(moduleMap.entries())
    .map(([key, value]) => ({ dirname: key, content: value }))
    .filter((module) => Array.isArray(module.content) && module.content.length > 0);

  log('module directory: ', refinedModule);

  const exportContents: IExportContent[] = refinedModule
    .map((module) => module.content.map((content) => ({ dirname: module.dirname, content })))
    .flatMap((flat) => flat);

  return exportContents;
}

/**
 * create content to write index.ts file
 * @param args
 */
export async function getWriteContents(
  args: TResolvedEither<TResolvedPromise<ReturnType<typeof getTypeScriptExportStatement>>> & {
    optionObjects: INonNullableOptionObjectProps[];
  },
): Promise<TEI.Either<Error, Array<{ pathname: string; content: string[] }>>> {
  try {
    const configMap = new Map<string, INonNullableOptionObjectProps>(
      args.optionObjects.map((configObject) => [configObject.dir, configObject]),
    );

    const [rootConfig] = args.optionObjects;
    const projectDir = path.resolve(path.dirname(rootConfig.option.project));

    log('exportFilenames: ', args.exportFilenames);
    log('defaultExportFilenames: ', args.defaultExportFilenames);

    const replacer = (args: { dirname: string; filename: string }) => args.filename.replace(args.dirname, '');
    const getDirname = (args: { filename: string; project: string }) => path.dirname(args.filename);

    const exportContents: IExportContent[] = args.exportFilenames
      .map((filename) => createExportContents({ filename, configMap, replacer, getDirname }))
      .filter((content): content is { dirname: string; content: string } => isNotEmpty(content.content));

    const defaultExportContents: IExportContent[] = args.defaultExportFilenames
      .map((filename) => createDefaultExportContents({ filename, configMap, replacer, getDirname }))
      .filter((content): content is { dirname: string; content: string } => isNotEmpty(content.content));

    const modules = getModuleDir({
      project: projectDir,
      configMap,
      filenames: args.exportFilenames.concat(args.defaultExportFilenames),
    });

    const aggregated = exportContents
      .concat(defaultExportContents)
      .concat(modules)
      .reduce<{ [key: string]: string[] }>((aggregation, current) => {
        if (isEmpty(aggregation[current.dirname])) {
          aggregation[current.dirname] = [];
        }

        if (isNotEmpty(current.content)) {
          aggregation[current.dirname] = [...aggregation[current.dirname], current.content];
        }

        return aggregation;
      }, {});

    const tupled: Array<{ pathname: string; content: string[] }> = Object.entries(aggregated)
      .map(([key, value]) => ({
        pathname: key,
        content: value,
      }))
      .sort((left, right) => left.pathname.localeCompare(right.pathname));

    return TEI.right(tupled);
  } catch (err) {
    return TEI.left(err);
  }
}

/**
 * create content to write index.ts file
 * @param args
 */
export async function getSingleFileWriteContents(
  args: TResolvedEither<TResolvedPromise<ReturnType<typeof getTypeScriptExportStatement>>> & {
    optionObjects: INonNullableOptionObjectProps[];
  },
): Promise<TEI.Either<Error, Array<{ pathname: string; content: string[] }>>> {
  try {
    const configMap = new Map<string, INonNullableOptionObjectProps>(
      args.optionObjects.map((configObject) => [configObject.dir, configObject]),
    );

    log('exportFilenames: ', args.exportFilenames);
    log('defaultExportFilenames: ', args.defaultExportFilenames);

    const replacer = (args: { dirname: string; filename: string; project: string }) =>
      path.relative(path.dirname(args.project), args.filename);
    const getDirname = (args: { filename: string; project: string }) => path.dirname(args.project);

    const exportContents: IExportContent[] = args.exportFilenames
      .map((filename) => createExportContents({ filename, configMap, replacer, getDirname }))
      .filter((content): content is { dirname: string; content: string } => isNotEmpty(content.content));

    const defaultExportContents: IExportContent[] = args.defaultExportFilenames
      .map((filename) => createDefaultExportContents({ filename, configMap, replacer, getDirname }))
      .filter((content): content is { dirname: string; content: string } => isNotEmpty(content.content));

    const aggregated = exportContents
      .concat(defaultExportContents)
      .reduce<{ [key: string]: string[] }>((aggregation, current) => {
        if (isEmpty(aggregation[current.dirname])) {
          aggregation[current.dirname] = [];
        }

        if (isNotEmpty(current.content)) {
          aggregation[current.dirname] = [...aggregation[current.dirname], current.content];
        }

        return aggregation;
      }, {});

    const tupled: Array<{ pathname: string; content: string[] }> = Object.entries(aggregated).map(([key, value]) => ({
      pathname: key,
      content: value,
    }));

    return TEI.right(tupled);
  } catch (err) {
    return TEI.left(err);
  }
}

export async function write(args: {
  contents: TResolvedEither<TResolvedPromise<ReturnType<typeof getWriteContents>>>;
  optionObjects: INonNullableOptionObjectProps[];
}): Promise<TEI.Either<Error, number>> {
  try {
    const configMap = new Map<string, INonNullableOptionObjectProps>(
      args.optionObjects.map((configObject) => [configObject.dir, configObject]),
    );

    const writing = async (targetContent: { pathname: string; content: string[] }) => {
      log('current: ', targetContent.pathname);

      const configObject = configMap.get(targetContent.pathname) ?? {
        dir: targetContent.pathname,
        depth: 0,
        exists: false,
        option: defaultOption(),
      };

      const indexFile = configObject.option.exportFilename;
      const resolvedIndexFile = path.resolve(targetContent.pathname, indexFile);
      const resolvedBackupFile = path.resolve(targetContent.pathname, `${indexFile}.bak`);

      // processing backup file,
      if (isTrue(configObject.option.useBackupFile) && (await exists(resolvedIndexFile))) {
        const backupWrited = await TPI.pipe(
          TTE.taskify(fs.readFile)(resolvedIndexFile),
          TTE.chain((buf) => TTE.taskify(fs.writeFile)(resolvedBackupFile, buf)),
        )();

        if (TEI.isLeft(backupWrited)) {
          log('error caused from backup write, ...');
          log(backupWrited.left.message);
          log(backupWrited.left.stack);

          return TEI.left(backupWrited.left);
        }
      }

      // create index file
      const today = dayjs();
      const comment = (() =>
        TPI.pipe(
          (() => (configObject.option.useComment ? '// created from ctix' : ''))(),
          (comment) =>
            configObject.option.useComment && configObject.option.useTimestamp
              ? `${comment} ${today.format('YYYY-MM-DD HH:mm:ss')}`
              : comment,
          (comment) => (comment !== '' ? `${comment}\n\n` : comment),
        ))();

      const buf = Buffer.from(
        `${comment}${targetContent.content
          .map((line) => (configObject.option.useSemicolon ? `${line};` : line))
          .join('\n')}${configObject.option.addNewline ? '\n' : ''}`,
        'utf8',
      );

      const writeResult = await TTE.taskify(fs.writeFile)(resolvedIndexFile, buf)();

      if (TEI.isLeft(writeResult)) {
        log(`error caused from ${indexFile} write, ...`);
        log(writeResult.left.message);
        log(writeResult.left.stack);

        return TEI.left(writeResult.left);
      }

      return TEI.right(1);
    };

    const writesResult = await Promise.all(args.contents.map((indexContent) => writing(indexContent)));
    const sum = writesResult.map((result): number => (TEI.isRight(result) ? 1 : 0)).reduce((prev, next) => prev + next);

    log('successfully writed index: ', sum);
    return TEI.right(sum);
  } catch (err) {
    return TEI.left(err);
  }
}
