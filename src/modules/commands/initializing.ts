import { askInitOptions } from '#/cli/questions/askInitOptions';
import { Spinner } from '#/cli/ux/Spinner';
import { getFileScope } from '#/compilers/getFileScope';
import { getTypeScriptConfig } from '#/compilers/getTypeScriptConfig';
import { CE_CTIX_BUILD_MODE } from '#/configs/const-enum/CE_CTIX_BUILD_MODE';
import { CE_CTIX_DEFAULT_VALUE } from '#/configs/const-enum/CE_CTIX_DEFAULT_VALUE';
import type { TCommandInitOptions } from '#/configs/interfaces/TCommandInitOptions';
import { getDefaultInitAnswer } from '#/configs/modules/getDefaultInitAnswer';
import { safeJsonc } from '#/configs/modules/json/safeJsonc';
import { transformBundleMode } from '#/configs/transforms/transformBundleMode';
import { transformCreateMode } from '#/configs/transforms/transformCreateMode';
import { posixJoin } from '#/modules/path/modules/posixJoin';
import { prettifing } from '#/modules/writes/prettifing';
import { CE_TEMPLATE_NAME } from '#/templates/const-enum/CE_TEMPLATE_NAME';
import { TemplateContainer } from '#/templates/modules/TemplateContainer';
import chalk from 'chalk';
import { exists } from 'my-node-fp';
import fs from 'node:fs';
import type { PackageJson, TsConfigJson } from 'type-fest';

export async function initializing(option: TCommandInitOptions) {
  await TemplateContainer.bootstrap();

  const answer = option.forceYes ? await getDefaultInitAnswer() : await askInitOptions();

  if (!answer.overwirte) {
    const optionFilePath = posixJoin(answer.cwd, CE_CTIX_DEFAULT_VALUE.CONFIG_FILENAME);
    Spinner.it.fail(`${chalk.yellow(optionFilePath)} already exists`);
    return;
  }

  Spinner.it.start(`Start ${chalk.yellow('.ctirc')} file creation ...`);

  const nestedOptions = await Promise.all(
    answer.tsconfig.map(async (tsconfigPath) => {
      Spinner.it.update(`Start option creation for: ${chalk.yellow(tsconfigPath)}`);

      const tsconfig = getTypeScriptConfig(tsconfigPath);
      const { include, exclude } = getFileScope(tsconfig.raw);

      const initOption =
        answer.mode === CE_CTIX_BUILD_MODE.CREATE_MODE
          ? await transformCreateMode(
              { project: tsconfigPath, exportFilename: answer.exportFilename },
              { include, exclude },
            )
          : transformBundleMode(
              { project: tsconfigPath, exportFilename: answer.exportFilename },
              { include, exclude },
            );

      Spinner.it.succeed(`${chalk.yellow(tsconfigPath)} option creation completed!`);

      return {
        ...initOption,
        include: JSON.stringify(initOption.include),
        exclude: JSON.stringify(initOption.exclude),
        removeBackup: false,
        forceYes: false,
        mode: answer.mode,
      };
    }),
  );

  Spinner.it.start(`Start ${chalk.yellow('.ctirc')} file write ...`);

  const renderedNestedOptions = await Promise.all(
    nestedOptions.map(async (initOption) => {
      const rendered = await TemplateContainer.evaluate(
        CE_TEMPLATE_NAME.NESTED_OPTIONS_TEMPLATE,
        initOption,
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

  if (answer.configPosition === 'tsconfig.json') {
    // tsconfig.json 파일은 중요하니까, 백업 만들 생각이 있냐고 물어보자
    await Promise.all(
      answer.tsconfig.map(async (tsconfigFilePath) => {
        const buf = await fs.promises.readFile(tsconfigFilePath);
        const tsconfig = safeJsonc<TsConfigJson>(buf);

        if (tsconfig != null) {
          const newTsconfig = {
            ...tsconfig,
            ctix: { ...(safeJsonc(Buffer.from(prettified.contents)) ?? {}) },
          };

          await fs.promises.writeFile(tsconfigFilePath, JSON.stringify(newTsconfig, null, 2));
          Spinner.it.succeed(`${chalk.yellow(tsconfigFilePath)} file modifing completed!`);
        }
      }),
    );
  } else if (answer.configPosition === 'package.json') {
    const packageJsonFilePath = (
      await Promise.all(
        [posixJoin(answer.cwd, 'package.json'), posixJoin(process.cwd(), 'package.json')].map(
          async (filePath) => {
            return {
              exists: await exists(filePath),
              filePath,
            };
          },
        ),
      )
    )
      .filter((packageJson) => packageJson.exists)
      .at(0);

    if (packageJsonFilePath == null) {
      throw new Error('Cannot found package.json file');
    }

    const buf = await fs.promises.readFile(packageJsonFilePath.filePath);
    const packageJson = safeJsonc<PackageJson>(buf);

    if (packageJson != null) {
      const newPackageJson = {
        ...packageJson,
        ctix: safeJsonc(Buffer.from(prettified.contents)) ?? {},
      };

      await fs.promises.writeFile(
        packageJsonFilePath.filePath,
        JSON.stringify(newPackageJson, null, 2),
      );
      Spinner.it.succeed(`${chalk.yellow(packageJsonFilePath.filePath)} file modifing completed!`);
    }
  } else {
    await fs.promises.writeFile('.ctirc', prettified.contents);
    Spinner.it.succeed(`${chalk.yellow('.ctirc')} file writing completed!`);
  }
}
