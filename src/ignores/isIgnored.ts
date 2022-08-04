import getIgnoreConfigContents from '@ignores/getIgnoreConfigContents';
import getRefineIgnorePath from '@ignores/getRefineIgnorePath';
import minimatch from 'minimatch';
import { isFalse } from 'my-easy-fp';
import { AsyncReturnType } from 'type-fest';

export default function isIgnored(
  ignores: AsyncReturnType<typeof getIgnoreConfigContents>,
  filePath: string,
) {
  // stage 00. refine filePath
  const refinedFilePath = getRefineIgnorePath(filePath);

  // stage 01. check gitignore
  if (ignores.git.ignores(refinedFilePath)) {
    return true;
  }

  // stage 02. check npmignore
  if (ignores.npm.map((pattern) => minimatch(filePath, pattern)).some((match) => match)) {
    return true;
  }

  // stage 03. check ctiignore, if match partial return false
  // ignores function cache match result, so full-match create cache that is enhance performance
  // ignores는 매치 결과를 캐시하기 때문에 아래처럼 전체로 결과를 매치해준다
  if (ignores.cti.ignores(refinedFilePath)) {
    const detailIgnoreds = ignores.data.cti.withValue
      .map((withValue) => ({
        ignored: withValue.ignore.ignores(refinedFilePath),
        pattern: withValue.pattern,
      }))
      .filter((ignored) => ignored.ignored);

    return isFalse(detailIgnoreds.some((ignored) => ignored.pattern !== '*'));
  }

  return false;
}
