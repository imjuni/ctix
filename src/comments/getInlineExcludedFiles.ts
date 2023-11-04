import { CE_INLINE_EXCLUDE_KEYWORD } from '#/comments/const-enum/CE_INLINE_EXCLUDE_KEYWORD';
import { getInlineExclude } from '#/comments/getInlineExclude';
import { getSourceCodeComment } from '#/comments/getSourceCodeComment';
import type { IInlineExcludeInfo } from '#/comments/interfaces/IInlineExcludeInfo';
import type { IExtendOptions } from '#/configs/interfaces/IExtendOptions';
import type * as tsm from 'ts-morph';
import type { SetRequired } from 'type-fest';

interface IExcludeFile {
  filePath: string;
  fileExcludeComment: IInlineExcludeInfo[];
  firstExcludeComment?: IInlineExcludeInfo;
  excluded: boolean;
}

export function getInlineExcludedFiles(params: {
  project: tsm.Project;
  extendOptions: Pick<IExtendOptions, 'eol'>;
  filePaths: string[];
}) {
  const excluded = params.filePaths
    .map((filePath) => params.project.getSourceFile(filePath))
    .filter((sourceFile): sourceFile is tsm.SourceFile => sourceFile != null)
    .map((sourceFile): IExcludeFile => {
      const fileExcludeComment = getSourceCodeComment(sourceFile)
        .map((comment) =>
          getInlineExclude(comment.getText(), {
            eol: params.extendOptions.eol,
            keyword: CE_INLINE_EXCLUDE_KEYWORD.FILE_EXCLUDE_KEYWORD,
          }),
        )
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
