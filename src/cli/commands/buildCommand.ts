import { ProgressBar } from '#/cli/ux/ProgressBar';
import { Reasoner } from '#/cli/ux/Reasoner';
import { Spinner } from '#/cli/ux/Spinner';
import { createBuildOptions } from '#/configs/createBuildOptions';
import type { TCommandBuildArgvOptions } from '#/configs/interfaces/TCommandBuildArgvOptions';
import { bundling } from '#/modules/commands/bundling';
import { creating } from '#/modules/commands/creating';
import consola from 'consola';
import type yargs from 'yargs';

async function buildCommandCode(argv: yargs.ArgumentsCamelCase<TCommandBuildArgvOptions>) {
  const options = await createBuildOptions(argv);

  await options.options.reduce(async (prevHandle, modeOption) => {
    const handle = async () => {
      if (modeOption.mode === 'create') {
        await creating(options, modeOption);
      } else {
        await bundling(options, modeOption);
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
