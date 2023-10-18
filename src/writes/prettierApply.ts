import prettier from 'prettier';

export async function prettierApply(
  project: string,
  contents: string,
): Promise<{ apply: boolean; contents: string }> {
  try {
    const option = await prettier.resolveConfig(project, {
      editorconfig: true,
    });

    if (option != null && option.parser === 'typescript') {
      const prettiered = await prettier.format(contents, option);
      return { apply: true, contents: prettiered };
    }

    return { apply: false, contents };
  } catch (catched) {
    return { apply: false, contents };
  }
}
