import getIgnoreConfigFiles from '@ignores/getIgnoreConfigFiles';
import * as env from '@testenv/env';
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
