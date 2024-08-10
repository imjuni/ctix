export const optionDefaultTemplate = `
{
  <%- if (it.addEveryOptions && it.isComment && it.spinnerStream != null) { -%>
  // Stream of cli spinner, you can pass stdout or stderr
  //
  // @mode all
  // @default stdout
  <%- } -%>
  <%- if (it.addEveryOptions && it.spinnerStream != null) { -%>
  "spinnerStream": "<%= it.spinnerStream %>",
  <%- } -%>

  <%- if (it.addEveryOptions && it.isComment && it.progressStream) { -%>
  // Stream of cli progress, you can pass stdout or stderr
  //
  // @mode all
  // @default stdout
  <%- } -%>
  <%- if (it.addEveryOptions && it.progressStream != null) { -%>
  "progressStream": "<%= it.progressStream %>",
  <%- } -%>

  <%- if (it.addEveryOptions && it.isComment && it.reasonerStream != null) { -%>
  // Stream of cli reasoner. Reasoner show name conflict error and already exist index.ts file error.
  // You can pass stdout or stderr
  //
  // @mode all
  // @default stderr
  <%- } -%>
  <%- if (it.addEveryOptions && it.reasonerStream != null) { -%>
  "reasonerStream": "<%= it.reasonerStream %>",
  <%- } -%>

  "options": [<%= it.options %>]
}
`;
