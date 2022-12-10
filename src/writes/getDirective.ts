import { TCreateOrSingleOption } from '@configs/interfaces/IOption';

export default function getDirective(
  option: Pick<TCreateOrSingleOption, 'useDirective'>,
  eol: string,
): string {
  if (option.useDirective) {
    return `${option.useDirective}${eol}${eol}`;
  }

  return '';
}
