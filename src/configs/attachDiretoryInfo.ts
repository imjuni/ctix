import getTypeScriptConfig from '@compilers/getTypeScriptConfig';
import defaultIgnoreFileName from '@configs/defaultIgnoreFileName';
import getSourceFileEol from '@configs/getSourceFileEol';
import IDirectoryInfo from '@configs/interfaces/IDirectoryInfo';
import {
  TCreateOption,
  TInitOption,
  TRemoveOption,
  TSingleOption,
} from '@configs/interfaces/IOption';
import getDepth from '@tools/getDepth';
import findUp from 'find-up';
import { isEmpty, settify } from 'my-easy-fp';
import { existsSync, getDirnameSync, replaceSepToPosix } from 'my-node-fp';
import path from 'path';

function getCustomIgnoreFile(option: TCreateOption | TSingleOption) {
  if (option.ignoreFile === undefined || option.ignoreFile === null) {
    return defaultIgnoreFileName;
  }

  const resolvedIgnoreFilePath = path.resolve(option.ignoreFile);

  if (existsSync(resolvedIgnoreFilePath)) {
    return resolvedIgnoreFilePath;
  }

  if (option.ignoreFile === defaultIgnoreFileName) {
    const findUpResultIgnoreFile = findUp.sync(option.ignoreFile);
    const nonNullableIgnoreFile = findUpResultIgnoreFile ?? defaultIgnoreFileName;

    if (existsSync(nonNullableIgnoreFile)) {
      return nonNullableIgnoreFile;
    }

    return defaultIgnoreFileName;
  }

  return defaultIgnoreFileName;
}

function getStartAtDir(startAtArgs: string | undefined, projectDirPath: string) {
  if (isEmpty(startAtArgs)) {
    return replaceSepToPosix(projectDirPath);
  }

  if (path.isAbsolute(startAtArgs)) {
    return replaceSepToPosix(startAtArgs);
  }

  // src가 absolute path가 아니라면 projectDirPath에서 찾아야함,
  // 안그러면 엉뚱한데서 찾음
  if (startAtArgs.startsWith('.')) {
    return replaceSepToPosix(path.resolve(path.join(projectDirPath, startAtArgs)));
  }

  const filePath =
    findUp.sync(startAtArgs, { cwd: projectDirPath, type: 'directory' }) ?? projectDirPath;
  const startAt = replaceSepToPosix(path.resolve(filePath));

  return startAt;
}

export default function attachDiretoryInfo<
  T extends TCreateOption | TSingleOption | TRemoveOption | TInitOption,
>(option: T): T & IDirectoryInfo {
  const project = replaceSepToPosix(path.resolve(option.project));
  const tsconfig = getTypeScriptConfig(option.project);

  const topDirDepth = tsconfig.fileNames
    .map((filePath) => {
      const dirPath = replaceSepToPosix(path.resolve(getDirnameSync(filePath)));
      return {
        filePaths: [dirPath],
        depth: getDepth(dirPath),
      };
    })
    .reduce(
      (minDepth, depth) => {
        if (minDepth.depth > depth.depth) {
          return { ...depth, filePaths: settify(minDepth.filePaths.concat(depth.filePaths)) };
        }

        if (minDepth.depth === depth.depth) {
          return { ...minDepth, filePaths: settify(minDepth.filePaths.concat(depth.filePaths)) };
        }

        return minDepth;
      },
      {
        filePaths: [],
        depth: Number.MAX_SAFE_INTEGER,
      },
    );

  const eol = getSourceFileEol([...tsconfig.fileNames].slice(0, 30));

  const resolvedIgnoreFilePath =
    option.mode === 'create' || option.mode === 'single'
      ? getCustomIgnoreFile(option)
      : defaultIgnoreFileName;

  const resolvedProjectDirPath = replaceSepToPosix(getDirnameSync(project));

  return {
    ...{ ...option, startAt: getStartAtDir(option.startAt, resolvedProjectDirPath) },
    eol,
    topDirs: topDirDepth.filePaths,
    topDirDepth: 0,
    resolvedProjectDirPath,
    resolvedProjectFilePath: project,
    resolvedIgnoreFilePath,
  };
}
