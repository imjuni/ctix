import getDirective from '@writes/getDirective';
import getFirstLineComment from '@writes/getFirstLineComment';
import dayjs from 'dayjs';
import 'jest';

test('getFirstLineComment - comment', async () => {
  const comment = getFirstLineComment(
    {
      useComment: true,
    },
    '\n',
    dayjs('2022-11-11T11:22:33.000Z'),
  );

  expect(comment).toEqual('// created from ctix\n\n');
});

test('getFirstLineComment - timestamp', async () => {
  const comment = getFirstLineComment(
    {
      useTimestamp: true,
    },
    '\n',
    dayjs('2022-11-11T11:22:33.000Z'),
  );

  expect(comment).toEqual('// 2022-11-11 11:22:33\n\n');
});

test('getFirstLineComment - both', async () => {
  const comment = getFirstLineComment(
    {
      useComment: true,
      useTimestamp: true,
    },
    '\n',
    dayjs('2022-11-11T11:22:33.000Z'),
  );

  expect(comment).toEqual('// created from ctix 2022-11-11 11:22:33\n\n');
});

test('getFirstLineComment - none date', async () => {
  const comment = getFirstLineComment(
    {
      useComment: true,
      useTimestamp: true,
    },
    '\n',
  );

  expect(comment).toBeDefined();
});

test('getFirstLineComment - none', async () => {
  const comment = getFirstLineComment(
    {
      useComment: false,
      useTimestamp: false,
    },
    '\n',
  );

  expect(comment).toEqual('');
});

test('getDirective - set directive', async () => {
  const directive = getDirective(
    {
      useDirective: 'use strict',
    },
    '\n',
  );

  expect(directive).toEqual('use strict\n\n');
});

test('getDirective - none', async () => {
  const directive = getDirective({}, '\n');

  expect(directive).toEqual('');
});
