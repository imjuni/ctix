import { getCreateModeFileTree } from '#/modules/file/getCreateModeFileTree';
import pathe from 'pathe';
import { describe, expect, it } from 'vitest';

// get.create.mode.file.tree
describe('getCreateModeFiles', () => {
  const type04Dir = pathe.join(process.cwd(), 'examples', 'type04');

  it('start from process.cwd()', async () => {
    const files = await getCreateModeFileTree(type04Dir);
    const expectFiles = {
      root: {
        kind: 'root',
        name: 'type04',
        path: type04Dir,
        children: [
          {
            kind: 'child',
            name: 'juvenile',
            path: pathe.join(type04Dir, 'juvenile'),
            parent: type04Dir,
            children: [
              {
                kind: 'child',
                name: 'apple',
                path: pathe.join(type04Dir, 'juvenile/apple'),
                parent: pathe.join(type04Dir, 'juvenile'),
                children: [],
              },
              {
                kind: 'child',
                name: 'spill',
                path: pathe.join(type04Dir, 'juvenile/spill'),
                parent: pathe.join(type04Dir, 'juvenile'),
                children: [],
              },
            ],
          },
          {
            kind: 'child',
            name: 'popcorn',
            path: pathe.join(type04Dir, 'popcorn'),
            parent: type04Dir,
            children: [
              {
                kind: 'child',
                name: 'finance',
                path: pathe.join(type04Dir, 'popcorn/finance'),
                parent: pathe.join(type04Dir, 'popcorn'),
                children: [
                  {
                    kind: 'child',
                    name: 'discipline',
                    path: pathe.join(type04Dir, 'popcorn/finance/discipline'),
                    parent: pathe.join(type04Dir, 'popcorn/finance'),
                    children: [],
                  },
                ],
              },
              {
                kind: 'child',
                name: 'lawyer',
                path: pathe.join(type04Dir, 'popcorn/lawyer'),
                parent: pathe.join(type04Dir, 'popcorn'),
                children: [
                  {
                    kind: 'child',
                    name: 'appliance',
                    path: pathe.join(type04Dir, 'popcorn/lawyer/appliance'),
                    parent: pathe.join(type04Dir, 'popcorn/lawyer'),
                    children: [],
                  },
                ],
              },
            ],
          },
          {
            kind: 'child',
            name: 'wellmade',
            path: pathe.join(type04Dir, 'wellmade'),
            parent: type04Dir,
            children: [
              {
                kind: 'child',
                name: 'carpenter',
                path: pathe.join(type04Dir, 'wellmade/carpenter'),
                parent: pathe.join(type04Dir, 'wellmade'),
                children: [],
              },
            ],
          },
        ],
      },
      children: [
        {
          kind: 'child',
          name: 'juvenile',
          path: pathe.join(type04Dir, 'juvenile'),
          parent: type04Dir,
          children: [
            {
              kind: 'child',
              name: 'apple',
              path: pathe.join(type04Dir, 'juvenile/apple'),
              parent: pathe.join(type04Dir, 'juvenile'),
              children: [],
            },
            {
              kind: 'child',
              name: 'spill',
              path: pathe.join(type04Dir, 'juvenile/spill'),
              parent: pathe.join(type04Dir, 'juvenile'),
              children: [],
            },
          ],
        },
        {
          kind: 'child',
          name: 'popcorn',
          path: pathe.join(type04Dir, 'popcorn'),
          parent: type04Dir,
          children: [
            {
              kind: 'child',
              name: 'finance',
              path: pathe.join(type04Dir, 'popcorn/finance'),
              parent: pathe.join(type04Dir, 'popcorn'),
              children: [
                {
                  kind: 'child',
                  name: 'discipline',
                  path: pathe.join(type04Dir, 'popcorn/finance/discipline'),
                  parent: pathe.join(type04Dir, 'popcorn/finance'),
                  children: [],
                },
              ],
            },
            {
              kind: 'child',
              name: 'lawyer',
              path: pathe.join(type04Dir, 'popcorn/lawyer'),
              parent: pathe.join(type04Dir, 'popcorn'),
              children: [
                {
                  kind: 'child',
                  name: 'appliance',
                  path: pathe.join(type04Dir, 'popcorn/lawyer/appliance'),
                  parent: pathe.join(type04Dir, 'popcorn/lawyer'),
                  children: [],
                },
              ],
            },
          ],
        },
        {
          kind: 'child',
          name: 'wellmade',
          path: pathe.join(type04Dir, 'wellmade'),
          parent: type04Dir,
          children: [
            {
              kind: 'child',
              name: 'carpenter',
              path: pathe.join(type04Dir, 'wellmade/carpenter'),
              parent: pathe.join(type04Dir, 'wellmade'),
              children: [],
            },
          ],
        },
        {
          kind: 'child',
          name: 'carpenter',
          path: pathe.join(type04Dir, 'wellmade/carpenter'),
          parent: pathe.join(type04Dir, 'wellmade'),
          children: [],
        },
        {
          kind: 'child',
          name: 'finance',
          path: pathe.join(type04Dir, 'popcorn/finance'),
          parent: pathe.join(type04Dir, 'popcorn'),
          children: [
            {
              kind: 'child',
              name: 'discipline',
              path: pathe.join(type04Dir, 'popcorn/finance/discipline'),
              parent: pathe.join(type04Dir, 'popcorn/finance'),
              children: [],
            },
          ],
        },
        {
          kind: 'child',
          name: 'lawyer',
          path: pathe.join(type04Dir, 'popcorn/lawyer'),
          parent: pathe.join(type04Dir, 'popcorn'),
          children: [
            {
              kind: 'child',
              name: 'appliance',
              path: pathe.join(type04Dir, 'popcorn/lawyer/appliance'),
              parent: pathe.join(type04Dir, 'popcorn/lawyer'),
              children: [],
            },
          ],
        },
        {
          kind: 'child',
          name: 'appliance',
          path: pathe.join(type04Dir, 'popcorn/lawyer/appliance'),
          parent: pathe.join(type04Dir, 'popcorn/lawyer'),
          children: [],
        },
        {
          kind: 'child',
          name: 'discipline',
          path: pathe.join(type04Dir, 'popcorn/finance/discipline'),
          parent: pathe.join(type04Dir, 'popcorn/finance'),
          children: [],
        },
        {
          kind: 'child',
          name: 'apple',
          path: pathe.join(type04Dir, 'juvenile/apple'),
          parent: pathe.join(type04Dir, 'juvenile'),
          children: [],
        },
        {
          kind: 'child',
          name: 'spill',
          path: pathe.join(type04Dir, 'juvenile/spill'),
          parent: pathe.join(type04Dir, 'juvenile'),
          children: [],
        },
      ],
    };

    expect(files).toMatchObject(expectFiles);
  });
});
