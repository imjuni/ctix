export const moduleIndexFileDefaultTemplate = `
<% it.datas.forEach((data) => { %>
  import <%= data.statement.default.identifier.name %> from<%= " " %>
  <%-= it.options.quote %><%= data.statement.importPath %><%-= data.statement.default.identifier.name -%>
  <%-= data.statement.extname.render %><%-= it.options.quote %>
  <%- if (it.options.useSemicolon) { -%><%-= ";" -%><%- } -%>
<% }); %>

<%= "\\n" %>
<%= "\\n" %>

export {
  <% it.datas.forEach((data, index) => { %>
    <%= data.statement.default.identifier.name %><%- if (it.datas.length !== 1 && it.datas.length > index) { -%><%-= "," %><% } %>
  <% }); %>
}<%- if (it.options.useSemicolon) { -%><%-= ";" -%><%- } -%>
`;
