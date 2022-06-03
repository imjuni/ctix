/* eslint-disable @typescript-eslint/no-unused-expressions */

import builder from '@cli/builder';
import createBuilder from '@cli/createBuilder';
import createSingleBuilder from '@cli/createSingleBuilder';
import initBuilder from '@cli/initBuilder';
import removeBuilder from '@cli/removeBuilder';
import singleBuilder from '@cli/singleBuilder';
import attachDiretoryInfo from '@configs/attachDiretoryInfo';
import getRequiredCliCleanOption from '@configs/getRequiredCliCleanOption';
import getRequiredCliCreateOption from '@configs/getRequiredCliCreateOption';
import getRequiredCliSingleOption from '@configs/getRequiredCliSingleOption';
import {
  TCreateOption,
  TInitOption,
  TRemoveOption,
  TSingleOption,
} from '@configs/interfaces/IOption';
import preLoadConfig from '@configs/preLoadConfig';
import consola, { LogLevel } from 'consola';
import sourceMapSupport from 'source-map-support';
import yargsAnyType, { Argv } from 'yargs';
import { createInitFile, createWritor, removeIndexFile, singleWritor } from './ctix';

sourceMapSupport.install();

// Yargs default type using object type(= {}). But object type cause error that
// fast-maker cli option interface type. So we make concrete type yargs instance
// make using by any type.
const yargs: Argv<TRemoveOption | TCreateOption | TInitOption | TSingleOption> =
  yargsAnyType as any;
consola.level = LogLevel.Debug;

yargs(process.argv.slice(2))
  .command<TCreateOption>({
    command: 'create',
    aliases: ['c'],
    describe: 'create index.ts file that each file per directory',
    builder: (argv) => {
      return createBuilder(createSingleBuilder(builder(argv))) as any;
    },
    handler: async (argv) => {
      try {
        const option = getRequiredCliCreateOption(argv);
        const optionWithDirectoryInfo = attachDiretoryInfo(option);

        await createWritor(optionWithDirectoryInfo, true);
      } catch (catched) {
        const err = catched instanceof Error ? catched : new Error('unknown error raised');
        consola.error(err);
      }
    },
  })
  .command<TSingleOption>({
    command: 'single',
    aliases: ['s'],
    describe: 'create index.ts file that aggregate on single file',
    builder: (argv) => {
      return singleBuilder(createSingleBuilder(builder(argv))) as any;
    },
    handler: async (argv) => {
      try {
        const option = getRequiredCliSingleOption(argv);
        const optionWithDirectoryInfo = attachDiretoryInfo(option);

        await singleWritor(optionWithDirectoryInfo, true);
      } catch (catched) {
        const err = catched instanceof Error ? catched : new Error('unknown error raised');
        consola.error(err);
      }
    },
  })
  .command<TRemoveOption>({
    command: 'remove',
    aliases: ['r'],
    describe: 'remove index.ts file',
    builder: (argv) => {
      return removeBuilder(builder(argv)) as any;
    },
    handler: async (argv) => {
      try {
        const option = getRequiredCliCleanOption(argv);
        const optionWithDirectoryInfo = attachDiretoryInfo(option);

        await removeIndexFile(optionWithDirectoryInfo, true);
      } catch (catched) {
        const err = catched instanceof Error ? catched : new Error('unknown error raised');
        consola.error(err);
      }
    },
  })
  .command<TInitOption>({
    command: 'init',
    aliases: ['i'],
    describe: 'create .ctirc configuration',
    builder: (argv) => {
      return initBuilder(argv) as any;
    },
    handler: async (argv) => {
      try {
        const optionWithDirectoryInfo = attachDiretoryInfo(argv);
        await createInitFile(optionWithDirectoryInfo, true);
      } catch (catched) {
        const err = catched instanceof Error ? catched : new Error('unknown error raised');
        consola.error(err);
      }
    },
  })
  .demandCommand()
  .recommendCommands()
  .demandOption(['project', 'exportFilename'])
  .config(preLoadConfig())
  .help().argv;
