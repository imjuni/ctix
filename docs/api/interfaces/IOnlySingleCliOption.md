# Interface: IOnlySingleCliOption

## Table of contents

### Properties

- [mode](IOnlySingleCliOption.md#mode)
- [o](IOnlySingleCliOption.md#o)
- [output](IOnlySingleCliOption.md#output)
- [r](IOnlySingleCliOption.md#r)
- [useRootDir](IOnlySingleCliOption.md#userootdir)

## Properties

### mode

• **mode**: ``"single"``

#### Defined in

[src/configs/interfaces/IOnlySingleCliOption.ts:2](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/IOnlySingleCliOption.ts#L2)

___

### o

• **o**: `string`

Output directory. Default value is same project directory

**`Mode`**

single

#### Defined in

[src/configs/interfaces/IOnlySingleCliOption.ts:8](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/IOnlySingleCliOption.ts#L8)

___

### output

• **output**: `string`

#### Defined in

[src/configs/interfaces/IOnlySingleCliOption.ts:9](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/IOnlySingleCliOption.ts#L9)

___

### r

• `Optional` **r**: `boolean`

Only work single file generation mode. use rootDir configuration in tsconfig.json.
Export file create under a rootDir directory. If you set rootDirs, ctix use first element of array.

**`Mode`**

single

**`Default`**

false

#### Defined in

[src/configs/interfaces/IOnlySingleCliOption.ts:17](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/IOnlySingleCliOption.ts#L17)

___

### useRootDir

• `Optional` **useRootDir**: `boolean`

#### Defined in

[src/configs/interfaces/IOnlySingleCliOption.ts:18](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/IOnlySingleCliOption.ts#L18)
