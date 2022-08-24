# Interface: ICreateSingleCommonCliOption

## Table of contents

### Properties

- [g](ICreateSingleCommonCliOption.md#g)
- [ignoreFile](ICreateSingleCommonCliOption.md#ignorefile)
- [k](ICreateSingleCommonCliOption.md#k)
- [keepFileExt](ICreateSingleCommonCliOption.md#keepfileext)
- [m](ICreateSingleCommonCliOption.md#m)
- [overwrite](ICreateSingleCommonCliOption.md#overwrite)
- [q](ICreateSingleCommonCliOption.md#q)
- [quote](ICreateSingleCommonCliOption.md#quote)
- [s](ICreateSingleCommonCliOption.md#s)
- [t](ICreateSingleCommonCliOption.md#t)
- [useComment](ICreateSingleCommonCliOption.md#usecomment)
- [useSemicolon](ICreateSingleCommonCliOption.md#usesemicolon)
- [useTimestamp](ICreateSingleCommonCliOption.md#usetimestamp)
- [w](ICreateSingleCommonCliOption.md#w)

## Properties

### g

• **g**: `string`

ignore file name. You can pass ignore, config file at ctix and use it like profile

**`Mode`**

create, single

**`Default`**

.ctiignore

#### Defined in

[src/configs/interfaces/ICreateSingleCommonCliOption.ts:94](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/ICreateSingleCommonCliOption.ts#L94)

___

### ignoreFile

• **ignoreFile**: `string`

#### Defined in

[src/configs/interfaces/ICreateSingleCommonCliOption.ts:95](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/ICreateSingleCommonCliOption.ts#L95)

___

### k

• `Optional` **k**: `boolean`

Keep file extension in index.ts file.

if this option set true that see below
export * from './test.ts'

**`Mode`**

create, single

**`Default`**

false

#### Defined in

[src/configs/interfaces/ICreateSingleCommonCliOption.ts:76](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/ICreateSingleCommonCliOption.ts#L76)

___

### keepFileExt

• `Optional` **keepFileExt**: `boolean`

keep file extension in export statement path

if this option set true that see below
export * from './test.ts'

**`Mode`**

create, single

**`Default`**

false

#### Defined in

[src/configs/interfaces/ICreateSingleCommonCliOption.ts:86](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/ICreateSingleCommonCliOption.ts#L86)

___

### m

• `Optional` **m**: `boolean`

add ctix comment at first line of creted index.ts file, that remark created from ctix

**`Mode`**

create, single

**`Default`**

false

#### Defined in

[src/configs/interfaces/ICreateSingleCommonCliOption.ts:33](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/ICreateSingleCommonCliOption.ts#L33)

___

### overwrite

• `Optional` **overwrite**: `boolean`

overwrite each index.ts file

**`Mode`**

create, single

**`Default`**

false

#### Defined in

[src/configs/interfaces/ICreateSingleCommonCliOption.ts:65](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/ICreateSingleCommonCliOption.ts#L65)

___

### q

• `Optional` **q**: `string`

quote mark " or '

**`Mode`**

create, single

**`Default`**

'

#### Defined in

[src/configs/interfaces/ICreateSingleCommonCliOption.ts:46](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/ICreateSingleCommonCliOption.ts#L46)

___

### quote

• `Optional` **quote**: `string`

quote mark " or '

**`Mode`**

create, single

**`Default`**

'

#### Defined in

[src/configs/interfaces/ICreateSingleCommonCliOption.ts:52](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/ICreateSingleCommonCliOption.ts#L52)

___

### s

• `Optional` **s**: `boolean`

add ctix comment at first line of creted index.ts file, that remark created from ctix

**`Mode`**

create, single

**`Default`**

false

#### Defined in

[src/configs/interfaces/ICreateSingleCommonCliOption.ts:7](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/ICreateSingleCommonCliOption.ts#L7)

___

### t

• `Optional` **t**: `boolean`

timestamp write on ctix comment right-side, only works in useComment option set true

**`Mode`**

create, single

**`Default`**

false

#### Defined in

[src/configs/interfaces/ICreateSingleCommonCliOption.ts:20](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/ICreateSingleCommonCliOption.ts#L20)

___

### useComment

• `Optional` **useComment**: `boolean`

add ctix comment at first line of creted index.ts file, that remark created from ctix

**`Mode`**

create, single

**`Default`**

false

#### Defined in

[src/configs/interfaces/ICreateSingleCommonCliOption.ts:39](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/ICreateSingleCommonCliOption.ts#L39)

___

### useSemicolon

• `Optional` **useSemicolon**: `boolean`

add ctix comment at first line of creted index.ts file, that remark created from ctix

**`Mode`**

create, single

**`Default`**

false

#### Defined in

[src/configs/interfaces/ICreateSingleCommonCliOption.ts:13](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/ICreateSingleCommonCliOption.ts#L13)

___

### useTimestamp

• `Optional` **useTimestamp**: `boolean`

timestamp write on ctix comment right-side, only works in useComment option set true

**`Mode`**

create, single

**`Default`**

false

#### Defined in

[src/configs/interfaces/ICreateSingleCommonCliOption.ts:26](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/ICreateSingleCommonCliOption.ts#L26)

___

### w

• `Optional` **w**: `boolean`

overwrite each index.ts file

**`Mode`**

create, single

**`Default`**

false

#### Defined in

[src/configs/interfaces/ICreateSingleCommonCliOption.ts:59](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/ICreateSingleCommonCliOption.ts#L59)
