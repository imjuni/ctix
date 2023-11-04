import type { ICommandBundleOptions } from '#/configs/interfaces/ICommandBundleOptions';
import type { ICommandCreateOptions } from '#/configs/interfaces/ICommandCreateOptions';
import type { ICommonGenerateOptions } from '#/configs/interfaces/ICommonGenerateOptions';
import type { ICommonModeOptions } from '#/configs/interfaces/ICommonModeOptions';
import type { IProjectOptions } from '#/configs/interfaces/IProjectOptions';

export type TCommandBuildArgvOptions = IProjectOptions &
  ICommonModeOptions &
  ICommonGenerateOptions &
  ICommandBundleOptions &
  ICommandCreateOptions;