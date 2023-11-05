import type { CE_CTIX_COMMAND } from '#/configs/const-enum/CE_CTIX_COMMAND';
import type { IProjectOptions } from '#/configs/interfaces/IProjectOptions';
import type { TBundleOptions } from '#/configs/interfaces/TBundleOptions';
import type { TCreateOptions } from '#/configs/interfaces/TCreateOptions';
import type { TModuleOptions } from '#/configs/interfaces/TModuleOptions';

export type TCommandBuildOptions = IProjectOptions & {
  $kind: typeof CE_CTIX_COMMAND.BUILD_COMMAND;
  options: (TCreateOptions | TBundleOptions | TModuleOptions)[];
};
