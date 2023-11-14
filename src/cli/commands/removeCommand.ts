import { askRemoveFiles } from '#/cli/questions/askRemoveFiles';
import { ProgressBar } from '#/cli/ux/ProgressBar';
import { Reasoner } from '#/cli/ux/Reasoner';
import { Spinner } from '#/cli/ux/Spinner';
import type { TCommandBuildArgvOptions } from '#/configs/interfaces/TCommandBuildArgvOptions';
import type { TCommandRemoveOptions } from '#/configs/interfaces/TCommandRemoveOptions';
import { createBuildOptions } from '#/configs/transforms/createBuildOptions';
import { getRemoveFileGlobPattern } from '#/modules/file/getRemoveFileGlobPattern';
import { unlinks } from '#/modules/file/unlinks';
import { IncludeContainer } from '#/modules/scope/IncludeContainer';
import chalk from 'chalk';
import consola from 'consola';
import path from 'node:path';
import type yargs from 'yargs';

async function removeCommandCode(
  argv: yargs.ArgumentsCamelCase<TCommandRemoveOptions & TCommandBuildArgvOptions>,
) {
  Spinner.it.start(`'index.ts' file remove start`);

  const options = await createBuildOptions(argv);
  const patterns = await getRemoveFileGlobPattern(argv, options.options);

  const include = new IncludeContainer({
    config: { include: patterns.map((projectDir) => projectDir.pattern) },
  });
  const filePaths = include.files();

  if (argv.forceYes) {
    Spinner.it.succeed('enable force-yes, file removing without question');
    Spinner.it.stop();

    ProgressBar.it.start(filePaths.length);

    await unlinks(filePaths, () => {
      ProgressBar.it.increment();
    });

    ProgressBar.it.stop();

    await filePaths.reduce(async (prevHandle: Promise<void>, filePath: string) => {
      const handle = async () => {
        Spinner.it.succeed(
          `${chalk.redBright('removed:')} ${path.relative(process.cwd(), filePath)}`,
        );
      };

      await prevHandle;
      return handle();
    }, Promise.resolve());

    return;
  }

  Spinner.it.stop();
  ProgressBar.it.start(filePaths.length);

  const indexFiles = await askRemoveFiles(filePaths);

  await unlinks(indexFiles, () => {
    ProgressBar.it.increment();
  });

  ProgressBar.it.stop();

  await filePaths.reduce(async (prevHandle: Promise<void>, filePath: string) => {
    const handle = async () => {
      Spinner.it.succeed(
        `${chalk.redBright('removed:')} ${path.relative(process.cwd(), filePath)}`,
      );
    };

    await prevHandle;
    return handle();
  }, Promise.resolve());
}

export async function removeCommand(
  argv: yargs.ArgumentsCamelCase<TCommandRemoveOptions & TCommandBuildArgvOptions>,
) {
  ProgressBar.it.enable = true;
  Spinner.it.enable = true;
  Reasoner.it.enable = true;

  try {
    await removeCommandCode(argv);
  } catch (err) {
    consola.error(err);
  } finally {
    ProgressBar.it.stop();
    Spinner.it.stop();
  }
}
