/* eslint-disable no-console */
import type { IReason } from '#/cli/interfaces/IReason';
import type { TStreamType } from '#/configs/interfaces/TStreamType';
import chalk from 'chalk';
import { sleep as sleepMs } from 'my-easy-fp';
import * as path from 'path';

class CtixReasoner {
  #isEnable: boolean;

  #stream: TStreamType;

  #streamWrite: typeof console.log;

  constructor() {
    this.#isEnable = false;
    this.#streamWrite = console.error;
    this.#stream = 'stderr';
  }

  set stream(value: TStreamType) {
    if (value === 'stderr' && this.#stream === 'stdout') {
      this.#streamWrite = console.error;
      this.#stream = 'stderr';
    } else if (value === 'stdout' && this.#stream === 'stderr') {
      this.#streamWrite = console.log;
      this.#stream = 'stdout';
    }
  }

  get isEnable() {
    return this.#isEnable;
  }

  set isEnable(value) {
    this.#isEnable = value;
  }

  async sleep(ms: number): Promise<void> {
    if (this.#isEnable) {
      await sleepMs(ms);
    }
  }

  space(): void {
    if (this.#isEnable === false) {
      return;
    }

    this.#streamWrite('');
  }

  start(reasons: IReason[]): void {
    if (this.#isEnable === false) {
      return;
    }

    this.#streamWrite('');

    reasons.forEach((reason) => {
      const typeMessage =
        reason.type === 'error'
          ? chalk.bgRed(`   ${reason.type.toUpperCase()}   `)
          : chalk.bgYellow(`   ${reason.type.toUpperCase()}    `);

      const { filePath } = reason;

      const filename =
        reason.lineAndCharacter == null
          ? `${path.basename(filePath)}`
          : `${path.basename(filePath)}:${reason.lineAndCharacter.line}:${
              reason.lineAndCharacter.character
            }`;

      const chevronRight = reason.type === 'error' ? chalk.red('>') : chalk.yellow('>');

      this.#streamWrite(typeMessage, filename);

      if (reason.lineAndCharacter == null) {
        this.#streamWrite(`   ${chevronRight} ${chalk.gray(`${filePath}`)}`);
      } else {
        this.#streamWrite(
          `   ${chevronRight} ${chalk.gray(
            `${filePath}:${reason.lineAndCharacter.line}:${reason.lineAndCharacter.character}`,
          )}`,
        );
      }
      reason.message.split('\n').forEach((splittedMessage) => {
        this.#streamWrite(`   ${chevronRight} ${chalk.gray(splittedMessage.trim())}`);
      });

      this.#streamWrite('');
    });
  }
}

export const reasoner = new CtixReasoner();
