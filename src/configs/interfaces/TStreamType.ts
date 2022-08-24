type TStreamType = Extract<keyof typeof process, 'stdout' | 'stderr'>;

export default TStreamType;
