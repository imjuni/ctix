/**
 * `index.ts` 파일을 생성할 때 어떤 방식으로 생성할 지를 결정합니다
 *
 * When generating the `index.ts` file, decide how you want to generate it
 *
 * auto
 * default alias, named star
 * default alias, named destructive
 * default non alias, named destructive
 * default star, named star
 * default star, named destructive
 */
export const CE_GENERATION_STYLE = {
  AUTO: 'auto',
  DEFAULT_ALIAS_NAMED_STAR: 'default-alias-named-star',
  DEFAULT_ALIAS_NAMED_DESTRUCTIVE: 'default-alias-named-destructive',
  DEFAULT_NON_ALIAS_NAMED_DESTRUCTIVE: 'default-non-alias-named-destructive',
  DEFAULT_STAR_NAMED_STAR: 'default-star-named-star',
  DEFAULT_STAR_NAMED_DESTRUCTIVE: 'default-star-named-destructive',
} as const;

export type CE_GENERATION_STYLE = (typeof CE_GENERATION_STYLE)[keyof typeof CE_GENERATION_STYLE];
