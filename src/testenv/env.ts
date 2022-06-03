import attachDiretoryInfo from '@configs/attachDiretoryInfo';
import ICommonCliOption from '@configs/interfaces/ICommonCliOption';
import ICreateSingleCommonCliOption from '@configs/interfaces/ICreateSingleCommonCliOption';
import { TCreateOption, TRemoveOption, TSingleOption } from '@configs/interfaces/IOption';
import { replaceSepToPosix } from 'my-node-fp';
import path from 'path';

export const examplePath = path.resolve(path.join(__dirname, '..', '..', 'example'));
export const exampleRcloaderPath = path.join(examplePath, 'rcloader');
export const exampleType01Path = path.join(examplePath, 'type01');
export const exampleType02Path = path.join(examplePath, 'type02');
export const exampleType03Path = path.join(examplePath, 'type03');
export const exampleType04Path = path.join(examplePath, 'type04');
export const exampleType05Path = path.join(examplePath, 'type05');

export const commonOption: ICommonCliOption = {
  c: replaceSepToPosix(path.join(exampleRcloaderPath, '.ctirc')),
  config: replaceSepToPosix(path.join(exampleRcloaderPath, '.ctirc')),

  p: replaceSepToPosix(path.join(examplePath, 'tsconfig.json')),
  project: replaceSepToPosix(path.join(examplePath, 'tsconfig.json')),

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
};

export const createOption: TCreateOption = {
  ...commonOption,
  ...createSingleCommonOption,
  mode: 'create',
  e: true,
  skipEmptyDir: true,
};

export const singleOption: TSingleOption = {
  ...commonOption,
  ...createSingleCommonOption,
  mode: 'single',
  o: replaceSepToPosix(exampleType04Path),
  output: replaceSepToPosix(exampleType04Path),
  r: false,
  useRootDir: false,
};

export const cleanOption: TRemoveOption = {
  ...commonOption,
  mode: 'clean',
  b: true,
  includeBackup: true,
};

export const createOptionWithDirInfo = attachDiretoryInfo(createOption);
export const singleOptionWithDirInfo = attachDiretoryInfo(singleOption);
export const cleanOptionWithDirInfo = attachDiretoryInfo(cleanOption);
