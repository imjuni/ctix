/* eslint-disable @typescript-eslint/no-unused-expressions */

import builder from '@cli/builder';
import createBuilder from '@cli/createBuilder';
import createSingleBuilder from '@cli/createSingleBuilder';
import initBuilder from '@cli/initBuilder';
import removeBuilder from '@cli/removeBuilder';
import singleBuilder from '@cli/singleBuilder';
import attachDiretoryInfo from '@configs/attachDiretoryInfo';
import getCreateOption from '@configs/getCreateOption';
import getInitOption from '@configs/getInitOption';
import getRemoveOption from '@configs/getRemoveOption';
import getSingleOption from '@configs/getSingleOption';
import {
  TCreateOption,
  TInitOption,
  TRemoveOption,
  TSingleOption,
} from '@configs/interfaces/IOption';
import isValidConfig from '@configs/isValidConfig';
import preLoadConfig from '@configs/preLoadConfig';
import logger from '@tools/logger';
import { isError } from 'my-easy-fp';
import sourceMapSupport from 'source-map-support';
import yargsAnyType, { Argv } from 'yargs';
import { createInitFile, createWritor, removeIndexFile, singleWritor } from './ctix';

sourceMapSupport.install();

const log = logger();

// Yargs default type using object type(= {}). But object type cause error that
// fast-maker cli option interface type. So we make concrete type yargs instance
// make using by any type.
const yargs: Argv<TRemoveOption | TCreateOption | TInitOption | TSingleOption> =
  yargsAnyType as any;

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
        const withDefaultOption = getCreateOption(argv);
        const withDirectoryInfo = attachDiretoryInfo(withDefaultOption);

        await createWritor(withDirectoryInfo, true);
      } catch (catched) {
        const err = isError(catched) ?? new Error('unknown error raised');

        log.error(err.message);
        log.error(err.stack);
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
        const withDefaultOption = getSingleOption(argv);
        const withDirectoryInfo = attachDiretoryInfo(withDefaultOption);

        await singleWritor(withDirectoryInfo, true);
      } catch (catched) {
        const err = isError(catched) ?? new Error('unknown error raised');

        log.error(err.message);
        log.error(err.stack);
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
        const withDefaultOption = getRemoveOption(argv);
        const withDirectoryInfo = attachDiretoryInfo(withDefaultOption);

        await removeIndexFile(withDirectoryInfo, true);
      } catch (catched) {
        const err = isError(catched) ?? new Error('unknown error raised');

        log.error(err.message);
        log.error(err.stack);
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
        const withDefaultOption = getInitOption(argv);
        const withDirectoryInfo = attachDiretoryInfo(withDefaultOption);

        await createInitFile(withDirectoryInfo, true);
      } catch (catched) {
        const err = isError(catched) ?? new Error('unknown error raised');

        log.error(err.message);
        log.error(err.stack);
      }
    },
  })
  .check(isValidConfig)
  .demandCommand()
  .recommendCommands()
  .config(preLoadConfig())
  .help('help').argv;
