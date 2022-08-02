import ICommonCliOption from '@configs/interfaces/ICommonCliOption';
import ICreateSingleCommonCliOption from '@configs/interfaces/ICreateSingleCommonCliOption';
import IDirectoryInfo from '@configs/interfaces/IDirectoryInfo';
import IOnlyCreateCliOption from '@configs/interfaces/IOnlyCreateCliOption';
import IOnlyRemoveCliOption from '@configs/interfaces/IOnlyRemoveCliOption';
import IOnlySingleCliOption from '@configs/interfaces/IOnlySingleCliOption';

export type TCreateOption = ICommonCliOption & ICreateSingleCommonCliOption & IOnlyCreateCliOption;
export type TCreateOptionWithDirInfo = TCreateOption & IDirectoryInfo;

export type TSingleOption = ICommonCliOption & ICreateSingleCommonCliOption & IOnlySingleCliOption;
export type TSingleOptionWithDirInfo = TSingleOption & IDirectoryInfo;

export type TRemoveOption = ICommonCliOption & IOnlyRemoveCliOption;
export type TRemoveOptionWithDirInfo = TRemoveOption & IDirectoryInfo;

export type TInitOption = { mode: 'init' } & ICommonCliOption &
  Omit<ICreateSingleCommonCliOption, 'mode'> &
  Omit<IOnlyCreateCliOption, 'mode'> &
  Omit<IOnlySingleCliOption, 'mode'> &
  Omit<IOnlyRemoveCliOption, 'mode' | 'e'>;
export type TTInitOptionWithDirInfo = Omit<
  TInitOption,
  'p' | 'f' | 's' | 'm' | 't' | 'q' | 'b' | 'k' | 'e' | 'o' | 'r'
> &
  IDirectoryInfo;

export type TCreateOrSingleOption = TCreateOptionWithDirInfo | TSingleOptionWithDirInfo;
