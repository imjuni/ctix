export interface IDirectoryInfo {
  /** sourceFile newline character */
  eol: string;

  /** topLevelDirs */
  topDirs: string[];

  /** topLevelDir Depth */
  topDirDepth: number;

  /** resolved tsconfig.json directory */
  resolvedProjectDirPath: string;

  /** resolved tsconfig.json directory with filename */
  resolvedProjectFilePath: string;

  /** resolved ignoreFile(eg. .ctiignore) directory with filename */
  resolvedIgnoreFilePath: string;
}
