import { atOrUndefined } from 'my-easy-fp';

export function getConfigValue(
  argv: Record<string, unknown>,
  ...keywordArgs: string[]
): string | undefined {
  const keywords = [...keywordArgs];

  if (keywords.length <= 0) {
    return undefined;
  }

  const keys = keywords.find((keyword) => keyword in argv && typeof argv[keyword] === 'string');
  const key = atOrUndefined(keys, 0);

  if (key != null && key in argv && argv[key] != null) {
    const value = argv[key] as string;
    return value;
  }

  return undefined;
}
