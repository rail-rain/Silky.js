(function () {
  "use strict";
  
  var setBindAttribute = function (template) {
    
    var attributes = template.match(/value="{{.*?}}"/g);
    attributes.forEach(function (corrent) {
      var _variable = corrent.match(/{{.*}}/)[0];
      var variable = _variable.substring(2, _variable.length - 2);
      template = template.replace(corrent, corrent
         + " data-silky-bind=\"" + variable + "\""
         + " data-silky-bind-flag=\"true\"");
    });
    return template;
  };
  
  var setBindEvent = function (data) {
    
    var eventFunction = function (event) {
      var dataKey = event.target["data-silky-bind"];
      data[dataKey] = event.target.value;
    };
    
    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
      var corrent = inputs[i];
      
      if (corrent["data-silky-bind-flag"] === undefined) {
        continue;
      }
      corrent["data-silky-bind-flag"] = undefined;
      
      corrent.addEventListener("change", eventFunction);
    }
  };
  
  module.exports = {
    setBindAttribute: setBindAttribute,
    setBindEvent: setBindEvent
  };
  
}());
