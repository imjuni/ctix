import getIgnoreConfigContents from '@ignores/getIgnoreConfigContents';
import getRefineIgnorePath from '@ignores/getRefineIgnorePath';
import { first } from 'my-easy-fp';
import { AsyncReturnType } from 'type-fest';

export default function getCtiIgnorePattern(
  ig: AsyncReturnType<typeof getIgnoreConfigContents>,
  filePath: string,
) {
  // stage 00. refine filePath
  const refinedFilePath = getRefineIgnorePath(filePath);

  // stage 03. check ctiignore, if match partial return false
  // ignores function cache match result, so full-match create cache that is enhance performance
  // ignores는 매치 결과를 캐시하기 때문에 아래처럼 전체로 결과를 매치해준다
  if (ig.cti.ignores(refinedFilePath)) {
    const detailIgnoreds = ig.data.cti.withValue
      .map((withValue) => ({
        ignored: withValue.ignore.ignores(refinedFilePath),
        ...withValue,
      }))
      .filter((ignored) => ignored.ignored);

    // detailIgnoreds가 1개 이상이라면 사실 ignore 파일 설계가 잘못된 것이라서 warning을 해주는게 필요하다
    const ignored = first(detailIgnoreds);

    return {
      pattern: ignored.pattern,
      matcher: (statement: string) => {
        if (ignored.type === 'wildcard' && ignored.pattern === '*') {
          return true;
        }

        if (ignored.type === 'wildcard') {
          return ignored.pattern === statement;
        }

        return ignored.patternMatcher.ignores(statement);
      },
    };
  }

  return { pattern: undefined, matcher: () => false };
}
