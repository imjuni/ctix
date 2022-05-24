import { INonNullableOptionObjectProps } from '@interfaces/IConfigObjectProps';
import { ICTIXOptions } from '@interfaces/ICTIXOptions';
import {
  exists,
  fpAddDotPath,
  fpRefinePathSep,
  fpRefineStartSlash,
  fpRemoveExt,
  fpRemoveExtWithTSX,
  fpTimes,
  getDirname,
  settify,
} from '@tools/misc';
import { getTypeScriptExportStatement } from '@tools/tsfiles';
import { TResolvedEither, TResolvedPromise } from '@tools/typehelper';
import { camelCase } from 'change-case';
import dayjs from 'dayjs';
import debug from 'debug';
import * as TEI from 'fp-ts/Either';
import * as TFU from 'fp-ts/function';
import * as TTE from 'fp-ts/TaskEither';
import * as fs from 'fs';
import { isEmpty, isFalse, isNotEmpty, isTrue } from 'my-easy-fp';
import * as path from 'path';
import typescript from 'typescript';
import { upperCaseFirst } from 'upper-case-first';
import { defaultOption } from './cticonfig';

const log = debug('ctix:write');

interface IExportContent {
  dirname: string;
  content: string | undefined;
}

const getTsconfigRootDir = (compilerOptions: typescript.CompilerOptions): string | undefined => {
  // If set rootDir, use it
  if (compilerOptions.rootDir !== undefined && compilerOptions.rootDir !== null) {
    const rootDir = path.resolve(compilerOptions.rootDir);
    return rootDir;
  }

  // If set rootDirs, use first element of array
  if (compilerOptions.rootDirs !== undefined && compilerOptions.rootDirs !== null) {
    const [head] = compilerOptions.rootDirs;
    const rootDir = path.resolve(head);
    return rootDir;
  }

  return undefined;
};

const getOutputDir = async (
  program: typescript.Program,
  rootOptions: ICTIXOptions,
): Promise<string> => {
  if (isFalse(rootOptions.useRootDir)) {
    return path.resolve(await getDirname(rootOptions.output));
  }

  const compilerOptions = program.getCompilerOptions();
  const rootDir = getTsconfigRootDir(compilerOptions);

  if (rootDir !== undefined && rootDir !== null) {
    const outputDirConfig = await getDirname(rootOptions.output);

    if (path.relative(rootDir, outputDirConfig).startsWith('..')) {
      return rootDir;
    }

    return path.resolve(outputDirConfig);
  }

  return path.resolve(await getDirname(rootOptions.output));
};

async function createExportContents({
  filename,
  replacer,
  configMap,
}: {
  filename: string;
  replacer: (args: { dirname: string; filename: string }) => string;
  configMap: Map<string, INonNullableOptionObjectProps>;
}): Promise<IExportContent> {
  const dirname = path.dirname(filename);

  log('createExportContents: ', dirname);

  try {
    const configObject = configMap.get(dirname);
    const quote = configObject?.option.quote ?? "'";
    const replaced = replacer({ dirname, filename });
    const refined = TFU.flow(
      fpRefinePathSep,
      fpRemoveExt,
      fpRefineStartSlash,
      fpAddDotPath,
    )(replaced);

    const exportFileContent = `export * from ${quote}${refined}${quote}`;

    return { dirname: await getDirname(filename), content: exportFileContent };
  } catch (catched) {
    const err = catched instanceof Error ? catched : new Error('unknown error raised');

    log(err.message);
    log(err.stack);

    return { dirname: path.dirname(filename), content: undefined };
  }
}

function getCamelCaseConverter(option?: ICTIXOptions) {
  if (option === undefined || option === null) {
    return camelCase;
  }

  if (isFalse(option.excludePath)) {
    return camelCase;
  }

  if (isFalse(option.useUpperFirst)) {
    return camelCase;
  }

  return (targetFilename: string) =>
    /^[A-Z]\w+/.test(targetFilename)
      ? upperCaseFirst(camelCase(targetFilename))
      : camelCase(targetFilename);
}

async function createDefaultExportContents({
  filename,
  replacer,
  configMap,
}: {
  filename: string;
  replacer: (args: { dirname: string; filename: string }) => string;
  configMap: Map<string, INonNullableOptionObjectProps>;
}): Promise<IExportContent> {
  const dirname = path.dirname(filename);

  try {
    const configObject = configMap.get(dirname);
    const quote = configObject?.option.quote ?? "'";
    const replaced = replacer({ dirname, filename });
    const refined = TFU.flow(
      fpRefinePathSep,
      fpRemoveExt,
      fpRefineStartSlash,
      fpAddDotPath,
    )(replaced);

    const refinedAlias = configObject?.option.excludePath
      ? TFU.flow((filePath: string) => path.basename(filePath), fpRemoveExtWithTSX)(replaced)
      : TFU.flow(fpRefinePathSep, fpRemoveExtWithTSX)(replaced);

    const camelCaseConverter = getCamelCaseConverter(configObject?.option);

    const defaultExportFileContent = `export { default as ${camelCaseConverter(
      refinedAlias,
    )} } from ${quote}${refined}${quote}`;

    return { dirname: await getDirname(filename), content: defaultExportFileContent };
  } catch (catched) {
    const err = catched instanceof Error ? catched : new Error('unknown error raised');

    log(err.message);
    log(err.stack);

    return { dirname, content: undefined };
  }
}

type ContentItem = { dirname: string, filename: string, depth: number };
export function getModuleDir({
  project,
  configMap,
  filenames,
}: {
  project: string;
  configMap: Map<string, INonNullableOptionObjectProps>;
  filenames: string[];
}): IExportContent[] {

  const dirs = Object.values<ContentItem>(
    filenames
      .reduce((all, filename) => {
        let dirname = path.dirname(filename);
        let depth = dirname.replace(project, '').split(path.sep).length - 1;

        // add ContentItem for file
        all[filename] = { depth, dirname, filename };

        while (depth > 0) {
          filename = path.join(dirname, 'index.ts');
          // add ContentItem for parent directory
          all[filename] = { depth, dirname, filename };

          dirname = dirname.substring(0, dirname.lastIndexOf(path.sep));
          depth--;
        }

        return all;
      }, {})
  )
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
            const refined = TFU.flow(
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
          const refined = TFU.flow(
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

    const replacer = (replacerArgs: { dirname: string; filename: string }) =>
      path.relative(replacerArgs.dirname, replacerArgs.filename);

    const nullableExportContents = await Promise.all(
      args.exportFilenames.map((filename) =>
        createExportContents({ filename, configMap, replacer }),
      ),
    );
    const exportContents: IExportContent[] = nullableExportContents.filter(
      (content): content is { dirname: string; content: string } => isNotEmpty(content.content),
    );

    const nullableDefaultExportContents = await Promise.all(
      args.defaultExportFilenames.map((filename) =>
        createDefaultExportContents({ filename, configMap, replacer }),
      ),
    );
    const defaultExportContents: IExportContent[] = nullableDefaultExportContents.filter(
      (content): content is { dirname: string; content: string } => isNotEmpty(content.content),
    );

    const modules = getModuleDir({
      project: projectDir,
      configMap,
      filenames: args.exportFilenames.concat(args.defaultExportFilenames),
    });

    const aggregated = exportContents
      .concat(defaultExportContents)
      .concat(modules)
      .reduce<Record<string, string[]>>((aggregation, current) => {
        const next = aggregation;
        if (isEmpty(aggregation[current.dirname])) {
          next[current.dirname] = [];
        }

        if (isNotEmpty(current.content)) {
          next[current.dirname] = [...next[current.dirname], current.content];
        }

        return next;
      }, {});

    const tupled: Array<{ pathname: string; content: string[] }> = Object.entries(aggregated)
      .map(([key, value]) => ({
        pathname: key,
        content: value,
      }))
      .sort((left, right) => left.pathname.localeCompare(right.pathname));

    return TEI.right(tupled);
  } catch (catched) {
    const err = catched instanceof Error ? catched : new Error('unknown error raised');

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
    rootOptions: ICTIXOptions;
  },
): Promise<TEI.Either<Error, Array<{ pathname: string; content: string[] }>>> {
  try {
    const configMap = new Map<string, INonNullableOptionObjectProps>(
      args.optionObjects.map((configObject) => [configObject.dir, configObject]),
    );

    log('exportFilenames: ', args.exportFilenames);
    log('defaultExportFilenames: ', args.defaultExportFilenames);

    const rootDir = await getOutputDir(args.program, args.rootOptions);

    const replacer = (replacerArgs: { dirname: string; filename: string }) =>
      path.relative(rootDir, replacerArgs.filename);

    const nullableExportContents = await Promise.all(
      args.exportFilenames.map((filename) =>
        createExportContents({ filename, configMap, replacer }),
      ),
    );
    const exportContents: IExportContent[] = nullableExportContents.filter(
      (content): content is { dirname: string; content: string } => isNotEmpty(content.content),
    );

    const nullableDefaultExportContents = await Promise.all(
      args.defaultExportFilenames.map((filename) =>
        createDefaultExportContents({ filename, configMap, replacer }),
      ),
    );
    const defaultExportContents: IExportContent[] = nullableDefaultExportContents.filter(
      (content): content is { dirname: string; content: string } => isNotEmpty(content.content),
    );

    const aggregated = exportContents
      .concat(defaultExportContents)
      .reduce<{ [key: string]: string[] }>((aggregation, current) => {
        const next = aggregation;
        if (isEmpty(next[rootDir])) {
          next[rootDir] = [];
        }

        if (isNotEmpty(current.content)) {
          next[rootDir] = [...next[rootDir], current.content];
        }

        return next;
      }, {});

    const tupled: Array<{ pathname: string; content: string[] }> = Object.entries(aggregated).map(
      ([key, value]) => ({
        pathname: key,
        content: value,
      }),
    );

    return TEI.right(tupled);
  } catch (catched) {
    const err = catched instanceof Error ? catched : new Error('unknown error raised');

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
        const backupWrited = await TFU.pipe(
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
        TFU.pipe(
          (() => (configObject.option.useComment ? '// created from ctix' : ''))(),
          (commentContent) =>
            configObject.option.useComment && configObject.option.useTimestamp
              ? `${commentContent} ${today.format('YYYY-MM-DD HH:mm:ss')}`
              : commentContent,
          (commentContent) => (commentContent !== '' ? `${commentContent}\n\n` : commentContent),
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

    const writesResult = await Promise.all(
      args.contents.map((indexContent) => writing(indexContent)),
    );
    const sum = writesResult
      .map((result): number => (TEI.isRight(result) ? 1 : 0))
      .reduce((prev, next) => prev + next);

    log('successfully writed index: ', sum);
    return TEI.right(sum);
  } catch (catched) {
    const err = catched instanceof Error ? catched : new Error('unknown error raised');

    return TEI.left(err);
  }
}
