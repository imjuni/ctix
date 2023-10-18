export type TStreamType = Extract<keyof typeof process, 'stdout' | 'stderr'>;
