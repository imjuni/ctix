import { askRemoveFiles } from '#/cli/questions/askRemoveFiles';
import { ProgressBar } from '#/cli/ux/ProgressBar';
import { Reasoner } from '#/cli/ux/Reasoner';
import { Spinner } from '#/cli/ux/Spinner';
import { createBuildOptions } from '#/configs/createBuildOptions';
import type { TCommandBuildArgvOptions } from '#/configs/interfaces/TCommandBuildArgvOptions';
import type { TCommandRemoveOptions } from '#/configs/interfaces/TCommandRemoveOptions';
import { getRemoveFileGlobPattern } from '#/modules/file/getRemoveFileGlobPattern';
import { unlinks } from '#/modules/file/unlinks';
import { IncludeContainer } from '#/modules/ignore/IncludeContainer';
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

    await unlinks(filePaths, (filePath) => {
      Spinner.it.succeed(
        `${chalk.redBright('removed:')} ${path.relative(process.cwd(), filePath)}`,
      );
    });

    return;
  }

  Spinner.it.stop();

  const indexFiles = await askRemoveFiles(filePaths);

  await unlinks(indexFiles, (filePath) => {
    Spinner.it.succeed(`${chalk.redBright('removed:')} ${path.relative(process.cwd(), filePath)}`);
  });
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
