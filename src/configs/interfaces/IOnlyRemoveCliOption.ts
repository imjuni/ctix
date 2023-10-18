export interface IOnlyRemoveCliOption {
  mode: 'remove';

  /**
   * remove with backup file
   * @mode remove
   * @default false
   */
  b?: boolean;
  includeBackup?: boolean;
}
