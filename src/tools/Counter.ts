/* eslint-disable import/prefer-default-export */
export class Counter {
  private count: number;

  public readonly verbose: boolean;

  constructor(verbose: boolean) {
    this.count = 0;
    this.verbose = verbose;
  }

  public get log() {
    this.count += 1;

    return this.count;
  }

  public get debug() {
    this.count += this.verbose ? 1 : 0;

    return this.count;
  }
}
