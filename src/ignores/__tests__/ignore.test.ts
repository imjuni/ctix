import getEmptyDescendantTree from '@ignores/getEmptyDescendantTree';
import getIgnoreConfigContents from '@ignores/getIgnoreConfigContents';
import getIgnoreConfigFiles from '@ignores/getIgnoreConfigFiles';
import { bootstrap as gitignoreBootstrap } from '@ignores/gitignore';
import * as env from '@testenv/env';
import { posixJoin } from '@tools/misc';
import consola, { LogLevel } from 'consola';
import { replaceSepToPosix } from 'my-node-fp';
import path from 'path';

beforeAll(() => {
  consola.level = LogLevel.Debug;
});

test('getIgnoreFiles', async () => {
  const result = await getIgnoreConfigFiles(env.exampleType04Path);

  const expectation = {
    cti: replaceSepToPosix(path.join(env.exampleType04Path, '.ctiignore')),
    git: replaceSepToPosix(path.join(env.exampleType04Path, '.gitignore')),
    npm: replaceSepToPosix(path.join(env.exampleType04Path, '.npmignore')),
  };

  expect(result).toEqual(expectation);
});

test('getIgnoreConfigContents', async () => {
  const ignoreFiles = await getIgnoreConfigFiles(env.exampleType04Path);
  const result = await getIgnoreConfigContents({
    cwd: env.exampleType04Path,
    ...ignoreFiles,
  });

  consola.debug(result);

  const expectation = {
    origin: {
      '**/__tests__/*': '*',
      'juvenile/**': '*',
      'wellmade/FlakyCls.ts': '*',
      'wellmade/WhisperingCls.ts': '*',
      'wellmade/ChildlikeCls.ts': ['transfer', 'stomach'],
    },
    evaluated: {
      [posixJoin(env.exampleType04Path, 'fast-maker', 'ChildlikeCls.ts')]: '*',
      [posixJoin(env.exampleType04Path, 'fast-maker', 'FlakyCls.ts')]: '*',
      [posixJoin(env.exampleType04Path, 'fast-maker', 'WhisperingCls.ts')]: '*',
      [posixJoin(env.exampleType04Path, 'fast-maker', 'carpenter', 'DiscussionCls.ts')]: '*',
      [posixJoin(env.exampleType04Path, 'fast-maker', 'carpenter', 'MakeshiftCls.ts')]: '*',
      [posixJoin(env.exampleType04Path, 'fast-maker', '__tests__', 'juvenile.test.ts')]: '*',
      [posixJoin(env.exampleType04Path, 'juvenile', 'TriteCls.ts')]: '*',
      [posixJoin(env.exampleType04Path, 'juvenile', 'spill', 'ExperienceCls.ts')]: '*',
      [posixJoin(env.exampleType04Path, 'wellmade', 'ChildlikeCls.ts')]: ['transfer', 'stomach'],
      [posixJoin(env.exampleType04Path, 'wellmade', 'FlakyCls.ts')]: '*',
      [posixJoin(env.exampleType04Path, 'wellmade', 'WhisperingCls.ts')]: '*',
    },
  };

  expect(result).toEqual(expectation);
});

test('getEmptyDescendantTree-case01', async () => {
  const projectPath = env.exampleType02Path;
  await gitignoreBootstrap(posixJoin(projectPath, '.gitignore'));

  const ignoreFiles = await getIgnoreConfigFiles(projectPath);
  const ignoreContents = await getIgnoreConfigContents({
    cwd: projectPath,
    ...ignoreFiles,
  });

  const result = await getEmptyDescendantTree({
    cwd: projectPath,
    ignores: ignoreContents.evaluated,
  });

  const expectation = {
    [posixJoin(projectPath, 'juvenile')]: '*',
    [posixJoin(projectPath, 'juvenile', 'spill')]: '*',
    [posixJoin(projectPath, 'juvenile', '__tests__')]: '*',
    [posixJoin(projectPath, 'wellmade', '__tests__')]: '*',
  };

  expect(result).toEqual(expectation);
});

test('getEmptyDescendantTree-case02', async () => {
  const projectPath = env.exampleType04Path;
  await gitignoreBootstrap(posixJoin(projectPath, '.gitignore'));

  const ignoreFiles = await getIgnoreConfigFiles(projectPath);
  const ignoreContents = await getIgnoreConfigContents({
    cwd: projectPath,
    ...ignoreFiles,
  });

  const result = await getEmptyDescendantTree({
    cwd: projectPath,
    ignores: ignoreContents.evaluated,
  });

  const expectation = {
    [posixJoin(projectPath, 'juvenile')]: '*',
    [posixJoin(projectPath, 'juvenile', 'spill')]: '*',
  };

  expect(result).toEqual(expectation);
});

test('getEmptyDescendantTree-case03', async () => {
  const projectPath = env.exampleType06Path;
  await gitignoreBootstrap(posixJoin(projectPath, '.gitignore'));

  const ignoreFiles = await getIgnoreConfigFiles(projectPath);
  const ignoreContents = await getIgnoreConfigContents({
    cwd: projectPath,
    ...ignoreFiles,
  });

  const result = await getEmptyDescendantTree({
    cwd: projectPath,
    ignores: ignoreContents.evaluated,
  });

  const expectation = {
    [posixJoin(projectPath, 'fast-maker/__tests__')]: '*',
  };

  expect(result).toEqual(expectation);
});
