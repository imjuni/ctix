import { CE_CTIX_DEFAULT_VALUE } from '#/configs/const-enum/CE_CTIX_DEFAULT_VALUE';
import { getConfigValue } from '#/configs/getConfigValue';
import findUp from 'find-up';
import { existsSync, getDirnameSync } from 'my-node-fp';

export function getConfigFilePath(argv: Record<string, string>, projectPath?: string) {
  const fromArgv = getConfigValue(argv, 'c', 'config');

  if (fromArgv != null && existsSync(fromArgv)) {
    return fromArgv;
  }

  const fromSearchOnResultOnCwd = findUp.sync(CE_CTIX_DEFAULT_VALUE.CONFIG_FILENAME);

  if (fromSearchOnResultOnCwd != null && existsSync(fromSearchOnResultOnCwd)) {
    return fromSearchOnResultOnCwd;
  }

  const projectDirPath = projectPath != null ? getDirnameSync(projectPath) : undefined;
  const fromSearchOnProjectDir =
    projectDirPath != null
      ? findUp.sync(CE_CTIX_DEFAULT_VALUE.CONFIG_FILENAME, { cwd: projectDirPath })
      : undefined;

  if (fromSearchOnProjectDir != null && existsSync(fromSearchOnProjectDir)) {
    return fromSearchOnProjectDir;
  }

  return undefined;
}
