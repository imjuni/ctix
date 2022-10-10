import { TInitOption } from '@configs/interfaces/IOption';
import { existsSync } from 'my-node-fp';
import path from 'path';
import yargs from 'yargs';

export default function isValidConfig(argv: yargs.Arguments<TInitOption>) {
  // check project file exits
  const { project } = argv;
  if (existsSync(path.resolve(project)) === false) {
    throw new Error(`Invalid project path: ${path.resolve(project)}`);
  }

  return true;
}
