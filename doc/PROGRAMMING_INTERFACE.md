# Programming interface

When using task runners like Gulp and Just, as well as bundlers like webpack and rollup, you need a programming interface to add ctix.

| function | option | descryption |
| - | - | - |
| building | [TCommandBuildOptions](https://github.com/imjuni/ctix/blob/master/src/configs/interfaces/TCommandBuildOptions.ts) | Execute the `build` command |
| initializing | [TCommandInitOptions](https://github.com/imjuni/ctix/blob/master/src/configs/interfaces/TCommandInitOptions.ts) | Execute the `init` command |
| removing | [TCommandRemoveOptions](https://github.com/imjuni/ctix/blob/master/src/configs/interfaces/TCommandRemoveOptions.ts), [TCommandBuildOptions](https://github.com/imjuni/ctix/blob/master/src/configs/interfaces/TCommandBuildOptions.ts) | Execute the `remove` command |

## CommonJS Example

```js
const fs = require('node:fs');
const ctix = require('ctix');

const handle = async () => {
  const options = ctix.parseConfig(await fs.promises.readFile('.ctirc'));
  await ctix.building(options);
};

handle();
```

## ESM, TypeScript Example

> esm

```js
import { building, parseConfig, TCommandBuildOptions } from 'ctix';
import fs from 'node:fs';

const handle = async () => {
  const options = parseConfig(await fs.promises.readFile('.ctirc'));
  await building(options);
};

handle();
```

> TypeScript

```ts
import { building, parseConfig, TCommandBuildOptions } from 'ctix';
import fs from 'node:fs';

const handle = async () => {
  const options = parseConfig(await fs.promises.readFile('.ctirc')) as TCommandBuildOptions;
  await building(options);
};

handle();
```

## Gulp Example

```js
gulp.task('ctix', async () => {
  const options = parseConfig(await fs.promises.readFile('.configs/.ctirc'));
  await building(options);
});
```
