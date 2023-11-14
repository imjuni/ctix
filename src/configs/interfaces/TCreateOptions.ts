import type { CE_CTIX_BUILD_MODE } from '#/configs/const-enum/CE_CTIX_BUILD_MODE';
import type { IModeCreateOptions } from '#/configs/interfaces/IModeCreateOptions';
import type { IModeGenerateOptions } from '#/configs/interfaces/IModeGenerateOptions';
import type { IModeTsGenerateOptions } from '#/configs/interfaces/IModeTsGenerateOptions';

export type TCreateOptions = {
  mode: typeof CE_CTIX_BUILD_MODE.CREATE_MODE;
} & IModeCreateOptions &
  IModeGenerateOptions &
  IModeTsGenerateOptions;
