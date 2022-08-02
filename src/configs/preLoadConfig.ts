import getCliCreateOption from '@configs/getCliCreateOption';
import getCliRemoveOption from '@configs/getCliRemoveOption';
import getCliSingleOption from '@configs/getCliSingleOption';
import consola from 'consola';
import * as findUp from 'find-up';
import fs from 'fs';
import { isEmpty, isFalse, isNotEmpty } from 'my-easy-fp';
import { existsSync, getDirnameSync } from 'my-node-fp';
import yargs, { ArgumentsCamelCase } from 'yargs';
import { TCreateOption, TRemoveOption, TSingleOption } from './interfaces/IOption';

function getConfigFilePath(argv: { c?: string; config?: string }, projectPath?: string) {
  const argvConfigFilePath = argv.c ?? argv.config;
  const projectDirPath = isNotEmpty(projectPath) ? getDirnameSync(projectPath) : undefined;

  const configFilePathSearchResultOnCwd = findUp.sync('.ctirc');
  const configFilePathSearchProjectDirPath = isNotEmpty(projectDirPath)
    ? findUp.sync('.ctirc', { cwd: projectDirPath })
    : undefined;

  return (
    argvConfigFilePath ?? configFilePathSearchResultOnCwd ?? configFilePathSearchProjectDirPath
  );
}

export default function preLoadConfig() {
  try {
    const argv = yargs(process.argv.slice(2)).parseSync() as any;

    const tsconfigPath =
      isNotEmpty(argv.project) || isNotEmpty(argv.p)
        ? findUp.sync([argv.project, argv.p])
        : findUp.sync('tsconfig.json');

    const configFilePath = getConfigFilePath(argv, tsconfigPath);

    if (isEmpty(configFilePath) || isFalse(existsSync(configFilePath))) {
      return {
        p: tsconfigPath,
        project: tsconfigPath,
        f: argv.f ?? argv.exportFilename ?? 'index.ts',
        exportFilename: argv.f ?? argv.exportFilename ?? 'index.ts',
      };
    }

    if (isEmpty(tsconfigPath) || isFalse(existsSync(tsconfigPath))) {
      return {};
    }

    const [command] = argv._;

    const configBuf = fs.readFileSync(configFilePath);

    if (command === 'c' || command === 'create') {
      const createArgv: ArgumentsCamelCase<TCreateOption> = argv as any;
      return getCliCreateOption(configBuf, createArgv, configFilePath, tsconfigPath);
    }

    if (command === 's' || command === 'single') {
      const singleArgv: ArgumentsCamelCase<TSingleOption> = argv as any;
      return getCliSingleOption(configBuf, singleArgv, configFilePath, tsconfigPath);
    }

    if (command === 'r' || command === 'remove') {
      const removeArgv: ArgumentsCamelCase<TRemoveOption> = argv as any;
      return getCliRemoveOption(configBuf, removeArgv, configFilePath, tsconfigPath);
    }

    if (command === 'i' || command === 'init') {
      return {
        p: tsconfigPath,
        project: tsconfigPath,
        c: configFilePath,
        config: configFilePath,
        f: argv.f ?? argv.exportFilename ?? 'index.ts',
        exportFilename: argv.f ?? argv.exportFilename ?? 'index.ts',
      };
    }

    return {};
  } catch (catched) {
    const err = catched instanceof Error ? catched : new Error('unknown error raised');
    consola.error(err);

    return {};
  }
}
