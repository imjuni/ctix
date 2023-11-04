export const CE_INLINE_EXCLUDE_KEYWORD = {
  FILE_EXCLUDE_KEYWORD: '@ctix-exclude',
  NEXT_STATEMENT_EXCLUDE_KEYWORD: '@ctix-exclude-next',
} as const;

export type CE_INLINE_EXCLUDE_KEYWORD =
  (typeof CE_INLINE_EXCLUDE_KEYWORD)[keyof typeof CE_INLINE_EXCLUDE_KEYWORD];
