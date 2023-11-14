import type { CE_CTIX_BUILD_MODE } from '#/configs/const-enum/CE_CTIX_BUILD_MODE';
import type { IModeBundleOptions } from '#/configs/interfaces/IModeBundleOptions';
import type { IModeGenerateOptions } from '#/configs/interfaces/IModeGenerateOptions';
import type { IModeTsGenerateOptions } from '#/configs/interfaces/IModeTsGenerateOptions';

export type TBundleOptions = {
  mode: typeof CE_CTIX_BUILD_MODE.BUNDLE_MODE;
} & IModeBundleOptions &
  IModeGenerateOptions &
  IModeTsGenerateOptions;
