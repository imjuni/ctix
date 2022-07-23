import {
  TCreateOption,
  TInitOption,
  TRemoveOption,
  TSingleOption,
} from '@configs/interfaces/IOption';
import { Argv } from 'yargs';

export default function singleBuilder<
  T extends TRemoveOption | TCreateOption | TInitOption | TSingleOption,
>(args: Argv<T>) {
  args.option('skipEmptyDir', {
    alias: 'e',
    describe: 'If set true this option, skip empty directory',
    type: 'boolean',
    default: true,
  });

  return args;
}
