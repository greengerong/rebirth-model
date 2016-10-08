/**
 * This file is generated by the rebirth-model compiler.
 *
 */
/* tslint:disable */

<% var encodeDefaultValue =function (type, value) {
  return type === 'string' ? ('"' + value+ '"') : value;
}%>

<% _.chain(type).filter(item => item.importType).forEach(item => {%>
import { <%=item.importType %> } from './<%=item.importType %>';
<%}).value()%>

export class <%= name%> {
   <% _.forEach(type, item =>{%>
    <%=item.name %>: <%=item.type %><% if(item.default){%> = <%= encodeDefaultValue(item.type, item.default)%><%} %>;
   <%})%>
}
