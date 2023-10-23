export const indexFileDefaultTemplate = `
<%- if (it.directive != null && it.directive !== '' && it.banner != null) { -%>
  <%-= it.directive -%>
  <%-= it.eol -%>
<%- } else if (it.directive != null && it.directive !== '') { -%>
  <%-= it.directive -%>
  <%-= it.eol -%><%-= it.eol -%>
<%- } -%>

<%- if (it.directive != null && it.directive !== '' && it.banner != null) { -%>
  <%-= it.banner -%>
  <%-= it.eol -%><%-= it.eol -%>
<%- } else if (it.banner != null) { -%>
  <%-= it.banner -%>
  <%-= it.eol -%><%-= it.eol -%>
<%- } -%>

<%-= it.content -%>
`;
