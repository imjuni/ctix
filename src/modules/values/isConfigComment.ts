import type { IInitQuestionAnswer } from '#/cli/interfaces/IInitQuestionAnswer';

export function isConfigComment(
  answer: Pick<IInitQuestionAnswer, 'configComment' | 'configPosition'>,
) {
  if (answer.configPosition === 'package.json') {
    return false;
  }

  return answer.configComment;
}
