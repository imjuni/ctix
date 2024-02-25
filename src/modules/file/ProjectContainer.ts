import { getTypeScriptProject } from '#/compilers/getTypeScriptProject';
import path from 'node:path';
import type * as tsm from 'ts-morph';

export class ProjectContainer {
  static #it: ProjectContainer;

  static get it(): ProjectContainer {
    return ProjectContainer.#it;
  }

  static #isBootstrap: boolean = false;

  static get isBootstrap(): boolean {
    return ProjectContainer.#isBootstrap;
  }

  static project(projectPath: string) {
    if (!ProjectContainer.#isBootstrap) {
      throw new Error('NOT_INITIALIZE_ERROR: please, initialize before use');
    }

    return ProjectContainer.#it.project(projectPath);
  }

  static addSourceFilesAtPaths(projectPath: string, filePaths: string[]) {
    if (!ProjectContainer.#isBootstrap) {
      throw new Error('NOT_INITIALIZE_ERROR: please, initialize before use');
    }

    return ProjectContainer.#it.addSourceFilesAtPaths(projectPath, filePaths);
  }

  static bootstrap() {
    if (ProjectContainer.#isBootstrap) {
      return;
    }

    ProjectContainer.#it = new ProjectContainer();
    ProjectContainer.#isBootstrap = true;
  }

  #projects: Map<string, tsm.Project>;

  constructor() {
    this.#projects = new Map<string, tsm.Project>();
  }

  project(projectPath: string): tsm.Project {
    const project = this.#projects.get(projectPath);

    if (project != null) {
      return project;
    }

    const loadedProject = getTypeScriptProject({
      tsConfigFilePath: path.resolve(projectPath),
    });

    this.#projects.set(projectPath, loadedProject);

    return loadedProject;
  }

  addSourceFilesAtPaths(projectPath: string, filePaths: string[]) {
    const project = this.#projects.get(projectPath);

    if (project == null) {
      throw new Error(`Cannot found tsconfig.json: ${project}`);
    }

    filePaths.forEach((filePath) => {
      project.addSourceFileAtPath(filePath);
    });
  }
}

ProjectContainer.bootstrap();
