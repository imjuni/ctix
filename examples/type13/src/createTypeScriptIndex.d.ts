import fastGlob from 'fast-glob';

export interface ICreateTsIndexOption {
  fileFirst?: boolean;
  addNewline?: boolean;
  useSemicolon?: boolean;
  useTimestamp?: boolean;
  includeCWD?: boolean;
  excludes?: string[];
  fileExcludePatterns?: string[];
  targetExts?: string[];
  globOptions?: fastGlob.IOptions;
}
export declare function indexWriter(
  directory: string,
  directories: string[],
  option: ICreateTsIndexOption,
): Promise<void>;

export declare function createTypeScriptIndex(_option: ICreateTsIndexOption): Promise<void>;
