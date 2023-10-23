export interface ICommandRemoveOptions {
  /**
   * remove with backup file
   * @mode remove
   * @default false
   */
  removeBackup: boolean;

  /**
   * Export filename, if you not pass this field that use "index.ts" or "index.d.ts"
   * @mode create, single, remove
   * @default index.ts
   */
  exportFilename: string;

  /**
   * answer `yes` to all questions
   * @mode remove
   * @default false
   */
  forceYes: boolean;
}
