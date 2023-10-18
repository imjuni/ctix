import type { TCreateOrSingleOption } from '#/configs/interfaces/IOption';

export function getDirective(
  option: Pick<TCreateOrSingleOption, 'useDirective'>,
  eol: string,
): string {
  if (option.useDirective) {
    return `${option.useDirective}${eol}${eol}`;
  }

  return '';
}
