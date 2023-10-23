import { CE_TEMPLATE_NAME } from '#/templates/const-enum/CE_TEMPLATE_NAME';
import type { IIndexFileWriteParams } from '#/templates/interfaces/IIndexFileWriteParams';
import { TemplateContainer } from '#/templates/modules/TemplateContainer';
import { describe, expect, it } from '@jest/globals';

describe('TemplateContainer', () => {
  it('exception - not bootstrap', async () => {
    await expect(async () => {
      const rendered = await TemplateContainer.evaluate(CE_TEMPLATE_NAME.INDEX_FILE_TEMPLATE, {
        directive: undefined,
        banner: undefined,
        eol: '\n',
        content: 'i am ironman',
      } satisfies IIndexFileWriteParams);

      console.log(rendered);
    }).rejects.toThrowError();
  });
});
