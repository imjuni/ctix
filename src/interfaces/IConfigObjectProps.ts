import { ICTIXOptions } from '@interfaces/ICTIXOptions';

export interface ICreateTypeScriptIndex {
  // tsconfig.json directory with filename
  projectPath: string;
  optionFiles: string[];
}

export interface IOptionObjectProps {
  dir: string;
  depth: number;
  exists: boolean;
  option?: Partial<ICTIXOptions>;
}

export interface INonNullableOptionObjectProps {
  dir: string;
  depth: number;
  exists: boolean;
  option: ICTIXOptions;
}
