import { CE_GENERATION_STYLE } from '#/configs/const-enum/CE_GENERATION_STYLE';
import { addExt } from '#/modules/path/addExt';
import { CE_TEMPLATE_NAME } from '#/templates/const-enum/CE_TEMPLATE_NAME';
import { defaultAliasNamedDestructiveDefaultTemplate } from '#/templates/templates/defaultAliasNamedDestructiveDefaultTemplate';
import { defaultAliasNamedStarDefaultTemplate } from '#/templates/templates/defaultAliasNamedStarDefaultTemplate';
import { defaultNonAliasNamedDestructiveDefaultTemplate } from '#/templates/templates/defaultNonAliasNamedDestructiveDefaultTemplate';
import { defaultStarNamedDestructiveDefaultTemplate } from '#/templates/templates/defaultStarNamedDestructiveDefaultTemplate';
import { defaultStarNamedStarDefaultTemplate } from '#/templates/templates/defaultStarNamedStarDefaultTemplate';
import { indexFileDefaultTemplate } from '#/templates/templates/indexFileDefaultTemplate';
import { nestedOptionDefaultTemplate } from '#/templates/templates/nestedOptionDefaultTemplate';
import { optionDefaultTemplate } from '#/templates/templates/optionDefaultTemplate';
import consola from 'consola';
import { Eta } from 'eta';
import { isError } from 'my-easy-fp';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export class TemplateContainer {
  static #it: TemplateContainer;

  static get it(): TemplateContainer {
    return TemplateContainer.#it;
  }

  static #isBootstrap: boolean = false;

  static get isBootstrap(): boolean {
    return TemplateContainer.#isBootstrap;
  }

  static getDefaultTemplate() {
    return new Map<string, string>([
      [CE_TEMPLATE_NAME.INDEX_FILE_TEMPLATE, indexFileDefaultTemplate.trim()],
      [CE_TEMPLATE_NAME.OPTIONS_TEMPLATE, optionDefaultTemplate.trim()],
      [CE_TEMPLATE_NAME.NESTED_OPTIONS_TEMPLATE, nestedOptionDefaultTemplate.trim()],
      [CE_GENERATION_STYLE.DEFAULT_ALIAS_NAMED_STAR, defaultAliasNamedStarDefaultTemplate.trim()],
      [
        CE_GENERATION_STYLE.DEFAULT_ALIAS_NAMED_DESTRUCTIVE,
        defaultAliasNamedDestructiveDefaultTemplate.trim(),
      ],
      [
        CE_GENERATION_STYLE.DEFAULT_NON_ALIAS_NAMED_DESTRUCTIVE,
        defaultNonAliasNamedDestructiveDefaultTemplate.trim(),
      ],
      [CE_GENERATION_STYLE.DEFAULT_STAR_NAMED_STAR, defaultStarNamedStarDefaultTemplate.trim()],
      [
        CE_GENERATION_STYLE.DEFAULT_STAR_NAMED_DESTRUCTIVE,
        defaultStarNamedDestructiveDefaultTemplate.trim(),
      ],
    ]);
  }

  static async load(templatePath?: string) {
    if (templatePath == null) {
      return TemplateContainer.getDefaultTemplate();
    }

    const resolvedTemplateFilePath = path.resolve(templatePath);
    const templates = await TemplateContainer.readFiles(resolvedTemplateFilePath);

    return new Map<string, string>([
      [CE_TEMPLATE_NAME.INDEX_FILE_TEMPLATE, templates.indexFile],
      [CE_TEMPLATE_NAME.OPTIONS_TEMPLATE, templates.options],
      [CE_TEMPLATE_NAME.NESTED_OPTIONS_TEMPLATE, templates.nestedOptions],
      [CE_GENERATION_STYLE.DEFAULT_ALIAS_NAMED_DESTRUCTIVE, templates.defaultAliasNamedDestructive],
      [
        CE_GENERATION_STYLE.DEFAULT_NON_ALIAS_NAMED_DESTRUCTIVE,
        templates.defaultNonAliasNamedDestructive,
      ],
      [CE_GENERATION_STYLE.DEFAULT_STAR_NAMED_STAR, templates.defaultStarNamedStar],
      [CE_GENERATION_STYLE.DEFAULT_ALIAS_NAMED_STAR, templates.defaultAliasNamedStar],
      [CE_GENERATION_STYLE.DEFAULT_STAR_NAMED_DESTRUCTIVE, templates.defaultStarNamedDestructive],
    ]);
  }

  static async bootstrap(templatePath?: string) {
    if (TemplateContainer.#isBootstrap) {
      return;
    }

    const templates = await TemplateContainer.load(templatePath);

    TemplateContainer.#it = new TemplateContainer({ templatePath, templates });
    TemplateContainer.#isBootstrap = true;
  }

  static getTemplateFileNames(basePath: string, templateName: string): string {
    return path.join(basePath, addExt(templateName, 'eta'));
  }

  static async readFiles(basePath: string) {
    const n = (t: string) => TemplateContainer.getTemplateFileNames(basePath, t);

    const buffers = await Promise.all([
      readFile(n(CE_TEMPLATE_NAME.INDEX_FILE_TEMPLATE)),
      readFile(n(CE_TEMPLATE_NAME.OPTIONS_TEMPLATE)),
      readFile(n(CE_TEMPLATE_NAME.NESTED_OPTIONS_TEMPLATE)),
      readFile(n(CE_GENERATION_STYLE.DEFAULT_ALIAS_NAMED_STAR)),
      readFile(n(CE_GENERATION_STYLE.DEFAULT_ALIAS_NAMED_DESTRUCTIVE)),
      readFile(n(CE_GENERATION_STYLE.DEFAULT_NON_ALIAS_NAMED_DESTRUCTIVE)),
      readFile(n(CE_GENERATION_STYLE.DEFAULT_STAR_NAMED_STAR)),
      readFile(n(CE_GENERATION_STYLE.DEFAULT_STAR_NAMED_DESTRUCTIVE)),
    ]);

    const [
      indexFile,
      options,
      nestedOptions,
      defaultAliasNamedStar,
      defaultAliasNamedDestructive,
      defaultNonAliasNamedDestructive,
      defaultStarNamedStar,
      defaultStarNamedDestructive,
    ] = buffers.map((buffer) => buffer.toString().trim());

    return {
      indexFile,
      options,
      nestedOptions,
      defaultAliasNamedStar,
      defaultAliasNamedDestructive,
      defaultNonAliasNamedDestructive,
      defaultStarNamedStar,
      defaultStarNamedDestructive,
    };
  }

  static async evaluate<T extends object>(
    name: string,
    data: T,
    option?: ConstructorParameters<typeof Eta>[0],
  ) {
    try {
      if (!TemplateContainer.#isBootstrap) {
        throw new Error('NOT_INITIALIZE_ERROR: please, initialize before use');
      }

      const rendered = await TemplateContainer.it.evaluate(name, data, option);
      return rendered;
    } catch (caught) {
      const err = isError(caught, new Error('raise error from evaluateTemplate'));
      consola.error(`template: ${name}`, data);
      consola.error(err);

      throw err;
    }
  }

  #templatePath?: string;

  #templates: Map<string, string>;

  #eta: Eta;

  constructor(args: { templatePath?: string; templates: Map<string, string> }) {
    this.#templatePath = args.templatePath;
    this.#templates = args.templates;

    this.#eta = new Eta({ views: 'ctix', autoEscape: false, rmWhitespace: true });
    this.#eta.resolvePath = this.etaResolvePath.bind(this);
    this.#eta.readFile = this.etaReadFile.bind(this);
  }

  get templatePath() {
    return this.#templatePath;
  }

  // eslint-disable-next-line class-methods-use-this
  etaResolvePath(templatePath: string) {
    return templatePath;
  }

  etaReadFile(templatePath: string) {
    return this.#templates.get(templatePath) ?? defaultStarNamedStarDefaultTemplate.trim();
  }

  async evaluate<T extends object>(
    name: string,
    data: T,
    option?: ConstructorParameters<typeof Eta>[0],
  ) {
    try {
      if (this.#templates.get(name) == null) {
        throw new Error(`cannot found template: ${name}`);
      }

      if (option != null) {
        const rendered = this.#eta.withConfig(option).render(name, data);
        return rendered;
      }

      const rendered = this.#eta.render(name, data);
      return rendered;
    } catch (caught) {
      const err = isError(caught, new Error('raise error from evaluateTemplate'));
      consola.error(`template: ${name}`, data);
      consola.error(err);

      throw err;
    }
  }
}
