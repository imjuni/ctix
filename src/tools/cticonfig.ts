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
import { isEmpty } from 'my-easy-fp';
import * as TPI from 'fp-ts/pipeable';
import * as fs from 'fs';
import json5 from 'json5';
import path from 'path';
import { fpGetDirDepth, fpTimes, getParentPath } from './misc';

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

export async function getCTIXOptions(
  args: Omit<ICreateTypeScriptIndex, 'optionFiles'>,
): Promise<TEI.Either<Error, IOptionObjectProps[]>> {
  try {
    const dirs = await fastGlob(`${args.cwd}/**/*`, { onlyDirectories: true });

    const parsedConfigObjects = await Promise.all(
      [args.cwd, ...dirs].map<Promise<IOptionObjectProps>>((dir) =>
        (async () => {
          const configFile = path.join(dir, '.ctirc');
          const isConfigFileExists = await exists(configFile);

          log('Working configuration file: ', configFile, isConfigFileExists);

          try {
            return {
              dir: path.resolve(dir),
              exists: isConfigFileExists,
              depth: fpGetDirDepth(args.cwd, dir),
              config: isConfigFileExists
                ? (json5.parse((await fs.promises.readFile(configFile)).toString()) as ICTIXOptions)
                : undefined,
            };
          } catch (err) {
            log(configFile, isConfigFileExists);
            log(err.message);

            return {
              dir,
              depth: fpGetDirDepth(args.cwd, dir),
              exists: isConfigFileExists,
              config: undefined,
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
  cwd,
  cliOption: cliOptionFrom,
  optionObjects,
}: {
  cwd: string;
  cliOption: ICTIXOptions;
  optionObjects: IOptionObjectProps[];
}): Promise<TEI.Either<Error, INonNullableOptionObjectProps[]>> {
  try {
    if (optionObjects.length > 1) {
      const rootOptions = merge(
        optionObjects[0].option ?? defaultOption({ project: cwd }),
        cliOptionFrom ?? defaultOption({ project: cwd }),
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
        config: merge(defaultOption({ project: cwd }), {
          ...(firstOptionObject.option ?? defaultOption({ project: cwd })),
          output: cwd,
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
              (optionObject.option ?? defaultOption()).exportFilename,
              newOptionObject.option.exportFilename,
            );
          } else {
            const newOptionObject = {
              ...currentDepthedObject,
              option: optionObject?.option ?? defaultOption(),
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
    const resolvedCWD = path.resolve(args.cwd); // absolute path
    const configPattern = path.join(resolvedCWD, '**', '.ctirc'); // create ctirc glob pattern

    // ctiignore file have dot charactor at file first so set true dot flag
    const configs = await fastGlob(configPattern, { dot: true });

    log('finded: ', configs);

    return TEI.right({ cwd: args.cwd, optionFiles: configs });
  } catch (err) {
    return TEI.left(err);
  }
}
