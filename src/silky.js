"use strict";

  require("object.observe");
  
  var diff = require("virtual-dom/vtree/diff"),
    patch = require("virtual-dom/vdom/patch"),
    create = require("virtual-dom/vdom/create-element"),
    observeDeep = require("observe-deep"),
    html2tvd = require("html2template-hs/virtual-dom"),
    htmlTemplate = require("./htmlParser");

  var Silky = function(option) {
    htmlTemplate.addTemplate(option.template);
    var data = option.data;
    
    createSilky(option.el, option.template, data);

    if (option.ready) {
      option.ready.call(data);
    }
    return data;
  };
    
  var createSilky = function(elId, template, data) {
    
    var render = htmlTemplate.templates[template];
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
  
  Silky.template = {
    registerHelper: html2tvd.registerHelper,
    unregisterHelper: html2tvd.unregisterHelper
  };
  
  window.Silky = Silky;
