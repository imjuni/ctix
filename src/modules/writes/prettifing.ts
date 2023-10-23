import prettier, { type Options } from 'prettier';

export async function prettifing(
  project: string,
  contents: string,
  options?: Options,
): Promise<{ apply: boolean; contents: string }> {
  try {
    if (options != null) {
      const prettiered = await prettier.format(contents, options);
      return { apply: true, contents: prettiered };
    }

    const resolved = await prettier.resolveConfig(project, {
      editorconfig: true,
    });

    if (resolved != null) {
      const prettiered = await prettier.format(contents, options);
      return { apply: true, contents: prettiered };
    }

    return { apply: false, contents };
  } catch (catched) {
    return { apply: false, contents };
  }
}
