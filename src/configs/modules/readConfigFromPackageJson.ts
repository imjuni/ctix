import fs from 'fs';
import { isError } from 'my-easy-fp';
import { type PassFailEither, fail, pass } from 'my-only-either';
import pathe from 'pathe';
import type { PackageJson } from 'type-fest';

export async function readConfigFromPackageJson(): Promise<
  PassFailEither<Error, Record<string, unknown>>
> {
  try {
    const packageJsonFilePath = pathe.join(process.cwd(), 'package.json');
    const buf = await fs.promises.readFile(packageJsonFilePath);
    const packageJson = JSON.parse(buf.toString()) as PackageJson;

    if (
      'ctix' in packageJson &&
      typeof packageJson.ctix === 'object' &&
      packageJson.ctix != null &&
      Object.keys(packageJson.ctix).length > 0
    ) {
      const config = packageJson.ctix as Record<string, unknown>;
      return pass(config);
    }

    return fail(new Error('cannot read configuration from package.json'));
  } catch (caught) {
    const err = isError(caught, new Error('unknown error raised from configuration reading'));
    return fail(err);
  }
}
