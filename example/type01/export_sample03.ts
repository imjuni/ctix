export { log } from 'console';
export { var1, var2, var3, var5 as v05, var6 as v06, variable04 as v04 } from './export_sample01';
export { consoleLog } from './export_sample04';
export { defaultExportFunc as default };

function defaultExportFunc() {
  console.log('defaultExportFunc');
}

export function exportFunc() {
  console.log('exportFunc');
}

export async function exportAsyncFunc() {
  console.log('exportAsyncFunc');
}

export type integer = number;
