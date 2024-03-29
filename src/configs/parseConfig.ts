import { readJson5 } from '#/configs/modules/json/readJson5';
import { readJsonc } from '#/configs/modules/json/readJsonc';
import { readYaml } from '#/configs/modules/json/readYml';

export function parseConfig<T = unknown>(buf: Buffer | string) {
  // step 01. try jsonc
  const jsonc = readJsonc<T>(buf);

  if (jsonc.type === 'pass') {
    return jsonc.pass;
  }

  // step 02. try json5
  const json5 = readJson5<T>(buf);

  if (json5.type === 'pass') {
    return json5.pass;
  }

  // step 03. try yaml
  const yaml = readYaml<T>(buf);

  if (yaml.type === 'pass') {
    return yaml.pass;
  }

  throw jsonc.fail;
}
