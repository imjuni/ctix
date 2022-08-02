import defaultIgnoreFileName from '@configs/defaultIgnoreFileName';
import getEmptyDescendantTree from '@ignores/getEmptyDescendantTree';
import getIgnoreConfigContents from '@ignores/getIgnoreConfigContents';
import getIgnoreConfigFiles from '@ignores/getIgnoreConfigFiles';
import { bootstrap as gitignoreBootstrap } from '@ignores/gitignore';
import * as env from '@testenv/env';
import { posixJoin } from '@tools/misc';
import consola, { LogLevel } from 'consola';

beforeAll(() => {
  consola.level = LogLevel.Debug;
});

test('getIgnoreFiles', async () => {
  const projectPath = env.exampleType04Path;

  const ignoreFilePath = posixJoin(projectPath, '.ctiignore_another_name');
  const result = await getIgnoreConfigFiles(projectPath, ignoreFilePath);

  const expectation = {
    cti: posixJoin(projectPath, '.ctiignore_another_name'),
    git: posixJoin(projectPath, '.gitignore'),
    npm: posixJoin(projectPath, '.npmignore'),
  };

  expect(result).toEqual(expectation);
});

test('getIgnoreConfigContents', async () => {
  const projectPath = env.exampleType04Path;

  const ignoreFilePath = posixJoin(projectPath, '.ctiignore_another_name');
  const ignoreFiles = await getIgnoreConfigFiles(projectPath, ignoreFilePath);
  const result = await getIgnoreConfigContents({
    cwd: projectPath,
    ...ignoreFiles,
  });

  consola.debug(result);

  const expectation = {
    origin: {
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

  const ignoreFilePath = posixJoin(projectPath, defaultIgnoreFileName);
  await gitignoreBootstrap(posixJoin(projectPath, '.gitignore'));

  const ignoreFiles = await getIgnoreConfigFiles(projectPath, ignoreFilePath);
  const ignoreContents = await getIgnoreConfigContents({
    cwd: projectPath,
    ...ignoreFiles,
  });

  const result = await getEmptyDescendantTree({
    cwd: projectPath,
    ignoreFilePath,
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

  const ignoreFilePath = posixJoin(projectPath, '.ctiignore_another_name');
  await gitignoreBootstrap(posixJoin(projectPath, '.gitignore'));

  const ignoreFiles = await getIgnoreConfigFiles(projectPath, ignoreFilePath);
  const ignoreContents = await getIgnoreConfigContents({
    cwd: projectPath,
    ...ignoreFiles,
  });

  const result = await getEmptyDescendantTree({
    cwd: projectPath,
    ignoreFilePath,
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

  const ignoreFilePath = posixJoin(projectPath, defaultIgnoreFileName);
  await gitignoreBootstrap(posixJoin(projectPath, '.gitignore'));

  const ignoreFiles = await getIgnoreConfigFiles(projectPath, ignoreFilePath);
  const ignoreContents = await getIgnoreConfigContents({
    cwd: projectPath,
    ...ignoreFiles,
  });

  const result = await getEmptyDescendantTree({
    cwd: projectPath,
    ignoreFilePath,
    ignores: ignoreContents.evaluated,
  });

  const expectation = {
    [posixJoin(projectPath, 'fast-maker/__tests__')]: '*',
  };

  expect(result).toEqual(expectation);
});
