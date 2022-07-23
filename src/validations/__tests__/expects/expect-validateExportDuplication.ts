import * as env from '@testenv/env';
import { posixJoin } from '@tools/misc';
import colors from 'colors';
import { replaceSepToPosix } from 'my-node-fp';

export default {
  valid: false,
  filePaths: [
    posixJoin(env.exampleType03Path, 'createTypeScriptIndex.d.ts'),
    posixJoin(env.exampleType03Path, 'index.d.ts'),
    posixJoin(env.exampleType03Path, 'popcorn', 'lawyer', 'appliance', 'bomb.ts'),
  ],
  duplicate: {
    indexWriter: [
      {
        resolvedFilePath: posixJoin(env.exampleType03Path, 'createTypeScriptIndex.d.ts'),
        resolvedDirPath: replaceSepToPosix(env.exampleType03Path),
        relativeFilePath: 'createTypeScriptIndex.d.ts',
        depth: 0,
        isEmpty: false,
        starExported: true,
        defaultExport: undefined,
        namedExports: [
          { identifier: 'indexWriter', isIsolatedModules: false },
          { identifier: 'createTypeScriptIndex', isIsolatedModules: false },
          { identifier: 'ICreateTsIndexOption', isIsolatedModules: true },
        ],
      },
      {
        resolvedFilePath: posixJoin(env.exampleType03Path, 'index.d.ts'),
        resolvedDirPath: replaceSepToPosix(env.exampleType03Path),
        relativeFilePath: 'index.d.ts',
        depth: 0,
        isEmpty: false,
        starExported: true,
        defaultExport: undefined,
        namedExports: [
          { identifier: 'indexWriter', isIsolatedModules: false },
          { identifier: 'createTypeScriptIndex', isIsolatedModules: false },
          { identifier: 'ICreateTsIndexOption', isIsolatedModules: true },
        ],
      },
    ],
    createTypeScriptIndex: [
      {
        resolvedFilePath: posixJoin(env.exampleType03Path, 'createTypeScriptIndex.d.ts'),
        resolvedDirPath: replaceSepToPosix(env.exampleType03Path),
        relativeFilePath: 'createTypeScriptIndex.d.ts',
        depth: 0,
        isEmpty: false,
        starExported: true,
        defaultExport: undefined,
        namedExports: [
          { identifier: 'indexWriter', isIsolatedModules: false },
          { identifier: 'createTypeScriptIndex', isIsolatedModules: false },
          { identifier: 'ICreateTsIndexOption', isIsolatedModules: true },
        ],
      },
      {
        resolvedFilePath: posixJoin(env.exampleType03Path, 'index.d.ts'),
        resolvedDirPath: replaceSepToPosix(env.exampleType03Path),
        relativeFilePath: 'index.d.ts',
        depth: 0,
        isEmpty: false,
        starExported: true,
        defaultExport: undefined,
        namedExports: [
          { identifier: 'indexWriter', isIsolatedModules: false },
          { identifier: 'createTypeScriptIndex', isIsolatedModules: false },
          { identifier: 'ICreateTsIndexOption', isIsolatedModules: true },
        ],
      },
    ],
    ICreateTsIndexOption: [
      {
        resolvedFilePath: posixJoin(env.exampleType03Path, 'createTypeScriptIndex.d.ts'),
        resolvedDirPath: replaceSepToPosix(env.exampleType03Path),
        relativeFilePath: 'createTypeScriptIndex.d.ts',
        depth: 0,
        isEmpty: false,
        starExported: true,
        defaultExport: undefined,
        namedExports: [
          { identifier: 'indexWriter', isIsolatedModules: false },
          { identifier: 'createTypeScriptIndex', isIsolatedModules: false },
          { identifier: 'ICreateTsIndexOption', isIsolatedModules: true },
        ],
      },
      {
        resolvedFilePath: posixJoin(env.exampleType03Path, 'index.d.ts'),
        resolvedDirPath: replaceSepToPosix(env.exampleType03Path),
        relativeFilePath: 'index.d.ts',
        depth: 0,
        isEmpty: false,
        starExported: true,
        defaultExport: undefined,
        namedExports: [
          { identifier: 'indexWriter', isIsolatedModules: false },
          { identifier: 'createTypeScriptIndex', isIsolatedModules: false },
          { identifier: 'ICreateTsIndexOption', isIsolatedModules: true },
        ],
      },
    ],
    bomb: [
      {
        resolvedFilePath: posixJoin(
          env.exampleType03Path,
          'popcorn',
          'lawyer',
          'appliance',
          'bomb.ts',
        ),
        resolvedDirPath: posixJoin(env.exampleType03Path, 'popcorn', 'lawyer', 'appliance'),
        relativeFilePath: posixJoin('popcorn', 'lawyer', 'appliance', 'bomb.ts'),
        depth: 3,
        isEmpty: false,
        starExported: true,
        defaultExport: { identifier: 'bomb', isIsolatedModules: false },
        namedExports: [{ identifier: 'bomb', isIsolatedModules: false }],
      },
      {
        resolvedFilePath: posixJoin(
          env.exampleType03Path,
          'popcorn',
          'lawyer',
          'appliance',
          'bomb.ts',
        ),
        resolvedDirPath: posixJoin(env.exampleType03Path, 'popcorn', 'lawyer', 'appliance'),
        relativeFilePath: posixJoin('popcorn', 'lawyer', 'appliance', 'bomb.ts'),
        depth: 3,
        isEmpty: false,
        starExported: true,
        defaultExport: { identifier: 'bomb', isIsolatedModules: false },
        namedExports: [{ identifier: 'bomb', isIsolatedModules: false }],
      },
    ],
  },
  reasons: [
    {
      type: 'error',
      lineAndCharacter: {
        line: 14,
        character: 1,
      },
      nodes: [null],
      filePath: posixJoin(env.exampleType03Path, 'createTypeScriptIndex.d.ts'),
      message: `detect same name of export statement: "${colors.yellow('indexWriter')}"`,
    },
    {
      type: 'error',
      lineAndCharacter: {
        line: 14,
        character: 1,
      },
      nodes: [null],
      filePath: posixJoin(env.exampleType03Path, 'index.d.ts'),
      message: `detect same name of export statement: "${colors.yellow('indexWriter')}"`,
    },
    {
      type: 'error',
      lineAndCharacter: {
        line: 19,
        character: 1,
      },
      nodes: [null],
      filePath: posixJoin(env.exampleType03Path, 'createTypeScriptIndex.d.ts'),
      message: `detect same name of export statement: "${colors.yellow('createTypeScriptIndex')}"`,
    },
    {
      type: 'error',
      lineAndCharacter: {
        line: 19,
        character: 1,
      },
      nodes: [null],
      filePath: posixJoin(env.exampleType03Path, 'index.d.ts'),
      message: `detect same name of export statement: "${colors.yellow('createTypeScriptIndex')}"`,
    },
    {
      type: 'error',
      lineAndCharacter: {
        line: 3,
        character: 1,
      },
      nodes: [null],
      filePath: posixJoin(env.exampleType03Path, 'createTypeScriptIndex.d.ts'),
      message: `detect same name of export statement: "${colors.yellow('ICreateTsIndexOption')}"`,
    },
    {
      type: 'error',
      lineAndCharacter: {
        line: 3,
        character: 1,
      },
      nodes: [null],
      filePath: posixJoin(env.exampleType03Path, 'index.d.ts'),
      message: `detect same name of export statement: "${colors.yellow('ICreateTsIndexOption')}"`,
    },
    {
      type: 'error',
      lineAndCharacter: {
        line: 3,
        character: 16,
      },
      nodes: [null],
      filePath: posixJoin(env.exampleType03Path, 'popcorn', 'lawyer', 'appliance', 'bomb.ts'),
      message: `detect same name of default export statement: "${colors.yellow('bomb')}"`,
    },
    {
      type: 'error',
      lineAndCharacter: {
        line: 3,
        character: 16,
      },
      nodes: [null],
      filePath: posixJoin(env.exampleType03Path, 'popcorn', 'lawyer', 'appliance', 'bomb.ts'),
      message: `detect same name of default export statement: "${colors.yellow('bomb')}"`,
    },
  ],
};
