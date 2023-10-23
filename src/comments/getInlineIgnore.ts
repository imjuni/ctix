import { getIgnoreNamespace } from '#/comments/getIgnoreNamespace';
import type { IInlineIgnoreInfo } from '#/comments/interfaces/IInlineIgnoreInfo';
import type { IExtendOptions } from '#/configs/interfaces/IExtendOptions';

export function getInlineIgnore(
  comment: string,
  options: { eol: IExtendOptions['eol']; keyword: string },
): IInlineIgnoreInfo | undefined {
  const lines = comment.split(options.eol).map((line) => line.trim());
  const reg = new RegExp(`(${options.keyword})(\\s.*|)$`);

  const finded = lines
    .map((line, index) => {
      const matched = reg.exec(line);

      if (matched != null) {
        const namespaces = getIgnoreNamespace(matched.at(2)?.trim());

        return {
          commentCode: line,
          pos: matched.index,
          line: index,
          finded: true,
          namespaces,
        } satisfies IInlineIgnoreInfo & { finded: boolean };
      }

      return {
        commentCode: line,
        pos: NaN,
        line: index,
        finded: false,
        namespaces: undefined,
      } satisfies IInlineIgnoreInfo & { finded: boolean };
    })
    .filter((line) => line.finded);

  return finded.at(0);
}
