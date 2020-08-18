export class Counter {
  private _count: number;
  public readonly verbose: boolean;

  constructor(verbose: boolean) {
    this._count = 0;
    this.verbose = verbose;
  }

  public get log() {
    this._count += 1;

    return this._count;
  }

  public get debug() {
    this._count += this.verbose ? 1 : 0;

    return this._count;
  }
}
