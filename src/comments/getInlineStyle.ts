import { getCommentNamespaces } from '#/comments/getCommentNamespaces';
import { getJsDocComment } from '#/comments/getJsDocComment';
import { getJsDocTag } from '#/comments/getJsDocTag';
import type { IInlineGenerationStyleInfo } from '#/comments/interfaces/IInlineGenerationStyleInfo';
import type { IStatementComments } from '#/comments/interfaces/IStatementComments';
import { getGenerationStyle } from '#/templates/modules/getGenerationStyle';
import { parse } from 'comment-parser';

export function getInlineStyle(params: {
  comment: IStatementComments;
  options: { keyword: string };
}): IInlineGenerationStyleInfo | undefined {
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
      commentCode: params.comment.range,
      filePath: params.comment.filePath,
      style: getGenerationStyle(tag.name),
      pos: params.comment.pos,
      namespaces: getCommentNamespaces(tag.description ?? ''),
    } satisfies IInlineGenerationStyleInfo;
  }

  return undefined;
}
