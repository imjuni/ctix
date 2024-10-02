import { ProgressBar } from '#/cli/ux/ProgressBar';
import { Reasoner } from '#/cli/ux/Reasoner';
import { Spinner } from '#/cli/ux/Spinner';
import type { TCommandBuildArgvOptions } from '#/configs/interfaces/TCommandBuildArgvOptions';
import type { TCommandRemoveOptions } from '#/configs/interfaces/TCommandRemoveOptions';
import { createBuildOptions } from '#/configs/transforms/createBuildOptions';
import { createRemoveOptions } from '#/configs/transforms/createRemoveOptions';
import { removing } from '#/modules/commands/removing';
import consola from 'consola';
import type yargs from 'yargs';

export async function removeCommand(
  argv: yargs.ArgumentsCamelCase<TCommandRemoveOptions & TCommandBuildArgvOptions>,
) {
  ProgressBar.it.enable = true;
  Spinner.it.enable = true;
  Reasoner.it.enable = true;

  try {
    const options = await createBuildOptions(argv);
    const removeOptions = createRemoveOptions(argv);

    await removing({ ...options, ...removeOptions });
  } catch (err) {
    consola.error(err);
  } finally {
    ProgressBar.it.stop();
    Spinner.it.stop();
  }
}
