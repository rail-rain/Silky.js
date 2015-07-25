(function () {
  "use strict";
  
  var vd = require('virtual-dom');
  var html2hs = require('html2hs-args');
  var mustache = require('mustache');
  
  window.silky = function (elId, templateId, data) {
    var template = document.getElementById(templateId);
    if (template.getAttribute("type") !== "text/silky") {
      console.log("template script type not a \"silky\"");
      return;
    }
    template = template.textContent;
    
    mustacheVdRender(template, data, function (tree) {
      var rootNode = vd.create(tree);
      var el = document.getElementById(elId);
      el.parentNode.replaceChild(rootNode, el);
      
      Object.observe(data, function () {
        mustacheVdRender(template, data, function (newTree) {
          var patches = vd.diff(tree, newTree);
          rootNode = vd.patch(rootNode, patches);
          tree = newTree;
        });
      });
    });
  };
  
  var mustacheVdRender = function (html, data, callBack) {
    html2hs(mustache.render(html, data), vd.h, function (err, hscropt) {
      callBack(hscropt);
    });
  };

}());

