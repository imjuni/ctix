import { ICTIXOptions } from '@interfaces/ICTIXOptions';

export interface ICreateTypeScriptIndex {
  cwd: string;
  configFiles: string[];
}

export interface IConfigObjectProps {
  dir: string;
  depth: number;
  exists: boolean;
  config?: ICTIXOptions;
}

export interface INonNullableConfigObjectProps {
  dir: string;
  depth: number;
  exists: boolean;
  config: ICTIXOptions;
}
