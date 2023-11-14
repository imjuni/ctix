import type { ICommonModeOptions } from '#/configs/interfaces/ICommonModeOptions';
import type { IModeBundleOptions } from '#/configs/interfaces/IModeBundleOptions';
import type { IModeCreateOptions } from '#/configs/interfaces/IModeCreateOptions';
import type { IModeGenerateOptions } from '#/configs/interfaces/IModeGenerateOptions';
import type { IModeTsGenerateOptions } from '#/configs/interfaces/IModeTsGenerateOptions';
import type { IProjectOptions } from '#/configs/interfaces/IProjectOptions';

export type TCommandBuildArgvOptions = IProjectOptions &
  ICommonModeOptions &
  IModeGenerateOptions &
  IModeTsGenerateOptions &
  IModeBundleOptions &
  IModeCreateOptions;
