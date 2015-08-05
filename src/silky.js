(function() {
  "use strict";

  var observe = require("object.observe");

  var silky = function(option) {
    addTemplate(option.template);
    var data = option.data;
    
    createSilky(option.el, option.template, data);

    if (option.ready) {
      option.ready.call(data);
    }
    return data;
  };

  var diff = require("virtual-dom/vtree/diff"),
    patch = require("virtual-dom/vdom/patch"),
    create = require("virtual-dom/vdom/create-element"),
    h = require("virtual-dom/virtual-hyperscript"),
    observeDeep = require("observe-deep"),
    html2ths = require("html2template-hs");
    
  var createSilky = function(elId, template, data) {
    
    var render = templates[template];
    var tree = render(data);
    
    var rootNode = create(tree);
    var el = document.getElementById(elId);
    el.parentNode.replaceChild(rootNode, el);

    observeDeep(data, function() {
      var newTree = render(data);
      var patches = diff(tree, newTree);
      rootNode = patch(rootNode, patches);
      tree = newTree;
    });
  };

  var templates = {};

  var addTemplate = function(templateId) {
    if (templates[templateId]) {
      return;
    }
    var template = document.getElementById(templateId);

    var hsFunction = html2ths.compile(template.textContent, h);
    templates[templateId] = hsFunction;
    template.parentNode.removeChild(template);
  };
  
  silky.template = {
    registerHelper: html2ths.registerHelper,
    unregisterHelper: html2ths.unregisterHelper
  };
  
  window.silky = silky;
}());
