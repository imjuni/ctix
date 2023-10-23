export const optionDefaultTemplate = `
{
  // configuration file(.ctirc) path
  "config": "<%= it.config %>",

  // Stream of cli spinner, you can pass stdout or stderr
  //
  // @mode all
  // @default stdout
  "spinnerStream": "<%= it.spinnerStream %>",

  // Stream of cli progress, you can pass stdout or stderr
  //
  // @mode all
  // @default stdout
  "progressStream": "<%= it.progressStream %>",

  // Stream of cli reasoner. Reasoner show name conflict error and already exist index.ts file error.
  // You can pass stdout or stderr
  //
  // @mode all
  // @default stderr
  "reasonerStream": "<%= it.reasonerStream %>",

  "options": [<%= it.options %>]
}
`;
