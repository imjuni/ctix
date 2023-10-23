export const CE_EXTENSION_PROCESSING = {
  NOT_EXTENSION: 'none',
  KEEP_EXTENSION: 'keep',
  REPLACE_JS: 'to-js',
} as const;

export type CE_EXTENSION_PROCESSING =
  (typeof CE_EXTENSION_PROCESSING)[keyof typeof CE_EXTENSION_PROCESSING];
