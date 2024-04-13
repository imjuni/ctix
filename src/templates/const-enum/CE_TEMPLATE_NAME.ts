export const CE_TEMPLATE_NAME = {
  INDEX_FILE_TEMPLATE: 'index-file-template',
  NESTED_OPTIONS_TEMPLATE: 'nested-options-template',
  OPTIONS_TEMPLATE: 'options-template',
  MODULE_INDEX_FILE_TEMPLATE: 'module-index-file-template',
  DECLARATION_FILE_TEMPLATE: 'declaration-file-template',
} as const;

export type CE_TEMPLATE_NAME = (typeof CE_TEMPLATE_NAME)[keyof typeof CE_TEMPLATE_NAME];
