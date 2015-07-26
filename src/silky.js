(function () {
  "use strict";
  
  var vd = require('virtual-dom');
  var html2hs = require('html2hs-args');
  var mustache = require('mustache');
  var observeDeep = require('observe-deep');
  var util = require('./util');
  var createSilky = util.createSilky;
  var templateParse = util.templateParse;
  var mustacheVdRender = util.mustacheVdRender;
  
  var components = {};
  
  var silkyNew = function (option) {
      return createSilky(option.el, templateParse(option.template), option.data);
  }
  
  var silkyExtend = function (option) {
    components[option.name] = {
      template: templateParse(option.template),
      data: option.data
    };
  };
  
  var silkyComponent = function (option) {
    var component = components[option.name];
    return createSilky(option.el, component.template, component.data());
  }
  
  window.silky = {
    new: silkyNew,
    extend: silkyExtend,
    component: silkyComponent
  };

}());

