# Generation Style

The handling of the `default export` is an important issue, but many bundlers and type bundlers handle the `default export` differently, so ctix provides many ways to create a `default export`.

You can change the `generation style` of the entire project by setting the `generation-style` option, or you can change the `generation style` of only certain files by adding the `@ctix-generation-style` inline comment at the top of the file.

- [Configurations](#configurations)
  - [Using `.ctirc` to apply to entier project](#using-ctirc-to-apply-to-entier-project)
  - [Using document comment to apply to a single file](#using-document-comment-to-apply-to-a-single-file)
- [Options](#options)
- [Examples of each style](#examples-of-each-style)
  - [default-star-named-star](#default-star-named-star)
    - [soruce file](#soruce-file)
    - [generated file](#generated-file)
  - [default-star-named-destructive](#default-star-named-destructive)
    - [soruce file](#soruce-file-1)
    - [generated file](#generated-file-1)
  - [default-alias-named-star](#default-alias-named-star)
    - [soruce file](#soruce-file-2)
    - [generated file](#generated-file-2)
  - [default-alias-named-destructive](#default-alias-named-destructive)
    - [soruce file](#soruce-file-3)
    - [generated file](#generated-file-3)
  - [default-non-alias-named-destructive](#default-non-alias-named-destructive)
    - [soruce file](#soruce-file-4)
    - [generated file](#generated-file-4)

## Configurations

### Using `.ctirc` to apply to entier project

Configuration for entire project.

```json
{
  "spinnerStream": "stdout",
  "progressStream": "stdout",
  "reasonerStream": "stderr",
  "options": [
    {
      "mode": "bundle",
      "project": "example/type10/tsconfig.json",
      "exportFilename": "index.ts",
      "useSemicolon": true,
      "useBanner": false,
      "useTimestamp": false,
      "quote": "'",
      "directive": "",
      "fileExt": "none",
      "overwrite": true,
      "backup": false,
      "generationStyle": "auto", // check this option!
      "include": ["**/*.ts"],
      "exclude": [],
      "skipEmptyDir": true,
      "startFrom": "/Users/imjuni/project/github/ctix/ctix/example/type10",
      "output": "example/type10",
      "removeBackup": false,
      "forceYes": false
    }
  ]
}
```

### Using document comment to apply to a single file

```ts
/** @ctix-generation-style default-alias-named-destructive */

// ComparisonCls
export class ComparisonCls {
  private name: string = 'ComparisonCls';
}
```

## Options

| Key                                 |                                                                                      |
| ----------------------------------- | ------------------------------------------------------------------------------------ |
| auto                                | The `generation-style` option is selected automatically                              |
| default-alias-named-star            | `default` export using alias, `named exports` are star                               |
| default-alias-named-destructive     | `default` export using alias, each of the `named exports` becomes export by name     |
| default-non-alias-named-destructive | `default` export `default`, each of the `named exports` becomes export by name       |
| default-star-named-star             | `default`, `named exports` becomes export by star                                    |
| default-star-named-destructive      | `default` becomes export by star, each of the `named exports` becomes export by name |

## Examples of each style

### default-star-named-star

#### soruce file

```ts
// src/hero.ts
const hero = 'ironman';

export function greeting() {
  return `hello! ${hero}`;
}

export default hero;
```

#### generated file

```ts
export * from 'src/hero';
```

### default-star-named-destructive

#### soruce file

```ts
// src/hero.ts
const hero = 'ironman';

export function greeting() {
  return `hello! ${hero}`;
}

export function flying() {
  return `${hero} flying!`;
}

export default hero;
```

#### generated file

```ts
export * from 'src/hero';
export { greeting, flying } from 'src/hero';
```

### default-alias-named-star

#### soruce file

```ts
// src/hero.ts
const hero = 'ironman';

export function greeting() {
  return `hello! ${hero}`;
}

export function flying() {
  return `${hero} flying!`;
}

export default hero;
```

#### generated file

```ts
export { default as hero } from 'src/hero';
export * from 'src/hero';
```

### default-alias-named-destructive

#### soruce file

```ts
// src/hero.ts
const hero = 'ironman';

export function greeting() {
  return `hello! ${hero}`;
}

export function flying() {
  return `${hero} flying!`;
}

export default hero;
```

#### generated file

```ts
export { default as hero, greeting, flying } from 'src/hero';
```

### default-non-alias-named-destructive

#### soruce file

```ts
// src/hero.ts
const hero = 'ironman';

export function greeting() {
  return `hello! ${hero}`;
}

export function flying() {
  return `${hero} flying!`;
}

export default hero;
```

#### generated file

```ts
export { default, greeting, flying } from 'src/hero';
```
