export interface ICommandRemoveOptions {
  /**
   * remove with backup file
   *
   * @command remove
   * @mode
   *
   * @default false
   */
  removeBackup: boolean;

  /**
   * Export filename, if you not pass this field that use "index.ts" or "index.d.ts"
   *
   * @command build, remove
   * @mode bundle, create
   *
   * @default index.ts
   */
  exportFilename: string;

  /**
   * answer `yes` to all questions
   *
   * @command remove
   * @mode
   *
   * @default false
   */
  forceYes: boolean;
}
