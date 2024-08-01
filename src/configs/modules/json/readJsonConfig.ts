import { readJsonc } from '#/configs/modules/json/readJsonc';
import fs from 'node:fs';

export async function readJsonConfig<T = unknown>(jsonConfigFilePath: string) {
  const buf = await fs.promises.readFile(jsonConfigFilePath);
  const packageJsonParsed = readJsonc<T>(buf);

  if (packageJsonParsed.type === 'fail') {
    return undefined;
  }

  return packageJsonParsed.pass;
}
