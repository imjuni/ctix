import { getCtiignoreFiles } from '#/ignores/getCtiignoreFiles';
import { getGitignoreFiles } from '#/ignores/getGitignoreFiles';
import type { IGetIgnoreConfigFiles } from '#/ignores/getIgnoreConfigFiles';
import { getNpmignoreFiles } from '#/ignores/getNpmignoreFiles';
import type { Ignore } from 'ignore';
import type { AsyncReturnType } from 'type-fest';

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

export async function getIgnoreConfigContents({
  git,
  npm,
  cti,
  cwd,
}: IGetIgnoreConfigFiles & { cwd: string }): Promise<IGetIgnoreConfigContentsReturn> {
  const gitignoreRecord = await getGitignoreFiles(git);
  const npmignoreRecord = await getNpmignoreFiles(npm);
  const ctiignoreRecord = await getCtiignoreFiles(cwd, cti);

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
