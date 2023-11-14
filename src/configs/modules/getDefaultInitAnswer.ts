import type { IInitQuestionAnswer } from '#/cli/interfaces/IInitQuestionAnswer';
import { CE_CTIX_BUILD_MODE } from '#/configs/const-enum/CE_CTIX_BUILD_MODE';
import { CE_CTIX_DEFAULT_VALUE } from '#/configs/const-enum/CE_CTIX_DEFAULT_VALUE';
import { getTsconfigComparer } from '#/configs/modules/getTsconfigComparer';
import { getGlobFiles } from '#/modules/file/getGlobFiles';
import { defaultExclude } from '#/modules/scope/defaultExclude';
import { Glob } from 'glob';

export async function getDefaultInitAnswer(): Promise<IInitQuestionAnswer> {
  const cwd = process.cwd();
  const glob = new Glob(['**/tsconfig.json', '**/tsconfig.*.json'], {
    cwd,
    ignore: defaultExclude,
  });
  const tsconfigFiles = getGlobFiles(glob);
  const sortedTsconfigFiles = tsconfigFiles.sort(getTsconfigComparer(cwd));
  const tsconfigPath = sortedTsconfigFiles.at(0);

  if (tsconfigPath == null) {
    throw new Error('tsconfig.json file was searched for but not found');
  }

  const answer: IInitQuestionAnswer = {
    cwd,
    tsconfig: [tsconfigPath],
    mode: CE_CTIX_BUILD_MODE.BUNDLE_MODE,
    exportFilename: CE_CTIX_DEFAULT_VALUE.EXPORT_FILENAME,
    overwirte: true,
  };

  return answer;
}
