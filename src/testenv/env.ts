import attachDiretoryInfo from '@configs/attachDiretoryInfo';
import defaultIgnoreFileName from '@configs/defaultIgnoreFileName';
import ICommonCliOption from '@configs/interfaces/ICommonCliOption';
import ICreateSingleCommonCliOption from '@configs/interfaces/ICreateSingleCommonCliOption';
import { TCreateOption, TRemoveOption, TSingleOption } from '@configs/interfaces/IOption';
import { posixJoin } from '@tools/misc';
import { replaceSepToPosix } from 'my-node-fp';
import path from 'path';

export const examplePath = replaceSepToPosix(
  path.resolve(path.join(__dirname, '..', '..', 'example')),
);
export const exampleRcloaderPath = posixJoin(examplePath, 'rcloader');
export const exampleType01Path = posixJoin(examplePath, 'type01');
export const exampleType02Path = posixJoin(examplePath, 'type02');
export const exampleType03Path = posixJoin(examplePath, 'type03');
export const exampleType04Path = posixJoin(examplePath, 'type04');
export const exampleType05Path = posixJoin(examplePath, 'type05');
export const exampleType06Path = posixJoin(examplePath, 'type06');

export const commonOption: ICommonCliOption = {
  c: posixJoin(exampleRcloaderPath, '.ctirc'),
  config: posixJoin(exampleRcloaderPath, '.ctirc'),

  p: posixJoin(examplePath, 'tsconfig.json'),
  project: posixJoin(examplePath, 'tsconfig.json'),

  f: 'index.ts',
  exportFilename: 'index.ts',
};

export const createSingleCommonOption: ICreateSingleCommonCliOption = {
  s: true,
  useSemicolon: true,

  m: false,
  useTimestamp: false,

  t: false,
  useComment: false,

  q: "'",
  quote: "'",

  w: true,
  overwrite: true,

  g: defaultIgnoreFileName,
  ignoreFile: defaultIgnoreFileName,
};

export const createOption: TCreateOption = {
  ...commonOption,
  ...createSingleCommonOption,
  mode: 'create',
  project: replaceSepToPosix(path.join(exampleType04Path, 'tsconfig.json')),
  e: true,
  skipEmptyDir: true,
};

export const singleOption: TSingleOption = {
  ...commonOption,
  ...createSingleCommonOption,
  mode: 'single',
  project: replaceSepToPosix(path.join(exampleType04Path, 'tsconfig.json')),
  o: replaceSepToPosix(exampleType04Path),
  output: replaceSepToPosix(exampleType04Path),
  r: false,
  useRootDir: false,
};

export const cleanOption: TRemoveOption = {
  ...commonOption,
  mode: 'remove',
  b: true,
  project: replaceSepToPosix(path.join(exampleType04Path, 'tsconfig.json')),
  includeBackup: true,
};

export const createOptionWithDirInfo = attachDiretoryInfo(createOption);
export const singleOptionWithDirInfo = attachDiretoryInfo(singleOption);
export const cleanOptionWithDirInfo = attachDiretoryInfo(cleanOption);
