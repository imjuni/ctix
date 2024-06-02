# Examples

## Background

다양한 프로젝트 형태에서 ctix를 사용해서 `index.ts` 파일을 생성하는 경우를 예제로 작성한 디렉터리 입니다. `examples`는 ctix를 사용하는 방법 뿐만 아니라 테스트케이스 작성을 비롯하여 Vue.js, Font 파일을 타입으로 선언했을 때 등 다양한 상황에 대한 예제를 포함하고 있으며 이를 통해 ctix를 사용하는 방법을 설명하고 테스트를 해볼 수 있게 돕습니다.

## Usage

`ctix`는 `ts-morph`를 사용하여 TypeScript Compiler API를 사용하기 때문에 입력 값으로 `tsconfig.json` 파일이 필요합니다. 테스트를 돕기 위해 각 예제 디렉터리는 `tsconfig.json` 파일을 포함하고 있으며, 예제를 추가할 때는 예제를 실행하기 위한 `tsconfig.json` 파일을 반드시 작성해야 합니다.

`ctix` 프로젝트에 포함된 예제이기 때문에 각 에제를 실행할 때는 다음과 같이 npm scripts를 실행해야 합니다.

```bash
# type12 예제를 실행하는 경우
USE_INIT_CWD=true pnpm run dev build -p examples/type12/tsconfig.json -o examples/type12
```

type12 외 다른 예제를 실행하고 싶다면 경로를 변경하세요. USE_INIT_CWD는 스크립트가 실행될 때 `process.cwd()` 대신 `INIT_CWD`를 사용하도록 지시하는 ENV 변수입니다. 실제 프로젝트는 이 환경변수를 사용할 필요가 없습니다. 위 명령을 자신의 프로젝트에서 실행할 때는 다음과 같이 입력하면 됩니다.

```bash
npx ctix build -p [your tsconfig.json] -o [output directory]
```

## Example directories with a special purpose

| directory name | purpose                                                                   |
| -------------- | ------------------------------------------------------------------------- |
| type03         | 전체 프로젝트에서 중복된 이름이 있는 경우                                 |
| type05         | React 프로젝트인 경우                                                     |
| type06         | TypeScript enum을 사용하는 경우                                           |
| type07         | variable을 destructive operation을 사용하여 named exports 하는 경우       |
| type09         | ttf 폰트를 module declare module로 작성한 뒤 TypeScript에서 사용하는 경우 |
| type10         | Vue.js를 사용하는 경우                                                    |
| type11         | React 프로젝트에서 Component Props를 사용하는 경우                        |

하나의 `index.ts` 파일에 export statements를 모으기 때문에 중복된 이름을 사용할 수 없습니다. 이 경우 alias를 사용하여 다른 이름으로 export해야 합니다. ctix는 중복된 이름이 있는 경우 중복된 이름 모두 `index.ts`에서 제외 합니다. 그리고 경고를 출력하여 개발자가 중복된 이름을 인지할 수 있게 합니다. 이에 대한 예제가 type03 입니다.
