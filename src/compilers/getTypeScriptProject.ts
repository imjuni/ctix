import * as tsm from 'ts-morph';

export function getTypeScriptProject(projectOption: tsm.ProjectOptions): tsm.Project {
  /**
   * 주의
   *
   * 타입스크립트는 `index.ts` 파일이 있을 때 `index.d.ts` 파일을 순수 타입 선언으로 가정하고 프로젝트
   * 파일리스트에 포함시키지 않는다. 그래서 `project.getSourceFiles().map(s => s.getFilePaths())` 코드를
   * 실행해서 파일을 살펴보면 `index.d.ts` 파일이 포함되지 않은 것을 확인할 수 있고, 이로 인해 type04 예제에서
   * 중복 체크 경고가 많이 줄어드는 것을 볼 수 있다.
   */
  const project = new tsm.Project(projectOption);
  return project;
}
