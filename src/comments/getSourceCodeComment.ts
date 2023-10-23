import type * as tsm from 'ts-morph';

export function getSourceCodeComment(sourceFile: tsm.SourceFile) {
  const comments: tsm.CommentRange[] = [];

  sourceFile.forEachChild((node) => {
    const comment = node.getLeadingCommentRanges();
    if (comment != null && comment.length > 0) {
      comments.push(...comment);
    }
  });

  return comments;
}
