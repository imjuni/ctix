import type { CE_CTIX_BUILD_MODE } from '#/configs/const-enum/CE_CTIX_BUILD_MODE';
import type { ICommandModuleOptions } from '#/configs/interfaces/ICommandModuleOptions';
import type { ICommonGenerateOptions } from '#/configs/interfaces/ICommonGenerateOptions';

export type TModuleOptions = {
  mode: typeof CE_CTIX_BUILD_MODE.MODULE_MODE;
} & ICommonGenerateOptions &
  ICommandModuleOptions;
