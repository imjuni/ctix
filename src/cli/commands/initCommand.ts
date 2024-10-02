import { ProgressBar } from '#/cli/ux/ProgressBar';
import { Reasoner } from '#/cli/ux/Reasoner';
import { Spinner } from '#/cli/ux/Spinner';
import { CE_CTIX_COMMAND } from '#/configs/const-enum/CE_CTIX_COMMAND';
import type { ICommandInitOptions } from '#/configs/interfaces/ICommandInitOptions';
import type { TCommandInitOptions } from '#/configs/interfaces/TCommandInitOptions';
import { initializing } from '#/modules/commands/initializing';
import consola from 'consola';
import type yargs from 'yargs';

export async function initCommand(argv: yargs.ArgumentsCamelCase<ICommandInitOptions>) {
  ProgressBar.it.enable = true;
  Spinner.it.enable = true;
  Reasoner.it.enable = true;

  try {
    const option: TCommandInitOptions = {
      $kind: CE_CTIX_COMMAND.INIT_COMMAND,
      forceYes: argv.forceYes,
    };

    await initializing(option);
  } catch (err) {
    consola.error(err);
  } finally {
    ProgressBar.it.stop();
    Spinner.it.stop();
  }
}
