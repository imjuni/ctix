import initialConfigLiteral from '@configs/initialConfigLiteral';
import consola, { LogLevel } from 'consola';
import { applyEdits, FormattingOptions, ModificationOptions, modify } from 'jsonc-parser';

const share: { formattingOptions: FormattingOptions; options: ModificationOptions } = {} as any;

beforeAll(() => {
  consola.level = LogLevel.Debug;
  share.formattingOptions = {
    insertSpaces: true,
    tabSize: 2,
    eol: '\n',
  };

  share.options = {
    formattingOptions: share.formattingOptions,
  };
});

test('defaultConfig', async () => {
  consola.debug('AS-IS -------------------------------------------------------------------');
  consola.debug(initialConfigLiteral);
  consola.debug('------------------------------------------------------------------------');

  const modified = modify(initialConfigLiteral, ['project'], 'helloworld', share.options);

  consola.debug('TO-BE -------------------------------------------------------------------');
  consola.debug(applyEdits(initialConfigLiteral, modified));
  consola.debug('------------------------------------------------------------------------');
});
