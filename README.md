#Stik.js

An opinionated JS lib that wires your JavaScript execution to your HTML templates by creating pseudo closures of execution and scoping. Allowing you to manage, in a more consistant way, your events `binding/unbind` and your DOM scope manipulation.

By splitting your logic into small specialized responsible actions, Stik.js will help you avoid both the gigantism and namespace hell on your JavaScripts.

#Wire up
With Stik.js you can define in your HTML which templates should be bound to a specific controller and action.
```html
<div id="characters-list" data-controller="CharactersCtrl" data-action="List">
  <ul>
    <li>Mario</li>
    <li>Samus</li>
    <li>Link</li>
  </ul>
</div>
```

And then in your JavaScript you would describe your template behaviors using the `register` function provided by Stick.js.

```javascript
stik.register("CharactersCtrl", "List", function($context, $template){
  // use your favorite DOM library to attach events
  elm = $($template);

  herosList = elm.find("ul");

  herosList.on('click', 'li', function(event){
    alert("It's me Mario!!");
  });
});
```

The `register` function accepts three arguments:

* `ControllerName` (String) -> Could be either the name of the page or the section in which the template will reside;
* `ActionName` (String) -> The actual name of the template;
* `closure` (Function) -> The closure where your template behavior shall live;

The `closure` function takes 2 arguments:

* `$context` (Object) -> This object contains information about the execution context (e.g. controller and template);
* `$template` -> Contains the HTMLElement that corresponds to the template associated with this controller. Every DOM manipulation should belong to its tree, maintining the component isolation.

You can even have multiple templates using the same controller and action.
```html
```

```javascript
```

#Development
##Testing
```shell
$ grunt test
```

##Packing
```shell
$ grunt pack
```
