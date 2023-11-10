import { CE_GENERATION_STYLE } from '#/configs/const-enum/CE_GENERATION_STYLE';

export function getGenerationStyle(name: string): CE_GENERATION_STYLE {
  switch (name) {
    case CE_GENERATION_STYLE.DEFAULT_ALIAS_NAMED_DESTRUCTIVE:
      return CE_GENERATION_STYLE.DEFAULT_ALIAS_NAMED_DESTRUCTIVE;
    case CE_GENERATION_STYLE.DEFAULT_ALIAS_NAMED_STAR:
      return CE_GENERATION_STYLE.DEFAULT_ALIAS_NAMED_STAR;
    case CE_GENERATION_STYLE.DEFAULT_NON_ALIAS_NAMED_DESTRUCTIVE:
      return CE_GENERATION_STYLE.DEFAULT_NON_ALIAS_NAMED_DESTRUCTIVE;
    case CE_GENERATION_STYLE.DEFAULT_STAR_NAMED_DESTRUCTIVE:
      return CE_GENERATION_STYLE.DEFAULT_STAR_NAMED_DESTRUCTIVE;
    case CE_GENERATION_STYLE.DEFAULT_STAR_NAMED_STAR:
      return CE_GENERATION_STYLE.DEFAULT_STAR_NAMED_STAR;
    default:
      return CE_GENERATION_STYLE.AUTO;
  }
}
