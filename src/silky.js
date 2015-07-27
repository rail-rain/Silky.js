(function () {
  "use strict";
  
  var observe = require("object.observe");
  var util = require("./util");
  var createSilky = util.createSilky;
  var templateParse = util.templateParse;
  var callReady = util.callReady;
  
  var components = {};
  
  var silkyNew = function (option) {
    var data = createSilky(option.el, templateParse(option.template), option.data);
    callReady(option.ready);
    return data;
  };
  
  var silkyExtend = function (option) {
    components[option.name] = {
      template: templateParse(option.template),
      data: option.data
    };
  };
  
  var silkyComponent = function (option) {
    var component = components[option.name];
    var data = createSilky(option.el, component.template, component.data());
    callReady(option.ready);
    return data;
  };
  
  window.silky = {
    new: silkyNew,
    extend: silkyExtend,
    component: silkyComponent,
    config: {}
  };

}());

