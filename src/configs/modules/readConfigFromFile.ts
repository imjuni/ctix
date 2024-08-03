import { parseConfig } from '#/configs/parseConfig';
import fs from 'fs';
import { isError } from 'my-easy-fp';
import { type PassFailEither, fail, pass } from 'my-only-either';

export async function readConfigFromFile(
  configFilePath: string,
): Promise<PassFailEither<Error, Record<string, unknown>>> {
  try {
    const buf = await fs.promises.readFile(configFilePath);
    const parsed = parseConfig<Record<string, unknown>>(buf);

    if (typeof parsed !== 'object') {
      return fail(new Error(`invalid configuration file format: ${parsed as string}`));
    }

    return pass(parsed);
  } catch (caught) {
    const err = isError(caught, new Error('unknown error raised from configuration reading'));
    return fail(err);
  }
}
