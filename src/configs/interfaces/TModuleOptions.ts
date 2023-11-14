import type { CE_CTIX_BUILD_MODE } from '#/configs/const-enum/CE_CTIX_BUILD_MODE';
import type { IModeGenerateOptions } from '#/configs/interfaces/IModeGenerateOptions';
import type { IModeModuleOptions } from '#/configs/interfaces/IModeModuleOptions';

export type TModuleOptions = {
  mode: typeof CE_CTIX_BUILD_MODE.MODULE_MODE;
} & IModeGenerateOptions &
  IModeModuleOptions;
