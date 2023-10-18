export interface ICreateIndexInfos {
  /**
   * depth of the resolvedDirPath
   */
  depth: number;

  /**
   * resolved file path, if case of 'index.ts' that is empty
   */
  resolvedFilePaths?: string[];

  /**
   * resolved dir path
   */
  resolvedDirPath: string;

  /**
   * real export statement
   * ex> export * from './wellmade'
   */
  exportStatements: string[];
}
