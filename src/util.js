(function () {
  "use strict";

  var vd = require("virtual-dom");
  var html2hs = require("html2hs-args");
  var observeDeep = require("observe-deep");
  var twoWay = require("./two-way");
  
  var createSilky = function (elId, template, data) {
      template = twoWay.setBindAttribute(template);
     
     mustacheVdRender(template, data, function (tree) {
      var rootNode = vd.create(tree);
      var el = document.getElementById(elId);
      el.parentNode.replaceChild(rootNode, el);
      
        twoWay.setBindEvent(data);
      
      observeDeep(data, function () {
        mustacheVdRender(template, data, function (newTree) {
          var patches = vd.diff(tree, newTree);
          rootNode = vd.patch(rootNode, patches);
          tree = newTree;
         });
       });
     });
    return data;
   };
  
  var templateParse = function (templateString) {
    var template = document.getElementById(templateString);
    if (template === null) {
      return templateString;
    } else {
      if (template.getAttribute("type") === "text/silky") {
        template.parentNode.removeChild(template);
        return template.textContent;
      } else {
        console.log("template script type not a \"text/silky\"");
        return null;
      }
    }
  };
  
  var callReady = function (ready) {
    if (ready !== undefined) {
      ready();
    }
  };
  
  var mustacheVdRender = function (html, data, callBack) {
    var render = silky.config.templateEngine;
     html2hs(render(html, data), vd.h, function (err, hscropt) {
       callBack(hscropt);
     });
  };
  
  module.exports = {
    createSilky: createSilky,
    templateParse: templateParse,
    callReady: callReady
  };
}());
