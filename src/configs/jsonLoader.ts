import { parse as json5parse } from 'json5';
import { parse as jsoncParse } from 'jsonc-parser';
import { PassFailEither, pass, fail, isPass } from 'my-only-either';

export default function jsonLoader(data: string) {
  const jsoncParsed = ((): PassFailEither<Error, any> => {
    try {
      const parsed = jsoncParse(data);
      return pass(parsed);
    } catch (catched) {
      const err = catched instanceof Error ? catched : new Error('unknown error raised');
      return fail(err);
    }
  })();

  if (isPass(jsoncParsed)) {
    return jsoncParsed.pass;
  }

  const json5Parsed = ((): PassFailEither<Error, any> => {
    try {
      const parsed = json5parse(data);
      return pass(parsed);
    } catch (catched) {
      const err = catched instanceof Error ? catched : new Error('unknown error raised');
      return fail(err);
    }
  })();

  if (isPass(json5Parsed)) {
    return json5Parsed.pass;
  }

  return {};
}
