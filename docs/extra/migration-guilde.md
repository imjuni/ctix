---
lang: en-US
title: Migration Guide
description: Migration guide from 0.6.x from 1.x
---

This document describe to migrate from 0.6.x to 1.x.

## Command changing

clean command rename to remove. And entrypoint command chage to shortcut command.

### create

0.6.x version skip command that execute create mode but 1.x not work and show help. 1.x version have to pass command always. If you skip passing command that show help. Instead add shortcut command. See below table.

| command | shortcut |
| ------- | -------- |
| create  | c        |
| single  | s        |
| remove  | r        |
| init    | i        |

### single

0.6.x version entrypoint command works single command. 1.x version entrypoint command change to shortcut command.

### remove

clean command change to remove. clean word shortcut conflict create word so it changed.

## Option

### excludePath, useUpperFirst

This option depreciated. Default export statement export given name in source file. See below example code.

```ts
// cti.ts
export default class CreateTypeScriptIndex {}

// index.ts: using given name
export { default as CreateTypeScriptIndex } from './cti.ts';
```

Maybe default export statement is a anonymous function(also include arrow function, object literal etc) in this case use filename. No longer use parent path and keep first letter lower/upper case, filename change camelCase. For example, "iam.hero.ts" change to "iamHero".

### addNewline

This option depreciated. If you use prettier and can resolve .prettierrc that apply prettier on created index.ts file.

### useSemicolon

This option possible to ignore maybe you use prettier.

### useBackupFile

This option depreciated. 1.x version no longer overwrite exportFilename. Also filename conflict error display using by well-formed message. If you want to overwrite exportFilename pass -w or --overwrite option. Maybe pass -w or --overwrite option, automatic create backup file.

### skipEmptyDir

This option only work on create mode. You can skip index.ts file empty directory. example [type03](https://github.com/imjuni/ctix/tree/master/example/type03) is this case.

```text
type03/
// index.ts created
    popcorn/
    // index.ts created
        finance/
        // empty directory, it skipped
            discipline/
            // index.ts created
    popcorn/
    // index.ts created
        lawyer/
        // empty directory, it skipped
            appliance/
            // index.ts created
```

## Configuration file .ctirc

0.6.x configuration file format is json5. But 1.x configuration file format change json with comment from json5. Because json with comment is same to tsconfig.json and many IDE well support.

0.6.x version configuration apply each directory. 1.x version support only one configuration file. Because add -c, --config option added so one file configuration is more clear.

## Ignore

.ctiignore file format is chagned. 0.6.x can apply each directory and same format to gitignore file. Bug 1.x version use json with comment. Because partial ignore support.

### Partial Ignore

See below [.ctiignore](https://github.com/imjuni/ctix/blob/develop/example/type04/.ctiignore).

```jsonc
{
  "juvenile/**": "*",
  "wellmade/FlakyCls.ts": "*",
  "wellmade/WhisperingCls.ts": "*",
  "wellmade/ChildlikeCls.ts": ["transfer", "stomach"]
}
```

json key indicate file path. You can use glob pattern. If set '\*' character at value that is totally ignore file or glob pattern. If set string array that is ignore type name array.

### testcase

ctix need manual ignore for testcase like that. testcase directory, file ignore using glob pattern.

```jsonc
{
  // ignore testcase file
  "**/__tests__/*": "*"
}
```

ctix auto create index.ts file empty directory because that can have children directory. So, ctix need ignore directory and file both.
