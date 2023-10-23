export const CE_CTIX_COMMAND = {
  BUILD_COMMAND: 'build',
  BUILD_COMMAND_ALIAS: 'b',

  REMOVE_COMMAND: 'remove',
  REMOVE_COMMAND_ALIAS: 'r',

  INIT_COMMAND: 'init',
  INIT_COMMAND_ALIAS: 'i',
} as const;

export type CE_CTIX_COMMAND = (typeof CE_CTIX_COMMAND)[keyof typeof CE_CTIX_COMMAND];
