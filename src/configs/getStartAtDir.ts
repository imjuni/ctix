import findUp from 'find-up';
import isRelative from 'is-relative';
import { replaceSepToPosix } from 'my-node-fp';
import path from 'path';

export default function getStartAtDir(startAtArgs: string | undefined, projectDirPath: string) {
  if (startAtArgs == null) {
    return replaceSepToPosix(projectDirPath);
  }

  if (path.isAbsolute(startAtArgs)) {
    return replaceSepToPosix(startAtArgs);
  }

  // If the `startAt` directory(eg. lib, src, etc ...) is not an absolute path,
  // use `projectDirPath` as the default path
  if (isRelative(startAtArgs) === true) {
    return replaceSepToPosix(path.resolve(path.join(projectDirPath, startAtArgs)));
  }

  const filePath =
    findUp.sync(startAtArgs, { cwd: projectDirPath, type: 'directory' }) ?? projectDirPath;
  const startAt = replaceSepToPosix(path.resolve(filePath));

  return startAt;
}
