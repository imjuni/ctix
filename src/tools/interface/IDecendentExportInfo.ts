import IExportInfo from '@compilers/interfaces/IExportInfo';

export default interface IDecendentExportInfo {
  dirPath: string;
  depth: number;
  isTerminal: boolean;
  exportInfos: IExportInfo[];
}
