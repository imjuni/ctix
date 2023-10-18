import type { IIdentifierWithNode } from '#/compilers/interfaces/IIdentifierWithNode';

export interface IExportInfo {
  isEmpty: boolean;
  resolvedFilePath: string;
  resolvedDirPath: string;
  relativeFilePath: string;
  depth: number;
  starExported: boolean;
  defaultExport?: IIdentifierWithNode;
  namedExports: IIdentifierWithNode[];
}
