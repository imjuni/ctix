import { askRemoveFiles } from '#/cli/questions/askRemoveFiles';
import { ProgressBar } from '#/cli/ux/ProgressBar';
import { Spinner } from '#/cli/ux/Spinner';
import type { TCommandBuildOptions } from '#/configs/interfaces/TCommandBuildOptions';
import type { TCommandRemoveOptions } from '#/configs/interfaces/TCommandRemoveOptions';
import { getRemoveFileGlobPattern } from '#/modules/file/getRemoveFileGlobPattern';
import { unlinks } from '#/modules/file/unlinks';
import { posixRelative } from '#/modules/path/modules/posixRelative';
import { IncludeContainer } from '#/modules/scope/IncludeContainer';
import chalk from 'chalk';

export async function removing(
  options: TCommandRemoveOptions & Omit<TCommandBuildOptions, '$kind'>,
) {
  Spinner.it.start(`'index.ts' file remove start`);

  const patterns = await getRemoveFileGlobPattern(options, options.options);

  const include = new IncludeContainer({
    config: { include: patterns.map((projectDir) => projectDir.pattern) },
    cwd: process.cwd(),
  });
  const filePaths = include.files();

  if (options.forceYes) {
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
          `${chalk.redBright('removed:')} ${posixRelative(process.cwd(), filePath)}`,
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
        `${chalk.redBright('removed:')} ${posixRelative(process.cwd(), filePath)}`,
      );
    };

    await prevHandle;
    return handle();
  }, Promise.resolve());
}
