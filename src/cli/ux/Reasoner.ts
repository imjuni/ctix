/* eslint-disable no-console */
import type { IReason } from '#/compilers/interfaces/IReason';
import type { TStreamType } from '#/configs/interfaces/TStreamType';
import chalk from 'chalk';
import { sleep as sleepMs } from 'my-easy-fp';
import * as path from 'path';

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

  #func: typeof console.log | typeof console.error;

  constructor(
    func: typeof console.log | typeof console.error,
    stream: TStreamType,
    enable: boolean,
  ) {
    this.#func = func;
    this.#stream = stream;
    this.#enable = enable;
  }

  set stream(value: TStreamType) {
    if (value !== this.#stream) {
      this.#func = value === 'stderr' ? console.error : console.log;
      this.#stream = value;
    }
  }

  get enable() {
    return this.#enable;
  }

  set enable(value) {
    this.#enable = value;
  }

  async sleep(ms: number): Promise<void> {
    if (this.#enable) {
      await sleepMs(ms);
    }
  }

  space(): void {
    if (this.#enable === false) {
      return;
    }

    this.#func('');
  }

  start(reasons: IReason[]): void {
    if (this.#enable === false) {
      return;
    }

    const messages = reasons.map((reason) => {
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
            `${filePath}:${reason.lineAndCharacter.line}:${reason.lineAndCharacter.character}`,
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
    });

    this.#func(messages.join(''));
  }
}

Reasoner.bootstrap();
