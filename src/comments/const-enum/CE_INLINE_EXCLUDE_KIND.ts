export const CE_INLINE_EXCLUDE_KIND = {
  FILE_EXCLUDE_KEYWORD: 'file',
  NEXT_STATEMENT_EXCLUDE_KEYWORD: 'next-statement',
} as const;

export type CE_INLINE_EXCLUDE_KIND =
  (typeof CE_INLINE_EXCLUDE_KIND)[keyof typeof CE_INLINE_EXCLUDE_KIND];
