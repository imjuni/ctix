export const declarationFileTemplate = `
<%- it.declarations.forEach((declaration) => { -%>
import <%-= it.options.quote %><%= declaration.relativePath %><%= it.options.quote -%>

<%- }) %>
`;
