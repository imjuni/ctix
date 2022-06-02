import * as tsm from 'ts-morph';

export default interface IReason {
  type: 'error' | 'warn';
  lineAndCharacter?: tsm.ts.LineAndCharacter;
  filePath: string;
  source?: tsm.SourceFile;
  nodes?: tsm.Node[];
  message: string;
}
