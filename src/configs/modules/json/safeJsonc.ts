import { readJsonc } from '#/configs/modules/json/readJsonc';

export function safeJsonc<T = unknown>(buf: Buffer | string): T | undefined {
  try {
    const json = readJsonc<T>(buf);

    if (json.type === 'pass') {
      return json.pass;
    }

    return undefined;
  } catch {
    return undefined;
  }
}
