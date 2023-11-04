import { getExcludeNamespace } from '#/comments/getExcludeNamespace';
import type { IInlineExcludeInfo } from '#/comments/interfaces/IInlineExcludeInfo';
import type { IExtendOptions } from '#/configs/interfaces/IExtendOptions';

export function getInlineExclude(
  comment: string,
  options: { eol: IExtendOptions['eol']; keyword: string },
): IInlineExcludeInfo | undefined {
  const lines = comment.split(options.eol).map((line) => line.trim());
  const reg = new RegExp(`(${options.keyword})(\\s.*|)$`);

  const finded = lines
    .map((line, index) => {
      const matched = reg.exec(line);

      if (matched != null) {
        const namespaces = getExcludeNamespace(matched.at(2)?.trim());

        return {
          commentCode: line,
          pos: matched.index,
          line: index,
          finded: true,
          namespaces,
        } satisfies IInlineExcludeInfo & { finded: boolean };
      }

      return {
        commentCode: line,
        pos: NaN,
        line: index,
        finded: false,
        namespaces: undefined,
      } satisfies IInlineExcludeInfo & { finded: boolean };
    })
    .filter((line) => line.finded);

  return finded.at(0);
}
