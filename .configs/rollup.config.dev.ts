import sourcemaps from 'rollup-plugin-sourcemaps';
import ts from 'rollup-plugin-ts';

export default [
  {
    input: 'src/cli.ts',
    output: {
      dir: 'dist',
      format: 'cjs',
      banner: '#!/usr/bin/env node',
    },
    plugins: [ts({ tsconfig: 'tsconfig.json' })],
  },
  {
    input: 'src/ctix.ts',
    output: [
      {
        format: 'cjs',
        file: 'dist/cjs/ctix.js',
        sourcemap: true,
      },
      {
        format: 'esm',
        file: 'dist/esm/ctix.js',
        sourcemap: true,
      },
    ],
    plugins: [sourcemaps(), ts({ tsconfig: 'tsconfig.json' })],
  },
];
