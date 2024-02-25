import type { TBundleOptions } from '#/configs/interfaces/TBundleOptions';
import type { TCommandBuildArgvOptions } from '#/configs/interfaces/TCommandBuildArgvOptions';
import type { TCommandRemoveOptions } from '#/configs/interfaces/TCommandRemoveOptions';
import type { TCreateOptions } from '#/configs/interfaces/TCreateOptions';
import { posixJoin } from '#/modules/path/modules/posixJoin';
import { posixResolve } from '#/modules/path/modules/posixResolve';
import { getDirname } from 'my-node-fp';
import type yargs from 'yargs';

interface IGetRemoveFileGlobPatternReturn {
  origin: string;
  project: string;
  pattern: string;
}

export async function getRemoveFileGlobPattern(
  argv: Pick<
    yargs.ArgumentsCamelCase<TCommandRemoveOptions & TCommandBuildArgvOptions>,
    'exportFilename' | 'removeBackup'
  >,
  options: (
    | Pick<TCreateOptions, 'project' | 'exportFilename'>
    | Pick<TBundleOptions, 'project' | 'exportFilename'>
  )[],
): Promise<IGetRemoveFileGlobPatternReturn[]> {
  const dirs = (
    await Promise.all(
      options.map(async (modeOption) => {
        const dir = await getDirname(modeOption.project);

        const results: IGetRemoveFileGlobPatternReturn[] = [
          {
            origin: dir,
            project: modeOption.project,
            pattern: posixJoin(
              posixResolve(dir),
              '**',
              argv.exportFilename ?? modeOption.exportFilename,
            ),
          },
        ];

        if (argv.removeBackup) {
          results.push({
            origin: dir,
            project: modeOption.project,
            pattern: posixJoin(
              posixResolve(dir),
              '**',
              argv.exportFilename != null
                ? `${argv.exportFilename}.bak`
                : `${modeOption.exportFilename}.bak`,
            ),
          });
        }

        return results;
      }),
    )
  ).flat();

  return dirs;
}
