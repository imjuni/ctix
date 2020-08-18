import { ICTIXOptions } from '@interfaces/ICTIXOptions';
import { clean, getCleanFilenames } from '@tools/clean';
import { defaultConfig, getCtiConfig, getMergedConfig } from '@tools/cticonfig';
import { getIgnoredContents, getIgnoreFileContents, getIgnoreFiles } from '@tools/ctiignore';
import logger from '@tools/Logger';
import { exists } from '@tools/misc';
import { getTypeScriptConfig, getTypeScriptExportStatement, getTypeScriptSource } from '@tools/tsfiles';
import { taskEitherLiftor } from '@tools/typehelper';
import { getWriteContents, write } from '@tools/write';
import chalk from 'chalk';
import cli from 'cli-ux';
import debug from 'debug';
import * as TAP from 'fp-ts/Apply';
import * as TEI from 'fp-ts/Either';
import * as TPI from 'fp-ts/pipeable';
import * as TTE from 'fp-ts/TaskEither';
import { isFalse } from 'my-easy-fp';
import * as path from 'path';
import yargs, { Argv } from 'yargs';
import { Counter } from '@tools/Counter';

const log = debug('ctix:config-tool');

type TCTIXOptionWithCWD = Partial<Omit<ICTIXOptions, 'project'>> & {
  project: string;
  cwd: string;
};

// only use builder function
const casting = <T>(args: T): any => args;

function setOptions(args: Argv<{}>) {
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
      describe: 'timestamp write on ctix comment right-side, only works in useComment option set true',
      type: 'boolean',
    })
    .option('useComment', {
      alias: 'c',
      describe: 'add ctix comment at first line of creted index.ts file, that remark created from ctix',
      type: 'boolean',
    })
    .option('quote', {
      alias: 'q',
      describe: 'change quote character at export syntax',
      type: 'string',
    })
    .option('useBackupFile', {
      alias: 'b',
      describe: 'created backup file if exists index.ts file already in directory',
      type: 'boolean',
    });

  return casting(args);
}

const argv = yargs
  .command<TCTIXOptionWithCWD>({
    command: '$0',
    aliases: 'create',
    builder: (argv: Argv<{}>) => {
      return setOptions(argv);
    },
    handler: async (argv) => {
      logger.switch(argv.verbose ?? false);
      const counter = new Counter(argv.verbose ?? false);

      try {
        if (isFalse(await exists(argv.project ?? ''))) {
          throw new Error(chalk`ctix can't found tsconfig file in {red ${argv.project}}`);
        }

        cli.action.start(chalk`{yellow ctix} ${argv.exportFilename} file create mode:`, 'initializing', {
          stdout: true,
        });

        const fallbackConfig = defaultConfig({ project: argv.project });
        const options: ICTIXOptions = {
          project: path.resolve(argv.project),
          useBackupFile: argv.useBackupFile ?? fallbackConfig.useBackupFile,
          useComment: argv.useComment ?? fallbackConfig.useComment,
          useSemicolon: argv.useSemicolon ?? fallbackConfig.useSemicolon,
          useTimestamp: argv.useTimestamp ?? fallbackConfig.useTimestamp,
          addNewline: argv.addNewline ?? fallbackConfig.addNewline,
          quote: argv.quote ?? fallbackConfig.quote,
          verbose: argv.verbose ?? fallbackConfig.verbose,
          exportFilename: argv.exportFilename ?? fallbackConfig.exportFilename,
        };

        const projectCWD = path.dirname(argv.project);
        logger.debug(chalk`{yellow ctix - ${counter.debug}:} {blueBright [info]} project directory: ${argv.project}`);
        logger.log(chalk`{yellow ctix - ${counter.log}:} read ignore file, tsconfig file, cti config {green complete}`);
        cli.action.status = 'processing ...';

        const configWithIgnored = await TAP.sequenceT(TTE.taskEither)(
          TPI.pipe(
            taskEitherLiftor(getIgnoreFiles)(projectCWD),
            TTE.chain(taskEitherLiftor(getIgnoreFileContents)),
            TTE.chain(taskEitherLiftor(getIgnoredContents)),
          ),
          taskEitherLiftor(getTypeScriptConfig)({
            cwd: projectCWD,
            tsconfigPath: argv.project,
          }),
          TPI.pipe(
            taskEitherLiftor(getCtiConfig)({ cwd: projectCWD }),
            TTE.chain((args) => () => getMergedConfig({ cwd: projectCWD, configObjects: args, cliOptions: options })),
          ),
        )();

        if (TEI.isLeft(configWithIgnored)) {
          throw configWithIgnored.left;
        }

        const [ignores, tsconfig, configObjects] = configWithIgnored.right;

        logger.log(chalk`{yellow ctix - ${counter.log}:} typescript source file parsing {green compile} `);
        cli.action.status = 'processing ...';

        logger.debug(
          chalk`{yellow ctix - ${counter.debug}:} {blueBright [info]} ignore content - ${ignores.ignores.length}`,
        );
        logger.debug(
          chalk`{yellow ctix - ${counter.debug}:} {blueBright [info]} typescript file - ${tsconfig.fileNames.length}`,
        );
        logger.debug(
          chalk`{yellow ctix - ${counter.debug}:} {blueBright [info]} config file - ${configObjects.length}`,
        );

        const exportContents = await TPI.pipe(
          taskEitherLiftor(getTypeScriptSource)({
            tsconfig,
            ignores: ignores.ignores,
          }),
          TTE.chain((args) => () =>
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

        const writed = await getWriteContents({ ...exportContents.right, configObjects });

        if (TEI.isLeft(writed)) {
          throw writed.left;
        }

        await write({ contents: writed.right, configObjects });
      } catch (err) {
        logger.error(chalk`{red error} message below, `);
        logger.error(err.message);
      } finally {
        cli.action.stop('complete');
      }
    },
  })
  .command<TCTIXOptionWithCWD & { includeBackup: boolean }>({
    command: 'clean',
    builder: (argv: Argv<{}>) => {
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
        if (isFalse(await exists(argv.project))) {
          throw new Error(`invalid project path, don't exist: ${argv.project}`);
        }

        cli.action.start(chalk`{yellow ctix} ${argv.exportFilename} file clean mode:`, 'initializing', {
          stdout: true,
        });

        const fallbackConfig = defaultConfig({ project: argv.project });
        const options: ICTIXOptions = {
          project: path.resolve(argv.project),
          useBackupFile: argv.useBackupFile ?? fallbackConfig.useBackupFile,
          useComment: argv.useComment ?? fallbackConfig.useComment,
          useSemicolon: argv.useSemicolon ?? fallbackConfig.useSemicolon,
          useTimestamp: argv.useTimestamp ?? fallbackConfig.useTimestamp,
          addNewline: argv.addNewline ?? fallbackConfig.addNewline,
          quote: argv.quote ?? fallbackConfig.quote,
          verbose: argv.verbose ?? fallbackConfig.verbose,
          exportFilename: argv.exportFilename ?? fallbackConfig.exportFilename,
        };

        const files = await TPI.pipe(
          () => getCleanFilenames({ cliOptions: options, includeBackupFrom: argv.includeBackup }),
          TTE.chain((args) => () => {
            logger.log(chalk`{yellow ctix - ${counter.log}:} clean file find {green complete}`);
            logger.debug(chalk`{yellow ctix - ${counter.debug}:} {blueBright [info]} clean file - ${args.length}`);

            return clean({ filenames: args });
          }),
        )();

        if (TEI.isLeft(files)) {
          throw files.left;
        }

        logger.log(chalk`{yellow ctix - ${counter.log}:} clean action {green complete}`);
      } catch (err) {
        logger.error(chalk`{red error} message below, `);
        logger.error(err.message);
      } finally {
        cli.action.stop('complete');
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
    describe:
      'Export filename, if you not pass this field that use "index.ts" or "index.d.ts" (set useDeclarationFile true)',
    type: 'string',
  })
  .option('verbose', {
    alias: 'v',
    describe: 'display more detailed log',
    type: 'boolean',
  })
  .help().argv;

// below line, meaning less
log('test: ', argv.filenames);
log('test: ', argv.interfaces);
log('test: ', process.env.DEBUG);
