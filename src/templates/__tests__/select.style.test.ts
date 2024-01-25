import type { IStatementComments } from '#/comments/interfaces/IStatementComments';
import { CE_GENERATION_STYLE } from '#/configs/const-enum/CE_GENERATION_STYLE';
import { filenamify } from '#/modules/path/filenamify';
import { posixJoin } from '#/modules/path/posixJoin';
import { CE_AUTO_RENDER_CASE } from '#/templates/const-enum/CE_AUTO_RENDER_CASE';
import type { IIndexRenderData } from '#/templates/interfaces/IIndexRenderData';
import { getSelectStyle } from '#/templates/modules/getSelectStyle';
import copy from 'fast-copy';
import { replaceSepToPosix } from 'my-node-fp';
import { randomUUID } from 'node:crypto';
import * as tsm from 'ts-morph';
import { describe, expect, it } from 'vitest';

const uuid = randomUUID();
const filename = `${uuid}.ts`;
const commentContent = `
/**
 * @ctix-generation-style default-non-alias-named-destructive
 */
`;
const context: { comment: IStatementComments; renderData: IIndexRenderData } = {
  comment: {
    kind: tsm.SyntaxKind.MultiLineCommentTrivia,
    pos: {
      line: 1,
      column: 1,
      start: 1,
    },
    filePath: '',
    range: commentContent.trim(),
  },
  renderData: {
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
  },
};

describe('getSelectStyle', () => {
  it('auto generation', () => {
    const r01 = getSelectStyle({
      comment: undefined,
      options: { style: CE_GENERATION_STYLE.AUTO },
      renderData: context.renderData,
    });

    expect(r01).toMatchObject({
      case: CE_AUTO_RENDER_CASE.NAMED,
      style: CE_GENERATION_STYLE.DEFAULT_STAR_NAMED_STAR,
    });
  });

  it('custom style', () => {
    const r01 = getSelectStyle({
      comment: undefined,
      options: { style: CE_GENERATION_STYLE.DEFAULT_ALIAS_NAMED_DESTRUCTIVE },
      renderData: context.renderData,
    });

    expect(r01).toMatchObject({
      case: CE_AUTO_RENDER_CASE.UNKNOWN,
      style: CE_GENERATION_STYLE.DEFAULT_ALIAS_NAMED_DESTRUCTIVE,
    });
  });

  it('extracted style comment', () => {
    const comment = copy<IStatementComments>(context.comment);
    comment.filePath = posixJoin(process.cwd());

    const r01 = getSelectStyle({
      comment,
      options: { style: CE_GENERATION_STYLE.DEFAULT_ALIAS_NAMED_DESTRUCTIVE },
      renderData: context.renderData,
    });

    expect(r01).toMatchObject({
      case: CE_AUTO_RENDER_CASE.UNKNOWN,
      style: CE_GENERATION_STYLE.DEFAULT_NON_ALIAS_NAMED_DESTRUCTIVE,
    });
  });

  it('extract fail style comment', () => {
    const comment = copy<IStatementComments>(context.comment);
    comment.filePath = posixJoin(process.cwd());
    comment.range = `/** @hello-world */`;

    const r01 = getSelectStyle({
      comment,
      options: { style: CE_GENERATION_STYLE.DEFAULT_ALIAS_NAMED_DESTRUCTIVE },
      renderData: context.renderData,
    });

    expect(r01).toMatchObject({
      case: CE_AUTO_RENDER_CASE.UNKNOWN,
      style: CE_GENERATION_STYLE.DEFAULT_ALIAS_NAMED_DESTRUCTIVE,
    });
  });
});
