/* eslint-disable @typescript-eslint/no-unused-expressions */

import builder from '@cli/builder';
import convertConfig from '@configs/convertConfig';
import ICliOption from '@configs/interfaces/ICliOption';
import preLoadConfig from '@configs/preLoadConfig';
import { CliUx } from '@oclif/core';
import chalk from 'chalk';
import consola, { LogLevel } from 'consola';
import sourceMapSupport from 'source-map-support';
import yargsAnyType, { Argv } from 'yargs';
import { cleanIndexFile, createWritor, singleWritor } from './ctix';

sourceMapSupport.install();

// Yargs default type using object type(= {}). But object type cause error that
// fast-maker cli option interface type. So we make concrete type yargs instance
// make using by any type.
const yargs: Argv<ICliOption> = yargsAnyType as any;
consola.level = LogLevel.Debug;

yargs(process.argv.slice(2))
  .command<ICliOption>({
    command: '$0',
    aliases: 'create',
    builder,
    handler: async (argv) => {
      try {
        const option = convertConfig(argv, 'create');
        await createWritor(option, true);
      } catch (catched) {
        const err = catched instanceof Error ? catched : new Error('unknown error raised');

        consola.error(err);
        // logger.error(chalk`{red error} message below, `);
        // logger.error(err.message);
      }
    },
  })
  .command<ICliOption>({
    command: 'single',
    aliases: ['entrypoint'],
    builder: (argv) => {
      return builder(argv)
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
    },
    handler: async (argv) => {
      try {
        const option = convertConfig(argv, 'create');
        await singleWritor(option);
      } catch (catched) {
        const err = catched instanceof Error ? catched : new Error('unknown error raised');
        consola.error(err);
        // logger.error(chalk`{red error} message below, `);
        // logger.error(err.message);
      }
    },
  })
  .command<ICliOption>({
    command: 'clean',
    builder: (argv) => {
      argv.option('includeBackup', {
        alias: 'k',
        describe: 'clean with backup file',
        default: false,
        type: 'boolean',
      });

      return argv;
    },
    handler: async (argv) => {
      try {
        const option = convertConfig(argv, 'create');
        await cleanIndexFile(option, true);
      } catch (catched) {
        const err = catched instanceof Error ? catched : new Error('unknown error raised');
        consola.error(err);
        // logger.error(chalk`{red error} message below, `);
        // logger.error(err.message);
      } finally {
        CliUx.ux.action.stop('complete');
      }
    },
  })
  .command<ICliOption>({
    command: 'init [tsconfigPath]',
    builder: (argv) => argv,
    handler: async (argv) => {
      try {
        // const project = '';
        consola.debug('init', argv);

        CliUx.ux.action.start(chalk`{yellow ctix} generate .ctirc:`, 'initializing', {
          stdout: true,
        });

        // logger.log(
        //   chalk`{yellow ctix - ${counter.log}:} default option generation {green compile} `,
        // );

        CliUx.ux.action.status = 'processing ...';

        // const options: Omit<IOption, 'project' | 'verbose'> & {
        //   project?: IOption['project'];
        //   verbose?: IOption['verbose'];
        // } = {
        //   ...defaultOption(),
        // };

        // delete options.project;
        // delete options.verbose;

        // const initDir = path.dirname(project);
        // await fs.promises.writeFile(path.join(initDir, '.ctirc'), JSON.stringify(options));

        // logger.log(chalk`{yellow ctix - ${counter.log}:} .ctirc file write {green compile} `);
        // CliUx.ux.action.status = 'processing ...';
      } catch (catched) {
        const err = catched instanceof Error ? catched : new Error('unknown error raised');
        consola.error(err);
        // logger.error(chalk`{red error} message below, `);
        // logger.error(err.message);
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
  .demandOption(['project'])
  .config(preLoadConfig())
  .help().argv;
