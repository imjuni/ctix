export const CE_INLINE_COMMENT_KEYWORD = {
  FILE_EXCLUDE_KEYWORD: '@ctix-exclude',
  FILE_DECLARATION_KEYWORD: '@ctix-declaration',
  NEXT_STATEMENT_EXCLUDE_KEYWORD: '@ctix-exclude-next',
  FILE_GENERATION_STYLE_KEYWORD: '@ctix-generation-style',
} as const;

export type CE_INLINE_COMMENT_KEYWORD =
  (typeof CE_INLINE_COMMENT_KEYWORD)[keyof typeof CE_INLINE_COMMENT_KEYWORD];
