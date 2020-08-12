/**
 * Option interface for CTIX
 */
export interface ICTIXOptions {
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
   * create index.d.ts file instead of index.ts
   * @mode both
   * @default false
   */
  useDeclarationFile: boolean;

  /**
   * Don't create backupfile if already exists target file
   * @mode both
   * @default true
   */
  useBackupFile: boolean;

  /**
   * Output file directory, only works in single-file mode
   * @mode single-file (= entrypoint)
   * @default process.cwd()
   */
  output: string;

  /**
   * tsconfig path (with filename)
   * @mode both
   * @default `${process.cwd()}${path.sep}tsconfig.json`
   */
  project: string;
}
