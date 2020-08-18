import {
  IConfigObjectProps,
  ICreateTypeScriptIndex,
  INonNullableConfigObjectProps,
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

export function defaultConfig(args?: {
  project?: string;
  exportFilename?: string;
}): ICTIXOptions {
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

export async function getCtiConfig(
  args: Omit<ICreateTypeScriptIndex, 'configFiles'>,
): Promise<TEI.Either<Error, IConfigObjectProps[]>> {
  try {
    const dirs = await fastGlob(`${args.cwd}/**/*`, { onlyDirectories: true });

    const parsedConfigObjects = await Promise.all(
      [args.cwd, ...dirs].map<Promise<IConfigObjectProps>>((dir) =>
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
                ? (json5.parse(
                    (await fs.promises.readFile(configFile)).toString(),
                  ) as ICTIXOptions)
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
  cliOptions: cliOptionsFrom,
  configObjects,
}: {
  cwd: string;
  cliOptions: ICTIXOptions;
  configObjects: IConfigObjectProps[];
}): Promise<TEI.Either<Error, INonNullableConfigObjectProps[]>> {
  try {
    if (configObjects.length > 1) {
      const rootOptions = merge(
        configObjects[0].config ?? defaultConfig({ project: cwd }),
        cliOptionsFrom ?? defaultConfig({ project: cwd }),
      );

      const lastConfigObject = configObjects[configObjects.length - 1];
      const firstConfigObject = {
        ...configObjects[0],
        config: {
          ...rootOptions,
          project: rootOptions.project,
          exportFilename: getExportFilename(rootOptions.exportFilename),
        },
      };

      // root configuration from project directory
      const processedParseConfigMap = new Map<string, IConfigObjectProps>(
        configObjects.map((configObject) => [configObject.dir, configObject]),
      );

      const rootConfigObject = {
        ...firstConfigObject,
        config: merge(defaultConfig({ project: cwd }), {
          ...(firstConfigObject.config ?? defaultConfig({ project: cwd })),
          output: cwd,
        }),
      };

      const nonNullableConfigMap = new Map<string, INonNullableConfigObjectProps>();
      nonNullableConfigMap.set(rootConfigObject.dir, rootConfigObject);

      fpTimes(lastConfigObject.depth, false).forEach((depth) => {
        log(`directory depth "${depth}" processed`);

        const currentDepthedObjects = Array.from(processedParseConfigMap.values()).filter(
          (configObject) => configObject.depth === depth,
        );

        currentDepthedObjects.forEach((currentDepthedObject) => {
          const configObject = processedParseConfigMap.get(currentDepthedObject.dir);
          const parentOptions =
            nonNullableConfigMap.get(getParentPath(configObject?.dir ?? ''))?.config ??
            defaultConfig();

          if (configObject !== undefined && parentOptions !== undefined) {
            const newConfigObject = {
              ...configObject,
              config: merge(
                parentOptions,
                configObject.config ??
                  defaultConfig({
                    // exportFilename, project fields use parent options
                    exportFilename: parentOptions.exportFilename,
                    project: parentOptions.project,
                  }),
              ),
            };

            nonNullableConfigMap.set(newConfigObject.dir, newConfigObject);
            log(
              'exportFilename-1: ',
              parentOptions.exportFilename,
              (configObject.config ?? defaultConfig()).exportFilename,
              newConfigObject.config.exportFilename,
            );
          } else {
            const newConfigObject = {
              ...currentDepthedObject,
              config: configObject?.config ?? defaultConfig(),
            };

            nonNullableConfigMap.set(currentDepthedObject.dir, newConfigObject);
            log('exportFilename-2: ', newConfigObject.config.exportFilename);
          }
        });
      });

      const merged = [rootConfigObject, ...Array.from(nonNullableConfigMap.values())];
      return TEI.right(merged);
    }

    return TEI.right(
      [...configObjects].map((configObject) => ({
        ...configObject,
        config: defaultConfig(),
      })),
    );
  } catch (err) {
    return TEI.left(err);
  }
}

export async function getConfigFiles(
  args: Omit<ICreateTypeScriptIndex, 'configFiles'>,
): Promise<TEI.Either<Error, ICreateTypeScriptIndex>> {
  try {
    const resolvedCWD = path.resolve(args.cwd); // absolute path
    const configPattern = path.join(resolvedCWD, '**', '.ctirc'); // create ctirc glob pattern

    // ctiignore file have dot charactor at file first so set true dot flag
    const configs = await fastGlob(configPattern, { dot: true });

    log('finded: ', configs);

    return TEI.right({ cwd: args.cwd, configFiles: configs });
  } catch (err) {
    return TEI.left(err);
  }
}
