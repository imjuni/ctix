export default interface ICreateIndexInfo {
  /**
   * depth of the resolvedDirPath
   */
  depth: number;

  /**
   * resolved file path, if case of 'index.ts' that is empty
   */
  resolvedFilePath?: string;

  /**
   * resolved dir path
   */
  resolvedDirPath: string;

  /**
   * real export statement
   * ex> export * from './wellmade'
   */
  exportStatement: string;
}
