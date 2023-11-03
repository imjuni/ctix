import * as esbuild from 'esbuild';
import readPkg from 'read-pkg';

const pkg = readPkg.sync();

if (process.env.FORMAT !== 'cjs' && process.env.FORMAT !== 'esm') {
  console.log(`support "cjs" or "esm"`);
  console.log(`eg. FORMAT=cjs node esbuild.mjs`);

  process.exit(1);
}

const external = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.devDependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
];

console.log('esbuild start bundling');
console.log(`version: ${pkg.version}`);
console.log(`FORMAT: ${process.env.FORMAT}`);
console.log(`MINIFY: ${process.env.FORMAT}`);
console.log(`external: ${JSON.stringify(external)}`);

await esbuild.build({
  entryPoints: ['src/cli.ts'],
  target: 'es2021',
  banner: { js: '#!/usr/bin/env node\n' },
  bundle: true,
  sourcemap: true,
  platform: 'node',
  minify: process.env.MINIFY === 'true',
  outfile: process.env.FORMAT === 'cjs' ? 'dist/cjs/cli.cjs' : 'dist/esm/cli.mjs',
  format: process.env.FORMAT,
  external,
});
