import { getNodeComments } from '#/comments/getNodeComments';
import type { ISourceFileComments } from '#/comments/interfaces/ISourceFileComments';
import type * as tsm from 'ts-morph';

export function getSourceFileComments(sourceFile: tsm.SourceFile): ISourceFileComments {
  const comments: ISourceFileComments['comments'] = [];

  sourceFile.forEachChild((node) => {
    comments.push(...getNodeComments(node));
  });

  return {
    filePath: sourceFile.getFilePath().toString(),
    comments,
  };
}
