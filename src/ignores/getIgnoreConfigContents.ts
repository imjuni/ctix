import getCtiignoreFiles from '@ignores/getCtiignoreFiles';
import getGitignoreFiles from '@ignores/getGitignoreFiles';
import type { IGetIgnoreConfigFiles } from '@ignores/getIgnoreConfigFiles';
import getNpmignoreFiles from '@ignores/getNpmignoreFiles';
import { Ignore } from 'ignore';
import { AsyncReturnType } from 'type-fest';

interface IGetIgnoreConfigContentsReturn {
  git: Ignore;
  cti: Ignore;
  npm: string[];

  data: {
    git: AsyncReturnType<typeof getGitignoreFiles>;
    npm: AsyncReturnType<typeof getNpmignoreFiles>;
    cti: AsyncReturnType<typeof getCtiignoreFiles>;
  };
}

export default async function getIgnoreConfigContents({
  git,
  npm,
  cti,
}: IGetIgnoreConfigFiles & { cwd: string }): Promise<IGetIgnoreConfigContentsReturn> {
  const gitignoreRecord = await getGitignoreFiles(git);
  const npmignoreRecord = await getNpmignoreFiles(npm);
  const ctiignoreRecord = await getCtiignoreFiles(cti);

  return {
    git: gitignoreRecord.ignore,
    cti: ctiignoreRecord.ignore,
    npm: npmignoreRecord.patterns,

    data: {
      git: gitignoreRecord,
      cti: ctiignoreRecord,
      npm: npmignoreRecord,
    },
  };
}
