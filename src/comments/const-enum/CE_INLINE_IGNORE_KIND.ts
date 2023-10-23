export const CE_INLINE_IGNORE_KIND = {
  FILE_IGNORE_KEYWORD: 'file',
  NEXT_STATEMENT_IGNORE_KEYWORD: 'next-statement',
} as const;

export type CE_INLINE_IGNORE_KIND =
  (typeof CE_INLINE_IGNORE_KIND)[keyof typeof CE_INLINE_IGNORE_KIND];
