(function () {
  "use strict";

  var vd = require("virtual-dom");
  var html2hs = require("html2hs-args");
  var mustache = require("mustache");
  var observeDeep = require("observe-deep");
  
  var setBindAttribute = function (template) {
    
    var attributes = template.match(/value="{{.*?}}"/g);
    attributes.forEach(function (corrent) {
      var _variable = corrent.match(/{{.*}}/)[0];
      var variable = _variable.substring(2, _variable.length - 2);
      template = template.replace(corrent, corrent + " data-silky-bind=\"" + variable + "\" ");
    });
    return template;
  };
  
  var setBindEvent = function (data) {
    
    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
      var corrent = inputs[i];
      var dataKey = corrent["data-silky-bind"];
      if (dataKey !== undefined) {
        corrent.addEventListener("change", function (event) {
          //TODO 全員おなじになる
          data[dataKey] = event.target.value;
        });
        corrent["data-silky-bind"] = undefined;
      }
    }
  };
  
  var createSilky = function (elId, template, data) {
    
    template = setBindAttribute(template);
     
     mustacheVdRender(template, data, function (tree) {
      var rootNode = vd.create(tree);
      var el = document.getElementById(elId);
      el.parentNode.replaceChild(rootNode, el);
      
      setBindEvent(data);
      
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
     html2hs(mustache.render(html, data), vd.h, function (err, hscropt) {
       callBack(hscropt);
     });
  };
  
  module.exports = {
    createSilky: createSilky,
    templateParse: templateParse,
    callReady: callReady
  };
}());
