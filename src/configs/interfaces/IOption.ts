import ICommonCliOption from '@configs/interfaces/ICommonCliOption';
import ICreateSingleCommonCliOption from '@configs/interfaces/ICreateSingleCommonCliOption';
import IDirectoryInfo from '@configs/interfaces/IDirectoryInfo';
import IOnlyCleanCliOption from '@configs/interfaces/IOnlyCleanCliOption';
import IOnlyCreateCliOption from '@configs/interfaces/IOnlyCreateCliOption';
import IOnlySingleCliOption from '@configs/interfaces/IOnlySingleCliOption';

export type TCreateOption = ICommonCliOption & ICreateSingleCommonCliOption & IOnlyCreateCliOption;
export type TCreateOptionWithDirInfo = TCreateOption & IDirectoryInfo;

export type TSingleOption = ICommonCliOption & ICreateSingleCommonCliOption & IOnlySingleCliOption;
export type TSingleOptionWithDirInfo = TSingleOption & IDirectoryInfo;

export type TCleanOption = ICommonCliOption & IOnlyCleanCliOption;
export type TCleanOptionWithDirInfo = TCleanOption & IDirectoryInfo;

export type TInitOption = ICommonCliOption & ICreateSingleCommonCliOption & IOnlyCleanCliOption;
export type TTInitOptionWithDirInfo = TInitOption & IDirectoryInfo;

export type TCreateOrSingleOption = TCreateOptionWithDirInfo | TSingleOptionWithDirInfo;
