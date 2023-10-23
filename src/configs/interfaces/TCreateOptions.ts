import type { CE_CTIX_BUILD_MODE } from '#/configs/const-enum/CE_CTIX_BUILD_MODE';
import type { ICommandCreateOptions } from '#/configs/interfaces/ICommandCreateOptions';
import type { ICommonGenerateOptions } from '#/configs/interfaces/ICommonGenerateOptions';

export type TCreateOptions = {
  mode: typeof CE_CTIX_BUILD_MODE.CREATE_MODE;
} & ICommandCreateOptions &
  ICommonGenerateOptions;
