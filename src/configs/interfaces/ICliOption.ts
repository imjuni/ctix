export default interface ICliOption {
  c: string;
  config: string;

  p: string;
  project: string;

  f?: string;
  exportFilename?: string;

  n?: boolean;
  addNewline?: boolean;

  v?: boolean;
  verbose?: boolean;

  s?: boolean;
  useSemicolon?: boolean;

  m?: boolean;
  useTimestamp?: boolean;

  t?: boolean;
  useComment?: boolean;

  q?: string;
  quote?: string;

  b?: boolean;
  useBackupFile?: boolean;
  includeBackup?: boolean;

  o?: string;
  output?: string;

  k?: boolean;
  keepFileExt?: boolean;

  e?: boolean;
  skipEmptyDir?: boolean;

  r?: boolean;
  useRootDir?: boolean;
}
