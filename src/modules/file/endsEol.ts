import { populate } from 'my-easy-fp';

export function endsEol(content: string, eol: string, size?: number): string {
  if (content.endsWith(eol)) {
    return content;
  }

  const multiplier = size ?? 1;
  const eols = populate(multiplier)
    .map(() => eol)
    .join('');
  return `${content}${eols}`;
}
