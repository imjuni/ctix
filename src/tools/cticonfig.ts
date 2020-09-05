import {
  IOptionObjectProps,
  ICreateTypeScriptIndex,
  INonNullableOptionObjectProps,
} from '@interfaces/IConfigObjectProps';
import { ICTIXOptions } from '@interfaces/ICTIXOptions';
import { exists } from '@tools/misc';
import debug from 'debug';
import merge from 'deepmerge';
import fastGlob from 'fast-glob';
import * as TEI from 'fp-ts/Either';
import { isEmpty, isNotEmpty } from 'my-easy-fp';
import * as TPI from 'fp-ts/pipeable';
import * as fs from 'fs';
import json5 from 'json5';
import path from 'path';
import { fpGetDirDepth, fpTimes, getParentPath } from './misc';
import logger from './Logger';

const log = debug('ctix:config-tool');

export const getExportFilename = (exportFilenameFrom?: string | undefined | null) =>
  TPI.pipe(
    exportFilenameFrom,
    (filename) => (isEmpty(filename) ? 'index.ts' : filename),
    (filename) => (filename === '' ? 'index.ts' : filename),
  );

export function defaultOption(args?: { project?: string; exportFilename?: string }): ICTIXOptions {
  const project = args?.project ?? path.join(process.cwd(), 'tsconfig.json');
  const exportFilename = args?.exportFilename ?? 'index.ts';

  return {
    addNewline: true,
    useSemicolon: true,
    useTimestamp: false,
    useComment: true,
    exportFilename,
    quote: "'",
    verbose: false,
    useBackupFile: true,
    project,
  };
}

export async function readOptionFile(filename: string, projectPath: string): Promise<Partial<ICTIXOptions>> {
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
    ];

    const extracted: Partial<ICTIXOptions> = optionKeys.reduce((option, key) => {
      if (isNotEmpty(parsed[key])) {
        option[key] = parsed[key];
      }

      return option;
    }, {});

    return extracted;
  } catch (err) {
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
  const fallbackOption = typeof projectPath === 'string' ? defaultOption({ project: projectPath }) : projectPath;

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
  };
}

export async function getCTIXOptions(
  args: Omit<ICreateTypeScriptIndex, 'optionFiles'>,
): Promise<TEI.Either<Error, IOptionObjectProps[]>> {
  try {
    const projectPath = path.resolve(args.projectPath);
    const projectDir = path.dirname(projectPath);
    const dirs = await fastGlob(`${projectDir}/**/*`, { onlyDirectories: true });

    const parsedConfigObjects = await Promise.all(
      [projectDir, ...dirs].map<Promise<IOptionObjectProps>>((dir) =>
        (async () => {
          const configFile = path.join(dir, '.ctirc');
          const isConfigFileExists = await exists(configFile);

          log('Working configuration file: ', configFile, isConfigFileExists);

          try {
            return {
              dir: path.resolve(dir),
              exists: isConfigFileExists,
              depth: fpGetDirDepth(projectDir, dir),
              option: isConfigFileExists ? await readOptionFile(configFile, projectPath) : undefined,
            };
          } catch (err) {
            log(configFile, isConfigFileExists);
            log(err.message);

            return {
              dir,
              depth: fpGetDirDepth(projectDir, dir),
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
  } catch (err) {
    return TEI.left(err);
  }
}

export async function getMergedConfig({
  projectPath,
  cliOption: cliOptionFrom,
  optionObjects,
}: {
  projectPath: string;
  cliOption: Partial<ICTIXOptions>;
  optionObjects: IOptionObjectProps[];
}): Promise<TEI.Either<Error, INonNullableOptionObjectProps[]>> {
  try {
    if (optionObjects.length > 1) {
      const fallbackOption = defaultOption({ project: projectPath });
      const rootOptions = merge(
        getNonEmptyOption(optionObjects[0].option, fallbackOption),
        getNonEmptyOption(cliOptionFrom, fallbackOption),
      );

      const lastOptionObject = optionObjects[optionObjects.length - 1];
      const firstOptionObject = {
        ...optionObjects[0],
        option: {
          ...rootOptions,
          project: rootOptions.project,
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
            nonNullableOptionMap.get(getParentPath(optionObject?.dir ?? ''))?.option ?? defaultOption();

          if (optionObject !== undefined && parentOptions !== undefined) {
            const newOptionObject = {
              ...optionObject,
              option: merge(
                parentOptions,
                optionObject.option ??
                  defaultOption({
                    // exportFilename, project fields use parent options
                    exportFilename: parentOptions.exportFilename,
                    project: parentOptions.project,
                  }),
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
              option: getNonEmptyOption(optionObject?.option, fallbackOption),
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
  } catch (err) {
    return TEI.left(err);
  }
}

export async function getConfigFiles(
  args: Omit<ICreateTypeScriptIndex, 'optionFiles'>,
): Promise<TEI.Either<Error, ICreateTypeScriptIndex>> {
  try {
    const resolvedCWD = path.dirname(path.resolve(args.projectPath)); // absolute projectPath
    const configPattern = path.join(resolvedCWD, '**', '.ctirc'); // create ctirc glob pattern

    // ctiignore file have dot charactor at file first so set true dot flag
    const configs = await fastGlob(configPattern, { dot: true });

    log('finded: ', configs);

    return TEI.right({ projectPath: args.projectPath, optionFiles: configs });
  } catch (err) {
    return TEI.left(err);
  }
}
