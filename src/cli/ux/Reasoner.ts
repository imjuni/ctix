import type { IReason } from '#/compilers/interfaces/IReason';
import type { TStreamType } from '#/configs/interfaces/TStreamType';
import chalk from 'chalk';
import * as path from 'node:path';

export class Reasoner {
  static #it: Reasoner;

  static get it() {
    return Reasoner.#it;
  }

  static #isBootstrap: boolean = false;

  static get isBootstrap() {
    return Reasoner.#isBootstrap;
  }

  static bootstrap() {
    if (Reasoner.#isBootstrap) {
      return;
    }

    const enable = false;
    const stream = 'stderr';

    Reasoner.#it = new Reasoner(console.error, stream, enable);
    Reasoner.#isBootstrap = true;
  }

  #enable: boolean;

  #stream: TStreamType;

  #logger: typeof console.log;

  #streamFunc: typeof console.log | typeof console.error;

  constructor(
    func: typeof console.log | typeof console.error,
    stream: TStreamType,
    enable: boolean,
  ) {
    this.#streamFunc = func;
    this.#stream = stream;
    this.#enable = enable;
    this.#logger = console.log;
  }

  set stream(value: TStreamType) {
    if (value !== this.#stream) {
      this.#streamFunc = value === 'stderr' ? console.error : console.log;
      this.#stream = value;
    }
  }

  get logger() {
    return this.#logger;
  }

  get enable() {
    return this.#enable;
  }

  set enable(value) {
    this.#enable = value;
  }

  static messaging(reason: IReason): string {
    const messageBlock = [''];

    const typeMessage =
      reason.type === 'error'
        ? chalk.bgRed(`   ${reason.type.toUpperCase()}   `)
        : chalk.bgYellow(`   ${chalk.black(reason.type.toUpperCase())}    `);

    const { filePath } = reason;

    const filename =
      reason.lineAndCharacter == null
        ? `${path.basename(filePath)}`
        : `${path.basename(filePath)}:${reason.lineAndCharacter.line}:${
            reason.lineAndCharacter.character
          }`;

    const chevronRight = reason.type === 'error' ? chalk.red('>') : chalk.yellow('>');

    messageBlock.push(`${typeMessage} ${filename}`);

    if (reason.lineAndCharacter == null) {
      messageBlock.push(`   ${chevronRight} ${chalk.gray(`${filePath}`)}`);
    } else {
      messageBlock.push(
        `   ${chevronRight} ${chalk.gray(
          `${filePath}:${chalk.yellowBright(reason.lineAndCharacter.line)}:${chalk.yellowBright(reason.lineAndCharacter.character)}`,
        )}`,
      );
    }

    messageBlock.push(
      ...reason.message.split('\n').map((splittedMessage) => {
        return `   ${chevronRight} ${chalk.gray(splittedMessage.trim())}`;
      }),
    );

    messageBlock.push('');

    return messageBlock.join('\n');
  }

  start(reasons: IReason[]): void {
    if (this.#enable === false) {
      return;
    }

    const errors = reasons
      .filter((reason) => reason.type === 'error')
      .map((reason) => Reasoner.messaging(reason));

    const warns = reasons
      .filter((reason) => reason.type === 'warn')
      .map((reason) => Reasoner.messaging(reason));

    this.#logger(warns.join(''));
    this.#streamFunc(errors.join(''));
  }

  displayNewIssueMessage() {
    const messageIndent = '  > ';
    this.#logger(
      chalk.green(
        `${messageIndent}Please submit a new GitHub issue with a reproducible repository to improve ctix!`,
      ),
    );
    this.#logger(chalk.green(`${messageIndent}https://github.com/imjuni/ctix/issues/new`));
    this.#logger('\n');
  }
}

Reasoner.bootstrap();
