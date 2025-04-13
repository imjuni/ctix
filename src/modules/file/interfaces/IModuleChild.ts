import type { IExportStatement } from '#/compilers/interfaces/IExportStatement';

export interface IModuleChild {
  kind: 'child';
  name: string;
  path: string;
  parent: string;
  isSkip: boolean;
  children: IModuleChild[];
  statements: IExportStatement[];
}
