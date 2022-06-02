import getIgnoreConfigContents from '@ignores/getIgnoreConfigContents';
import getIgnoreConfigFiles from '@ignores/getIgnoreConfigFiles';
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
    [posixJoin(env.exampleType04Path, 'fast-maker/ChildlikeCls.ts')]: '*',
    [posixJoin(env.exampleType04Path, 'fast-maker/FlakyCls.ts')]: '*',
    [posixJoin(env.exampleType04Path, 'fast-maker/WhisperingCls.ts')]: '*',
    [posixJoin(env.exampleType04Path, 'fast-maker/carpenter/DiscussionCls.ts')]: '*',
    [posixJoin(env.exampleType04Path, 'fast-maker/carpenter/MakeshiftCls.ts')]: '*',
    [posixJoin(env.exampleType04Path, 'juvenile/TriteCls.ts')]: '*',
    [posixJoin(env.exampleType04Path, 'juvenile/spill/ExperienceCls.ts')]: '*',
    [posixJoin(env.exampleType04Path, 'wellmade/FlakyCls.ts')]: '*',
    [posixJoin(env.exampleType04Path, 'wellmade/WhisperingCls.ts')]: '*',
  };

  expect(result).toEqual(expectation);
});
