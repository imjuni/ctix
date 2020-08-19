import { ICTIXOptions } from '@interfaces/ICTIXOptions';

export interface ICreateTypeScriptIndex {
  cwd: string;
  optionFiles: string[];
}

export interface IOptionObjectProps {
  dir: string;
  depth: number;
  exists: boolean;
  option?: ICTIXOptions;
}

export interface INonNullableOptionObjectProps {
  dir: string;
  depth: number;
  exists: boolean;
  option: ICTIXOptions;
}
