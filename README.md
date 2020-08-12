ctix
----
[![Download Status](https://img.shields.io/npm/dw/ctix.svg)](https://npmcharts.com/compare/ctix?minimal=true) [![Github Star](https://img.shields.io/github/stars/imjuni/ctix.svg?style=popout)](https://github.com/imjuni/ctix) [![Github Issues](https://img.shields.io/github/issues-raw/imjuni/ctix.svg)](https://github.com/imjuni/ctix/issues) [![NPM version](https://img.shields.io/npm/v/ctix.svg)](https://www.npmjs.com/package/ctix) [![License](https://img.shields.io/npm/l/ctix.svg)](https://github.com/imjuni/ctix/blob/master/LICENSE) [![cti](https://circleci.com/gh/imjuni/ctix.svg?style=shield)](https://app.circleci.com/pipelines/github/imjuni/ctix?branch=master)

# Install
```bash
npm install ctix --save-dev
```

# Introduction
index.ts file create for exportation. If don't have business logic in index.ts that use to only exportation, ctix help easy importing. Or if you have library project need this export process(for example, blueprint.js etc ...). cti(ctix) create export index.ts file.

For example, sample directory below.

```
  src/
    app.ts
    component/
      Nav.ts
      Button.ts
```

ctix create sub-command create index.ts file below.

```
  src/
    app.ts
    > index.ts
      // created from 'ctix'
      export * from './component';
      export * from './app';
    component/
      Nav.ts
      Button.ts
      > index.ts
        // created from 'ctix'
        export * from './Nav';
        export * from './Button';
```

ctix entrypoint sub-command create index.ts file below.

```
  src/
    app.ts
    component/
      Nav.ts
      Button.ts
  > entrypoint.ts
    // created from 'ctix'
    export * from './src/app.ts'
    export * from './src/component/Nav.ts'
    export * from './src/component/Button.ts'
```

# Option
## library
* `fileFirst: boolean` export list create filefirst. default false
* `addNewline: boolean` deside add newline file ending. default true
* `useSemicolon: boolean` deside use semicolon line ending. default true
* `useTimestamp: boolean` deside use timestamp(YYYY-MM-DD HH:mm) top line comment. default false
* `includeCWD: boolean` deside include cwd directory. default true
* `excludes: string[]` pass exclude directory. default exclude directory is `['@types', 'typings', '__test__', '__tests__']`
* `fileExcludePatterns: string[]` pass exclude filename pattern. default exclude patterns is `[]`
* `targetExts: string[]` pass include extname. default extname is `['ts', 'tsx']`. extname pass without dot charactor.
* `globOptions: glob.IOptions` pass include glob options. [node-glob](https://github.com/isaacs/node-glob) option use it.
* `quote` deside quote charactor. Single quete charactor use to default.
* `verbose` verbose log message disply
* `withoutComment` remove ctix comment that top of line in index.ts
* `withoutBackupFile` Don't create backupfile if already exists target file
* `output` index.ts or entrypoint.ts filename change

## cli (use it cti)
* `-f --filefirst` export list create filefirst, no option false, option true
* `-n --addnewline` deside add newline file ending. no option true, option false
* `-s --usesemicolon` deside use semicolon line ending. no option true, option false
* `-t --usetimestamp` deside use timestamp(YYYY-MM-DD HH:mm) top line comment. no option false, option true
* `-c --includecwd` deside include cwd directory. no option true, option true
* `-e --excludes [comma separated exclude directories]` pass exclude directory. default exclude directory is `['@types', 'typings', '__test__', '__tests__']`
* `-i --fileexcludes [comma separated extname]` pass exclude filename pattern. default exclude patterns is `[]`
* `-x --targetexts [comma separated extname]` pass include extname. default extname is `['ts', 'tsx']`. extname pass without dot charactor.
* `-q --quote` deside quote charactor. default quote charactor single quote
* `-v --verbose` disply verbose log message. no option false, option true
* `-w --withoutcomment` remove ctix comment that top of line in index.ts
* `-b --withoutbackup` Don't create backupfile if already exists target file
* `-o --output` index.ts or entrypoint.ts filename change

# Usage
## library 
### Use TypeScritIndexWriter
```typescript
const tsiw = new TypeScritIndexWriter();
const option = TypeScritIndexWriter.getDefaultOption('./src');

(async () => {
  await tsiw.create(option);

  // or

  await tsiw.createEntrypoint(option);
})();
```

### Use CommandModule
```typescript
(async () => {
  const option = CreateTsIndexOption.getOption({});
  const createCommand = new CreateCommandModule();
  await createCommand.do(process.cwd(), option);
});
```

## CLI
cli use git-style sub-command

* create
  * cti create index.ts file
* entrypoint
  * cti create webpack entrypoint
* init
  * create `.ctirc` file
* clean
  * cti clean index.ts file recursively

```bash
# basic usage
cti create ./src  # or cti create ./src
## or
cti entrypoint ./src  # or cti create ./src

# without newline

## create sub-command, create sub-command is a default command
cti -n ./src
cti create -n ./src

## entrypoint sub-command
cti entrypoint -n ./src

# custom exclude directories
cti create -n -e @types,typings,__test__,__tests__,pages ./src
## or
cti entrypoint -n -e @types,typings,__test__,__tests__,pages ./src

# clean index.ts
cti clean ./src  # or cti clean ./src

# loop through every sub-directory in current path (thanks Mohsen)
for f in *; do cti create ./$f; done

# Pass variadic directories
cti create ./src/server ./src/client ./src/module
```

## CLI with .ctirc
ctix cli support `.ctirc` configuration file. Available name is only `.ctirc`. `.ctirc` configuration file can applied by each target directories and script working directory. Every configuration overwrited same feature. Also cti cli arguments forced applied. And `.ctirc` file can write [json5](https://json5.org) format. json5 spec. can comment and more feature.

See below search, apply order. 

```bash
# execute on /Users/cti/github/ctix
sh> cti create ./example/type01

# search configuration file on "/Users/cti/github/ctix"
# search configuration file on "/Users/cti/github/ctix/example/type01"
# apply configuration by "/Users/cti/github/ctix"
# apply configuration by "/Users/cti/github/ctix/example/type01"
# every configuration is overwrited 
```

### .ctirc creation
You can use cli for `.ctirc` file creation. 

```bash
# create current directory
> cti init

# create multiple directory
> cti init ./example/type03 ./example/type02
```

# Language
* [English](https://github.com/imjuni/ctix/blob/master/README.md)
* [Korean](https://github.com/imjuni/ctix/blob/master/README.ko.md)
