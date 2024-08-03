export function getConfigObject(
  argv: Record<string, unknown>,
  ...keywordArgs: string[]
): Record<string, unknown> | undefined {
  const keywords = [...keywordArgs];
  const keys = keywords.filter((keyword) => keyword in argv && argv[keyword] != null);

  if (keys.length <= 0) {
    return undefined;
  }

  const aggregated = keys.reduce<Record<string, unknown>>((obj, key) => {
    return { ...obj, [key]: argv[key] };
  }, {});

  return aggregated;
}
