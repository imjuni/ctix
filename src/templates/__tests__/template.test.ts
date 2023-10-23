import { CE_GENERATION_STYLE } from '#/configs/const-enum/CE_GENERATION_STYLE';
import { CE_TEMPLATE_NAME } from '#/templates/const-enum/CE_TEMPLATE_NAME';
import type { IIndexFileWriteParams } from '#/templates/interfaces/IIndexFileWriteParams';
import { TemplateContainer } from '#/templates/modules/TemplateContainer';
import { defaultStarNamedStarDefaultTemplate } from '#/templates/templates/defaultStarNamedStarDefaultTemplate';
import { optionDefaultTemplate } from '#/templates/templates/optionDefaultTemplate';
import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import fs from 'node:fs/promises';

const expactation = new Map<string, string>([
  [CE_TEMPLATE_NAME.INDEX_FILE_TEMPLATE, '1'],
  [CE_TEMPLATE_NAME.OPTIONS_TEMPLATE, '2'],
  [CE_TEMPLATE_NAME.NESTED_OPTIONS_TEMPLATE, '3'],
  [CE_GENERATION_STYLE.DEFAULT_ALIAS_NAMED_STAR, '4'],
  [CE_GENERATION_STYLE.DEFAULT_ALIAS_NAMED_DESTRUCTIVE, '5'],
  [CE_GENERATION_STYLE.DEFAULT_NON_ALIAS_NAMED_DESTRUCTIVE, '6'],
  [CE_GENERATION_STYLE.DEFAULT_STAR_NAMED_STAR, '7'],
  [CE_GENERATION_STYLE.DEFAULT_STAR_NAMED_DESTRUCTIVE, '8'],
]);

describe('TemplateContainer', () => {
  beforeAll(async () => {
    await TemplateContainer.bootstrap();
    await TemplateContainer.bootstrap();
  });

  it('getter', () => {
    expect(TemplateContainer.it).toBeDefined();
    expect(TemplateContainer.isBootstrap).toBeTruthy();
    expect(TemplateContainer.it.templatePath).toBeUndefined();
  });

  it('etaResolvePath', () => {
    const r01 = TemplateContainer.it.etaResolvePath('a');
    expect(r01).toEqual('a');
  });

  it('etaResolvePath', () => {
    const r01 = TemplateContainer.it.etaReadFile(
      CE_GENERATION_STYLE.DEFAULT_ALIAS_NAMED_DESTRUCTIVE,
    );
    const r02 = TemplateContainer.it.etaReadFile('unknown-will-be-not-found');

    expect(r01).toBeDefined();
    expect(r02).toEqual(defaultStarNamedStarDefaultTemplate.trim());
  });

  it('getDefaultTemplate', async () => {
    const defaults = TemplateContainer.getDefaultTemplate();
    expect(defaults.get(CE_TEMPLATE_NAME.OPTIONS_TEMPLATE)).toEqual(optionDefaultTemplate.trim());
  });

  it('getTemplateFileNames', async () => {
    const name = TemplateContainer.getTemplateFileNames('a', 'b');
    expect(name).toEqual('a/b.eta');
  });

  it('readFiles', async () => {
    const spyH01 = jest
      .spyOn(fs, 'readFile')
      .mockImplementation((name: any) => Promise.resolve(Buffer.from(`${name}\nfile readed`)));

    const r01 = await TemplateContainer.readFiles('a');
    spyH01.mockRestore();

    expect(r01).toMatchObject({
      indexFile: 'a/index-file-template.eta\nfile readed',
      options: 'a/options-template.eta\nfile readed',
      nestedOptions: 'a/nested-options-template.eta\nfile readed',
      defaultAliasNamedStar: 'a/default-alias-named-star.eta\nfile readed',
      defaultAliasNamedDestructive: 'a/default-alias-named-destructive.eta\nfile readed',
      defaultNonAliasNamedDestructive: 'a/default-non-alias-named-destructive.eta\nfile readed',
      defaultStarNamedStar: 'a/default-star-named-star.eta\nfile readed',
      defaultStarNamedDestructive: 'a/default-star-named-destructive.eta\nfile readed',
    });
  });

  it('load by default', async () => {
    const spyH01 = jest
      .spyOn(TemplateContainer, 'load')
      .mockImplementation(() => Promise.resolve(expactation));

    const r01 = await TemplateContainer.load();

    spyH01.mockRestore();

    expect(r01).toEqual(expactation);
  });

  it('load by template file', async () => {
    const spyH01 = jest.spyOn(TemplateContainer, 'readFiles').mockImplementation(() =>
      Promise.resolve({
        indexFile: '1',
        options: '2',
        nestedOptions: '3',
        defaultAliasNamedStar: '4',
        defaultAliasNamedDestructive: '5',
        defaultNonAliasNamedDestructive: '6',
        defaultStarNamedStar: '7',
        defaultStarNamedDestructive: '8',
      }),
    );

    const r01 = await TemplateContainer.load(process.cwd());
    spyH01.mockRestore();

    expect(r01).toEqual(expactation);
  });

  it('render export statement', async () => {
    const rendered = await TemplateContainer.evaluate(CE_TEMPLATE_NAME.INDEX_FILE_TEMPLATE, {
      directive: undefined,
      banner: undefined,
      eol: '\n',
      content: 'i am ironman',
    } satisfies IIndexFileWriteParams);

    expect(rendered).toEqual('i am ironman');
  });

  it('render export statement', async () => {
    const rendered = await TemplateContainer.evaluate(CE_TEMPLATE_NAME.INDEX_FILE_TEMPLATE, {
      directive: '"use strict"',
      banner: undefined,
      eol: '\n',
      content: 'i am ironman',
    } satisfies IIndexFileWriteParams);

    expect(rendered).toEqual(`"use strict"\n\ni am ironman`);
  });

  it('render export statement', async () => {
    const rendered = await TemplateContainer.evaluate(CE_TEMPLATE_NAME.INDEX_FILE_TEMPLATE, {
      directive: '"use strict"',
      banner: '// create by ctix',
      eol: '\n',
      content: 'i am ironman',
    } satisfies IIndexFileWriteParams);

    expect(rendered).toEqual(`"use strict"\n// create by ctix\n\ni am ironman`);
  });

  it('invalid template name', async () => {
    await expect(async () => {
      await TemplateContainer.it.evaluate('1', {});
    }).rejects.toThrowError();
  });

  it('render export statement', async () => {
    const rendered = await TemplateContainer.evaluate(
      CE_TEMPLATE_NAME.INDEX_FILE_TEMPLATE,
      {
        directive: '"use strict"',
        banner: '// create by ctix',
        eol: '\n',
        content: 'i am ironman',
      } satisfies IIndexFileWriteParams,
      { rmWhitespace: false },
    );

    expect(rendered).toEqual(`  "use strict"  \n  // create by ctix  \n\ni am ironman`);
  });

  it('exception rendering', async () => {
    await expect(async () => {
      const rendered = await TemplateContainer.evaluate(CE_TEMPLATE_NAME.INDEX_FILE_TEMPLATE, {
        directive: '"use strict"',
        eol: '\n',
        content: Symbol('atest'),
      });

      console.log(rendered);
    }).rejects.toThrowError();
  });
});
