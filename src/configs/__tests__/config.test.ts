import { initialConfigLiteral } from '#/configs/initialConfigLiteral';
import { logger } from '#/tools/logger';
import { applyEdits, modify, type FormattingOptions, type ModificationOptions } from 'jsonc-parser';

const log = logger();
const share: { formattingOptions: FormattingOptions; options: ModificationOptions } = {} as any;

beforeAll(() => {
  log.level = 'debug';
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
  log.debug('AS-IS -------------------------------------------------------------------');
  log.debug(initialConfigLiteral);
  log.debug('------------------------------------------------------------------------');

  const modified = modify(initialConfigLiteral, ['project'], 'helloworld', share.options);

  log.debug('TO-BE -------------------------------------------------------------------');
  log.debug(applyEdits(initialConfigLiteral, modified));
  log.debug('------------------------------------------------------------------------');
});
