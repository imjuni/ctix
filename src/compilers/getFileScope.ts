export function getFileScope(tsconfig: unknown) {
  const getInclude = () => {
    if (
      typeof tsconfig === 'object' &&
      tsconfig != null &&
      'include' in tsconfig &&
      tsconfig.include != null
    ) {
      return tsconfig.include as string[];
    }

    return [];
  };

  const getExclude = () => {
    if (
      typeof tsconfig === 'object' &&
      tsconfig != null &&
      'exclude' in tsconfig &&
      tsconfig.exclude != null
    ) {
      return tsconfig.exclude as string[];
    }

    return [];
  };

  return {
    include: getInclude(),
    exclude: getExclude(),
  };
}
