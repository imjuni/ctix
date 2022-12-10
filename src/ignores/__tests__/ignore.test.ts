import getIgnoreConfigContents from '@ignores/getIgnoreConfigContents';
import getIgnoreConfigFiles from '@ignores/getIgnoreConfigFiles';
import * as env from '@testenv/env';
import { getTestValue, posixJoin } from '@tools/misc';
import path from 'path';

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

test('case001.getIgnoreConfigContents', async () => {
  const projectPath = env.exampleType04Path;
  const ignoreFilePath = posixJoin(projectPath, '.ctiignore_another_name');

  const ignoreFiles = await getIgnoreConfigFiles(projectPath, ignoreFilePath);
  const result = await getIgnoreConfigContents({ cwd: projectPath, ...ignoreFiles });
  const expectation = await import(path.join(__dirname, 'expects', 'case001.ts'));

  expect(getTestValue(result)).toMatchObject(expectation.default);
});
