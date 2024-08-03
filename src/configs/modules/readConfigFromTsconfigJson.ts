import { readJsonc } from '#/configs/modules/json/readJsonc';
import fs from 'fs';
import { isError } from 'my-easy-fp';
import { type PassFailEither, fail, pass } from 'my-only-either';

export async function readConfigFromTsconfigJson(
  tsconfigFilePath: string,
): Promise<PassFailEither<Error, Record<string, unknown>>> {
  try {
    const buf = await fs.promises.readFile(tsconfigFilePath);
    const parsed = readJsonc<Record<string, unknown>>(buf);

    if (parsed.type === 'fail') {
      return parsed;
    }

    const tsconfig = parsed.pass;

    if (
      'ctix' in tsconfig &&
      typeof tsconfig.ctix === 'object' &&
      tsconfig.ctix != null &&
      Object.keys(tsconfig.ctix).length > 0
    ) {
      const config = tsconfig.ctix as Record<string, unknown>;
      return pass(config);
    }

    return fail(new Error(`cannot read configuration from ${tsconfigFilePath}`));
  } catch (caught) {
    const err = isError(caught, new Error('unknown error raised from configuration reading'));
    return fail(err);
  }
}
