export default interface IOnlyRemoveCliOption {
  mode: 'clean';

  /**
   * remove with backup file
   * @mode clean
   * @default false
   */
  b?: boolean;
  includeBackup?: boolean;
}
