import { TCTIXOptionWithResolvedProject } from '@interfaces/ICTIXOptions';
import { defaultOption, getCTIXOptions, getMergedConfig } from '@tools/cticonfig';
import debug from 'debug';
import * as TEI from 'fp-ts/Either';
import * as TFU from 'fp-ts/function';
import * as TTE from 'fp-ts/TaskEither';
import * as fs from 'fs';
import { isFalse } from 'my-easy-fp';
import * as path from 'path';
import { exists, fastGlobWrap, replaceSepToPosix, settify } from './misc';

const log = debug('ctix:clean-tool');

export const getCleanFilenames =
  ({
    cliOption,
    includeBackupFrom,
  }: {
    cliOption?: TCTIXOptionWithResolvedProject;
    includeBackupFrom?: boolean;
  }): TTE.TaskEither<Error, string[]> =>
  async () => {
    try {
      const fallbackOptions = defaultOption();
      const projectPath = cliOption?.resolvedProjectPath ?? fallbackOptions.project;
      const projectDir = path.dirname(projectPath);
      const includeBackup = includeBackupFrom ?? true;

      // Check existing tsconfig.json path and project path
      if (isFalse(await exists(projectPath))) {
        return TEI.left(new Error(`invalid tsconfig.json path: ${projectPath}`));
      }

      const mergedConfig = await TFU.pipe(
        getCTIXOptions({ projectPath }),
        TTE.chain((args) =>
          getMergedConfig({
            projectPath: projectDir,
            cliOption: cliOption ?? fallbackOptions,
            optionObjects: args,
          }),
        ),
      )();

      if (TEI.isLeft(mergedConfig)) {
        return TEI.left(mergedConfig.left);
      }

      const globPatterns = settify(
        mergedConfig.right
          .filter((configObject) => {
            return configObject.dir.indexOf('node_modules') < 0;
          })
          .map((configObject) => {
            return path.join(configObject.dir, '**', configObject.option.exportFilename);
          }),
      );

      const backup = settify(
        mergedConfig.right.map((configObject) => {
          return path.join(configObject.dir, '**', `${configObject.option.exportFilename}.bak`);
        }),
      );

      const filenames = await fastGlobWrap(
        includeBackup
          ? globPatterns.concat(backup).map((dirname) => replaceSepToPosix(dirname))
          : globPatterns.map((dirname) => replaceSepToPosix(dirname)),
        {
          dot: true,
          cwd: projectDir,
          ignore: [replaceSepToPosix(path.join(projectPath, '**', 'node_modules', '**'))],
        },
      );

      const filteredCWD = filenames.filter((filename) => filename.startsWith(projectDir));

      log('resolved: ', projectPath, globPatterns, filenames, filteredCWD);

      return TEI.right(filteredCWD);
    } catch (err) {
      const catched =
        err instanceof Error ? err : new Error('unknown error raised from getCleanFilenames');

      log('Error raised: ', catched.message);
      log('Error raised: ', catched.stack);

      return TEI.left(catched);
    }
  };

async function unlink(filename: string): Promise<TEI.Either<Error, boolean>> {
  try {
    await fs.promises.unlink(filename);

    return TEI.right(true);
  } catch (err) {
    const catched = err instanceof Error ? err : new Error('unknown error raised from unlink');

    log('Error raised: ', catched.message);
    log('Error raised: ', catched.stack);

    return TEI.left(catched);
  }
}

export async function clean({
  filenames,
}: {
  filenames: string[];
}): Promise<TEI.Either<Error, boolean>> {
  try {
    const unlinkeds = await Promise.all(filenames.map((filename) => unlink(filename)));
    const errors = unlinkeds
      .map((unlinked) => (TEI.isLeft(unlinked) ? unlinked.left.message : ''))
      .filter((message) => message !== '');

    if (errors.length > 0) {
      return TEI.left(new Error(`invalid filename and path: ${errors.join('\n')}`));
    }

    return TEI.right(true);
  } catch (err) {
    const catched = err instanceof Error ? err : new Error('unknown error raised from clean');

    log('Error raised: ', catched.message);
    log('Error raised: ', catched.stack);

    return TEI.left(catched);
  }
}
