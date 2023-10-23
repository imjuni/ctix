export const CE_CTIX_DEFAULT_VALUE = {
  CONFIG_FILENAME: '.ctirc',
  TSCONFIG_FILENAME: 'tsconfig.json',
  EXPORT_FILENAME: 'index.ts',
  REMOVE_FILE_CHOICE_FUZZY: 50,
} as const;

export type CE_CTIX_DEFAULT_VALUE =
  (typeof CE_CTIX_DEFAULT_VALUE)[keyof typeof CE_CTIX_DEFAULT_VALUE];
