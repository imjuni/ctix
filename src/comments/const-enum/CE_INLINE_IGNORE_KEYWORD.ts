export const CE_INLINE_IGNORE_KEYWORD = {
  FILE_IGNORE_KEYWORD: '@ctix-ignore',
  NEXT_STATEMENT_IGNORE_KEYWORD: '@ctix-ignore-next',
} as const;

export type CE_INLINE_IGNORE_KEYWORD =
  (typeof CE_INLINE_IGNORE_KEYWORD)[keyof typeof CE_INLINE_IGNORE_KEYWORD];
