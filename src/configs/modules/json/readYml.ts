import { getString } from '#/configs/modules/json/getString';
import { isError } from 'my-easy-fp';
import { fail, pass, type PassFailEither } from 'my-only-either';
import { parse } from 'yaml';

export function readYaml<T = unknown>(buf: Buffer | string): PassFailEither<Error, T> {
  try {
    const stringified = getString(buf);
    const parsed = parse(stringified) as T;
    return pass(parsed);
  } catch (caught) {
    const err = isError(caught, new Error('unknown error raised'));
    return fail(err);
  }
}
