# Migration Guide
이 문서는 ctix 0.6.x 버전에서 1.x 버전으로 마이그레이션을 하는 방법을 설명하는 문서 입니다

# 변경된 명령어
변경된 명령어에 대한 설명입니다.

## create
0.6.x 버전에서는 command를 생략하면 create 모드로 동작했습니다. 1.x 버전은 더이상 명령어를 생략할 수 없으며 명령어를 생략하면 도움말을 출력합니다. 대신 모든 명령어는 단축 명령이 존재합니다. 단축 명령은 아래 표를 참고해주세요.

| command | shortcut |
| - | - |
| create | c |
| single | s |
| remove | r | 
| init | i |

## single
single 명령어는 entrypoint 명령어로 사용할 수 있었습니다. 1.x 버전에서 entrypoint 명령어는 단축 명령어로 대체 되었습니다.

## remove
clean 명령어는 remove 명령어로 변경되었습니다. 단축 명령어로 사용할 때 원본 명령어와 연관성을 유지하기 위해서 변경되었습니다.

# Option

## excludePath, useUpperFirst
이 두 옵션은 제거 되었습니다. default export statement는 이제 소스코드에서 사용한 변수명으로 export statement를 생성합니다.

```ts
// cti.ts
export default class CreateTypeScriptIndex {}

// index.ts
export { default as CreateTypeScriptIndex } from './cti.ts';
```

위 예제와 같이 이름이 있는 export statement 인 경우 이름을 사용합니다. 만약 익명 함수, 익명 타입 리터럴인 경우 파일명을 사용합니다. 익명 인 경우 기존과 달리 경로명을 포함하지 않으며 파일명은 camel case로 변경되지만 첫 문자를 더이상 소문자로 변경하지 않습니다.

## addNewline
이 옵션은 제거 되었습니다. 대신 project 디렉터리에 .prettierrc 파일이 존재하는 경우 생성되는 index.ts 파일에 prettier를 적용합니다.

## useSemicolon
이 옵션은 정상적으로 동작하지만 .prettierrc 파일이 존재하여 prettier를 적용한 경우 prettier 설정에 따라 semicolon 문자가 제거될 수 있습니다.

## useBackupFile
이 옵션은 제거 되었습니다. 이제 ctix는 이미 존재하는 index.ts 파일에 대해서 더이상 덮어쓰기를 하지 않습니다. 또한 이미 index.ts 파일이 존재하는 경우 오류 메시지를 노출합니다.

만약 기존과 같이 덮어쓰기 동작을 원하는 경우 --overwrite 또는 -w 옵션을 적용하여 덮어쓰기 옵션을 추가하십시오. 덮어쓰기를 해야하는 경우 backup 파일을 자동으로 생성합니다.

# Configuration file .ctirc
.ctirc 파일은 json5에서 json with comment 형식으로 변경되었습니다. 이는 개발자가 사용하는 visual studio code 등이 json with comment를 좀 더 잘 지원하기 때문에 내린 결정입니다.

더이상 .ctirc를 디렉터리 별로 설정할 수 없습니다. 설정으로 전달한 파일 또는 최상위에 존재하는 파일 1개만 설정 파일로 사용합니다.

# Ignore
ctix ignore 파일 형식이 변경되었습니다. 기존에는 개별 디렉터리 별로 설정이 가능하고 gitignore와 동일한 형식에서 하나의 파일만 적용이 가능하며 json with comment 형식으로 변경되었습니다.

## Partial Ignore
json with comment 형식으로 변경된 이유는 partial ignore를 지원하기 위함입니다. 다음 코드는 예제에 포함된 [.ctiignore](https://github.com/imjuni/ctix/blob/develop/example/type04/.ctiignore) 파일 입니다.

```jsonc
{
  "juvenile/**": "*",
  "wellmade/FlakyCls.ts": "*",
  "wellmade/WhisperingCls.ts": "*",
  "wellmade/ChildlikeCls.ts": ["transfer","stomach"]
}
```
key는 파일명입니다. glob 형식을 사용할 수 있습니다. value 부분은 "*" 문자를 기입한 경우 파일 전체가 무시되며 배열로 문자열을 전달하는 경우 특정 타입 이름이 무시됩니다. default export statement 인 경우 camel case로 변경된 파일명을 사용해서 무시합니다. partial ignore를 사용해서 효율적으로 index.ts 파일을 생성할 수 있습니다.
