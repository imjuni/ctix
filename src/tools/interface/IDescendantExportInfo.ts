import IExportInfo from '@compilers/interfaces/IExportInfo';

export default interface IDescendantExportInfo {
  dirPath: string;
  depth: number;
  isTerminal: boolean;
  exportInfos: IExportInfo[];
}
