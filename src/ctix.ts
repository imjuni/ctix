/* eslint-disable @typescript-eslint/no-unused-expressions */

import { ICTIXOptions, TCTIXOptionWithResolvedProject } from '@interfaces/ICTIXOptions';
import { CliUx } from '@oclif/core';
import { clean, getCleanFilenames } from '@tools/clean';
import { Counter } from '@tools/Counter';
import {
  defaultOption,
  getCTIXOptions,
  getMergedConfig,
  getNonEmptyOption,
} from '@tools/cticonfig';
import { getIgnoredContents, getIgnoreFileContents, getIgnoreFiles } from '@tools/ctiignore';
import logger from '@tools/Logger';
import { exists, getDirname } from '@tools/misc';
import {
  getTypeScriptConfig,
  getTypeScriptExportStatement,
  getTypeScriptSource,
} from '@tools/tsfiles';
import { getSingleFileWriteContents, getWriteContents, write } from '@tools/write';
import chalk from 'chalk';
import debug from 'debug';
import * as TAP from 'fp-ts/Apply';
import * as TEI from 'fp-ts/Either';
import * as TFU from 'fp-ts/function';
import * as TTE from 'fp-ts/TaskEither';
import * as fs from 'fs';
import { isFalse } from 'my-easy-fp';
import * as path from 'path';
import sourceMapSupport from 'source-map-support';
import yargsAnyType, { Argv } from 'yargs';

const log = debug('ctix:cli-tool');

type TCTIXOptionWithCWD = Partial<Omit<ICTIXOptions, 'project'>> & {
  project: string;
  cwd: string;
};

type TWithTSConfig<T> = T & { tsconfigPath: string };
type TWithIncludeBackup<T> = T & { includeBackup: boolean };

// only use builder function
const casting = <T>(args: T): any => args;

function setOptions(args: ReturnType<typeof yargs>) {
  args
    .option('addNewline', {
      alias: 'n',
      describe: 'add newline on EOF',
      type: 'boolean',
    })
    .option('useSemicolon', {
      alias: 's',
      describe: 'add semicolon on every export statement',
      type: 'boolean',
    })
    .option('useTimestamp', {
      alias: 'm',
      describe:
        'timestamp write on ctix comment right-side, only works in useComment option set true',
      type: 'boolean',
    })
    .option('useComment', {
      alias: 'c',
      describe:
        'add ctix comment at first line of creted index.ts file, that remark created from ctix',
      type: 'boolean',
    })
    .option('quote', {
      alias: 'q',
      describe: 'change quote character at export syntax',
      type: 'string',
    })
    .option('excludePath', {
      alias: 'x',
      describe: 'exclude path in default export variable(or function)',
      type: 'boolean',
      default: false,
    })
    .option('useUpperFirst', {
      describe: 'Default export variable, class, function name keep first capital character.',
      type: 'boolean',
      default: true,
    })
    .option('useBackupFile', {
      alias: 'b',
      describe: 'created backup file if exists index.ts file already in directory',
      type: 'boolean',
    });

  return casting(args);
}

async function existsCheck(
  fromCli: string | undefined,
  fromOption: string | undefined,
): Promise<string> {
  if (fromCli === undefined && fromOption === undefined) {
    throw new Error(`invalid project path, don't exist: "${fromCli}" or "${fromOption ?? ''}"`);
  }

  const nonNullableFromOption = fromOption ?? '';

  if (await exists(nonNullableFromOption)) {
    return path.resolve(nonNullableFromOption);
  }

  const fromOptionWithFilename = path.join(nonNullableFromOption, 'tsconfig.json');

  if (await exists(fromOptionWithFilename)) {
    return path.resolve(fromOptionWithFilename);
  }

  if (fromCli === undefined) {
    throw new Error(`invalid project path, don't exist: "${fromCli}" or "${fromOption ?? ''}"`);
  }

  if (await exists(fromCli)) {
    return path.resolve(fromCli);
  }

  const fromCliWithFilename = path.join(fromCli, 'tsconfig.json');

  if (await exists(fromCliWithFilename)) {
    return path.resolve(fromCliWithFilename);
  }

  throw new Error(`invalid project path, don't exist: ${fromCli} or ${fromOption ?? ''}`);
}

sourceMapSupport.install();

// Yargs default type using object type(= {}). But object type cause error that
// fast-maker cli option interface type. So we make concrete type yargs instance
// make using by any type.
const yargs: Argv<TWithTSConfig<TCTIXOptionWithCWD>> = yargsAnyType as any;

yargs(process.argv.slice(2))
  .command<TWithTSConfig<TCTIXOptionWithCWD>>({
    command: '$0 [tsconfigPath]',
    aliases: 'create [tsconfigPath]',
    builder: (argv) => setOptions(argv),
    handler: async (argv) => {
      logger.switch(argv.verbose ?? false);
      const counter = new Counter(argv.verbose ?? false);

      try {
        const project = await existsCheck(argv.tsconfigPath, argv.project);
        const resolvedProjectFilePath = path.resolve(project);
        const resolvedProjectDirPath = await getDirname(resolvedProjectFilePath, true);

        process.chdir(resolvedProjectDirPath);

        CliUx.ux.action.start(
          chalk`{yellow ctix} ${argv.exportFilename ?? 'index.ts'} file create mode:`,
          'initializing',
          {
            stdout: true,
          },
        );

        const options: TCTIXOptionWithResolvedProject = {
          ...getNonEmptyOption(argv, project),
          resolvedProjectDirPath,
          resolvedProjectFilePath,
        };

        logger.debug(
          chalk`{yellow ctix - ${counter.debug}:} {blueBright [info]} project directory: ${project}`,
        );
        logger.log(
          chalk`{yellow ctix - ${counter.log}:} read ignore file, tsconfig file, cti config {green complete}`,
        );
        CliUx.ux.action.status = 'processing ...';

        const configWithIgnored = await TAP.sequenceT(TTE.ApplicativeSeq)(
          TFU.pipe(
            getIgnoreFiles(resolvedProjectDirPath),
            TTE.chain(getIgnoreFileContents),
            TTE.chain(getIgnoredContents),
          ),
          getTypeScriptConfig({
            tsconfigPath: resolvedProjectFilePath,
          }),
          TFU.pipe(
            getCTIXOptions({ projectPath: resolvedProjectFilePath }),
            TTE.chain((args) =>
              getMergedConfig({
                projectPath: resolvedProjectFilePath,
                optionObjects: args,
                cliOption: options,
              }),
            ),
          ),
        )();

        if (TEI.isLeft(configWithIgnored)) {
          throw configWithIgnored.left;
        }

        const [ignores, tsconfig, optionObjects] = configWithIgnored.right;

        logger.log(
          chalk`{yellow ctix - ${counter.log}:} typescript source file parsing {green compile} `,
        );
        CliUx.ux.action.status = 'processing ...';

        logger.debug(
          chalk`{yellow ctix - ${counter.debug}:} {blueBright [info]} ignore content - ${ignores.ignores.length}`,
        );
        logger.debug(
          chalk`{yellow ctix - ${counter.debug}:} {blueBright [info]} typescript file - ${tsconfig.fileNames.length}`,
        );
        logger.debug(
          chalk`{yellow ctix - ${counter.debug}:} {blueBright [info]} config file - ${optionObjects.length}`,
        );

        const exportContents = await TFU.pipe(
          TTE.right({
            tsconfig,
            ignores: ignores.ignores,
          }),
          TTE.chain(getTypeScriptSource),
          TTE.chain(
            (args) => () =>
              getTypeScriptExportStatement({
                program: args.program,
                filenames: args.filenames,
              }),
          ),
        )();

        if (TEI.isLeft(exportContents)) {
          throw exportContents.left;
        }

        logger.log(
          chalk`{yellow ctix - ${counter.log}:} ${
            argv.exportFilename ?? 'index.ts'
          } write on project directory {green compile}`,
        );

        const writed = await getWriteContents({ ...exportContents.right, optionObjects });

        if (TEI.isLeft(writed)) {
          throw writed.left;
        }

        await write({ contents: writed.right, optionObjects });
      } catch (catched) {
        const err = catched instanceof Error ? catched : new Error('unknown error raised');

        logger.error(chalk`{red error} message below, `);
        logger.error(err.message);
      } finally {
        CliUx.ux.action.stop('complete');
      }
    },
  })
  .command<TWithTSConfig<TCTIXOptionWithCWD>>({
    command: 'single [tsconfigPath]',
    aliases: ['entrypoint [tsconfigPath]'],
    builder: (argv) => {
      const optionApplied = setOptions(argv);

      optionApplied
        .option('useRootDir', {
          alias: 'r',
          describe: 'output file under rootDir in tsconfig.json',
          type: 'boolean',
        })
        .option('output', {
          alias: 'o',
          describe: 'output directory',
          type: 'string',
        });

      return optionApplied;
    },
    handler: async (argv) => {
      logger.switch(argv.verbose ?? false);
      const counter = new Counter(argv.verbose ?? false);

      try {
        const project = await existsCheck(argv.tsconfigPath, argv.project);
        const resolvedProjectFilePath = path.resolve(project);
        const resolvedProjectDirPath = await getDirname(resolvedProjectFilePath, true);

        process.chdir(resolvedProjectDirPath);

        CliUx.ux.action.start(
          chalk`{yellow ctix} single ${argv.exportFilename ?? 'index.ts'} file create mode:`,
          'initializing',
          {
            stdout: true,
          },
        );

        const options: TCTIXOptionWithResolvedProject = {
          ...getNonEmptyOption(argv, project),
          resolvedProjectDirPath,
          resolvedProjectFilePath,
        };

        logger.debug(
          chalk`{yellow ctix - ${counter.debug}:} {blueBright [info]} project directory: ${project}`,
        );
        logger.log(
          chalk`{yellow ctix - ${counter.log}:} read ignore file, tsconfig file, cti config {green complete}`,
        );

        CliUx.ux.action.status = 'processing ...';

        const configWithIgnored = await TAP.sequenceT(TTE.ApplicativeSeq)(
          TFU.pipe(
            getIgnoreFiles(resolvedProjectDirPath),
            TTE.chain(getIgnoreFileContents),
            TTE.chain(getIgnoredContents),
          ),
          getTypeScriptConfig({
            tsconfigPath: project,
          }),
          TFU.pipe(
            getCTIXOptions({ projectPath: resolvedProjectFilePath }),
            TTE.chain((args) =>
              getMergedConfig({
                projectPath: resolvedProjectFilePath,
                optionObjects: args,
                cliOption: options,
              }),
            ),
          ),
        )();

        if (TEI.isLeft(configWithIgnored)) {
          throw configWithIgnored.left;
        }

        const [ignores, tsconfig, optionObjects] = configWithIgnored.right;

        logger.log(
          chalk`{yellow ctix - ${counter.log}:} typescript source file parsing {green compile} `,
        );
        CliUx.ux.action.status = 'processing ...';

        logger.debug(
          chalk`{yellow ctix - ${counter.debug}:} {blueBright [info]} ignore content - ${ignores.ignores.length}`,
        );
        logger.debug(
          chalk`{yellow ctix - ${counter.debug}:} {blueBright [info]} typescript file - ${tsconfig.fileNames.length}`,
        );
        logger.debug(
          chalk`{yellow ctix - ${counter.debug}:} {blueBright [info]} config file - ${optionObjects.length}`,
        );

        const exportContents = await TFU.pipe(
          TTE.right({
            tsconfig,
            ignores: ignores.ignores,
          }),
          TTE.chain(getTypeScriptSource),
          TTE.chain(
            (args) => () =>
              getTypeScriptExportStatement({
                program: args.program,
                filenames: args.filenames,
              }),
          ),
        )();

        if (TEI.isLeft(exportContents)) {
          throw exportContents.left;
        }

        logger.log(
          chalk`{yellow ctix - ${counter.log}:} ${
            argv.exportFilename ?? 'index.ts'
          } write on project directory {green compile}`,
        );

        const writed = await getSingleFileWriteContents({
          ...exportContents.right,
          optionObjects,
          rootOptions: options,
        });

        if (TEI.isLeft(writed)) {
          throw writed.left;
        }

        await write({ contents: writed.right, optionObjects });
      } catch (catched) {
        const err = catched instanceof Error ? catched : new Error('unknown error raised');

        logger.error(chalk`{red error} message below, `);
        logger.error(err.message);
      } finally {
        CliUx.ux.action.stop('complete');
      }
    },
  })
  .command<TWithIncludeBackup<TWithTSConfig<TCTIXOptionWithCWD>>>({
    command: 'clean [tsconfigPath]',
    builder: (argv) => {
      argv.option('includeBackup', {
        alias: 'b',
        describe: 'clean with backup file',
        default: false,
        type: 'boolean',
      });

      return casting(argv);
    },
    handler: async (argv) => {
      const counter = new Counter(argv.verbose ?? false);
      logger.switch(argv.verbose ?? false);

      try {
        const project = await existsCheck(argv.tsconfigPath, argv.project);
        const resolvedProjectFilePath = path.resolve(project);
        const resolvedProjectDirPath = await getDirname(resolvedProjectFilePath, true);

        process.chdir(resolvedProjectDirPath);

        log('path.resolve in ctix.ts: ', path.resolve(project));

        CliUx.ux.action.start(
          chalk`{yellow ctix} ${argv.exportFilename ?? 'index.ts'} file clean mode:`,
          'initializing',
          {
            stdout: true,
          },
        );

        const options: TCTIXOptionWithResolvedProject = {
          ...getNonEmptyOption(argv, project),
          resolvedProjectDirPath,
          resolvedProjectFilePath,
        };

        log('clean option: ', options);

        const files = await TFU.pipe(
          getCleanFilenames({
            cliOption: options,
            includeBackupFrom: argv.includeBackup || isFalse(options.useBackupFile),
          }),
          TTE.chain((args) => () => {
            logger.log(chalk`{yellow ctix - ${counter.log}:} clean file find {green complete}`);
            logger.debug(
              chalk`{yellow ctix - ${counter.debug}:} {blueBright [info]} clean file - ${args.length}`,
            );

            return clean({ filenames: args });
          }),
        )();

        if (TEI.isLeft(files)) {
          throw files.left;
        }

        logger.log(chalk`{yellow ctix - ${counter.log}:} clean action {green complete}`);
      } catch (catched) {
        const err = catched instanceof Error ? catched : new Error('unknown error raised');

        logger.error(chalk`{red error} message below, `);
        logger.error(err.message);
      } finally {
        CliUx.ux.action.stop('complete');
      }
    },
  })
  .command<TWithTSConfig<TCTIXOptionWithCWD>>({
    command: 'init [tsconfigPath]',
    builder: (argv) => argv,
    handler: async (argv) => {
      const counter = new Counter(argv.verbose ?? false);
      logger.switch(argv.verbose ?? false);

      try {
        const project = await existsCheck(argv.tsconfigPath, argv.project);

        CliUx.ux.action.start(chalk`{yellow ctix} generate .ctirc:`, 'initializing', {
          stdout: true,
        });

        logger.log(
          chalk`{yellow ctix - ${counter.log}:} default option generation {green compile} `,
        );

        CliUx.ux.action.status = 'processing ...';

        const options: Omit<ICTIXOptions, 'project' | 'verbose'> & {
          project?: ICTIXOptions['project'];
          verbose?: ICTIXOptions['verbose'];
        } = {
          ...defaultOption(),
        };

        delete options.project;
        delete options.verbose;

        const initDir = path.dirname(project);
        await fs.promises.writeFile(path.join(initDir, '.ctirc'), JSON.stringify(options));

        logger.log(chalk`{yellow ctix - ${counter.log}:} .ctirc file write {green compile} `);
        CliUx.ux.action.status = 'processing ...';
      } catch (catched) {
        const err = catched instanceof Error ? catched : new Error('unknown error raised');

        logger.error(chalk`{red error} message below, `);
        logger.error(err.message);
      } finally {
        CliUx.ux.action.stop('complete');
      }
    },
  })
  .option('project', {
    alias: 'p',
    describe: 'tsconfig.json path: you must pass path with filename, like this "./tsconfig.json"',
    type: 'string',
  })
  .option('exportFilename', {
    alias: 'f',
    describe: 'Export filename, if you not pass this field that use "index.ts" or "index.d.ts"',
    type: 'string',
  })
  .option('verbose', {
    alias: 'v',
    describe: 'display more detailed log',
    type: 'boolean',
  })
  .help().argv;
