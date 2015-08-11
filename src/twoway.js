"use strict";

var html2tvd = require("html2template-hs/virtual-dom"),
  evStore = require('virtual-dom/node_modules/ev-store');

document.documentElement.addEventListener("input", function (event) {
  var events = evStore(event.target);
  var handler = events.input;
  if (handler) {
    handler(event, events.bind);
  }
});

var twowayFunction = function (event, bindKey) {
  this[bindKey] = event.target.value;
};

html2tvd.registerHelper("twoway", function (data) {
  return twowayFunction.bind(data);
});

module.exports = {
  replace: function (html) {
    return html.replace(/(value="{{(.+?)}}")/, '$1 ev-bind="$2" ev-input="{{twoway .}}"');
  }
};

