/* eslint-disable @typescript-eslint/no-redeclare */
export type Bar = typeof Bar;
export const Bar = { bar: 'bar' } as const;

export interface Ignore {}
