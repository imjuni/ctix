import { CE_GENERATION_STYLE } from '#/configs/const-enum/CE_GENERATION_STYLE';
import { CE_AUTO_RENDER_CASE } from '#/templates/const-enum/CE_AUTO_RENDER_CASE';
import type { IIndexRenderData } from '#/templates/interfaces/IIndexRenderData';

export function getAutoRenderCase(renderData: IIndexRenderData): {
  case: CE_AUTO_RENDER_CASE;
  style: CE_GENERATION_STYLE;
} {
  // case 01.
  // default export (o)
  // named export   (o)
  // partial ignore (x)
  if (
    renderData.statement.isHasDefault &&
    renderData.statement.named.length > 0 &&
    !renderData.statement.isHasPartialIgnore
  ) {
    return {
      case: CE_AUTO_RENDER_CASE.DEFAULT_NAMED,
      style: CE_GENERATION_STYLE.DEFAULT_STAR_NAMED_STAR,
    };
  }

  // case 02.
  // default export (o)
  // named export   (x)
  // partial ignore (x)
  if (
    renderData.statement.isHasDefault &&
    renderData.statement.named.length <= 0 &&
    !renderData.statement.isHasPartialIgnore
  ) {
    return {
      case: CE_AUTO_RENDER_CASE.DEFAULT,
      style: CE_GENERATION_STYLE.DEFAULT_STAR_NAMED_STAR,
    };
  }

  // case 03.
  // default export (x)
  // named export   (o)
  // partial ignore (x)
  if (
    !renderData.statement.isHasDefault &&
    renderData.statement.named.length > 0 &&
    !renderData.statement.isHasPartialIgnore
  ) {
    return {
      case: CE_AUTO_RENDER_CASE.NAMED,
      style: CE_GENERATION_STYLE.DEFAULT_STAR_NAMED_STAR,
    };
  }

  // case 04.
  // default export (x)
  // named export   (o)
  // partial ignore (o)
  //
  // - partial ignore apply on default export
  // - partial ignore apply on named export and dosen't have a default export
  if (
    !renderData.statement.isHasDefault &&
    renderData.statement.named.length > 0 &&
    renderData.statement.isHasPartialIgnore
  ) {
    return {
      case: CE_AUTO_RENDER_CASE.NAMED_PARTAL,
      style: CE_GENERATION_STYLE.DEFAULT_ALIAS_NAMED_DESTRUCTIVE,
    };
  }

  // case 05.
  // default export (o)
  // named export   (x)
  // partial ignore (o)
  //
  // - partial ignore apply on named export
  // - named export item only one
  if (
    renderData.statement.isHasDefault &&
    renderData.statement.named.length <= 0 &&
    renderData.statement.isHasPartialIgnore
  ) {
    // 이 방식으로 되어 있을 때는 경고가 필요하다, rollup-plugin-dts에서는 이 방식인 경우,
    // default export를 2번 내보내서 오류가 발생한다.
    return {
      case: CE_AUTO_RENDER_CASE.DEFAULT_PARTIAL,
      style: CE_GENERATION_STYLE.DEFAULT_ALIAS_NAMED_STAR,
    };
  }

  // case 06.
  // default export (o)
  // named export   (o)
  // partial ignore (o)
  //
  // - partial ignore apply on named export
  // - named export item more then one
  if (
    renderData.statement.isHasDefault &&
    renderData.statement.named.length > 0 &&
    renderData.statement.isHasPartialIgnore
  ) {
    // 이 방식으로 되어 있을 때는 경고가 필요하다, rollup-plugin-dts에서는 이 방식인 경우,
    // default export를 2번 내보내서 오류가 발생한다.
    return {
      case: CE_AUTO_RENDER_CASE.DEFAULT_PARTIAL,
      style: CE_GENERATION_STYLE.DEFAULT_ALIAS_NAMED_DESTRUCTIVE,
    };
  }

  // case 07.
  // unknown case
  return {
    case: CE_AUTO_RENDER_CASE.UNKNOWN,
    style: CE_GENERATION_STYLE.DEFAULT_STAR_NAMED_STAR,
  };
}
