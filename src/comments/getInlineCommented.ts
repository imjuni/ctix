import { getCommentWorkspaces } from '#/comments/getCommentWorkspaces';
import { getJsDocComment } from '#/comments/getJsDocComment';
import { getJsDocTag } from '#/comments/getJsDocTag';
import type { IInlineCommentInfo } from '#/comments/interfaces/IInlineCommentInfo';
import type { IStatementComments } from '#/comments/interfaces/IStatementComments';
import { parse } from 'comment-parser';

export function getInlineCommented(params: {
  comment: IStatementComments;
  options: { keyword: string };
}): IInlineCommentInfo | undefined {
  const content = params.comment.range;
  const refined = getJsDocComment(params.comment.kind, content);
  const blocks = parse(refined);
  const block = blocks.at(0);

  if (block == null) {
    return undefined;
  }

  const tag = block.tags.find((element) => element.tag === getJsDocTag(params.options.keyword));

  if (tag?.tag === params.options.keyword || tag?.tag === params.options.keyword.substring(1)) {
    return {
      commentCode: content,
      filePath: params.comment.filePath,
      pos: params.comment.pos,
      tag: tag.tag,
      workspaces: getCommentWorkspaces([tag.name ?? '', tag.description ?? ''].join(' ')),
    } satisfies IInlineCommentInfo;
  }

  return undefined;
}
