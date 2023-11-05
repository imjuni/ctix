import type { CE_CTIX_BUILD_MODE } from '#/configs/const-enum/CE_CTIX_BUILD_MODE';
import type { ICommandBundleOptions } from '#/configs/interfaces/ICommandBundleOptions';
import type { ICommonGenerateOptions } from '#/configs/interfaces/ICommonGenerateOptions';
import type { ICommonTsGenerateOptions } from '#/configs/interfaces/ICommonTsGenerateOptions';

export type TBundleOptions = {
  mode: typeof CE_CTIX_BUILD_MODE.BUNDLE_MODE;
} & ICommandBundleOptions &
  ICommonGenerateOptions &
  ICommonTsGenerateOptions;
