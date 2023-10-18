import type { IExportInfo } from '#/compilers/interfaces/IExportInfo';

export interface IDescendantExportInfo {
  dirPath: string;
  depth: number;
  isTerminal: boolean;
  exportInfos: IExportInfo[];
}
