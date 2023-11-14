import type { CE_CTIX_COMMAND } from '#/configs/const-enum/CE_CTIX_COMMAND';
import type { ICommandInitOptions } from '#/configs/interfaces/ICommandInitOptions';

export type TCommandInitOptions = {
  $kind: typeof CE_CTIX_COMMAND.INIT_COMMAND;
} & ICommandInitOptions;
