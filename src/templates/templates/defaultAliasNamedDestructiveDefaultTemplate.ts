export const defaultAliasNamedDestructiveDefaultTemplate = `
<%- if (it.statement.default != null && it.statement.named.length > 0) { -%>

  export { <%= it.statement.default.isPureType ? 'type ' : '' %>default as <%= it.statement.default.identifier.alias %>, <%= it.statement.named.map((named) => (named.isPureType ? 'type ' + named.identifier.name : named.identifier.name)).join(', ') %> } from<%= " " %>
  <%-= it.options.quote %><%= it.statement.importPath %><%= it.statement.extname.render %><%= it.options.quote -%>
  <%- if (it.options.useSemicolon) { -%><%-= ";" -%><%- } -%>

<%- } else if (it.statement.default != null) { -%>

  export { <%= it.statement.default.isPureType ? 'type ' : '' %>default as <%= it.statement.default.identifier.alias %> } from<%= " " %>
  <%-= it.options.quote %><%= it.statement.importPath %><%= it.statement.extname.render %><%= it.options.quote %>
  <%- if (it.options.useSemicolon) { -%><%-= ";" -%><%- } -%>

<% } else if (it.statement.named.length > 0) { -%>

  export { <%= it.statement.named.map((named) => (named.isPureType ? 'type ' + named.identifier.name : named.identifier.name)).join(', ') %> } from<%= " " %>
  <%-= it.options.quote %><%= it.statement.importPath %><%= it.statement.extname.render %><%= it.options.quote %>
  <%- if (it.options.useSemicolon) { -%><%-= ";" -%><%- } -%>

<% } else { %>
<% } -%>
`;
