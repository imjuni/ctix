import { CE_INLINE_IGNORE_KEYWORD } from '#/comments/const-enum/CE_INLINE_IGNORE_KEYWORD';
import { getInlineIgnore } from '#/comments/getInlineIgnore';
import { getSourceCodeComment } from '#/comments/getSourceCodeComment';
import type { IInlineIgnoreInfo } from '#/comments/interfaces/IInlineIgnoreInfo';
import type { IExtendOptions } from '#/configs/interfaces/IExtendOptions';
import type * as tsm from 'ts-morph';
import type { SetRequired } from 'type-fest';

interface IIgnoreFile {
  filePath: string;
  fileIgnoreComment: IInlineIgnoreInfo[];
  firstIgnoreComment?: IInlineIgnoreInfo;
  ignored: boolean;
}

export function getInlineIgnoredFiles(params: {
  project: tsm.Project;
  extendOptions: Pick<IExtendOptions, 'eol'>;
  filePaths: string[];
}) {
  const ignored = params.filePaths
    .map((filePath) => params.project.getSourceFile(filePath))
    .filter((sourceFile): sourceFile is tsm.SourceFile => sourceFile != null)
    .map((sourceFile): IIgnoreFile => {
      const fileIgnoreComment = getSourceCodeComment(sourceFile)
        .map((comment) =>
          getInlineIgnore(comment.getText(), {
            eol: params.extendOptions.eol,
            keyword: CE_INLINE_IGNORE_KEYWORD.FILE_IGNORE_KEYWORD,
          }),
        )
        .filter((comment): comment is IInlineIgnoreInfo => comment != null);

      const firstIgnoreComment = fileIgnoreComment.at(0);

      return {
        filePath: sourceFile.getFilePath().toString(),
        fileIgnoreComment,
        firstIgnoreComment,
        ignored: firstIgnoreComment != null,
      } satisfies IIgnoreFile;
    })
    .filter(
      (ignore): ignore is SetRequired<IIgnoreFile, 'firstIgnoreComment'> =>
        ignore.firstIgnoreComment != null && ignore.ignored,
    )
    .map((ignore) => {
      return {
        ...ignore.firstIgnoreComment,
        filePath: ignore.filePath,
      };
    });

  return ignored;
}
