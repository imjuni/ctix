import { CE_GENERATION_STYLE } from '#/configs/const-enum/CE_GENERATION_STYLE';
import { filenamify } from '#/modules/path/filenamify';
import { CE_AUTO_RENDER_CASE } from '#/templates/const-enum/CE_AUTO_RENDER_CASE';
import type { IIndexRenderData } from '#/templates/interfaces/IIndexRenderData';
import { getAutoRenderCase } from '#/templates/modules/getAutoRenderCase';
import { replaceSepToPosix } from 'my-node-fp';
import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';

const uuid = randomUUID();
const filename = `${uuid}.ts`;
const context: IIndexRenderData = {
  options: {
    quote: "'",
    useSemicolon: true,
  },
  filePath: filename,
  statement: {
    extname: {
      origin: '.ts',
      render: '.js',
    },
    importPath: `./${uuid}`,
    isHasDefault: false,
    isHasPartialExclude: false,
    named: [
      {
        path: {
          filename,
          dirPath: replaceSepToPosix(process.cwd()),
          relativePath: '..',
        },
        depth: 2,
        pos: {
          line: 1,
          column: 1,
        },
        identifier: {
          name: 'MarvelHero',
          alias: filenamify(uuid),
        },
        isPureType: false,
        isAnonymous: false,
        isDefault: false,
        isExcluded: false,
        comments: [],
      },
      {
        path: {
          filename,
          dirPath: replaceSepToPosix(process.cwd()),
          relativePath: '..',
        },
        depth: 2,
        pos: {
          line: 1,
          column: 1,
        },
        identifier: {
          name: 'DCHero',
          alias: filenamify(uuid),
        },
        isPureType: false,
        isAnonymous: false,
        isDefault: false,
        isExcluded: false,
        comments: [],
      },
    ],
  },
};

describe('getAutoRenderCase', () => {
  it('case 01', () => {
    const renderData = { ...context, statement: { ...context.statement } };
    renderData.statement.isHasDefault = true;
    renderData.statement.isHasPartialExclude = false;

    const r01 = getAutoRenderCase(renderData);

    expect(r01).toMatchObject({
      case: CE_AUTO_RENDER_CASE.DEFAULT_NAMED,
      style: CE_GENERATION_STYLE.DEFAULT_STAR_NAMED_STAR,
    });
  });

  it('case 02', () => {
    const renderData = { ...context, statement: { ...context.statement } };
    renderData.statement.isHasDefault = true;
    renderData.statement.named = [];
    renderData.statement.isHasPartialExclude = false;

    const r01 = getAutoRenderCase(renderData);

    expect(r01).toMatchObject({
      case: CE_AUTO_RENDER_CASE.DEFAULT,
      style: CE_GENERATION_STYLE.DEFAULT_STAR_NAMED_STAR,
    });
  });

  it('case 03', () => {
    const renderData = { ...context, statement: { ...context.statement } };
    renderData.statement.isHasDefault = false;
    renderData.statement.isHasPartialExclude = false;

    const r01 = getAutoRenderCase(renderData);

    expect(r01).toMatchObject({
      case: CE_AUTO_RENDER_CASE.NAMED,
      style: CE_GENERATION_STYLE.DEFAULT_STAR_NAMED_STAR,
    });
  });

  it('case 04', () => {
    const renderData = { ...context, statement: { ...context.statement } };
    renderData.statement.isHasDefault = false;
    renderData.statement.isHasPartialExclude = true;

    const r01 = getAutoRenderCase(renderData);

    expect(r01).toMatchObject({
      case: CE_AUTO_RENDER_CASE.NAMED_PARTAL,
      style: CE_GENERATION_STYLE.DEFAULT_ALIAS_NAMED_DESTRUCTIVE,
    });
  });

  it('case 05', () => {
    const renderData = { ...context, statement: { ...context.statement } };
    renderData.statement.isHasDefault = true;
    renderData.statement.named = [];
    renderData.statement.isHasPartialExclude = true;

    const r01 = getAutoRenderCase(renderData);

    expect(r01).toMatchObject({
      case: CE_AUTO_RENDER_CASE.DEFAULT_PARTIAL,
      style: CE_GENERATION_STYLE.DEFAULT_ALIAS_NAMED_STAR,
    });
  });

  it('case 06', () => {
    const renderData = { ...context, statement: { ...context.statement } };
    renderData.statement.isHasDefault = true;
    renderData.statement.isHasPartialExclude = true;

    const r01 = getAutoRenderCase(renderData);

    expect(r01).toMatchObject({
      case: CE_AUTO_RENDER_CASE.DEFAULT_PARTIAL,
      style: CE_GENERATION_STYLE.DEFAULT_ALIAS_NAMED_DESTRUCTIVE,
    });
  });

  it('unknown case', () => {
    const renderData = { ...context, statement: { ...context.statement } };
    renderData.statement.isHasDefault = false;
    renderData.statement.named = [];
    renderData.statement.isHasPartialExclude = false;

    const r01 = getAutoRenderCase(renderData);

    expect(r01).toMatchObject({
      case: CE_AUTO_RENDER_CASE.UNKNOWN,
      style: CE_GENERATION_STYLE.DEFAULT_STAR_NAMED_STAR,
    });
  });
});
