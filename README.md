# Silky.js
Silky is fast, light and simple

This is still during the experiment therefore Possibility of change without notice

## example

```html
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

    <script id="example-template" type="text/Silky">
      <span>hello {{name}}!</span>
    </script>

    <script type="text/javascript">
      var data = Silky({
        el: "example",
        template: "example-template",
        data: {
          name: "silky.js"
        }
      });
    </script>
  </body>
</html>
```

- [docs](#docs)
  - [template](#template)
  - [api](#api)
  - [group](#group)

- [thanks](#thanks)

## docs
### template
template of silky is template like [handlebars]

(i will omit the "some of html" of template)

#### expression expansion

```html
  <!-- silky refers to the data property of silky options -->
  <span>hello {{name}}!</span>
```

#### built-in helpers
  Basic is the same as the handlebars
- [if](#if)
- [unless](#unless)
- [if else](#if-else)
- [array repeat](#array-repeat)
- [object in array repeat](#object-in-array-repeat)

##### if

```html
  <div>
    {{#if flag}}
      <span>hello</span>
    {{/if}}
    <span>world</span>
  </div>
```

##### unless

```html
  <div> 
    {{#unless flag}} 
      <span>hello</span> 
    {{/unless}} 
    <span>world</span> 
  </div>
```

##### if else

```html
    <div> 
      {{#if flag}} 
        <span>hello</span> 
      {{else}} 
        <span>good night</span> 
      {{/if}} 
      <span>world</span> 
    </div>
```

##### array repeat

```html
  <div> 
    {{#each array}} 
      <span>{{this}}</span> 
    {{/each}} 
  </div>
```

##### object in array repeat

```html
  <div> 
    {{#each object}} 
      <span>{{this.greeting}}</span> 
    {{/each}} 
  </div>
```

#### custom helper
- [registe helper](#registe-helper)
- [registe block helper](#registe-block-helper)

#### registe helper

```html

<div id="example">
</div>

<script id="example-template" type="text/Silky">
  <span>{{greeting name}}</span>
  <!-- result <span>hello world</span> -->
</script>

<script type="text/javascript">
  Silky.template.registerHelper("greeting", function (name) {
    return hello   name;
  });

  var data = Silky({
    el: "example",
    template: "example-template",
    data: {
      name: world
    }
  });
</script>
```

#### registe block helper

```html

<div id="example">
</div>

<script id="example-template" type="text/Silky">
  <div> 
    {{#with greeting}} 
      <span>{{this.morning}}</span> 
      <span>{{this.noon}}</span> 
      <span>{{this.evening}}</span> 
      <span>{{this.night}}</span> 
    {{/with}} 
  </div>
  <!-- result 
    <div>
      <span>good morning</span>
      <span>hello</span>
      <span>good evening</span>
      <span>good night</span>
    </div> -->
</script>

<script type="text/javascript">
  Silky.template.registerHelper("with", function (object, html) {
    return html(object);
  });

  var data = Silky({
    el: "example",
    template: "example-template",
    data: {
      greeting: {
        morning: good morning,
        noon: hello,
        evening: good evening,
        night: good night
      }
    }
  });
</script>
```

another sample

```html


<div id="example">
</div>

<script id="example-template" type="text/Silky">
  <div> 
    {{#for number}} 
      <span>{{this}}</span> 
    {{/for}} 
</div>
  <!-- result 
   <div>
     <span>0</span>
     <span>1</span>
     <span>2</span>
   </div> -->
</script>

<script type="text/javascript">
  Silky.template.registerHelper("for", function (number, html) {
    var results = [];
    for (var i = 0; i < number; i) {
      results.push(html(i));
    }
    return results;
  });

  var data = Silky({
    el: "example",
    template: "example-template",
    data: {
      items: 3
    }
  });
</script>
```

## api
* [options](#options)

### options

#### el
el is id of element to put the template
(It will be erased when you use)

#### template
id of template

#### data
Data to be used in the template

#### ready
ready is lifecycle,  
it will called to last,  
"this" of it is the data.  

#### group
Use in the following group system

## group

group will do the all that can not be to data-bind
``` html
<div id="group-example"></div>

<script id="group-example-template" type="text/silky">
  <div>
    <button type="button" data-on-group="{{example}}">prev</button>
    <button type="button" data-on-group="{{example}}">next</button>
  </div>
</script>
<script type="text/javascript">

  var data = Silky({
    el: "group-example",
    template: "group-example-template",
    groups: {
      example: function (prev, next) {
        // The arguments is htmlelement
      }
    }
  });
</script>
```

### special group sample
Using the combined for group and [bacon]

``` html
<div id="special"></div>

<script id="special-template" type="text/silky">
  <div>
    <input type="number" value="{{number}}">
    <button type="button" data-on-group="{{transition}}">prev</button>
    <button type="button" data-on-group="{{transition}}">next</button>
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
    el: "special",
    template: "special-template",
    data: {
      number: 1
    },
    groups: {
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
```

## thanks

  [handlebars] MIT
  
  Copyright (C) 2011-2015 by Yehuda Katz
  
  [bacon] MIT
  
  Copyright (c) 2014 Juha Paananen
  
[handlebars]: http://handlebarsjs.com/ "handlebars"
[bacon]: https://github.com/baconjs/bacon.js/ "bacon"
