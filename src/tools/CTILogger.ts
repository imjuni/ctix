// tslint:disable no-console

type TLogFunc = (message?: any, ...optionalParams: any[]) => void;

export class CTILogger {
  public readonly log: TLogFunc;
  public readonly error: TLogFunc;
  public readonly flog: TLogFunc;
  public readonly ferror: TLogFunc;

  public constructor(verbose: boolean) {
    if (verbose) {
      this.log = console.log;
      this.error = console.error;
    } else {
      this.log = () => undefined;
      this.error = console.error;
    }

    this.flog = console.log;
    this.ferror = console.error;
  }
}
