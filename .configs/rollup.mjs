import { dts } from 'rollup-plugin-dts';

const config = [
  {
    input: 'dist/types/origin/src/index.d.ts',
    output: [{ file: 'dist/types/index.d.ts', format: 'es' }],
    plugins: [dts({ tsconfig: 'tsconfig.json' })],
  },
];

export default config;
