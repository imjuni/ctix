import { castConfig } from '#/configs/castConfig';
import { CE_CTIX_DEFAULT_VALUE } from '#/configs/const-enum/CE_CTIX_DEFAULT_VALUE';
import { getConfigValue } from '#/configs/getConfigValue';
import type { IProjectOptions } from '#/configs/interfaces/IProjectOptions';
import type { TCommandBuildArgvOptions } from '#/configs/interfaces/TCommandBuildArgvOptions';
import type { TCommandRemoveOptions } from '#/configs/interfaces/TCommandRemoveOptions';
import { getCommand } from '#/configs/modules/getCommand';
import { parseConfig } from '#/configs/parseConfig';
import { getConfigFilePath } from '#/modules/path/getConfigFilePath';
import consola from 'consola';
import findUp from 'find-up';
import minimist from 'minimist';
import { isError } from 'my-easy-fp';
import fs from 'node:fs';

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
    const parsed =
      configFilePath != null ? parseConfig(await fs.promises.readFile(configFilePath)) : {};
    const command = getCommand(argv._);
    const config = castConfig(command, parsed, { config: configFilePath, tsconfig: tsconfigPath });

    return config;
  } catch (catched) {
    const err = isError(catched, new Error('unknown error raised'));
    consola.debug(err);

    return {} as unknown as TCommandBuildArgvOptions;
  }
}
