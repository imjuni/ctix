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
import * as TE from 'fp-ts/lib/Either';
import * as fs from 'fs';
import json5 from 'json5';
import path from 'path';
import { fpGetDirDepth, fpTimes, getParentPath } from './misc';

const log = debug('ctit:config-tool');

export function defaultConfig(cwd?: string): ICTIXOptions {
  return {
    addNewline: true,
    useSemicolon: true,
    useTimestamp: false,
    useComment: true,
    useDeclarationFile: false,
    quote: "'",
    verbose: false,
    useBackupFile: true,
    output: cwd ?? process.cwd(),
    project: path.join(cwd ?? process.cwd(), 'tsconfig.json'),
  };
}

export async function getCtiConfig(
  args: Omit<ICreateTypeScriptIndex, 'configFiles'>,
): Promise<TE.Either<Error, IConfigObjectProps[]>> {
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
              dir,
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
    return TE.right([...parsedConfigObjects].sort((a, b) => a.depth - b.depth));
  } catch (err) {
    return TE.left(err);
  }
}

export async function getMergedConfig({
  cwd,
  configObjects,
}: {
  cwd: string;
  configObjects: IConfigObjectProps[];
}): Promise<TE.Either<Error, INonNullableConfigObjectProps[]>> {
  try {
    if (configObjects.length > 1) {
      const lastConfigObject = configObjects[configObjects.length - 1];
      const firstConfigObject = configObjects[0];

      const processedParseConfigMap = new Map<string, IConfigObjectProps>(
        configObjects.map((configObject) => [configObject.dir, configObject]),
      );

      const rootConfigObject = {
        ...firstConfigObject,
        config: merge(defaultConfig(cwd), {
          ...(firstConfigObject.config ?? defaultConfig(cwd)),
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
          const parentObject = nonNullableConfigMap.get(
            getParentPath(configObject?.dir ?? ''),
          );

          if (configObject !== undefined && parentObject !== undefined) {
            const newConfigObject = {
              ...configObject,
              config: merge(
                parentObject.config ?? defaultConfig(),
                configObject.config ?? defaultConfig(),
              ),
            };

            nonNullableConfigMap.set(newConfigObject.dir, newConfigObject);
          }
        });
      });

      return TE.right([rootConfigObject, ...Array.from(nonNullableConfigMap.values())]);
    }

    return TE.right(
      [...configObjects].map((configObject) => ({
        ...configObject,
        config: defaultConfig(),
      })),
    );
  } catch (err) {
    return TE.left(err);
  }
}

export async function getConfigFiles(
  args: Omit<ICreateTypeScriptIndex, 'configFiles'>,
): Promise<TE.Either<Error, ICreateTypeScriptIndex>> {
  try {
    const resolvedCWD = path.resolve(args.cwd); // absolute path
    const configPattern = path.join(resolvedCWD, '**', '.ctirc'); // create ctirc glob pattern

    // ctiignore file have dot charactor at file first so set true dot flag
    const configs = await fastGlob(configPattern, { dot: true });

    log('finded: ', configs);

    return TE.right({ cwd: args.cwd, configFiles: configs });
  } catch (err) {
    return TE.left(err);
  }
}
