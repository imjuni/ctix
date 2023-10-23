import { askInitOptions } from '#/cli/questions/askInitOptions';
import { ProgressBar } from '#/cli/ux/ProgressBar';
import { Reasoner } from '#/cli/ux/Reasoner';
import { Spinner } from '#/cli/ux/Spinner';
import { getFileScope } from '#/compilers/getFileScope';
import { getTypeScriptConfig } from '#/compilers/getTypeScriptConfig';
import { CE_CTIX_DEFAULT_VALUE } from '#/configs/const-enum/CE_CTIX_DEFAULT_VALUE';
import { transformBundleMode } from '#/configs/transforms/transformBundleMode';
import { transformCreateMode } from '#/configs/transforms/transformCreateMode';
import { prettifing } from '#/modules/writes/prettifing';
import { CE_TEMPLATE_NAME } from '#/templates/const-enum/CE_TEMPLATE_NAME';
import { TemplateContainer } from '#/templates/modules/TemplateContainer';
import consola from 'consola';
import { writeFile } from 'node:fs/promises';
import type yargs from 'yargs';

async function initCommandCode(_argv: yargs.ArgumentsCamelCase) {
  await TemplateContainer.bootstrap();
  const answer = await askInitOptions();

  const nestedOptions = await Promise.all(
    answer.tsconfig.map(async (tsconfigPath) => {
      const tsconfig = getTypeScriptConfig(tsconfigPath);
      const { include, exclude } = getFileScope(tsconfig.raw);

      const created = await transformCreateMode(
        {
          project: tsconfigPath,
          exportFilename: answer.exportFilename,
        },
        {
          include,
          exclude,
        },
      );

      const bundled = transformBundleMode(
        {
          project: tsconfigPath,
          exportFilename: answer.exportFilename,
        },
        {
          include,
          exclude,
        },
      );

      return {
        ...created,
        ...bundled,
        include: JSON.stringify(bundled.include),
        exclude: JSON.stringify(bundled.exclude),
        removeBackup: false,
        forceYes: false,
        mode: answer.mode,
      };
    }),
  );

  const renderedNestedOptions = await Promise.all(
    nestedOptions.map(async (option) => {
      const rendered = await TemplateContainer.evaluate(
        CE_TEMPLATE_NAME.NESTED_OPTIONS_TEMPLATE,
        option,
        {
          rmWhitespace: false,
        },
      );

      return rendered;
    }),
  );

  const renderedOptions = await TemplateContainer.evaluate(
    CE_TEMPLATE_NAME.OPTIONS_TEMPLATE,
    {
      config: CE_CTIX_DEFAULT_VALUE.CONFIG_FILENAME,
      spinnerStream: 'stdout',
      progressStream: 'stdout',
      reasonerStream: 'stderr',
      options: renderedNestedOptions.join(',\n'),
    },
    { rmWhitespace: false },
  );

  const prettified = await prettifing(process.cwd(), renderedOptions, {
    parser: 'json',
    endOfLine: 'lf',
  });

  await writeFile('.ctirc', prettified.contents);
}

export async function initCommand(argv: yargs.ArgumentsCamelCase) {
  ProgressBar.it.enable = true;
  Spinner.it.enable = true;
  Reasoner.it.enable = true;

  try {
    await initCommandCode(argv);
  } catch (err) {
    consola.error(err);
  } finally {
    ProgressBar.it.stop();
    Spinner.it.stop();
  }
}
