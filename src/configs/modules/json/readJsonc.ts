import { getString } from '#/configs/modules/json/getString';
import { parse, printParseErrorCode, type ParseError } from 'jsonc-parser';
import { atOrThrow, isError } from 'my-easy-fp';
import { fail, pass, type PassFailEither } from 'my-only-either';

export function readJsonc<T = unknown>(buf: Buffer | string): PassFailEither<Error, T> {
  try {
    const stringified = getString(buf);
    const errors: ParseError[] = [];
    const parsed = parse(stringified, errors) as T;

    if (errors.length > 0) {
      throw new Error(
        `JSONC: [${printParseErrorCode(atOrThrow(errors, 0).error)}] invalid character ${
          atOrThrow(errors, 0).length
        }:${atOrThrow(errors, 0).offset}`,
      );
    }

    return pass(parsed);
  } catch (caught) {
    const err = isError(caught, new Error('unknown error raised'));
    return fail(err);
  }
}
