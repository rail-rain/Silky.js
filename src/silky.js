(function() {
  "use strict";

  var observe = require("object.observe");

  window.silky = function(option) {
    addTemplate(option.template);
    var data = createSilky(option.el, option.template, option.data);

    if (option.ready) {
      option.ready(data);
    }
    return data;
  };

  var diff = require("virtual-dom/vtree/diff"),
    patch = require("virtual-dom/vdom/patch"),
    create = require("virtual-dom/vdom/create-element"),
    h = require("virtual-dom/virtual-hyperscript"),
    mainLoop = require("main-loop"),
    observeDeep = require("observe-deep"),
    html2hs = require("html2template-hs");
    
  var createSilky = function(elId, template, data) {
      
    var loop = mainLoop(data, templates[template], {
      create: create,
      diff: diff,
      patch: patch
    });
    var el = document.getElementById(elId);
    el.parentNode.replaceChild(loop.target, el);

    observeDeep(data, function() {
      loop.update(data);
    });
    return data;
  };

  var templates = {};

  var addTemplate = function(templateId) {
    if (templates[templateId]) {
      return;
    }
    var template = document.getElementById(templateId);

    if (template.getAttribute("type") === "text/silky") {
      html2hs(template
        .textContent.replace(/[\n\r]/g, "")
        .replace(/(>|<)\s+/g, "$1").replace(/\s+(>|<)/g, "$1")
        .replace(/(value="{{(.+?)}}")/g,
        "$1 ev-change=function(t){o.$2=t.value}"),
        //TODO インライン要素内の前後の空白が消える
        h,
        function(hsFunction) {
          templates[templateId] = hsFunction;
        });
        template.parentNode.removeChild(template);
    } else {
      throw new Error("template script type not a \"text/silky\"");
    }
  };
  var EvStore = require("virtual-dom/node_modules/ev-store");
  document.documentElement
  .addEventListener("change", function (event) {
    var changeFunction = EvStore(event.target)['change'];
    if (changeFunction) {
      changeFunction(event.target);
    }
  });
}());
