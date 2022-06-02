import ICliOption from '@configs/interfaces/ICliOption';
import IOption from '@configs/interfaces/IOption';
import jsonLoader from '@configs/jsonLoader';
import consola from 'consola';
import * as findUp from 'find-up';
import fs from 'fs';
import minimist from 'minimist';
import { isEmpty, isFalse, isNotEmpty } from 'my-easy-fp';
import { existsSync } from 'my-node-fp';

export default function preLoadConfig() {
  try {
    const argv = minimist([...process.argv.slice(2)]);

    const configFilePath =
      isNotEmpty(argv.config) || isNotEmpty(argv.c)
        ? findUp.sync([argv.config, argv.c])
        : findUp.sync('.ctirc');

    const tsconfigPath =
      isNotEmpty(argv.project) || isNotEmpty(argv.p)
        ? findUp.sync([argv.project, argv.p])
        : findUp.sync('tsconfig.json');

    if (isEmpty(configFilePath) || isFalse(existsSync(configFilePath))) {
      return {
        project: tsconfigPath,
        p: tsconfigPath,
      };
    }

    if (isEmpty(tsconfigPath) || isFalse(existsSync(tsconfigPath))) {
      return {};
    }

    const configBuf = fs.readFileSync(configFilePath);
    const rawConfig: Partial<IOption> = jsonLoader(configBuf.toString());

    const option: Partial<ICliOption> = {
      c: configFilePath,
      config: configFilePath,

      p: tsconfigPath,
      project: tsconfigPath,

      f: argv.f ?? argv.exportFilename ?? rawConfig.exportFilename,
      exportFilename: argv.f ?? argv.exportFilename ?? rawConfig.exportFilename,

      n: argv.n ?? argv.addNewline ?? rawConfig.addNewline,
      addNewline: argv.n ?? argv.addNewline ?? rawConfig.addNewline,

      v: argv.v ?? argv.verbose ?? rawConfig.verbose ?? false,
      verbose: argv.v ?? argv.verbose ?? rawConfig.verbose ?? false,

      s: argv.s ?? argv.useSemicolon ?? rawConfig.useSemicolon,
      useSemicolon: argv.s ?? argv.useSemicolon ?? rawConfig.useSemicolon,

      m: argv.m ?? argv.useTimestamp ?? rawConfig.useTimestamp,
      useTimestamp: argv.m ?? argv.useTimestamp ?? rawConfig.useTimestamp,

      t: argv.t ?? argv.useComment ?? rawConfig.useComment,
      useComment: argv.t ?? argv.useComment ?? rawConfig.useComment,

      q: argv.q ?? argv.quote ?? rawConfig.quote,
      quote: argv.q ?? argv.quote ?? rawConfig.quote,

      b: argv.b ?? argv.useBackupFile ?? rawConfig.useBackupFile,
      useBackupFile: argv.b ?? argv.useBackupFile ?? rawConfig.useBackupFile,

      k: argv.b ?? argv.keepFileExt ?? rawConfig.keepFileExt,
      keepFileExt: argv.b ?? argv.keepFileExt ?? rawConfig.keepFileExt,

      r: argv.r ?? argv.useRootDir ?? rawConfig.useRootDir,
      useRootDir: argv.r ?? argv.useRootDir ?? rawConfig.useRootDir,

      e: argv.e ?? argv.skipEmptyDir ?? rawConfig.skipEmptyDir,
      skipEmptyDir: argv.r ?? argv.skipEmptyDir ?? rawConfig.skipEmptyDir,

      o: argv.o ?? argv.output ?? rawConfig.output,
      output: argv.o ?? argv.output ?? rawConfig.output,
    };

    return option;
  } catch (catched) {
    const err = catched instanceof Error ? catched : new Error('unknown error raised');
    consola.error(err);

    return {};
  }
}
