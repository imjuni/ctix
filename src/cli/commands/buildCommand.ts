import { ProgressBar } from '#/cli/ux/ProgressBar';
import { Reasoner } from '#/cli/ux/Reasoner';
import { Spinner } from '#/cli/ux/Spinner';
import type { TCommandBuildArgvOptions } from '#/configs/interfaces/TCommandBuildArgvOptions';
import { createBuildOptions } from '#/configs/transforms/createBuildOptions';
import { building } from '#/modules/commands/building';
import consola from 'consola';
import type yargs from 'yargs';

export async function buildCommand(argv: yargs.ArgumentsCamelCase<TCommandBuildArgvOptions>) {
  ProgressBar.it.enable = true;
  Spinner.it.enable = true;
  Reasoner.it.enable = true;

  try {
    const options = await createBuildOptions(argv);
    await building(options);
  } catch (err) {
    consola.error(err);
  } finally {
    ProgressBar.it.stop();
    Spinner.it.stop();
  }
}
