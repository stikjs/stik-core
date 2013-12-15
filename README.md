#Stik.js

An opinionated JS library that wires your JavaScript execution to your HTML templates by creating pseudo closures of execution and scoping. Allowing you to manage, in a more consistant way, your events `binding/unbind` and your DOM scope manipulation.

By splitting your logic into small specialized responsible actions, Stik.js will help you avoid both the gigantism and namespace hell on your JavaScripts.

#Wire up
With Stik.js you can define in your HTML which templates should be bound to a specific controller and action.

```html
<div id="characters-list" data-controller="CharactesCtrl" data-action="List">
  <h3>Sub Characters</h3>
  <ul>
    <li class="character" hero="Mario">Luigi</li>
    <li class="character" hero="Link">Zelda</li>
    <li class="character" hero="Samus">Baby Metroid</li>
  </ul>
</div>
```

And then in your JavaScript you would describe your template behaviors using the `register` function provided by Stick.js.

```javascript
stik.register("CharactesCtrl", "List", function($template){
  var supported, character;

  character = $template.getElementsByClassName('character');

  function clickHandler(event){
    supported = event.target.getAttribute('hero');
    alert("I'll support " + supported + "!!");
  };

  for (var i = 0; i < character.length; i++) {
    character[i].addEventListener('click', clickHandler);
  };
});
```

The `register` function accepts three arguments:

* `ControllerName` (String) -> Could be either the name of the page or the section in which the template will reside;
* `ActionName` (String) -> The actual name of the template;
* `closure` (Function) -> The closure where your template behavior shall live;

You can even have multiple templates using the same controller and action.

```html
<div id="heroes-list" data-controller="BattleCtrl" data-action="List">
  <ul>
    <li>Mario</li>
    <li>Samus</li>
    <li>Link</li>
  </ul>
</div>

<div id="villains-list" data-controller="BattleCtrl" data-action="List">
  <ul>
    <li>Bowser</li>
    <li>Metroid</li>
    <li>Ganondorf</li>
  </ul>
</div>
```

```javascript
stik.register("BattleCtrl", "List", function($template){
  var heroes = $template.getElementsByClassName('hero');

  function clickHandler(event){
    alert("It's me, " + event.target.textContent + "!! And I'm ready to fight!");
  };

  for (var i = 0; i < heroes.length; i++) {
    heroes[i].addEventListener('click', clickHandler);
  };
});
```

#Dependency Injection
With Dependency Injection (DI), your dependencies are given to your object instead of your object creating or explicitly referencing them. This means the dependency injector can provide a different dependency based on the context of the situation. For example, in your tests it might pass a fake version of your services API that doesn't make requests but returns static objects instead, while in production it provides the actual services API.

Stik.js comes with a built-in DI module that allows you to specify which modules you code cares about.

The available modules are:

* `$context` (Object) -> This object contains information about the execution context (e.g. controller and template);
* `$template` (HTMLElement) -> Contains the HTMLElement that corresponds to the template associated with this controller. Every DOM manipulation should belong to its tree, maintining the component isolation.

Theses can be required in any other you want:

```javascript
// just one

stik.register("BattleCtrl", "List", function($template){
  // ...
});

stik.register("BattleCtrl", "List", function($context){
  // ...
});

// or two

stik.register("BattleCtrl", "List", function($context, $template){
  // ...
});

stik.register("BattleCtrl", "List", function($template, $context){
  // ...
});

// or nothing at all

stik.register("BattleCtrl", "List", function(){
  // ...
});
```
#Helping Stik.js
##I found a bug!
If you found a repeatable bug then file an issue on [issues page](https://github.com/lukelex/stik.js/issues), preferably with a working example or repo.

##I have new sugestion!
For Feature requests or followup on current tasks and development status check our [Trello Board](https://trello.com/b/KKddbfdU/stik-js). Feel free to comment there or file issues.

#Development
##Testing
```shell
$ grunt test
```

##Packing
```shell
$ grunt pack
```
