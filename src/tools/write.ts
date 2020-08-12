import { INonNullableConfigObjectProps } from '@interfaces/IConfigObjectProps';
import {
  exists,
  fpRefinePathSep,
  fpRefineStartSlash,
  fpRemoveExt,
  fpRemoveExtWithTSX,
  settify,
} from '@tools/misc';
import { getTypeScriptExportStatement } from '@tools/tsfiles';
import { TResolvedEither, TResolvedPromise } from '@tools/typehelper';
import { camelCase } from 'change-case';
import debug from 'debug';
import * as TE from 'fp-ts/lib/Either';
import * as TI from 'fp-ts/lib/Identity';
import { flow } from 'fp-ts/lib/function';
import { pipe } from 'fp-ts/lib/pipeable';
import * as TTE from 'fp-ts/lib/TaskEither';
import * as fs from 'fs';
import { isEmpty, isNotEmpty, isTrue } from 'my-easy-fp';
import * as path from 'path';
import { defaultConfig } from './cticonfig';
import dayjs from 'dayjs';

const log = debug('ctit:write');

function createExportContents({
  filename,
  configMap,
}: {
  filename: string;
  configMap: Map<string, INonNullableConfigObjectProps>;
}): { dirname: string; content: string | undefined } {
  const dirname = path.dirname(filename);

  try {
    const configObject = configMap.get(dirname);
    const quote = configObject?.config.quote ?? "'";

    const refined = flow(
      fpRefinePathSep,
      fpRemoveExt,
      fpRefineStartSlash,
    )(filename.replace(dirname, ''));
    const exportFileContent = `export * from ${quote}./${refined}${quote}`;

    return { dirname, content: exportFileContent };
  } catch (err) {
    log(err.message);
    log(err.stack);
    return { dirname, content: undefined };
  }
}

function createDefaultExportContents({
  filename,
  configMap,
}: {
  filename: string;
  configMap: Map<string, INonNullableConfigObjectProps>;
}): { dirname: string; content: string | undefined } {
  const dirname = path.dirname(filename);

  try {
    const configObject = configMap.get(dirname);
    const quote = configObject?.config.quote ?? "'";

    const refined = flow(
      fpRefinePathSep,
      fpRemoveExt,
      fpRefineStartSlash,
    )(filename.replace(dirname, ''));

    const refinedAlias = flow(
      fpRefinePathSep,
      fpRemoveExtWithTSX,
    )(filename.replace(dirname, ''));

    const defaultExportFileContent = `export { default as ${camelCase(
      refinedAlias,
    )} } from ${quote}./${refined}${quote}`;

    return { dirname, content: defaultExportFileContent };
  } catch (err) {
    log(err.message);
    log(err.stack);
    return { dirname, content: undefined };
  }
}

export function getAllParentDir(basedir: string, dir: string): string[] {
  if (basedir === dir) {
    return [];
  }

  return dir
    .replace(basedir, '')
    .split(path.sep)
    .filter((element) => element !== '')
    .map((_, index, arr) =>
      path.join(basedir, arr.slice(0, arr.length - index).join(path.sep)),
    );
}

/**
 * create content to write index.ts file
 * @param args
 */
export async function getWriteContents(
  args: TResolvedEither<TResolvedPromise<ReturnType<typeof getTypeScriptExportStatement>>> & {
    configObjects: INonNullableConfigObjectProps[];
  },
): Promise<TE.Either<Error, Array<{ pathname: string; content: string[] }>>> {
  try {
    const configMap = new Map<string, INonNullableConfigObjectProps>(
      args.configObjects.map((configObject) => [configObject.dir, configObject]),
    );

    const [rootConfig] = args.configObjects;

    log('exportFilenames: ', args.exportFilenames);
    log('defaultExportFilenames: ', args.defaultExportFilenames);

    const moduleContainDir = settify(
      settify(
        args.exportFilenames
          .concat(args.defaultExportFilenames)
          .map((dirname) => path.dirname(dirname)),
      )
        .map((dirname) => ({
          depth: dirname.split(path.sep).length,
          dirname,
        }))
        .filter(
          (dirname) =>
            path.relative(rootConfig.config.output, dirname.dirname).indexOf('..') < 0,
        )
        .sort((left, right) => right.depth - left.depth)
        .map((dirname) => getAllParentDir(rootConfig.config.output, dirname.dirname))
        .flatMap((dirname) => dirname),
    );

    const exportContents = args.exportFilenames
      .concat(moduleContainDir)
      .map((filename) => createExportContents({ filename, configMap }))
      .filter((content): content is { dirname: string; content: string } =>
        isNotEmpty(content.content),
      );

    const defaultExportContents = args.defaultExportFilenames
      .map((filename) => createDefaultExportContents({ filename, configMap }))
      .filter((content): content is { dirname: string; content: string } =>
        isNotEmpty(content.content),
      );

    log('module contain directory: ', moduleContainDir);

    const aggregated = exportContents
      .concat(defaultExportContents)
      .reduce<{ [key: string]: string[] }>((aggregation, current) => {
        if (isEmpty(aggregation[current.dirname])) {
          aggregation[current.dirname] = [];
        }

        aggregation[current.dirname] = [...aggregation[current.dirname], current.content];
        return aggregation;
      }, {});

    const tupled: Array<{ pathname: string; content: string[] }> = Object.entries(
      aggregated,
    ).map(([key, value]) => ({ pathname: key, content: value }));

    return TE.right(tupled);
  } catch (err) {
    return TE.left(err);
  }
}

export async function write(args: {
  contents: TResolvedEither<TResolvedPromise<ReturnType<typeof getWriteContents>>>;
  configObjects: INonNullableConfigObjectProps[];
}): Promise<TE.Either<Error, number>> {
  try {
    const configMap = new Map<string, INonNullableConfigObjectProps>(
      args.configObjects.map((configObject) => [configObject.dir, configObject]),
    );

    const writing = async (targetContent: { pathname: string; content: string[] }) => {
      log('current: ', targetContent.pathname);

      const configObject = configMap.get(targetContent.pathname) ?? {
        dir: targetContent.pathname,
        depth: 0,
        exists: false,
        config: defaultConfig(),
      };

      const indexFile = configObject.config.useDeclarationFile ? 'index.d.ts' : 'index.ts';
      const resolvedIndexFile = path.resolve(targetContent.pathname, indexFile);
      const resolvedBackupFile = path.resolve(targetContent.pathname, `${indexFile}.bak`);

      // processing backup file,
      if (isTrue(configObject.config.useBackupFile) && (await exists(resolvedIndexFile))) {
        const backupWrited = await pipe(
          TTE.taskify(fs.readFile)(resolvedIndexFile),
          TTE.chain((buf) => TTE.taskify(fs.writeFile)(resolvedBackupFile, buf)),
        )();

        if (TE.isLeft(backupWrited)) {
          log('error caused from backup write, ...');
          log(backupWrited.left.message);
          log(backupWrited.left.stack);

          return TE.left(backupWrited.left);
        }
      }

      // create index file
      const today = dayjs();
      const comment = (() =>
        pipe(
          (() => (configObject.config.useComment ? '// created from ctix' : ''))(),
          (comment) =>
            configObject.config.useComment && configObject.config.useTimestamp
              ? `${comment} ${today.format('YYYY-MM-DD HH:mm:ss')}`
              : comment,
          (comment) => (comment !== '' ? `${comment}\n\n` : comment),
        ))();

      const buf = Buffer.from(
        `${comment}${targetContent.content
          .map((line) => (configObject.config.useSemicolon ? `${line};` : line))
          .join('\n')}${configObject.config.addNewline ? '\n' : ''}`,
        'utf8',
      );

      const writeResult = await TTE.taskify(fs.writeFile)(resolvedIndexFile, buf)();

      if (TE.isLeft(writeResult)) {
        log('error caused from index.ts write, ...');
        log(writeResult.left.message);
        log(writeResult.left.stack);

        return TE.left(writeResult.left);
      }

      return TE.right(1);
    };

    const writesResult = await Promise.all(
      args.contents.map((indexContent) => writing(indexContent)),
    );

    const sum = writesResult
      .map((result): number => (TE.isRight(result) ? 1 : 0))
      .reduce((prev, next) => prev + next);

    log('successfully writed index: ', sum);
    return TE.right(sum);
  } catch (err) {
    return TE.left(err);
  }
}
