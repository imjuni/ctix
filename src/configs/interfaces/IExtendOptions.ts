import type * as tsm from 'ts-morph';

export interface IExtendOptions {
  /** sourceFile newline character */
  eol: string;

  /** parsed tsconfig.json */
  tsconfig: tsm.ts.ParsedCommandLine;

  topDir: {
    /** topLevelDirs */
    dirs: string[];

    /** topLevelDir Depth */
    depth: number;
  };

  resolved: {
    /** resolved tsconfig.json directory */
    projectDirPath: string;

    /** resolved tsconfig.json directory with filename */
    projectFilePath: string;
  };
}
