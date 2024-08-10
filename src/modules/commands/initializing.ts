import { askInitOptions } from '#/cli/questions/askInitOptions';
import { Spinner } from '#/cli/ux/Spinner';
import { getFileScope } from '#/compilers/getFileScope';
import { getTypeScriptConfig } from '#/compilers/getTypeScriptConfig';
import { CE_CTIX_BUILD_MODE } from '#/configs/const-enum/CE_CTIX_BUILD_MODE';
import { CE_CTIX_DEFAULT_VALUE } from '#/configs/const-enum/CE_CTIX_DEFAULT_VALUE';
import type { TCommandInitOptions } from '#/configs/interfaces/TCommandInitOptions';
import { getDefaultInitAnswer } from '#/configs/modules/getDefaultInitAnswer';
import { transformBundleMode } from '#/configs/transforms/transformBundleMode';
import { transformCreateMode } from '#/configs/transforms/transformCreateMode';
import { isConfigComment } from '#/modules/values/isConfigComment';
import { CE_TEMPLATE_NAME } from '#/templates/const-enum/CE_TEMPLATE_NAME';
import { TemplateContainer } from '#/templates/modules/TemplateContainer';
import chalk from 'chalk';
import { assign, parse, stringify } from 'comment-json';
import fs from 'node:fs';
import pathe from 'pathe';

export async function initializing(option: TCommandInitOptions) {
  await TemplateContainer.bootstrap();

  const answer = option.forceYes ? await getDefaultInitAnswer() : await askInitOptions();

  if (!answer.overwirte) {
    const optionFilePath = pathe.join(answer.cwd, CE_CTIX_DEFAULT_VALUE.CONFIG_FILENAME);
    Spinner.it.fail(`${chalk.yellow(optionFilePath)} already exists`);
    return;
  }

  Spinner.it.start(`Start ctix ${chalk.yellow('configuration')} generate ...`);

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
        {
          isComment: isConfigComment(answer),
          addEveryOptions: answer.addEveryOptions,
          options: initOption,
        },
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
      isComment: isConfigComment(answer),
      addEveryOptions: answer.addEveryOptions,
      spinnerStream: 'stdout',
      progressStream: 'stdout',
      reasonerStream: 'stderr',
      options: renderedNestedOptions.join(',\n'),
    },
    { rmWhitespace: false },
  );

  const parsedRenderedOptions = parse(renderedOptions);

  if (answer.configPosition === 'tsconfig.json') {
    // tsconfig.json 파일은 중요하니까, 백업 만들 생각이 있냐고 물어보자
    await Promise.all(
      answer.tsconfig.map(async (tsconfigFilePath) => {
        const resolvedTsconfigFilePath = pathe.resolve(tsconfigFilePath);
        const buf = await fs.promises.readFile(resolvedTsconfigFilePath);
        const parsedTsconfig = parse(buf.toString());
        const newTsconfig = assign(parsedTsconfig, { ctix: parsedRenderedOptions });

        if (answer.confirmBackupPackageTsconfig) {
          const backupFilePath = `${pathe.basename(resolvedTsconfigFilePath)}.bak${pathe.extname(resolvedTsconfigFilePath)}`;
          await fs.promises.writeFile(backupFilePath, buf.toString());
        }

        await fs.promises.writeFile(resolvedTsconfigFilePath, stringify(newTsconfig, undefined, 2));
        Spinner.it.succeed(`${chalk.yellow(resolvedTsconfigFilePath)} file modifing completed!`);
      }),
    );
  } else if (answer.configPosition === 'package.json') {
    const packageJsonFilePath = pathe.resolve(answer.packageJson);
    const buf = await fs.promises.readFile(packageJsonFilePath);
    const parsedPackageJson = parse(buf.toString());
    const newPackageJson = assign(parsedPackageJson, { ctix: parsedRenderedOptions });

    if (answer.confirmBackupPackageTsconfig) {
      const backupFilePath = `${pathe.basename(packageJsonFilePath)}.bak${pathe.extname(packageJsonFilePath)}`;
      await fs.promises.writeFile(backupFilePath, buf.toString());
    }

    await fs.promises.writeFile(packageJsonFilePath, stringify(newPackageJson, undefined, 2));
    Spinner.it.succeed(`${chalk.yellow(packageJsonFilePath)} file modifing completed!`);
  } else {
    await fs.promises.writeFile('.ctirc', stringify(parsedRenderedOptions, undefined, 2));
    Spinner.it.succeed(`${chalk.yellow('.ctirc')} file writing completed!`);
  }
}
