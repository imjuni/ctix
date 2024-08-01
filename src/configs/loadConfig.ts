import { Spinner } from '#/cli/ux/Spinner';
import { castConfig } from '#/configs/castConfig';
import { CE_CTIX_DEFAULT_VALUE } from '#/configs/const-enum/CE_CTIX_DEFAULT_VALUE';
import { getConfigValue } from '#/configs/getConfigValue';
import type { IProjectOptions } from '#/configs/interfaces/IProjectOptions';
import type { TCommandBuildArgvOptions } from '#/configs/interfaces/TCommandBuildArgvOptions';
import type { TCommandRemoveOptions } from '#/configs/interfaces/TCommandRemoveOptions';
import { getCommand } from '#/configs/modules/getCommand';
import { readJsonConfig } from '#/configs/modules/json/readJsonConfig';
import { parseConfig } from '#/configs/parseConfig';
import { getConfigFilePath } from '#/modules/path/getConfigFilePath';
import { posixJoin } from '#/modules/path/modules/posixJoin';
import consola from 'consola';
import findUp from 'find-up';
import minimist from 'minimist';
import { isError } from 'my-easy-fp';
import fs from 'node:fs';
import type { PackageJson, TsConfigJson } from 'type-fest';

export async function loadConfig(): Promise<
  TCommandBuildArgvOptions | TCommandRemoveOptions | IProjectOptions
> {
  try {
    const argv = minimist(process.argv.slice(2));

    const prjectPath = getConfigValue(argv, 'p', 'project');
    const tsconfigPath =
      prjectPath != null
        ? findUp.sync(prjectPath)
        : findUp.sync(CE_CTIX_DEFAULT_VALUE.TSCONFIG_FILENAME);

    const configFilePath = getConfigFilePath(argv, tsconfigPath);
    const command = getCommand(argv._);

    if (tsconfigPath == null) {
      Spinner.it.fail('Cannot found tsconfig.json file!');
      throw new Error('Cannot found tsconfig.json file!');
    }

    // case 1. using .ctirc
    if (configFilePath != null) {
      const parsed =
        configFilePath != null ? parseConfig(await fs.promises.readFile(configFilePath)) : {};

      const config = castConfig(command, parsed, {
        config: configFilePath,
        tsconfig: tsconfigPath,
      });

      Spinner.it.fail("load configuration from '.ctirc'");
      return config;
    }

    // case 2. using tsconfig.json
    const tsconfigParsed = await readJsonConfig<TsConfigJson>(tsconfigPath);
    if (
      configFilePath == null &&
      tsconfigParsed != null &&
      'ctix' in tsconfigParsed &&
      tsconfigParsed.ctix != null &&
      typeof tsconfigParsed.ctix === 'object' &&
      Object.keys(tsconfigParsed.ctix).length > 0
    ) {
      const config = castConfig(command, tsconfigParsed.ctix, {
        config: configFilePath,
        tsconfig: tsconfigPath,
      });

      Spinner.it.fail("load configuration from 'tsconfig.json'");
      return config;
    }

    // case 3. using package.json
    const packageJsonParsed = await readJsonConfig<PackageJson>(
      posixJoin(process.cwd(), 'package.json'),
    );
    if (
      configFilePath == null &&
      packageJsonParsed != null &&
      'ctix' in packageJsonParsed &&
      packageJsonParsed.ctix != null &&
      typeof packageJsonParsed.ctix === 'object' &&
      Object.keys(packageJsonParsed.ctix).length > 0
    ) {
      const config = castConfig(command, packageJsonParsed.ctix, {
        config: configFilePath,
        tsconfig: tsconfigPath,
      });

      Spinner.it.fail("load configuration from 'package.json'");
      return config;
    }

    // case 4. in case of a read failure from .ctirc, tsconfig.json, or package.json
    const config = castConfig(
      command,
      {},
      {
        config: configFilePath,
        tsconfig: tsconfigPath,
      },
    );

    return config;
  } catch (catched) {
    const err = isError(catched, new Error('unknown error raised'));
    consola.debug(err);

    return {} as unknown as TCommandBuildArgvOptions;
  }
}
