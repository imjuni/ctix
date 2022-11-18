import tsMorphProjectOption from '@compilers/tsMorphProjectOption';
import { TSingleOptionWithDirInfo } from '@configs/interfaces/IOption';
import * as env from '@testenv/env';
import { posixJoin } from '@tools/misc';
import getOutputDir from '@writes/getOutputDir';
import 'jest';
import path from 'path';
import * as tsm from 'ts-morph';

const share: {
  project02Path: string;
  project02: tsm.Project;
  project03Path: string;
  project03: tsm.Project;
} = {} as any;

beforeAll(() => {
  share.project02Path = posixJoin(env.exampleType02Path, 'tsconfig.json');
  share.project02 = new tsm.Project({
    tsConfigFilePath: share.project02Path,
    ...tsMorphProjectOption,
  });

  share.project03Path = posixJoin(env.exampleType03Path, 'tsconfig.json');
  share.project03 = new tsm.Project({
    tsConfigFilePath: share.project03Path,
    ...tsMorphProjectOption,
  });
});

test('getOutputDir', async () => {
  const projectPath = env.exampleType03Path;
  // option modify for expectation
  const option: TSingleOptionWithDirInfo = {
    ...env.singleOptionWithDirInfo,
    keepFileExt: false,
    project: projectPath,
    output: projectPath,
    startAt: projectPath,
    topDirs: [projectPath],
  };

  const outputDirCase01 = getOutputDir(share.project02, option);
  expect(outputDirCase01).toEqual(projectPath);

  const outputDirCase02 = getOutputDir(share.project02, { ...option, useRootDir: false });
  expect(outputDirCase02).toEqual(projectPath);
});

test('getOutputDir useRootDir', async () => {
  const projectPath = env.exampleType03Path;
  // option modify for expectation
  const option: TSingleOptionWithDirInfo = {
    ...env.singleOptionWithDirInfo,
    keepFileExt: false,
    useRootDir: true,
    project: projectPath,
    output: projectPath,
    startAt: projectPath,
    topDirs: [projectPath],
  };

  const outputDir = getOutputDir(share.project02, option);
  expect(outputDir).toEqual(projectPath);
});

test('getOutputDir useRootDir with tsconfig rootDir', async () => {
  const projectPath = env.exampleType02Path;
  // option modify for expectation
  const option: TSingleOptionWithDirInfo = {
    ...env.singleOptionWithDirInfo,
    keepFileExt: false,
    useRootDir: true,
    project: projectPath,
    output: projectPath,
    startAt: projectPath,
    topDirs: [projectPath],
  };

  const juvenileDir = path.join(env.exampleType02Path, 'juvenile');
  share.project02.compilerOptions.set({ rootDir: juvenileDir });

  const outputDir = getOutputDir(share.project02, option);
  expect(outputDir).toEqual(juvenileDir);
});

test('getOutputDir useRootDir === tsconfig rootDir', async () => {
  const projectPath = env.exampleType02Path;
  const juvenileDir = path.join(env.exampleType02Path, 'juvenile');

  // option modify for expectation
  const option: TSingleOptionWithDirInfo = {
    ...env.singleOptionWithDirInfo,
    keepFileExt: false,
    useRootDir: true,
    project: projectPath,
    output: juvenileDir,
    startAt: projectPath,
    topDirs: [projectPath],
  };

  share.project02.compilerOptions.set({ rootDir: juvenileDir });

  const outputDir = getOutputDir(share.project02, option);
  expect(outputDir).toEqual(juvenileDir);
});

test('getOutputDir useRootDir with tsconfig rootDirs', async () => {
  const projectPath = env.exampleType03Path;
  // option modify for expectation
  const option: TSingleOptionWithDirInfo = {
    ...env.singleOptionWithDirInfo,
    keepFileExt: false,
    useRootDir: true,
    project: projectPath,
    output: projectPath,
    startAt: projectPath,
    topDirs: [projectPath],
  };

  const juvenileDir = path.join(env.exampleType03Path, 'juvenile');
  const wellmadeDir = path.join(env.exampleType03Path, 'wellmade');
  share.project03.compilerOptions.set({ rootDirs: [wellmadeDir, juvenileDir] });

  const outputDir = getOutputDir(share.project03, option);
  expect(outputDir).toEqual(wellmadeDir);
});
