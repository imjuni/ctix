import type { CE_INLINE_COMMENT_KEYWORD } from '#/comments/const-enum/CE_INLINE_COMMENT_KEYWORD';
import { getInlineCommented } from '#/comments/getInlineCommented';
import { getSourceFileComments } from '#/comments/getSourceFileComments';
import type { IExcludeFile } from '#/comments/interfaces/IExcludeFile';
import type { IInlineCommentInfo } from '#/comments/interfaces/IInlineCommentInfo';
import type * as tsm from 'ts-morph';
import type { SetRequired } from 'type-fest';

export function getInlineCommentedFiles(params: {
  project: tsm.Project;
  filePaths: string[];
  keyword: CE_INLINE_COMMENT_KEYWORD;
}) {
  const excluded = params.filePaths
    .map((filePath) => params.project.getSourceFile(filePath))
    .filter((sourceFile): sourceFile is tsm.SourceFile => sourceFile != null)
    .map((sourceFile): IExcludeFile => {
      const sourceFileComment = getSourceFileComments(sourceFile);

      const fileExcludeComment = sourceFileComment.comments
        .map((comment) => getInlineCommented({ comment, options: { keyword: params.keyword } }))
        .filter((comment): comment is IInlineCommentInfo => comment != null);

      const firstExcludeComment = fileExcludeComment.at(0);

      return {
        filePath: sourceFile.getFilePath().toString(),
        fileExcludeComment,
        firstExcludeComment,
        excluded: firstExcludeComment != null,
      } satisfies IExcludeFile;
    })
    .filter(
      (exclude): exclude is SetRequired<IExcludeFile, 'firstExcludeComment'> =>
        exclude.firstExcludeComment != null && exclude.excluded,
    )
    .map((exclude) => {
      return {
        ...exclude.firstExcludeComment,
        filePath: exclude.filePath,
      };
    });

  return excluded;
}
