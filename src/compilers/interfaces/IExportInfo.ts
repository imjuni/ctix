import IIdentifierWithNode from '@compilers/interfaces/IIdentifierWithNode';

export default interface IExportInfo {
  resolvedFilePath: string;
  resolvedDirPath: string;
  relativeFilePath: string;
  depth: number;
  starExported: boolean;
  defaultExport?: IIdentifierWithNode;
  namedExports: IIdentifierWithNode[];
}
