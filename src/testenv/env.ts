import convertConfig from '@configs/attachDiretoryInfo';
import ICliOption from '@configs/interfaces/IOption';
import { replaceSepToPosix } from 'my-node-fp';
import path from 'path';

export const examplePath = path.resolve(path.join(__dirname, '..', '..', 'example'));
export const exampleRcloaderPath = path.join(examplePath, 'rcloader');
export const exampleType01Path = path.join(examplePath, 'type01');
export const exampleType02Path = path.join(examplePath, 'type02');
export const exampleType03Path = path.join(examplePath, 'type03');
export const exampleType04Path = path.join(examplePath, 'type04');
export const exampleType05Path = path.join(examplePath, 'type05');

export const cliOption: ICliOption = {
  c: replaceSepToPosix(path.join(exampleRcloaderPath, '.ctirc')),
  config: replaceSepToPosix(path.join(exampleRcloaderPath, '.ctirc')),

  p: replaceSepToPosix(path.join(examplePath, 'tsconfig.json')),
  project: replaceSepToPosix(path.join(examplePath, 'tsconfig.json')),

  f: undefined,
  exportFilename: undefined,

  n: undefined,
  addNewline: undefined,

  v: undefined,
  verbose: undefined,

  s: true,
  useSemicolon: true,

  m: false,
  useTimestamp: false,

  t: false,
  useComment: false,

  q: undefined,
  quote: undefined,

  b: true,
  useBackupFile: true,

  e: true,
  skipEmptyDir: true,

  o: replaceSepToPosix(exampleType04Path),
  output: replaceSepToPosix(exampleType04Path),
};

export const option = convertConfig(cliOption, 'create');
