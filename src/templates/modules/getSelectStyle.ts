import { CE_INLINE_COMMENT_KEYWORD } from '#/comments/const-enum/CE_INLINE_COMMENT_KEYWORD';
import { getInlineStyle } from '#/comments/getInlineStyle';
import type { IStatementComments } from '#/comments/interfaces/IStatementComments';
import { CE_GENERATION_STYLE } from '#/configs/const-enum/CE_GENERATION_STYLE';
import { CE_AUTO_RENDER_CASE } from '#/templates/const-enum/CE_AUTO_RENDER_CASE';
import type { IIndexRenderData } from '#/templates/interfaces/IIndexRenderData';
import { getAutoRenderCase } from '#/templates/modules/getAutoRenderCase';

export function getSelectStyle(params: {
  comment?: IStatementComments;
  options: { style: CE_GENERATION_STYLE };
  renderData: IIndexRenderData;
}): ReturnType<typeof getAutoRenderCase> {
  if (params.comment != null) {
    const style = getInlineStyle({
      comment: params.comment,
      options: {
        keyword: CE_INLINE_COMMENT_KEYWORD.FILE_GENERATION_STYLE_KEYWORD,
      },
    });

    if (style != null) {
      return {
        case: CE_AUTO_RENDER_CASE.UNKNOWN,
        style: style?.style,
      };
    }
  }

  if (params.options.style === CE_GENERATION_STYLE.AUTO) {
    return getAutoRenderCase(params.renderData);
  }

  return {
    case: CE_AUTO_RENDER_CASE.UNKNOWN,
    style: params.options.style,
  };
}
