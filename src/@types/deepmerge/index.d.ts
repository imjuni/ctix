import { all } from 'deepmerge';

declare interface IDeepMergeOption {
  clone: boolean;
}

declare function merge<S1, S2>(
  orgin: S1,
  merged: S2,
  option?: IDeepMergeOption,
): Partial<S1 & S2>;

declare namespace merge {
  function all<S1, S2>(orgin: S1, merged: S2, option?: IDeepMergeOption): Partial<S1 & S2>;
}

export = merge;
