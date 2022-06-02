import getCtiignoreFiles from '@ignores/getCtiignoreFiles';
import getGitignoreFiles from '@ignores/getGitignoreFiles';
import type { IGetIgnoreConfigFiles } from '@ignores/getIgnoreConfigFiles';
import IGetIgnoredConfigContents from '@ignores/interfaces/IGetIgnoredConfigContents';
import { isEmpty } from 'my-easy-fp';

export default async function getIgnoreConfigContents({
  git,
  npm,
  cti,
  cwd,
}: IGetIgnoreConfigFiles & { cwd: string }): Promise<IGetIgnoredConfigContents> {
  const gitignoreRecord = await getGitignoreFiles(cwd, git);
  const npmignoreRecord = await getGitignoreFiles(cwd, npm);
  const ctiignoreRecord = await getCtiignoreFiles(cwd, cti);

  const ignoreConfigContents = Object.entries(gitignoreRecord)
    .concat(Object.entries(npmignoreRecord))
    .concat(Object.entries(ctiignoreRecord))
    .reduce<IGetIgnoredConfigContents>((aggregation, file) => {
      const [key, value] = file;

      if (isEmpty(aggregation[key])) {
        return { ...aggregation, [key]: value };
      }

      return { ...aggregation, [key]: Array.from(new Set([...aggregation[key], ...value])) };
    }, {});

  return ignoreConfigContents;
}
