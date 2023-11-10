import { CE_INLINE_COMMENT_KEYWORD } from '#/comments/const-enum/CE_INLINE_COMMENT_KEYWORD';
import { getInlineExclude } from '#/comments/getInlineExclude';
import { getSourceFileComments } from '#/comments/getSourceFileComments';
import type { IExcludeFile } from '#/comments/interfaces/IExcludeFile';
import type { IInlineExcludeInfo } from '#/comments/interfaces/IInlineExcludeInfo';
import type { IExtendOptions } from '#/configs/interfaces/IExtendOptions';
import type * as tsm from 'ts-morph';
import type { SetRequired } from 'type-fest';

export function getInlineExcludedFiles(params: {
  project: tsm.Project;
  extendOptions: Pick<IExtendOptions, 'eol'>;
  filePaths: string[];
}) {
  const excluded = params.filePaths
    .map((filePath) => params.project.getSourceFile(filePath))
    .filter((sourceFile): sourceFile is tsm.SourceFile => sourceFile != null)
    .map((sourceFile): IExcludeFile => {
      const sourceFileComment = getSourceFileComments(sourceFile);

      const fileExcludeComment = sourceFileComment.comments
        .map((comment) => {
          return getInlineExclude({
            comment,
            options: {
              keyword: CE_INLINE_COMMENT_KEYWORD.FILE_EXCLUDE_KEYWORD,
            },
          });
        })
        .filter((comment): comment is IInlineExcludeInfo => comment != null);

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
