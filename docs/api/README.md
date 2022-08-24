# ctix

## Table of contents

### Interfaces

- [ICommonCliOption](interfaces/ICommonCliOption.md)
- [ICreateIndexInfo](interfaces/ICreateIndexInfo.md)
- [ICreateIndexInfos](interfaces/ICreateIndexInfos.md)
- [ICreateSingleCommonCliOption](interfaces/ICreateSingleCommonCliOption.md)
- [IDescendantExportInfo](interfaces/IDescendantExportInfo.md)
- [IDirectoryInfo](interfaces/IDirectoryInfo.md)
- [IExportInfo](interfaces/IExportInfo.md)
- [IGetIgnoreConfigFiles](interfaces/IGetIgnoreConfigFiles.md)
- [IGetIgnoredConfigContents](interfaces/IGetIgnoredConfigContents.md)
- [IIdentifierWithNode](interfaces/IIdentifierWithNode.md)
- [IOnlyCreateCliOption](interfaces/IOnlyCreateCliOption.md)
- [IOnlyRemoveCliOption](interfaces/IOnlyRemoveCliOption.md)
- [IOnlySingleCliOption](interfaces/IOnlySingleCliOption.md)
- [IReason](interfaces/IReason.md)

### Type Aliases

- [TCreateOption](README.md#tcreateoption)
- [TCreateOptionWithDirInfo](README.md#tcreateoptionwithdirinfo)
- [TCreateOrSingleOption](README.md#tcreateorsingleoption)
- [TInitOption](README.md#tinitoption)
- [TRemoveOption](README.md#tremoveoption)
- [TRemoveOptionWithDirInfo](README.md#tremoveoptionwithdirinfo)
- [TSingleOption](README.md#tsingleoption)
- [TSingleOptionWithDirInfo](README.md#tsingleoptionwithdirinfo)
- [TTInitOptionWithDirInfo](README.md#ttinitoptionwithdirinfo)

### Variables

- [cleanOption](README.md#cleanoption)
- [cleanOptionWithDirInfo](README.md#cleanoptionwithdirinfo)
- [commonOption](README.md#commonoption)
- [createOption](README.md#createoption)
- [createOptionWithDirInfo](README.md#createoptionwithdirinfo)
- [createSingleCommonOption](README.md#createsinglecommonoption)
- [defaultIgnore](README.md#defaultignore)
- [defaultIgnoreFileName](README.md#defaultignorefilename)
- [examplePath](README.md#examplepath)
- [exampleRcloaderPath](README.md#examplercloaderpath)
- [exampleType01Path](README.md#exampletype01path)
- [exampleType02Path](README.md#exampletype02path)
- [exampleType03Path](README.md#exampletype03path)
- [exampleType04Path](README.md#exampletype04path)
- [exampleType05Path](README.md#exampletype05path)
- [exampleType06Path](README.md#exampletype06path)
- [extensions](README.md#extensions)
- [initialConfigLiteral](README.md#initialconfigliteral)
- [singleOption](README.md#singleoption)
- [singleOptionWithDirInfo](README.md#singleoptionwithdirinfo)

### Functions

- [appendDotDirPrefix](README.md#appenddotdirprefix)
- [attachDiretoryInfo](README.md#attachdiretoryinfo)
- [builder](README.md#builder)
- [createDescendantIndex](README.md#createdescendantindex)
- [createIndexInfo](README.md#createindexinfo)
- [createIndexInfos](README.md#createindexinfos)
- [createInitFile](README.md#createinitfile)
- [createSingleBuilder](README.md#createsinglebuilder)
- [createWritor](README.md#createwritor)
- [fastGlobWrap](README.md#fastglobwrap)
- [getCliCreateOption](README.md#getclicreateoption)
- [getCliRemoveOption](README.md#getcliremoveoption)
- [getCliSingleOption](README.md#getclisingleoption)
- [getCtiIgnorePattern](README.md#getctiignorepattern)
- [getCtiignoreFiles](README.md#getctiignorefiles)
- [getDepth](README.md#getdepth)
- [getDescendantExportInfo](README.md#getdescendantexportinfo)
- [getDirPaths](README.md#getdirpaths)
- [getEOL](README.md#geteol)
- [getExportInfo](README.md#getexportinfo)
- [getExportInfos](README.md#getexportinfos)
- [getExportedName](README.md#getexportedname)
- [getExtname](README.md#getextname)
- [getFilePathOnIndex](README.md#getfilepathonindex)
- [getGitignoreFiles](README.md#getgitignorefiles)
- [getIgnoreConfigContents](README.md#getignoreconfigcontents)
- [getIgnoreConfigFiles](README.md#getignoreconfigfiles)
- [getIsIsolatedModules](README.md#getisisolatedmodules)
- [getNpmignoreFiles](README.md#getnpmignorefiles)
- [getOutputDir](README.md#getoutputdir)
- [getRefineIgnorePath](README.md#getrefineignorepath)
- [getRefinedFilename](README.md#getrefinedfilename)
- [getRelativeDepth](README.md#getrelativedepth)
- [getRemoveFiles](README.md#getremovefiles)
- [getSourceFileEol](README.md#getsourcefileeol)
- [getTestValue](README.md#gettestvalue)
- [getTsconfigRootDir](README.md#gettsconfigrootdir)
- [getTypeScriptConfig](README.md#gettypescriptconfig)
- [getTypeScriptProject](README.md#gettypescriptproject)
- [getTypeSymbolText](README.md#gettypesymboltext)
- [indexFileWrite](README.md#indexfilewrite)
- [initBuilder](README.md#initbuilder)
- [isIgnored](README.md#isignored)
- [jsonLoader](README.md#jsonloader)
- [mergeCreateIndexInfo](README.md#mergecreateindexinfo)
- [posixJoin](README.md#posixjoin)
- [preLoadConfig](README.md#preloadconfig)
- [prettierApply](README.md#prettierapply)
- [removeBuilder](README.md#removebuilder)
- [removeIndexFile](README.md#removeindexfile)
- [settify](README.md#settify)
- [singleIndexInfo](README.md#singleindexinfo)
- [singleIndexInfos](README.md#singleindexinfos)
- [singleWritor](README.md#singlewritor)
- [validateExportDuplication](README.md#validateexportduplication)
- [validateFileNameDuplication](README.md#validatefilenameduplication)

## Type Aliases

### TCreateOption

Ƭ **TCreateOption**: [`ICommonCliOption`](interfaces/ICommonCliOption.md) & [`ICreateSingleCommonCliOption`](interfaces/ICreateSingleCommonCliOption.md) & [`IOnlyCreateCliOption`](interfaces/IOnlyCreateCliOption.md)

#### Defined in

[src/configs/interfaces/IOption.ts:8](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/IOption.ts#L8)

___

### TCreateOptionWithDirInfo

Ƭ **TCreateOptionWithDirInfo**: [`TCreateOption`](README.md#tcreateoption) & [`IDirectoryInfo`](interfaces/IDirectoryInfo.md)

#### Defined in

[src/configs/interfaces/IOption.ts:9](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/IOption.ts#L9)

___

### TCreateOrSingleOption

Ƭ **TCreateOrSingleOption**: [`TCreateOptionWithDirInfo`](README.md#tcreateoptionwithdirinfo) \| [`TSingleOptionWithDirInfo`](README.md#tsingleoptionwithdirinfo)

#### Defined in

[src/configs/interfaces/IOption.ts:28](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/IOption.ts#L28)

___

### TInitOption

Ƭ **TInitOption**: { `mode`: ``"init"``  } & [`ICommonCliOption`](interfaces/ICommonCliOption.md) & `Omit`<[`ICreateSingleCommonCliOption`](interfaces/ICreateSingleCommonCliOption.md), ``"mode"``\> & `Omit`<[`IOnlyCreateCliOption`](interfaces/IOnlyCreateCliOption.md), ``"mode"``\> & `Omit`<[`IOnlySingleCliOption`](interfaces/IOnlySingleCliOption.md), ``"mode"``\> & `Omit`<[`IOnlyRemoveCliOption`](interfaces/IOnlyRemoveCliOption.md), ``"mode"`` \| ``"e"``\>

#### Defined in

[src/configs/interfaces/IOption.ts:17](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/IOption.ts#L17)

___

### TRemoveOption

Ƭ **TRemoveOption**: [`ICommonCliOption`](interfaces/ICommonCliOption.md) & [`IOnlyRemoveCliOption`](interfaces/IOnlyRemoveCliOption.md)

#### Defined in

[src/configs/interfaces/IOption.ts:14](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/IOption.ts#L14)

___

### TRemoveOptionWithDirInfo

Ƭ **TRemoveOptionWithDirInfo**: [`TRemoveOption`](README.md#tremoveoption) & [`IDirectoryInfo`](interfaces/IDirectoryInfo.md)

#### Defined in

[src/configs/interfaces/IOption.ts:15](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/IOption.ts#L15)

___

### TSingleOption

Ƭ **TSingleOption**: [`ICommonCliOption`](interfaces/ICommonCliOption.md) & [`ICreateSingleCommonCliOption`](interfaces/ICreateSingleCommonCliOption.md) & [`IOnlySingleCliOption`](interfaces/IOnlySingleCliOption.md)

#### Defined in

[src/configs/interfaces/IOption.ts:11](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/IOption.ts#L11)

___

### TSingleOptionWithDirInfo

Ƭ **TSingleOptionWithDirInfo**: [`TSingleOption`](README.md#tsingleoption) & [`IDirectoryInfo`](interfaces/IDirectoryInfo.md)

#### Defined in

[src/configs/interfaces/IOption.ts:12](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/IOption.ts#L12)

___

### TTInitOptionWithDirInfo

Ƭ **TTInitOptionWithDirInfo**: `Omit`<[`TInitOption`](README.md#tinitoption), ``"p"`` \| ``"f"`` \| ``"s"`` \| ``"m"`` \| ``"t"`` \| ``"q"`` \| ``"b"`` \| ``"k"`` \| ``"e"`` \| ``"o"`` \| ``"r"``\> & [`IDirectoryInfo`](interfaces/IDirectoryInfo.md)

#### Defined in

[src/configs/interfaces/IOption.ts:22](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/IOption.ts#L22)

## Variables

### cleanOption

• `Const` **cleanOption**: [`TRemoveOption`](README.md#tremoveoption)

#### Defined in

[src/testenv/env.ts:72](https://github.com/imjuni/ctix/blob/9bd0760/src/testenv/env.ts#L72)

___

### cleanOptionWithDirInfo

• `Const` **cleanOptionWithDirInfo**: [`ICommonCliOption`](interfaces/ICommonCliOption.md) & [`IOnlyRemoveCliOption`](interfaces/IOnlyRemoveCliOption.md) & [`IDirectoryInfo`](interfaces/IDirectoryInfo.md)

#### Defined in

[src/testenv/env.ts:82](https://github.com/imjuni/ctix/blob/9bd0760/src/testenv/env.ts#L82)

___

### commonOption

• `Const` **commonOption**: [`ICommonCliOption`](interfaces/ICommonCliOption.md)

#### Defined in

[src/testenv/env.ts:21](https://github.com/imjuni/ctix/blob/9bd0760/src/testenv/env.ts#L21)

___

### createOption

• `Const` **createOption**: [`TCreateOption`](README.md#tcreateoption)

#### Defined in

[src/testenv/env.ts:52](https://github.com/imjuni/ctix/blob/9bd0760/src/testenv/env.ts#L52)

___

### createOptionWithDirInfo

• `Const` **createOptionWithDirInfo**: [`ICommonCliOption`](interfaces/ICommonCliOption.md) & [`ICreateSingleCommonCliOption`](interfaces/ICreateSingleCommonCliOption.md) & [`IOnlyCreateCliOption`](interfaces/IOnlyCreateCliOption.md) & [`IDirectoryInfo`](interfaces/IDirectoryInfo.md)

#### Defined in

[src/testenv/env.ts:80](https://github.com/imjuni/ctix/blob/9bd0760/src/testenv/env.ts#L80)

___

### createSingleCommonOption

• `Const` **createSingleCommonOption**: [`ICreateSingleCommonCliOption`](interfaces/ICreateSingleCommonCliOption.md)

#### Defined in

[src/testenv/env.ts:32](https://github.com/imjuni/ctix/blob/9bd0760/src/testenv/env.ts#L32)

___

### defaultIgnore

• `Const` **defaultIgnore**: `string`[]

#### Defined in

[src/ignores/defaultIgnore.ts:1](https://github.com/imjuni/ctix/blob/9bd0760/src/ignores/defaultIgnore.ts#L1)

___

### defaultIgnoreFileName

• `Const` **defaultIgnoreFileName**: ``".ctiignore"``

#### Defined in

[src/configs/defaultIgnoreFileName.ts:1](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/defaultIgnoreFileName.ts#L1)

___

### examplePath

• `Const` **examplePath**: `string`

#### Defined in

[src/testenv/env.ts:10](https://github.com/imjuni/ctix/blob/9bd0760/src/testenv/env.ts#L10)

___

### exampleRcloaderPath

• `Const` **exampleRcloaderPath**: `string`

#### Defined in

[src/testenv/env.ts:13](https://github.com/imjuni/ctix/blob/9bd0760/src/testenv/env.ts#L13)

___

### exampleType01Path

• `Const` **exampleType01Path**: `string`

#### Defined in

[src/testenv/env.ts:14](https://github.com/imjuni/ctix/blob/9bd0760/src/testenv/env.ts#L14)

___

### exampleType02Path

• `Const` **exampleType02Path**: `string`

#### Defined in

[src/testenv/env.ts:15](https://github.com/imjuni/ctix/blob/9bd0760/src/testenv/env.ts#L15)

___

### exampleType03Path

• `Const` **exampleType03Path**: `string`

#### Defined in

[src/testenv/env.ts:16](https://github.com/imjuni/ctix/blob/9bd0760/src/testenv/env.ts#L16)

___

### exampleType04Path

• `Const` **exampleType04Path**: `string`

#### Defined in

[src/testenv/env.ts:17](https://github.com/imjuni/ctix/blob/9bd0760/src/testenv/env.ts#L17)

___

### exampleType05Path

• `Const` **exampleType05Path**: `string`

#### Defined in

[src/testenv/env.ts:18](https://github.com/imjuni/ctix/blob/9bd0760/src/testenv/env.ts#L18)

___

### exampleType06Path

• `Const` **exampleType06Path**: `string`

#### Defined in

[src/testenv/env.ts:19](https://github.com/imjuni/ctix/blob/9bd0760/src/testenv/env.ts#L19)

___

### extensions

• `Const` **extensions**: `string`[]

#### Defined in

[src/tools/extensions.ts:15](https://github.com/imjuni/ctix/blob/9bd0760/src/tools/extensions.ts#L15)

___

### initialConfigLiteral

• `Const` **initialConfigLiteral**: ``"{\n  // common configuration\n  // tsconfig.json path: you must pass path with filename, like this \"./tsconfig.json\"\n  \"project\": \"\",\n  \n  // Export filename, if you not pass this field that use \"index.ts\" or \"index.d.ts\"\n  \"exportFilename\": \"index.ts\",\n\n\n  // create, single command configuration\n  // add ctix comment at first line of creted index.ts file, that remark created from ctix\n  \"useSemicolon\": true,\n\n  // timestamp write on ctix comment right-side, only works in useComment option set true\n  \"useTimestamp\": false,\n  \n  // add ctix comment at first line of creted index.ts file, that remark created from ctix\n  \"useComment\": false,\n\n  // quote mark \" or '\n  \"quote\": \"'\",\n  // overwrite index.ts file also index.ts file already exist that create backup file\n  \"overwrite\": false,\n  // keep file extension in export statement path\n  \"keepFileExt\": false,\n\n  \n  // only create command configuration\n  // If set true this option, skip empty directory\n  \"skipEmptyDir\": true,\n\n\n  // only single command configuration\n  // Output directory. It works only single mode.\n  \"output\": \"\",\n  // Use rootDir or rootDirs configuration in tsconfig.json.\n  \"useRootDir\": true,\n\n  // only remove command configuration\n  // remove with backup file\n  \"includeBackup\": true\n}"``

#### Defined in

[src/configs/initialConfigLiteral.ts:1](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/initialConfigLiteral.ts#L1)

___

### singleOption

• `Const` **singleOption**: [`TSingleOption`](README.md#tsingleoption)

#### Defined in

[src/testenv/env.ts:61](https://github.com/imjuni/ctix/blob/9bd0760/src/testenv/env.ts#L61)

___

### singleOptionWithDirInfo

• `Const` **singleOptionWithDirInfo**: [`ICommonCliOption`](interfaces/ICommonCliOption.md) & [`ICreateSingleCommonCliOption`](interfaces/ICreateSingleCommonCliOption.md) & [`IOnlySingleCliOption`](interfaces/IOnlySingleCliOption.md) & [`IDirectoryInfo`](interfaces/IDirectoryInfo.md)

#### Defined in

[src/testenv/env.ts:81](https://github.com/imjuni/ctix/blob/9bd0760/src/testenv/env.ts#L81)

## Functions

### appendDotDirPrefix

▸ **appendDotDirPrefix**(`filePath`, `sep?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |
| `sep?` | `string` |

#### Returns

`string`

#### Defined in

[src/tools/appendDotDirPrefix.ts:3](https://github.com/imjuni/ctix/blob/9bd0760/src/tools/appendDotDirPrefix.ts#L3)

___

### attachDiretoryInfo

▸ **attachDiretoryInfo**<`T`\>(`option`): `T` & [`IDirectoryInfo`](interfaces/IDirectoryInfo.md)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`TCreateOption`](README.md#tcreateoption) \| [`TSingleOption`](README.md#tsingleoption) \| [`TRemoveOption`](README.md#tremoveoption) \| [`TInitOption`](README.md#tinitoption) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `option` | `T` |

#### Returns

`T` & [`IDirectoryInfo`](interfaces/IDirectoryInfo.md)

#### Defined in

[src/configs/attachDiretoryInfo.ts:42](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/attachDiretoryInfo.ts#L42)

___

### builder

▸ **builder**<`T`\>(`args`): `Argv`<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`TCreateOption`](README.md#tcreateoption) \| [`TSingleOption`](README.md#tsingleoption) \| [`TRemoveOption`](README.md#tremoveoption) \| [`TInitOption`](README.md#tinitoption) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `Argv`<`T`\> |

#### Returns

`Argv`<`T`\>

#### Defined in

[src/cli/builder.ts:9](https://github.com/imjuni/ctix/blob/9bd0760/src/cli/builder.ts#L9)

___

### createDescendantIndex

▸ **createDescendantIndex**(`dirPath`, `exportInfos`, `ignores`, `option`): `Promise`<[`ICreateIndexInfo`](interfaces/ICreateIndexInfo.md)[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `dirPath` | `string` | base directory for extract descendant directory |
| `exportInfos` | [`IExportInfo`](interfaces/IExportInfo.md)[] | every exportInfos |
| `ignores` | `IGetIgnoreConfigContentsReturn` | - |
| `option` | [`TCreateOrSingleOption`](README.md#tcreateorsingleoption) | ctix option |

#### Returns

`Promise`<[`ICreateIndexInfo`](interfaces/ICreateIndexInfo.md)[]\>

descendant directory index info

#### Defined in

[src/modules/createDescendantIndex.ts:42](https://github.com/imjuni/ctix/blob/9bd0760/src/modules/createDescendantIndex.ts#L42)

___

### createIndexInfo

▸ **createIndexInfo**(`exportInfo`, `option`): [`ICreateIndexInfo`](interfaces/ICreateIndexInfo.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `exportInfo` | [`IExportInfo`](interfaces/IExportInfo.md) |
| `option` | [`TCreateOrSingleOption`](README.md#tcreateorsingleoption) |

#### Returns

[`ICreateIndexInfo`](interfaces/ICreateIndexInfo.md)[]

#### Defined in

[src/modules/createIndexInfo.ts:8](https://github.com/imjuni/ctix/blob/9bd0760/src/modules/createIndexInfo.ts#L8)

___

### createIndexInfos

▸ **createIndexInfos**(`exportInfos`, `ignores`, `option`): `Promise`<[`ICreateIndexInfos`](interfaces/ICreateIndexInfos.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `exportInfos` | [`IExportInfo`](interfaces/IExportInfo.md)[] |
| `ignores` | `IGetIgnoreConfigContentsReturn` |
| `option` | [`TCreateOrSingleOption`](README.md#tcreateorsingleoption) |

#### Returns

`Promise`<[`ICreateIndexInfos`](interfaces/ICreateIndexInfos.md)[]\>

#### Defined in

[src/modules/createIndexInfos.ts:14](https://github.com/imjuni/ctix/blob/9bd0760/src/modules/createIndexInfos.ts#L14)

___

### createInitFile

▸ **createInitFile**(`option`, `isMessageDisplay?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `option` | [`TTInitOptionWithDirInfo`](README.md#ttinitoptionwithdirinfo) |
| `isMessageDisplay?` | `boolean` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/ctix.ts:181](https://github.com/imjuni/ctix/blob/9bd0760/src/ctix.ts#L181)

___

### createSingleBuilder

▸ **createSingleBuilder**<`T`\>(`args`): `Argv`<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`TCreateOption`](README.md#tcreateoption) \| [`TSingleOption`](README.md#tsingleoption) \| [`TRemoveOption`](README.md#tremoveoption) \| [`TInitOption`](README.md#tinitoption) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `Argv`<`T`\> |

#### Returns

`Argv`<`T`\>

#### Defined in

[src/cli/createSingleBuilder.ts:9](https://github.com/imjuni/ctix/blob/9bd0760/src/cli/createSingleBuilder.ts#L9)

___

### createWritor

▸ **createWritor**(`option`, `isMessageDisplay?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `option` | [`TCreateOptionWithDirInfo`](README.md#tcreateoptionwithdirinfo) |
| `isMessageDisplay?` | `boolean` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/ctix.ts:29](https://github.com/imjuni/ctix/blob/9bd0760/src/ctix.ts#L29)

___

### fastGlobWrap

▸ **fastGlobWrap**(`pattern`, `options`, `sep?`): `Promise`<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `pattern` | `string` \| `string`[] |
| `options` | `undefined` \| `Options` |
| `sep?` | `string` |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[src/tools/misc.ts:17](https://github.com/imjuni/ctix/blob/9bd0760/src/tools/misc.ts#L17)

___

### getCliCreateOption

▸ **getCliCreateOption**(`configBuf`, `argv`, `configFilePath`, `project`): [`TCreateOption`](README.md#tcreateoption)

#### Parameters

| Name | Type |
| :------ | :------ |
| `configBuf` | `Buffer` |
| `argv` | `ArgumentsCamelCase`<[`TCreateOption`](README.md#tcreateoption)\> |
| `configFilePath` | `string` |
| `project` | `string` |

#### Returns

[`TCreateOption`](README.md#tcreateoption)

#### Defined in

[src/configs/getCliCreateOption.ts:6](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/getCliCreateOption.ts#L6)

___

### getCliRemoveOption

▸ **getCliRemoveOption**(`configBuf`, `argv`, `configFilePath`, `project`): [`TRemoveOption`](README.md#tremoveoption)

#### Parameters

| Name | Type |
| :------ | :------ |
| `configBuf` | `Buffer` |
| `argv` | `ArgumentsCamelCase`<[`TRemoveOption`](README.md#tremoveoption)\> |
| `configFilePath` | `string` |
| `project` | `string` |

#### Returns

[`TRemoveOption`](README.md#tremoveoption)

#### Defined in

[src/configs/getCliRemoveOption.ts:5](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/getCliRemoveOption.ts#L5)

___

### getCliSingleOption

▸ **getCliSingleOption**(`configBuf`, `argv`, `configFilePath`, `project`): [`TSingleOption`](README.md#tsingleoption)

#### Parameters

| Name | Type |
| :------ | :------ |
| `configBuf` | `Buffer` |
| `argv` | `ArgumentsCamelCase`<[`TSingleOption`](README.md#tsingleoption)\> |
| `configFilePath` | `string` |
| `project` | `string` |

#### Returns

[`TSingleOption`](README.md#tsingleoption)

#### Defined in

[src/configs/getCliSingleOption.ts:7](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/getCliSingleOption.ts#L7)

___

### getCtiIgnorePattern

▸ **getCtiIgnorePattern**(`ig`, `filePath`): `undefined` \| `string` \| `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `ig` | `IGetIgnoreConfigContentsReturn` |
| `filePath` | `string` |

#### Returns

`undefined` \| `string` \| `string`[]

#### Defined in

[src/ignores/getCtiIgnorePattern.ts:5](https://github.com/imjuni/ctix/blob/9bd0760/src/ignores/getCtiIgnorePattern.ts#L5)

___

### getCtiignoreFiles

▸ **getCtiignoreFiles**(`filePath`): `Promise`<`IGetCtiignoreFilesReturn`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

#### Returns

`Promise`<`IGetCtiignoreFilesReturn`\>

#### Defined in

[src/ignores/getCtiignoreFiles.ts:19](https://github.com/imjuni/ctix/blob/9bd0760/src/ignores/getCtiignoreFiles.ts#L19)

___

### getDepth

▸ **getDepth**(`dirPath`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `dirPath` | `string` |

#### Returns

`number`

#### Defined in

[src/tools/getDepth.ts:4](https://github.com/imjuni/ctix/blob/9bd0760/src/tools/getDepth.ts#L4)

___

### getDescendantExportInfo

▸ **getDescendantExportInfo**(`parentFilePath`, `option`, `exportInfos`, `ignores`): `Promise`<[`IDescendantExportInfo`](interfaces/IDescendantExportInfo.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `parentFilePath` | `string` |
| `option` | [`TCreateOrSingleOption`](README.md#tcreateorsingleoption) |
| `exportInfos` | [`IExportInfo`](interfaces/IExportInfo.md)[] |
| `ignores` | `IGetIgnoreConfigContentsReturn` |

#### Returns

`Promise`<[`IDescendantExportInfo`](interfaces/IDescendantExportInfo.md)[]\>

#### Defined in

[src/modules/getDescendantExportInfo.ts:15](https://github.com/imjuni/ctix/blob/9bd0760/src/modules/getDescendantExportInfo.ts#L15)

___

### getDirPaths

▸ **getDirPaths**(`exportInfos`, `ignores`, `option`): `Promise`<{ `depths`: `Record`<`string`, `number`\> ; `dirPaths`: `Record`<`string`, [`IExportInfo`](interfaces/IExportInfo.md)[]\>  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `exportInfos` | [`IExportInfo`](interfaces/IExportInfo.md)[] |
| `ignores` | `IGetIgnoreConfigContentsReturn` |
| `option` | [`TCreateOrSingleOption`](README.md#tcreateorsingleoption) |

#### Returns

`Promise`<{ `depths`: `Record`<`string`, `number`\> ; `dirPaths`: `Record`<`string`, [`IExportInfo`](interfaces/IExportInfo.md)[]\>  }\>

#### Defined in

[src/modules/getDirPaths.ts:21](https://github.com/imjuni/ctix/blob/9bd0760/src/modules/getDirPaths.ts#L21)

___

### getEOL

▸ **getEOL**(`text`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |

#### Returns

`string`

#### Defined in

[src/configs/getSourceFileEol.ts:6](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/getSourceFileEol.ts#L6)

___

### getExportInfo

▸ **getExportInfo**(`sourceFile`, `option`, `ignores`): `Promise`<[`IExportInfo`](interfaces/IExportInfo.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sourceFile` | `SourceFile` |
| `option` | [`TCreateOrSingleOption`](README.md#tcreateorsingleoption) |
| `ignores` | `IGetIgnoreConfigContentsReturn` |

#### Returns

`Promise`<[`IExportInfo`](interfaces/IExportInfo.md)\>

#### Defined in

[src/compilers/getExportInfo.ts:32](https://github.com/imjuni/ctix/blob/9bd0760/src/compilers/getExportInfo.ts#L32)

___

### getExportInfos

▸ **getExportInfos**(`project`, `option`, `ignores`): `Promise`<[`IExportInfo`](interfaces/IExportInfo.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `project` | `Project` |
| `option` | [`TCreateOrSingleOption`](README.md#tcreateorsingleoption) |
| `ignores` | `IGetIgnoreConfigContentsReturn` |

#### Returns

`Promise`<[`IExportInfo`](interfaces/IExportInfo.md)[]\>

#### Defined in

[src/compilers/getExportInfos.ts:11](https://github.com/imjuni/ctix/blob/9bd0760/src/compilers/getExportInfos.ts#L11)

___

### getExportedName

▸ **getExportedName**(`exportedDeclarationNode`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `exportedDeclarationNode` | `ExportedDeclarations` |

#### Returns

`string`

#### Defined in

[src/compilers/getExportedName.ts:5](https://github.com/imjuni/ctix/blob/9bd0760/src/compilers/getExportedName.ts#L5)

___

### getExtname

▸ **getExtname**(`filePath`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

#### Returns

`string`

#### Defined in

[src/tools/getExtname.ts:5](https://github.com/imjuni/ctix/blob/9bd0760/src/tools/getExtname.ts#L5)

___

### getFilePathOnIndex

▸ **getFilePathOnIndex**(`filePath`, `option`, `relativePath?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |
| `option` | [`TCreateOrSingleOption`](README.md#tcreateorsingleoption) |
| `relativePath?` | `string` |

#### Returns

`string`

#### Defined in

[src/modules/getFilePathOnIndex.ts:90](https://github.com/imjuni/ctix/blob/9bd0760/src/modules/getFilePathOnIndex.ts#L90)

___

### getGitignoreFiles

▸ **getGitignoreFiles**(`filePath`): `Promise`<{ `ignore`: `Ignore` ; `patterns`: `string`[] ; `state?`: `gitignore.State`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

#### Returns

`Promise`<{ `ignore`: `Ignore` ; `patterns`: `string`[] ; `state?`: `gitignore.State`  }\>

#### Defined in

[src/ignores/getGitignoreFiles.ts:9](https://github.com/imjuni/ctix/blob/9bd0760/src/ignores/getGitignoreFiles.ts#L9)

___

### getIgnoreConfigContents

▸ **getIgnoreConfigContents**(`__namedParameters`): `Promise`<`IGetIgnoreConfigContentsReturn`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`IGetIgnoreConfigFiles`](interfaces/IGetIgnoreConfigFiles.md) & { `cwd`: `string`  } |

#### Returns

`Promise`<`IGetIgnoreConfigContentsReturn`\>

#### Defined in

[src/ignores/getIgnoreConfigContents.ts:20](https://github.com/imjuni/ctix/blob/9bd0760/src/ignores/getIgnoreConfigContents.ts#L20)

___

### getIgnoreConfigFiles

▸ **getIgnoreConfigFiles**(`cwd`, `ignoreFilePath`): `Promise`<[`IGetIgnoreConfigFiles`](interfaces/IGetIgnoreConfigFiles.md)\>

extract create-ts-index ignore file by glob pattern in cwd(current working directory)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cwd` | `string` | current working directory |
| `ignoreFilePath` | `string` | - |

#### Returns

`Promise`<[`IGetIgnoreConfigFiles`](interfaces/IGetIgnoreConfigFiles.md)\>

return value is eithered. string array or error class.

#### Defined in

[src/ignores/getIgnoreConfigFiles.ts:16](https://github.com/imjuni/ctix/blob/9bd0760/src/ignores/getIgnoreConfigFiles.ts#L16)

___

### getIsIsolatedModules

▸ **getIsIsolatedModules**(`exportedDeclarationNode`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `exportedDeclarationNode` | `ExportedDeclarations` |

#### Returns

`boolean`

#### Defined in

[src/compilers/getIsIsolatedModules.ts:4](https://github.com/imjuni/ctix/blob/9bd0760/src/compilers/getIsIsolatedModules.ts#L4)

___

### getNpmignoreFiles

▸ **getNpmignoreFiles**(`filePath`): `Promise`<{ `origin`: `string`[] ; `patterns`: `string`[] ; `state?`: `gitignore.State`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

#### Returns

`Promise`<{ `origin`: `string`[] ; `patterns`: `string`[] ; `state?`: `gitignore.State`  }\>

#### Defined in

[src/ignores/getNpmignoreFiles.ts:8](https://github.com/imjuni/ctix/blob/9bd0760/src/ignores/getNpmignoreFiles.ts#L8)

___

### getOutputDir

▸ **getOutputDir**(`project`, `option`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `project` | `Project` |
| `option` | [`TSingleOptionWithDirInfo`](README.md#tsingleoptionwithdirinfo) |

#### Returns

`string`

#### Defined in

[src/writes/getOutputDir.ts:24](https://github.com/imjuni/ctix/blob/9bd0760/src/writes/getOutputDir.ts#L24)

___

### getRefineIgnorePath

▸ **getRefineIgnorePath**(`filePath`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

#### Returns

`string`

#### Defined in

[src/ignores/getRefineIgnorePath.ts:3](https://github.com/imjuni/ctix/blob/9bd0760/src/ignores/getRefineIgnorePath.ts#L3)

___

### getRefinedFilename

▸ **getRefinedFilename**(`filename`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `filename` | `string` |

#### Returns

`string`

#### Defined in

[src/tools/getRefinedFilename.ts:5](https://github.com/imjuni/ctix/blob/9bd0760/src/tools/getRefinedFilename.ts#L5)

___

### getRelativeDepth

▸ **getRelativeDepth**(`basePaths`, `dirPath`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `basePaths` | `string` \| `string`[] |
| `dirPath` | `string` |

#### Returns

`number`

#### Defined in

[src/tools/getRelativeDepth.ts:4](https://github.com/imjuni/ctix/blob/9bd0760/src/tools/getRelativeDepth.ts#L4)

___

### getRemoveFiles

▸ **getRemoveFiles**(`project`, `option`): `Promise`<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `project` | `Project` |
| `option` | [`TRemoveOptionWithDirInfo`](README.md#tremoveoptionwithdirinfo) |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[src/modules/getRemoveFiles.ts:7](https://github.com/imjuni/ctix/blob/9bd0760/src/modules/getRemoveFiles.ts#L7)

___

### getSourceFileEol

▸ **getSourceFileEol**(`sourceFiles`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sourceFiles` | `string`[] |

#### Returns

`string`

#### Defined in

[src/configs/getSourceFileEol.ts:23](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/getSourceFileEol.ts#L23)

___

### getTestValue

▸ **getTestValue**<`T`\>(`testData`): `any`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `testData` | `T` |

#### Returns

`any`

#### Defined in

[src/tools/misc.ts:31](https://github.com/imjuni/ctix/blob/9bd0760/src/tools/misc.ts#L31)

___

### getTsconfigRootDir

▸ **getTsconfigRootDir**(`compilerOptions`): `string` \| `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `compilerOptions` | `CompilerOptions` |

#### Returns

`string` \| `undefined`

#### Defined in

[src/compilers/getTsconfigRootDir.ts:4](https://github.com/imjuni/ctix/blob/9bd0760/src/compilers/getTsconfigRootDir.ts#L4)

___

### getTypeScriptConfig

▸ **getTypeScriptConfig**(`project`): `ts.ParsedCommandLine`

tsconfig.json file find in current working director or cli execute path

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `project` | `string` | project directory |

#### Returns

`ts.ParsedCommandLine`

#### Defined in

[src/compilers/getTypeScriptConfig.ts:8](https://github.com/imjuni/ctix/blob/9bd0760/src/compilers/getTypeScriptConfig.ts#L8)

___

### getTypeScriptProject

▸ **getTypeScriptProject**(`projectPath`): `tsm.Project`

#### Parameters

| Name | Type |
| :------ | :------ |
| `projectPath` | `string` |

#### Returns

`tsm.Project`

#### Defined in

[src/compilers/getTypeScriptProject.ts:8](https://github.com/imjuni/ctix/blob/9bd0760/src/compilers/getTypeScriptProject.ts#L8)

___

### getTypeSymbolText

▸ **getTypeSymbolText**(`typeNode`, `declarationNodeCallback?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `typeNode` | `Type`<`Type`\> |
| `declarationNodeCallback?` | (`declarationNode`: `Node`<`Node`\>) => `string` |

#### Returns

`string`

#### Defined in

[src/compilers/getTypeSymbolText.ts:4](https://github.com/imjuni/ctix/blob/9bd0760/src/compilers/getTypeSymbolText.ts#L4)

___

### indexFileWrite

▸ **indexFileWrite**(`indexInfos`, `option`): `Promise`<[`IReason`](interfaces/IReason.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `indexInfos` | [`ICreateIndexInfos`](interfaces/ICreateIndexInfos.md)[] |
| `option` | [`TCreateOrSingleOption`](README.md#tcreateorsingleoption) |

#### Returns

`Promise`<[`IReason`](interfaces/IReason.md)[]\>

#### Defined in

[src/writes/indexFileWrite.ts:30](https://github.com/imjuni/ctix/blob/9bd0760/src/writes/indexFileWrite.ts#L30)

___

### initBuilder

▸ **initBuilder**<`T`\>(`args`): `Argv`<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`TCreateOption`](README.md#tcreateoption) \| [`TSingleOption`](README.md#tsingleoption) \| [`TRemoveOption`](README.md#tremoveoption) \| [`TInitOption`](README.md#tinitoption) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `Argv`<`T`\> |

#### Returns

`Argv`<`T`\>

#### Defined in

[src/cli/initBuilder.ts:9](https://github.com/imjuni/ctix/blob/9bd0760/src/cli/initBuilder.ts#L9)

___

### isIgnored

▸ **isIgnored**(`ignores`, `filePath`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ignores` | `IGetIgnoreConfigContentsReturn` |
| `filePath` | `string` |

#### Returns

`boolean`

#### Defined in

[src/ignores/isIgnored.ts:7](https://github.com/imjuni/ctix/blob/9bd0760/src/ignores/isIgnored.ts#L7)

___

### jsonLoader

▸ **jsonLoader**(`data`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `string` |

#### Returns

`any`

#### Defined in

[src/configs/jsonLoader.ts:5](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/jsonLoader.ts#L5)

___

### mergeCreateIndexInfo

▸ **mergeCreateIndexInfo**(`origin`, `target`): [`ICreateIndexInfos`](interfaces/ICreateIndexInfos.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `origin` | [`ICreateIndexInfos`](interfaces/ICreateIndexInfos.md) |
| `target` | [`ICreateIndexInfo`](interfaces/ICreateIndexInfo.md) \| [`ICreateIndexInfos`](interfaces/ICreateIndexInfos.md) |

#### Returns

[`ICreateIndexInfos`](interfaces/ICreateIndexInfos.md)

#### Defined in

[src/modules/mergeCreateIndexInfo.ts:6](https://github.com/imjuni/ctix/blob/9bd0760/src/modules/mergeCreateIndexInfo.ts#L6)

___

### posixJoin

▸ **posixJoin**(...`args`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `string`[] |

#### Returns

`string`

#### Defined in

[src/tools/misc.ts:13](https://github.com/imjuni/ctix/blob/9bd0760/src/tools/misc.ts#L13)

___

### preLoadConfig

▸ **preLoadConfig**(): [`TCreateOption`](README.md#tcreateoption) \| [`TSingleOption`](README.md#tsingleoption) \| [`TRemoveOption`](README.md#tremoveoption) \| { `c`: `undefined` = configFilePath; `config`: `undefined` = configFilePath; `exportFilename`: `any` ; `f`: `any` ; `p`: `undefined` \| `string` = tsconfigPath; `project`: `undefined` \| `string` = tsconfigPath } \| { `c`: `undefined` = configFilePath; `config`: `undefined` = configFilePath; `exportFilename`: `undefined` ; `f`: `undefined` ; `p`: `undefined` = tsconfigPath; `project`: `undefined` = tsconfigPath } \| { `c`: `string` = configFilePath; `config`: `string` = configFilePath; `exportFilename`: `any` ; `f`: `any` ; `p`: `string` = tsconfigPath; `project`: `string` = tsconfigPath }

#### Returns

[`TCreateOption`](README.md#tcreateoption) \| [`TSingleOption`](README.md#tsingleoption) \| [`TRemoveOption`](README.md#tremoveoption) \| { `c`: `undefined` = configFilePath; `config`: `undefined` = configFilePath; `exportFilename`: `any` ; `f`: `any` ; `p`: `undefined` \| `string` = tsconfigPath; `project`: `undefined` \| `string` = tsconfigPath } \| { `c`: `undefined` = configFilePath; `config`: `undefined` = configFilePath; `exportFilename`: `undefined` ; `f`: `undefined` ; `p`: `undefined` = tsconfigPath; `project`: `undefined` = tsconfigPath } \| { `c`: `string` = configFilePath; `config`: `string` = configFilePath; `exportFilename`: `any` ; `f`: `any` ; `p`: `string` = tsconfigPath; `project`: `string` = tsconfigPath }

#### Defined in

[src/configs/preLoadConfig.ts:26](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/preLoadConfig.ts#L26)

___

### prettierApply

▸ **prettierApply**(`project`, `contents`): `Promise`<{ `apply`: `boolean` = true; `contents`: `string` = prettiered }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `project` | `string` |
| `contents` | `string` |

#### Returns

`Promise`<{ `apply`: `boolean` = true; `contents`: `string` = prettiered }\>

#### Defined in

[src/writes/prettierApply.ts:4](https://github.com/imjuni/ctix/blob/9bd0760/src/writes/prettierApply.ts#L4)

___

### removeBuilder

▸ **removeBuilder**<`T`\>(`args`): `Argv`<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`TCreateOption`](README.md#tcreateoption) \| [`TSingleOption`](README.md#tsingleoption) \| [`TRemoveOption`](README.md#tremoveoption) \| [`TInitOption`](README.md#tinitoption) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `Argv`<`T`\> |

#### Returns

`Argv`<`T`\>

#### Defined in

[src/cli/removeBuilder.ts:9](https://github.com/imjuni/ctix/blob/9bd0760/src/cli/removeBuilder.ts#L9)

___

### removeIndexFile

▸ **removeIndexFile**(`option`, `isMessageDisplay?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `option` | [`TRemoveOptionWithDirInfo`](README.md#tremoveoptionwithdirinfo) |
| `isMessageDisplay?` | `boolean` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/ctix.ts:139](https://github.com/imjuni/ctix/blob/9bd0760/src/ctix.ts#L139)

___

### settify

▸ **settify**<`T`\>(`arr`): `T`[]

create set, dedupe duplicated element after return array type

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `arr` | `T`[] |

#### Returns

`T`[]

#### Defined in

[src/tools/misc.ts:9](https://github.com/imjuni/ctix/blob/9bd0760/src/tools/misc.ts#L9)

___

### singleIndexInfo

▸ **singleIndexInfo**(`exportInfo`, `option`, `project`): [`ICreateIndexInfo`](interfaces/ICreateIndexInfo.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `exportInfo` | [`IExportInfo`](interfaces/IExportInfo.md) |
| `option` | [`TSingleOptionWithDirInfo`](README.md#tsingleoptionwithdirinfo) |
| `project` | `Project` |

#### Returns

[`ICreateIndexInfo`](interfaces/ICreateIndexInfo.md)[]

#### Defined in

[src/modules/singleIndexInfo.ts:9](https://github.com/imjuni/ctix/blob/9bd0760/src/modules/singleIndexInfo.ts#L9)

___

### singleIndexInfos

▸ **singleIndexInfos**(`exportInfos`, `ignores`, `option`, `project`): `Promise`<[`ICreateIndexInfos`](interfaces/ICreateIndexInfos.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `exportInfos` | [`IExportInfo`](interfaces/IExportInfo.md)[] |
| `ignores` | `IGetIgnoreConfigContentsReturn` |
| `option` | [`TSingleOptionWithDirInfo`](README.md#tsingleoptionwithdirinfo) |
| `project` | `Project` |

#### Returns

`Promise`<[`ICreateIndexInfos`](interfaces/ICreateIndexInfos.md)[]\>

#### Defined in

[src/modules/singleIndexInfos.ts:14](https://github.com/imjuni/ctix/blob/9bd0760/src/modules/singleIndexInfos.ts#L14)

___

### singleWritor

▸ **singleWritor**(`option`, `isMessageDisplay?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `option` | [`TSingleOptionWithDirInfo`](README.md#tsingleoptionwithdirinfo) |
| `isMessageDisplay?` | `boolean` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/ctix.ts:89](https://github.com/imjuni/ctix/blob/9bd0760/src/ctix.ts#L89)

___

### validateExportDuplication

▸ **validateExportDuplication**(`exportInfos`): `Object`

Detect export duplication from every typescript source file.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `exportInfos` | [`IExportInfo`](interfaces/IExportInfo.md)[] | export statements from every typescript source file |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `duplicate` | `Record`<`string`, [`IExportInfo`](interfaces/IExportInfo.md)[]\> |
| `filePaths` | `string`[] |
| `reasons` | [`IReason`](interfaces/IReason.md)[] |
| `valid` | `boolean` |

#### Defined in

[src/validations/validateExportDuplication.ts:52](https://github.com/imjuni/ctix/blob/9bd0760/src/validations/validateExportDuplication.ts#L52)

___

### validateFileNameDuplication

▸ **validateFileNameDuplication**(`exportInfos`, `option`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `exportInfos` | [`IExportInfo`](interfaces/IExportInfo.md)[] |
| `option` | [`TCreateOrSingleOption`](README.md#tcreateorsingleoption) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `exportInfos` | [`IExportInfo`](interfaces/IExportInfo.md)[] |
| `filePaths` | `string`[] |
| `reasons` | [`IReason`](interfaces/IReason.md)[] |
| `valid` | `boolean` |

#### Defined in

[src/validations/validateFileNameDuplication.ts:8](https://github.com/imjuni/ctix/blob/9bd0760/src/validations/validateFileNameDuplication.ts#L8)
