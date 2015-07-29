(function () {
  "use strict";
  
  var observe = require("object.observe");
  
  var components = {};
  
  var silkyNew = function (option) {
    addTemplate(option.template);
    var data = createSilky(option.el, option.template, option.data);
    callReady(option.ready, data);
    return data;
  };
  
  var silkyExtend = function (option) {
    addTemplate(option.template);
    components[option.name] = {
      template: option.template,
      data: option.data
    };
  };
  
  var silkyComponent = function (option) {
    var component = components[option.name];
    var data = createSilky(option.el, component.template, component.data());
    callReady(option.ready, data);
    return data;
  };
  
  window.silky = {
    new: silkyNew,
    extend: silkyExtend,
    component: silkyComponent
  };

  var vd = require("virtual-dom");
  var html2hs = require("html2template-hs");
  var observeDeep = require("observe-deep");

  var createSilky = function(elId, template, data) {

    var tree = templates[template](data);
    var rootNode = vd.create(tree);
    var el = document.getElementById(elId);
    el.parentNode.replaceChild(rootNode, el);

    observeDeep(data, function() {
      var newTree = templates[template](data);
      var patches = vd.diff(tree, newTree);
      rootNode = vd.patch(rootNode, patches);
      tree = newTree;
    });
    return data;
  };

  var templates = {};

  var addTemplate = function(templateString) {
    var template = document.getElementById(templateString);

    if (template.getAttribute("type") === "text/silky") {
      html2hs(template
        .textContent.replace(/[\n\r]/g, "")
        .replace(/(>|<)\s+/g, "$1").replace(/\s+(>|<)/g, "$1"),
        //TODO インライン要素内の前後の空白が消える
        vd.h,
        function(hsFunction) {
          templates[templateString] = hsFunction;
        });
    } else {
      console.log("template script type not a \"text/silky\"");
    }
  };

  var callReady = function(ready, data) {
    if (ready) {
      ready(data);
    }
  };
}());

