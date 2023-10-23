import type { CE_CTIX_COMMAND } from '#/configs/const-enum/CE_CTIX_COMMAND';
import type { ICommandRemoveOptions } from '#/configs/interfaces/ICommandRemoveOptions';
import type { IProjectOptions } from '#/configs/interfaces/IProjectOptions';

export type TCommandRemoveOptions = {
  $kind: typeof CE_CTIX_COMMAND.REMOVE_COMMAND;
} & IProjectOptions &
  ICommandRemoveOptions;
