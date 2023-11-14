import { CE_CTIX_BUILD_MODE } from '#/configs/const-enum/CE_CTIX_BUILD_MODE';
import type { TCommandBuildOptions } from '#/configs/interfaces/TCommandBuildOptions';
import { bundling } from '#/modules/commands/bundling';
import { creating } from '#/modules/commands/creating';
import { moduling } from '#/modules/commands/moduling';

export async function building(options: TCommandBuildOptions) {
  await options.options.reduce(async (prevHandle, modeOption) => {
    const handle = () => {
      switch (modeOption.mode) {
        case CE_CTIX_BUILD_MODE.MODULE_MODE:
          return moduling(options, modeOption);
        case CE_CTIX_BUILD_MODE.CREATE_MODE:
          return creating(options, modeOption);
        default:
          return bundling(options, modeOption);
      }
    };

    await prevHandle;
    return handle();
  }, Promise.resolve());
}
