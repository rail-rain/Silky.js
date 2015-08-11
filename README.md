# Silky.js

Silky is fast, light and simple

## example

``` html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>example</title>
    
    <script src="./Silky.min.js" charset="utf-8"></script>
    
  </head>
  <body>
    
    <div id="example">
    </div>
    
    <script id="example-template" type="text/silky">
      <div>
        <input type="number" value="{{number}}">
        <button type="button" data-on-group="transition">prev</button>
        <button type="button" data-on-group="transition">next</button>
        {{#for number}}
          <span>{{this}}</span>
        {{/for}}
      </div>
    </script>
    
    <script type="text/javascript">
    
    Silky.template.registerHelper("for", function (number, html) {
      var results = [];
      for (var i = 0; i < number; i++) {
        results.push(html(i));
      }
      return results;
    });
    
      var data = Silky({
        el: "sample",
        template: "sample-template",
        data: {
          number: 1
        },
        events: {
          transition: function (prev, next) {
            var prevStreem = Bacon.fromEvent(prev, "click");
            var nextStreem = Bacon.fromEvent(next, "click");
            prevStreem.map(-1).merge(nextStreem.map(+1))
            .scan(1, function (current, v) {
              return current + v;
            }).onValue(function (number) {
              this.number = number;
            }.bind(this));
          }
        }
      });

      
    </script>
  </body>
</html>
```