import { TCreateOrSingleOption } from '@configs/interfaces/IOption';
import dayjs from 'dayjs';

export default function getFirstLineComment(
  option: Pick<TCreateOrSingleOption, 'useComment' | 'useTimestamp'>,
  eol: string,
  todayArgs?: dayjs.Dayjs,
): string {
  const today = todayArgs ?? dayjs();

  if (option.useComment && option.useTimestamp) {
    return `// created from ctix ${today.format('YYYY-MM-DD HH:mm:ss')}${eol}${eol}`;
  }

  if (option.useComment) {
    return `// created from ctix${eol}${eol}`;
  }

  if (option.useTimestamp) {
    return `// ${today.format('YYYY-MM-DD HH:mm:ss')}${eol}${eol}`;
  }

  return '';
}
