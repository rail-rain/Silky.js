var h = require("virtual-dom/virtual-hyperscript"),
  html2tvd = require("html2template-hs/virtual-dom"),
  twoway = require("./twoway");

html2tvd.setNotAttributes(["ev-", "value", "data-on-group"]);

var templates = {};

var addTemplate = function(templateId) {
  if (templates[templateId]) {
    return;
  }
  var template = document.getElementById(templateId);
  
  var text = twoway.replace(template.textContent);
  var hsFunction = html2tvd.compile(text, h);
  templates[templateId] = hsFunction;
  template.parentNode.removeChild(template);
};

module.exports = {
  addTemplate: addTemplate,
  templates: templates
};

