/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/lines-between-class-members */
/* eslint-disable no-console */
type TLogFunc = (message?: any, ...optionalParams: any[]) => void;

export class Logger {
  private _log: TLogFunc;
  private _debug: TLogFunc;
  private _error: TLogFunc;

  public constructor() {
    this._log = console.log;
    this._debug = () => undefined;
    this._error = console.error;
  }

  public log(...args: any): void {
    this._log(...args);
  }

  public debug(...args: any): void {
    this._debug(...args);
  }

  public error(...args: any): void {
    this._error(...args);
  }

  public switch(verbose: boolean) {
    if (verbose) {
      this._log = console.log;
      this._debug = console.debug;
      this._error = console.error;
    } else {
      this._log = console.log;
      this._debug = () => undefined;
      this._error = console.error;
    }
  }
}

const logger = new Logger();
export default logger;
