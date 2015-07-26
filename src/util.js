var createSilkyInstance = function (elId, template, data) {
 
  var el = document.getElementById(elId);
  el.parentNode.replaceChild(rootNode, el);
   
   mustacheVdRender(template, data, function (tree) {
     var rootNode = vd.create(tree);
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
      return;
    }
  }
}

 var mustacheVdRender = function (html, data, callBack) {
   html2hs(mustache.render(html, data), vd.h, function (err, hscropt) {
     callBack(hscropt);
   });
 };