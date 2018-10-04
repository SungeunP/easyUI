_getHTMLTemplate = (templateId, args) => {
  var source = document.getElementById(templateId).innerHTML;
  var template = Handlebars.compile(source);
  var context = args;
  var html = template(context);
  return html;
}