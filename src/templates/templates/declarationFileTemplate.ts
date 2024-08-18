export const declarationFileTemplate = `
<%- it.declarations.forEach((declaration) => { -%>
import <%-= it.options.quote %><%= declaration.relativePath %><%= declaration.extname.render %><%= it.options.quote -%>

<%- }) %>
`;
