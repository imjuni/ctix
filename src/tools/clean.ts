import { ICTIXOptions } from '@interfaces/ICTIXOptions';
import { defaultOption, getCTIXOptions, getMergedConfig } from '@tools/cticonfig';
import debug from 'debug';
import fastGlob from 'fast-glob';
import * as TEI from 'fp-ts/Either';
import * as TPI from 'fp-ts/lib/pipeable';
import * as TTE from 'fp-ts/TaskEither';
import * as fs from 'fs';
import { isFalse } from 'my-easy-fp';
import * as path from 'path';
import { exists, settify } from './misc';
import { taskEitherLiftor } from './typehelper';

const log = debug('ctix:ignore-tool');

export async function getCleanFilenames({
  cliOption,
  includeBackupFrom,
}: {
  cliOption?: ICTIXOptions;
  includeBackupFrom?: boolean;
}): Promise<TEI.Either<Error, string[]>> {
  try {
    const fallbackOptions = defaultOption();
    const projectPath = cliOption?.project ?? fallbackOptions.project;
    const projectDir = path.dirname(projectPath);
    const resolved = path.resolve(projectPath);
    const includeBackup = includeBackupFrom ?? true;

    // Check existing tsconfig.json path and project path
    if (isFalse(await exists(resolved))) {
      return TEI.left(new Error('invalid tsconfig.json path'));
    }

    const mergedConfig = await TPI.pipe(
      taskEitherLiftor(getCTIXOptions)({ projectPath: projectDir }),
      TTE.chain((args) => () =>
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
      mergedConfig.right.map((configObject) => {
        return path.join(configObject.dir, '**', configObject.option.exportFilename);
      }),
    );

    const backup = settify(
      mergedConfig.right.map((configObject) => {
        return path.join(configObject.dir, '**', `${configObject.option.exportFilename}.bak`);
      }),
    );

    const filenames = await fastGlob(includeBackup ? globPatterns.concat(backup) : globPatterns, { dot: true });

    log('resolved: ', resolved, globPatterns);

    return TEI.right(filenames);
  } catch (err) {
    return TEI.left(err);
  }
}

async function unlink(filename: string): Promise<TEI.Either<Error, boolean>> {
  try {
    await fs.promises.unlink(filename);

    return TEI.right(true);
  } catch (err) {
    return TEI.left(err);
  }
}

export async function clean({ filenames }: { filenames: string[] }): Promise<TEI.Either<Error, boolean>> {
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
    return TEI.left(err);
  }
}
