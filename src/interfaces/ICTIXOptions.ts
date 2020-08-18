/**
 * Option interface for CTIX
 */
export interface ICTIXOptions {
  /**
   * tsconfig path (with filename)
   * @mode both
   * @default `${process.cwd()}${path.sep}tsconfig.json`
   */
  project: string;

  /**
   * add newline on EOF
   * @mode both
   * @default true
   */
  addNewline: boolean;

  /**
   * add semicolon on every export statement
   * @mode both
   * @default true
   */
  useSemicolon: boolean;

  /**
   * add timestamp on creation comment
   * @mode both
   * @default false
   */
  useTimestamp: boolean;

  /**
   * remove create-ts-index comment, if enable this option forced disable useTimestamp option
   * @mode both
   * @default false
   */
  useComment: boolean;

  /**
   * quote mark " or '
   * @mode both
   * @default '
   */
  quote: string;

  /**
   * disply verbose logging message
   * @mode both
   * @default false
   */
  verbose: boolean;

  /**
   * Don't create backupfile if already exists target file
   * @mode both
   * @default true
   */
  useBackupFile: boolean;

  /**
   * Export filename, if you not pass this field that use "index.ts" or "index.d.ts" (set useDeclarationFile true)
   * @mode both
   * @default true
   */
  exportFilename: string;
}
