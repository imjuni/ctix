export const declarationFileTemplate = `
<%- it.declarations.forEach((declaration) => { -%>
import <%-= it.options.quote %><%= declaration.importPath %><%= declaration.extname.render %><%= it.options.quote -%><%- if (it.options.useSemicolon) { -%><%-= ";" -%><%- } -%><%= "\\n" %>
<%- }) %>
`;
