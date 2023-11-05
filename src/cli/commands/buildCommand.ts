import { ProgressBar } from '#/cli/ux/ProgressBar';
import { Reasoner } from '#/cli/ux/Reasoner';
import { Spinner } from '#/cli/ux/Spinner';
import { CE_CTIX_BUILD_MODE } from '#/configs/const-enum/CE_CTIX_BUILD_MODE';
import { createBuildOptions } from '#/configs/createBuildOptions';
import type { TCommandBuildArgvOptions } from '#/configs/interfaces/TCommandBuildArgvOptions';
import { bundling } from '#/modules/commands/bundling';
import { creating } from '#/modules/commands/creating';
import { moduling } from '#/modules/commands/moduling';
import consola from 'consola';
import type yargs from 'yargs';

async function buildCommandCode(argv: yargs.ArgumentsCamelCase<TCommandBuildArgvOptions>) {
  const options = await createBuildOptions(argv);

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

export async function buildCommand(argv: yargs.ArgumentsCamelCase<TCommandBuildArgvOptions>) {
  ProgressBar.it.enable = true;
  Spinner.it.enable = true;
  Reasoner.it.enable = true;

  try {
    await buildCommandCode(argv);
  } catch (err) {
    consola.error(err);
  } finally {
    ProgressBar.it.stop();
    Spinner.it.stop();
  }
}
