export const defaultStarNamedStarDefaultTemplate = `
export * from <%-= it.options.quote %><%= it.statement.importPath %><%= it.statement.extname.render %><%= it.options.quote %>
<%- if (it.options.useSemicolon) { -%><%-= ";" -%><%- } -%>
`;
