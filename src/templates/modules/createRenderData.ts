import type { CE_GENERATION_STYLE } from '#/configs/const-enum/CE_GENERATION_STYLE';
import type { ICommandBundleOptions } from '#/configs/interfaces/ICommandBundleOptions';
import type { ICommonGenerateOptions } from '#/configs/interfaces/ICommonGenerateOptions';
import type { CE_AUTO_RENDER_CASE } from '#/templates/const-enum/CE_AUTO_RENDER_CASE';
import type { IIndexRenderData } from '#/templates/interfaces/IIndexRenderData';

export function createRenderData(
  renderCase: CE_AUTO_RENDER_CASE,
  style: CE_GENERATION_STYLE,
  option: Pick<
    ICommonGenerateOptions & ICommandBundleOptions,
    'fileExt' | 'quote' | 'useSemicolon'
  >,
  filePath: string,
  statement: IIndexRenderData['statement'],
): {
  case: CE_AUTO_RENDER_CASE;
  style: CE_GENERATION_STYLE;
  renderData: IIndexRenderData;
} {
  const renderData: IIndexRenderData = {
    options: {
      quote: option.quote,
      useSemicolon: option.useSemicolon,
    },
    filePath,
    statement,
  };

  const data: {
    case: CE_AUTO_RENDER_CASE;
    style: CE_GENERATION_STYLE;
    renderData: IIndexRenderData;
  } = {
    case: renderCase,
    style,
    renderData,
  };

  return data;
}
