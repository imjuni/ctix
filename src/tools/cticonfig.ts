import {
  ICreateTypeScriptIndex,
  INonNullableOptionObjectProps,
  IOptionObjectProps,
} from '@interfaces/IConfigObjectProps';
import { ICTIXOptions } from '@interfaces/ICTIXOptions';
import { exists, fastGlobWrap, replaceSepToPosix } from '@tools/misc';
import debug from 'debug';
import merge from 'deepmerge';
import * as TEI from 'fp-ts/Either';
import * as TFU from 'fp-ts/function';
import * as TTE from 'fp-ts/TaskEither';
import * as fs from 'fs';
import json5 from 'json5';
import { isEmpty, isNotEmpty } from 'my-easy-fp';
import path from 'path';
import logger from './Logger';
import { fpGetDirDepth, fpTimes, getParentPath } from './misc';

const log = debug('ctix:config-test-case');

export const getExportFilename = (exportFilenameFrom?: string | undefined | null) =>
  TFU.pipe(
    exportFilenameFrom,
    (filename) => (isEmpty(filename) ? 'index.ts' : filename),
    (filename) => (filename === '' ? 'index.ts' : filename),
  );

export function defaultOption(args?: {
  project?: string;
  exportFilename?: string;
  excludePath?: boolean;
  useRootDir?: boolean;
  useUpperFirst?: boolean;
}): ICTIXOptions {
  const project = args?.project ?? path.join(process.cwd(), 'tsconfig.json');
  const exportFilename = args?.exportFilename ?? 'index.ts';
  const excludePath = args?.excludePath ?? false;
  const useRootDir = args?.useRootDir ?? false;
  const useUpperFirst = args?.useUpperFirst ?? true;

  return {
    addNewline: true,
    useSemicolon: true,
    useTimestamp: false,
    useComment: true,
    exportFilename,
    quote: "'",
    verbose: false,
    useBackupFile: true,
    output: project,
    useRootDir,
    excludePath,
    useUpperFirst,
    project,
  };
}

export async function readOptionFile(
  filename: string,
  projectPath: string,
): Promise<Partial<ICTIXOptions>> {
  try {
    const readed = await fs.promises.readFile(filename);
    const parsed = json5.parse(readed.toString()) as ICTIXOptions;
    const optionKeys: Array<keyof ICTIXOptions> = [
      'project',
      'addNewline',
      'useSemicolon',
      'useTimestamp',
      'useComment',
      'quote',
      'verbose',
      'useBackupFile',
      'exportFilename',
      'useRootDir',
    ];

    const extracted: Partial<ICTIXOptions> = optionKeys.reduce((aggregation, key) => {
      const next = aggregation;

      if (isNotEmpty(parsed[key])) {
        next[key] = parsed[key];
      }

      return next;
    }, {});

    return extracted;
  } catch (catched) {
    const err = catched instanceof Error ? catched : new Error('unknown error raised');

    logger.error(`Error caused from ${filename}`);
    logger.error(err.message ?? '');

    log('---------------------------------------------------------------------------');
    log('Error caused from readOptionFile');
    log(err.message);
    log(err.stack);
    log('---------------------------------------------------------------------------');

    return defaultOption({ project: projectPath });
  }
}

/**
 * Create non-empty option using two object
 *
 * @param partialOption Partial ctix option object. Usually, partial option object from cli or .ctirc.
 * @param {string | ICTIXOptions} default option object.
 */
export function getNonEmptyOption(
  partialOption: Partial<ICTIXOptions> | undefined,
  projectPath: string | ICTIXOptions,
): ICTIXOptions {
  const fallbackOption =
    typeof projectPath === 'string' ? defaultOption({ project: projectPath }) : projectPath;

  return {
    project: partialOption?.project ?? fallbackOption.project,
    addNewline: partialOption?.addNewline ?? fallbackOption.addNewline,
    useSemicolon: partialOption?.useSemicolon ?? fallbackOption.useSemicolon,
    useTimestamp: partialOption?.useTimestamp ?? fallbackOption.useTimestamp,
    useComment: partialOption?.useComment ?? fallbackOption.useComment,
    quote: partialOption?.quote ?? fallbackOption.quote,
    verbose: partialOption?.verbose ?? fallbackOption.verbose,
    useBackupFile: partialOption?.useBackupFile ?? fallbackOption.useBackupFile,
    exportFilename: partialOption?.exportFilename ?? fallbackOption.exportFilename,
    output: partialOption?.output ?? fallbackOption.output,
    useRootDir: partialOption?.useRootDir ?? fallbackOption.useRootDir,
    excludePath: partialOption?.excludePath ?? fallbackOption.excludePath,
    useUpperFirst: partialOption?.useUpperFirst ?? fallbackOption.useUpperFirst,
  };
}

export const getCTIXOptions =
  (
    args: Omit<ICreateTypeScriptIndex, 'optionFiles'>,
  ): TTE.TaskEither<Error, IOptionObjectProps[]> =>
  async () => {
    try {
      const projectFilePath = path.resolve(args.projectPath);
      const projectDirPath = path.dirname(projectFilePath);

      const dirs = await fastGlobWrap(`${projectDirPath}/**/*`, {
        onlyDirectories: true,
        ignore: [replaceSepToPosix(path.join(projectDirPath, '**', 'node_modules', '**'))],
      });

      const parsedConfigObjects = await Promise.all(
        [projectDirPath, ...dirs].map<Promise<IOptionObjectProps>>((dir) =>
          (async () => {
            const configFile = path.join(dir, '.ctirc');
            const isConfigFileExists = await exists(configFile);
            const depth = fpGetDirDepth(projectDirPath, dir);

            log('Working configuration file: ', depth, configFile, isConfigFileExists);

            try {
              return {
                dir: path.resolve(dir),
                exists: isConfigFileExists,
                depth,
                option: isConfigFileExists
                  ? await readOptionFile(configFile, projectFilePath)
                  : undefined,
              };
            } catch (catched) {
              const err = catched instanceof Error ? catched : new Error('unknown error raised');

              log(configFile, isConfigFileExists);
              log(err.message);

              return {
                dir,
                depth: fpGetDirDepth(projectDirPath, dir),
                exists: isConfigFileExists,
                option: undefined,
              };
            }
          })(),
        ),
      );

      // directory depth ascending sort
      return TEI.right(
        [...parsedConfigObjects].sort((left, right) => {
          const diff = left.depth - right.depth;
          return diff === 0 ? left.dir.localeCompare(right.dir) : diff;
        }),
      );
    } catch (catched) {
      const err = catched instanceof Error ? catched : new Error('unknown error raised');

      return TEI.left(err);
    }
  };

export const getMergedConfig =
  ({
    projectPath,
    cliOption: cliOptionFrom,
    optionObjects,
  }: {
    projectPath: string;
    cliOption: Partial<ICTIXOptions>;
    optionObjects: IOptionObjectProps[];
  }): TTE.TaskEither<Error, INonNullableOptionObjectProps[]> =>
  async () => {
    try {
      if (optionObjects.length > 1) {
        const fallbackOption = defaultOption({ project: projectPath });
        const rootOptions: ICTIXOptions = merge(
          getNonEmptyOption(optionObjects[0].option, fallbackOption),
          getNonEmptyOption(cliOptionFrom, fallbackOption),
        );

        const lastOptionObject = optionObjects[optionObjects.length - 1];
        const firstOptionObject = {
          ...optionObjects[0],
          option: {
            ...rootOptions,
            project: rootOptions.project,
            excludePath: rootOptions.excludePath,
            useRootDir: rootOptions.useRootDir,
            useUpperFirst: rootOptions.useUpperFirst,
            exportFilename: getExportFilename(rootOptions.exportFilename),
          },
        };

        // root configuration from project directory
        const processedParseConfigMap = new Map<string, IOptionObjectProps>(
          optionObjects.map((configObject) => [configObject.dir, configObject]),
        );

        const rootOptionObject = {
          ...firstOptionObject,
          option: merge(defaultOption({ project: projectPath }), {
            ...(firstOptionObject.option ?? fallbackOption),
          }),
        };

        const nonNullableOptionMap = new Map<string, INonNullableOptionObjectProps>();
        nonNullableOptionMap.set(rootOptionObject.dir, rootOptionObject);

        fpTimes(lastOptionObject.depth, false).forEach((depth) => {
          log(`directory depth "${depth}" processed`);

          const currentDepthedObjects = Array.from(processedParseConfigMap.values()).filter(
            (configObject) => configObject.depth === depth,
          );

          currentDepthedObjects.forEach((currentDepthedObject) => {
            const optionObject = processedParseConfigMap.get(currentDepthedObject.dir);
            const parentOptions =
              nonNullableOptionMap.get(getParentPath(optionObject?.dir ?? ''))?.option ??
              defaultOption();

            if (optionObject?.option !== undefined && parentOptions !== undefined) {
              const newOptionObject = {
                ...optionObject,
                option: merge(
                  parentOptions,
                  optionObject.option ?? getNonEmptyOption(parentOptions, rootOptions.project),
                ),
              };

              nonNullableOptionMap.set(newOptionObject.dir, newOptionObject);

              log(
                'exportFilename-1: ',
                parentOptions.exportFilename,
                (optionObject.option ?? fallbackOption).exportFilename,
                newOptionObject.option.exportFilename,
              );
            } else {
              const newOptionObject = {
                ...currentDepthedObject,
                option: getNonEmptyOption(optionObject?.option, rootOptions),
              };

              nonNullableOptionMap.set(currentDepthedObject.dir, newOptionObject);
              log('exportFilename-2: ', newOptionObject.option.exportFilename);
            }
          });
        });

        const merged = [rootOptionObject, ...Array.from(nonNullableOptionMap.values())];
        return TEI.right(merged);
      }

      return TEI.right(
        [...optionObjects].map((configObject) => ({
          ...configObject,
          option: defaultOption(),
        })),
      );
    } catch (catched) {
      const err = catched instanceof Error ? catched : new Error('unknown error raised');

      return TEI.left(err);
    }
  };

export async function getConfigFiles(
  args: Omit<ICreateTypeScriptIndex, 'optionFiles'>,
): Promise<TEI.Either<Error, ICreateTypeScriptIndex>> {
  try {
    const resolvedCWD = path.dirname(path.resolve(args.projectPath)); // absolute projectPath
    const configPattern = path.join(resolvedCWD, '**', '.ctirc'); // create ctirc glob pattern

    // ctiignore file have dot charactor at file first so set true dot flag
    // + win32 path.sep replace posix sep
    const configs = await fastGlobWrap(configPattern, { dot: true });
    const sorted = configs.sort((left, right) => left.localeCompare(right));

    log('finded: ', args, configPattern, sorted);

    return TEI.right({ projectPath: args.projectPath, optionFiles: sorted });
  } catch (catched) {
    const err = catched instanceof Error ? catched : new Error('unknown error raised');

    return TEI.left(err);
  }
}
