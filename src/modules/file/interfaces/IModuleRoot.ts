import type { IModuleChild } from '#/modules/file/interfaces/IModuleChild';

export interface IModuleRoot {
  kind: 'root';
  name: string;
  path: string;
  children: IModuleChild[];
}
