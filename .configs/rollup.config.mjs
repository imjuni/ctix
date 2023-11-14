import { nodeResolve } from '@rollup/plugin-node-resolve';
import readPackage from 'read-pkg';
import { dts } from 'rollup-plugin-dts';

const pkg = readPackage.sync();

const resolveOnly = (module) => {
  return (
    pkg?.dependencies?.[module] != null &&
    pkg?.devDependencies?.[module] != null &&
    pkg?.peerDependencies?.[module] != null
  );
};

const config = [
  {
    input: 'dist/types/origin/index.d.ts',
    output: [{ file: 'dist/types/index.d.ts', format: 'esm' }],
    plugins: [
      nodeResolve({ resolveOnly }),
      dts({
        tsconfig: './tsconfig.dts.json',
      }),
    ],
  },
];

export default config;
