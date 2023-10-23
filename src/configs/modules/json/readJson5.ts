import { getString } from '#/configs/modules/json/getString';
import { parse } from 'json5';
import { isError } from 'my-easy-fp';
import { fail, pass, type PassFailEither } from 'my-only-either';

export function readJson5<T = unknown>(buf: Buffer | string): PassFailEither<Error, T> {
  try {
    const stringified = getString(buf);
    const parsed = parse<T>(stringified);
    return pass(parsed);
  } catch (caught) {
    const err = isError(caught, new Error('unknown error raised'));
    return fail(err);
  }
}
