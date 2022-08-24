---
lang: en-US
title: Create Command
description: ctix detail usage guide
---

Collect exported something(variable, function, object, class, interface etc.) information to create index.ts file in each directories. You can use the top-level directory index.ts file as an entrypoint. In this case, be careful of duplicate export.

## create command option schema

| Name             | Short | Default  | Type                 | Required | Command |
| :--------------- | ----- | -------- | -------------------- | -------- | ------- |
| --config         | -c    |          | string               |          | create  |
| --project        | -p    |          | string               | required | create  |
| --exportFilename | -f    | index.ts | string               | required | create  |
| --useSemicolon   | -s    | true     | string               |          | create  |
| --useTimestamp   | -t    | false    | boolean              |          | create  |
| --useComment     | -m    | true     | boolean              |          | create  |
| --quote          | -q    | '        | string               |          | create  |
| --keepFileExt    | -k    | false    | boolean              |          | create  |
| --overwrite      | -w    | false    | boolean              |          | create  |
| --ignoreFile     | -g    |          | string               |          | create  |
| --skipEmptyDir   | -e    | true     | boolean              |          | create  |
| --spinnerStream  |       | stdout   | enum(stdout, stderr) |          | create  |
| --progressStream |       | stdout   | enum(stdout, stderr) |          | create  |
| --reasonerStream |       | stderr   | enum(stdout, stderr) |          | create  |

## create command option description

| Name             | Description                                                                                                                    |
| :--------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| --config         | configuration file(.ctirc) path                                                                                                |
| --project        | tsconfig.json path: you must pass path with filename, like this "./tsconfig.json"                                              |
| --exportFilename | Export filename, if you not pass this field that use "index.ts" or "index.d.ts"                                                |
| --useSemicolon   | add semicolon on line ending at every export statement                                                                         |
| --useTimestamp   | timestamp write on ctix comment right-side, only works in useComment option set true                                           |
| --useComment     | ctix comment add on first line of creted export file(default index.ts) file, that remark created from ctix                     |
| --quote          | change quote character at export syntax                                                                                        |
| --keepFileExt    | keep file extension on export statement path literal                                                                           |
| --overwrite      | overwrite each index.ts file                                                                                                   |
| --ignoreFile     | ignore file name. You can pass ignore, config file at ctix and use it like profile                                             |
| --skipEmptyDir   | If set true this option, skip empty directory                                                                                  |
| --spinnerStream  | Stream of cli spinner, you can pass stdout or stderr                                                                           |
| --progressStream | Stream of cli progress, you can pass stdout or stderr                                                                          |
| --reasonerStream | Stream of cli reasoner. Reasoner show name conflict error and already exist index.ts file error. You can pass stdout or stderr |

## skipEmptyDir mechanishm

If you want to include `index.ts` file in your vcs(eg. git) what is useful choice.

### Origin tree structure

```text
# To-Be
├─ src/
│  ├─ component/
│  │  ├─ nav/
│  │  │  ├─ Nav.tsx
│  │  ├─ small/
│  │  │  ├─ Button.tsx
│  │  │  ├─ Input.tsx
│  │  ├─ large/
│  │  │  ├─ Tree.tsx
│  │  │  ├─ Grid.tsx
│  ├─ pages/
│  │  ├─ Hero.tsx
│  │  ├─ User.tsx
├─ App.tsx
```

### in case of skipEmptyDir value false

```text
# To-Be
├─ src/
│  ├─ component/
│  │  ├─ nav/
│  │  │  ├─ Nav.tsx
│  │  │  ├─ index.ts      # created
│  │  ├─ small/
│  │  │  ├─ Button.tsx
│  │  │  ├─ Input.tsx
│  │  │  ├─ index.ts      # created
│  │  ├─ large/
│  │  │  ├─ Tree.tsx
│  │  │  ├─ Grid.tsx
│  │  │  ├─ index.ts      # created
│  │  ├─ index.ts         # created
│  ├─ pages/
│  │  ├─ Hero.tsx
│  │  ├─ User.tsx
│  │  ├─ index.ts         # created
│  ├─ index.ts            # created
├─ App.tsx
├─ index.ts               # created
```

### in case of skipEmptyDir value true

Enabling the skipEmptyDir option does not create `index.ts` file in empty directories

```text
# To-Be
├─ src/
│  ├─ component/
│  │  ├─ nav/
│  │  │  ├─ Nav.tsx
│  │  │  ├─ index.ts      # created
│  │  ├─ small/
│  │  │  ├─ Button.tsx
│  │  │  ├─ Input.tsx
│  │  │  ├─ index.ts      # created
│  │  ├─ large/
│  │  │  ├─ Tree.tsx
│  │  │  ├─ Grid.tsx
│  │  │  ├─ index.ts      # created
│  ├─ pages/
│  │  ├─ Hero.tsx
│  │  ├─ User.tsx
│  │  ├─ index.ts         # created
├─ App.tsx
├─ index.ts               # created
```

#### `src/component/nav/index.ts`

```text
// created from 'ctix'
export * from './Nav';
```

#### `src/component/small/index.ts`

```text
// created from 'ctix'
export * from './Button';
export * from './Input';
```

#### `src/component/large/index.ts`

```text
// created from 'ctix'
export * from './Tree';
export * from './Grid';
```

#### `src/pages/index.ts`

```text
// created from 'ctix'
export * from './Hero';
export * from './User';
```

#### `index.ts`

```text
// created from 'ctix'
export * from './component/nav';
export * from './component/small';
export * from './component/large';
export * from './pages';
```
