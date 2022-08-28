import getIgnoreConfigContents from '@ignores/getIgnoreConfigContents';
import getIgnoreConfigFiles from '@ignores/getIgnoreConfigFiles';
import * as env from '@testenv/env';
import { posixJoin } from '@tools/misc';

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

  expect(result).toMatchSnapshot();
});
