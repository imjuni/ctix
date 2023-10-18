import type * as tsm from 'ts-morph';

export interface IReason {
  type: 'error' | 'warn';
  lineAndCharacter?: tsm.ts.LineAndCharacter;
  filePath: string;
  source?: tsm.SourceFile;
  nodes?: tsm.Node[];
  message: string;
}
