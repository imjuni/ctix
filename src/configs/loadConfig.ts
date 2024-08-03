import { castConfig } from '#/configs/castConfig';
import { CE_CTIX_DEFAULT_VALUE } from '#/configs/const-enum/CE_CTIX_DEFAULT_VALUE';
import { getConfigObject } from '#/configs/getConfigObject';
import { getConfigValue } from '#/configs/getConfigValue';
import type { IProjectOptions } from '#/configs/interfaces/IProjectOptions';
import type { TCommandBuildArgvOptions } from '#/configs/interfaces/TCommandBuildArgvOptions';
import type { TCommandRemoveOptions } from '#/configs/interfaces/TCommandRemoveOptions';
import { getCommand } from '#/configs/modules/getCommand';
import { getConfigFilePath } from '#/configs/modules/getConfigFilePath';
import { readConfigFromFile } from '#/configs/modules/readConfigFromFile';
import { readConfigFromPackageJson } from '#/configs/modules/readConfigFromPackageJson';
import { readConfigFromTsconfigJson } from '#/configs/modules/readConfigFromTsconfigJson';
import { getCheckedValue } from '#/modules/values/getCheckedValue';
import consola from 'consola';
import minimist from 'minimist';
import { isError } from 'my-easy-fp';

export async function loadConfig(): Promise<
  TCommandBuildArgvOptions | TCommandRemoveOptions | IProjectOptions
> {
  try {
    const configValueKeys = [
      'force-yes',
      'y',
      'remove-backup',
      'export-filename',
      'f',
      'output',
      'o',
      'skip-empty-dir',
      'start-from',
      'project',
      'p',
      'mode',
      'use-semicolon',
      'use-banner',
      'quote',
      'q',
      'directive',
      'file-ext',
      'overwrite',
      'w',
      'backup',
      'generation-style',
      'include-files',
      'exclude-files',
      'config',
      'c',
      'spinner-stream',
      'progress-stream',
      'reasoner-stream',
    ];
    const argv = minimist(process.argv.slice(2));

    // const configFilePath = getConfigFilePath(argv, tsconfigPath);
    const command = getCommand(argv._);

    const configFilePath = await getConfigFilePath(
      CE_CTIX_DEFAULT_VALUE.CONFIG_FILENAME,
      getConfigValue(argv, 'c', 'config'),
    );

    const tsconfigFilePath = await getConfigFilePath(
      CE_CTIX_DEFAULT_VALUE.TSCONFIG_FILENAME,
      getConfigValue(argv, 'p', 'project'),
    );

    const configFileEither =
      configFilePath != null ? await readConfigFromFile(configFilePath) : undefined;

    // case 1. using .ctirc
    if (configFileEither != null && configFileEither.type === 'pass') {
      const projectFilePath =
        getCheckedValue<string>('String', getConfigValue(argv, 'p', 'project')) ??
        getCheckedValue<string>('String', configFileEither.pass.p) ??
        getCheckedValue<string>('String', configFileEither.pass.project) ??
        tsconfigFilePath;

      const config = castConfig(
        command,
        {
          ...configFileEither.pass,
          ...getConfigObject(argv, ...configValueKeys),
        },
        {
          from: '.ctirc',
          config: configFilePath,
          tsconfig: projectFilePath,
        },
      );

      return config;
    }

    const tsconfigEither =
      tsconfigFilePath != null ? await readConfigFromTsconfigJson(tsconfigFilePath) : undefined;

    if (tsconfigEither != null && tsconfigEither.type === 'pass') {
      const config = castConfig(
        command,
        {
          ...tsconfigEither.pass,
          ...getConfigObject(argv, ...configValueKeys),
        },
        {
          from: 'tsconfig.json',
          config: configFilePath,
          tsconfig: tsconfigFilePath,
        },
      );

      return config;
    }

    const packageJsonEither = await readConfigFromPackageJson();

    if (packageJsonEither.type === 'pass') {
      const config = castConfig(
        command,
        {
          ...packageJsonEither.pass,
          ...getConfigObject(argv, ...configValueKeys),
        },
        {
          from: 'package.json',
          config: configFilePath,
          tsconfig: tsconfigFilePath,
        },
      );

      return config;
    }

    // case 4. in case of a read failure from .ctirc, tsconfig.json, or package.json
    const config = castConfig(
      command,
      {
        ...getConfigObject(argv, ...configValueKeys),
      },
      {
        from: 'none',
        config: configFilePath,
        tsconfig: tsconfigFilePath,
      },
    );

    return config;
  } catch (catched) {
    const err = isError(catched, new Error('unknown error raised'));
    consola.debug(err);

    return {} as unknown as TCommandBuildArgvOptions;
  }
}
