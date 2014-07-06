![Stik.js Logo](https://raw.github.com/lukelex/stik.js/master/stik.js.png)

[![Build Status](https://travis-ci.org/stikjs/stik-core.svg?branch=master)](https://travis-ci.org/stikjs/stik-core)
[![Code Climate](https://codeclimate.com/github/stikjs/stik-core.png)](https://codeclimate.com/github/stikjs/stik-core)
[![Code Coverage](https://codeclimate.com/github/stikjs/stik-core/coverage.png)](https://codeclimate.com/github/stikjs/stik-core/)

An opinionated JS framework that wires your JavaScript execution to your HTML templates by creating pseudo closures of execution and scoping. Allowing you to manage, in a more consistant way, your events `binding/unbind` and your DOM scope manipulation.

By splitting your logic into small specialized responsible actions, Stik.js will help you avoid both the gigantism and namespace hell on your JavaScripts.

##Controllers
With Stik.js you can define in your HTML which templates should be bound to a specific controller and action.

###Single Actions
While declaring single controller actions you can pass in three arguments:

* `ControllerName` (String) -> Could be either the name of the page or the section in which the template will reside;
* `ActionName` (String) -> The component name. Usually maps to the component's responsibility;
* `ExecutionUnit` (Function) -> The script where your component data interactions shall live;

```javascript
stik.controller("CharactersCtrl", "List", function($template){
  var supported, characters;

  characters = $template.getElementsByClassName('character');

  function clickHandler(event){
    supported = event.target.getAttribute('hero');
    alert("I'll support " + supported + "!!");
  };

  for (var i = 0; i < characters.length; i++) {
    characters[i].addEventListener('click', clickHandler);
  };
});
```

```html
<div id="characters-list" data-controller="CharactersCtrl" data-action="List">
  <h3>Sub Characters</h3>
  <ul>
    <li class="character" hero="Mario">Luigi</li>
    <li class="character" hero="Link">Zelda</li>
    <li class="character" hero="Samus">Baby Metroid</li>
  </ul>
</div>
```

You can even have multiple templates using the same controller and action.

```html
<div id="heroes-list" data-controller="BattleCtrl" data-action="List">
  <ul>
    <li class="character">Mario</li>
    <li class="character">Samus</li>
    <li class="character">Link</li>
  </ul>
</div>

<div id="villains-list" data-controller="BattleCtrl" data-action="List">
  <ul>
    <li class="character">Bowser</li>
    <li class="character">Metroid</li>
    <li class="character">Ganondorf</li>
  </ul>
</div>
```

```javascript
stik.controller("BattleCtrl", "List", function($template){
  var heroes = $template.getElementsByClassName("character");

  function clickHandler(event){
    alert("It's me, " + event.target.textContent + "!! And I'm ready to fight!");
  };

  for (var i = 0; i < heroes.length; i++) {
    heroes[i].addEventListener('click', clickHandler);
  };
});
```

###Multiple actions per Controller
If you want to split responsibilities and compose your controller with multiple actions (and you should), you can declare multiple actions inside the same controller definition.

```javascript
stik.controller("MailCtrl", function(ctrl){
  ctrl.action("Sender", function($template, $courier){
    var mailInput, mailButton;

    mailInput = $template.getElementsByClassName("mail-input")[0];
    mailButton = $template.getElementsByClassName("mail-button")[0];

    mailButton.addEventListener("click", function(){
      $courier.$send("new-mail", mailInput.value);
      mailInput.value = "";
    });
  });

  ctrl.action("Receiver", function($courier, $viewBag){
    $courier.$receive("new-mail", function(message){
      $viewBag.push({newMsg: message});
    });
  });
});
```

##Behaviors
With the `behavior` method you can create reusable behaviors that can be applyed in multiple components throughout you application. Or, you can add multiple behaviors to a same component. Those behaviors should only have the responsibility of adding visual interactions instead of doing data manipulations (which is the controller responsibility).

```javascript
stik.behavior("sparkle-input", function($template){
  $template.addEventListener("focus", function(){
    // apply some fancy visual behavior
  });
  $template.addEventListener("blur", function(){
    // remove some fancy visual behavior
  });
});

stik.behavior("some-other-behavior", function($template){
  // ...
});
```

The bind of a behavior to its component is achieved using css classes.

```html
  <input class="sparkle-input some-other-behavior" />
```

After a template is bound to any behavior it will get a new attribute signalling behaviors were successfully applied, like so and the classes would be moved inside it, like so:

```html
  <input class="" data-behaviors="sparkle-input some-other-behavior" />
```

##Dependency Injection
With Dependency Injection (DI), your dependencies are given to your object instead of your object creating or explicitly referencing them. This means the dependency injector can provide a different dependency based on the execution context. For example, in your tests it might pass a fake version of your services API that doesn't make requests but returns static objects instead, while in production it provides the actual services API.

Stik.js comes with a built-in DI engine that allows you to specify which modules your code cares about. These modules can be required in any order you want:

```javascript
// just one

stik.controller("BattleCtrl", "List", function($template){
  // ...
});

stik.controller("BattleCtrl", "List", function($viewBag){
  // ...
});

// two

stik.controller("BattleCtrl", "List", function($viewBag, $template){
  // ...
});

// three

stik.controller("BattleCtrl", "List", function($courier, $template, $viewBag){
  // ...
});

// or nothing at all (why would you do that?!)

stik.controller("BattleCtrl", "List", function(){
  // ...
});
```

##Modules
Stik.js comes with a few modules to help you organize your code, by separating their responsibilities. These modules can be injected as needed.

###$template
Contains the HTML template (HTMLElement) that was bound to the current controller/behavior. This shall be used as the scope of **ALL** your DOM manipulation. Everything you need to access in the DOM to fullfill the role of the current controller/behavior action needs to be inside it.

####Using it
```javascript
stik.controller("YourCtrl", "YourAction", function($template){
  // you can use plain JS to access the DOM
  $template.getElementsByClassName("my-elm");

  // and do your stuff
  ...
});
```

##Boundaries
External libraries, objects and functions can be added as injectable modules to Stik.js. With that you will be able to avoid referencing global defined variables within controllers or behaviors. This will make your code more testable, since you will be able to inject mocks that quacks like the original libraries.

Boundaries can be injected in both controllers and behaviors. Unless, otherwise stated through the **from** parameter.

###Object Boundaries:

```javascript
stik.boundary({
  as: "MyDataLibrary",
  from: "controller",
  to: {
    // your awesome data related object
    someAwesomeData: "Awesome!!",
    doSomeDataManipulation: function(){ return "Yay!"; }
  }
});

stik.boundary({
  as: "MyEffectsLibrary",
  from: "behavior",
  to: {
    // your awesome visual related obj
    fadeIn: function(elm){},
    fadeOut: function(elm){}
  }
});

stik.controller("AppCtrl", "List", function(MyDataLibrary){
  // here you can manipulate your data
  // using your external dependency
  MyDataLibrary.doSomeDataManipulation(); // "Yay!"
  MyDataLibrary.someAwesomeData; // "Awesome!!"
});

stik.behavior("fade-input", function($template, MyEffectsLibrary){
  // here you can attach your visual effects
  // using your external dependency

  MyEffectsLibrary.fadeIn($template);
  MyEffectsLibrary.fadeOut($template);
});
```

###Function Boundaries:

```javascript
stik.boundary({
  as: "GetTwitterFeed",
  from: "controller",
  to: function(){
    return ajaxLib.get("https://twitter.com/twitterapi");
  }
});

stik.boundary({
  as: "fadeIn",
  from: "behavior",
  to: function(elm){
    return applyFadeIn(elm);
  }
});

stik.controller("AppCtrl", "List", function(GetTwitterFeed, $viewBag){
  var feed = GetTwitterFeed();

  $viewBag.push(feed);
});

stik.behavior("fade-input", function($template, fadeIn){
  fadeIn($template);
});
```

###Resolvable Boundaries
Resolvable Boundaries are functions that might depend on Stik modules or other boundaries. They will be called with the required dependencies and their returned value will be passed on to whichever controller or behavior requiring it.

```javascript
stik.boundary({
  as: "SomeFunkyFunc",
  from: "controller",
  resolvable: true,
  to: function($template){
    return doSomethingFunky($template);
  }
});

stik.controller("AppCtrl", "List", function(SomeFunkyFunc){
  SomeFunkyFunc // some funky value returned from the boundary
});
```

###Instantiable Boundaries:
Instantiable boundaries can be used when you might have dependencies on Stik modules but mostly other boundaries and you need to maintain separate state between your controllers and/or behaviors.

```javascript
stik.boundary({
  as: "TwoWayDataBinding",
  from: "controller",
  instantiable: true,
  to: function($template, $viewBag, GetTwitterFeed){
    // this should be the obj constructor
    // that will receive whichever dependency that you declare

    this.prototype.bindTo = function(myDataObj){
      // do your binding stuff
    };
  }
});

stik.controller("AppCtrl", "List", function(TwoWayDataBinding){
  // this will be a new instance of the TwoWayDataBinding class
  // that will have the $template as an instance variable
  TwoWayDataBinding.bindTo(SomeData);
});
```

###Cachable Boundaries
Function and Instantiable boundaries can be cached to avoid duplicate calls or expensive operations. The function will be called the first time and its value will be cached for all subsequencial calls.

```javascript
stik.boundary({
  as: "expensiveFunction",
  cache: true,
  to: function(){
    return expensiveOperation();
  }
});
```

##Helping Stik.js
###I found a bug!
If you found a repeatable bug then file an issue on [issues page](https://github.com/stikjs/stik.js/issues), preferably with a working example or repo.

###I have a new sugestion!
For Feature requests or followup on current tasks and development status check our [Trello Board](https://trello.com/b/KKddbfdU/stik-js). Feel free to comment there or file issues.

###Examples
####Gists
Some refactoring examples
* [https://gist.github.com/lukelex/10364670](https://gist.github.com/lukelex/10364670)

##Development

###Setup
```shell
npm install
```

###Testing
```shell
$ grunt test
```

###Packing
```shell
$ grunt pack
```
