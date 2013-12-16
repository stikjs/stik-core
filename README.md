#Stik.js

[![Build Status](https://travis-ci.org/lukelex/stik.js.png?branch=master)](https://travis-ci.org/lukelex/stik.js) [![Code Climate](https://codeclimate.com/github/lukelex/stik.js.png)](https://codeclimate.com/github/lukelex/stik.js)

An opinionated JS library that wires your JavaScript execution to your HTML templates by creating pseudo closures of execution and scoping. Allowing you to manage, in a more consistant way, your events `binding/unbind` and your DOM scope manipulation.

By splitting your logic into small specialized responsible actions, Stik.js will help you avoid both the gigantism and namespace hell on your JavaScripts.

#Wire up
With Stik.js you can define in your HTML which templates should be bound to a specific controller and action.

The `register` function accepts three arguments:

* `ControllerName` (String) -> Could be either the name of the page or the section in which the template will reside;
* `ActionName` (String) -> The component name. Usually maps to the component's responsibility;
* `ExecutionUnit` (Function) -> The script where your component behavior shall live;

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

And then in your JavaScript you would describe your template behaviors using the `register` function provided by Stik.js.

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

Stik.js comes with a built-in DI engine that allows you to specify which modules your code cares about. These modules can be required in any order you want:

```javascript
// just one

stik.register("BattleCtrl", "List", function($template){
  // ...
});

stik.register("BattleCtrl", "List", function($context){
  // ...
});

// two

stik.register("BattleCtrl", "List", function($context, $template){
  // ...
});

// three

stik.register("BattleCtrl", "List", function($courier, $template, $context){
  // ...
});

// or nothing at all (why would you do that?!)

stik.register("BattleCtrl", "List", function(){
  // ...
});
```

#Modules
Stik.js comes with a couple modules to help you organize your code, by separating their responsibilities. These modules can be injected in each controller, as needed.

##$template
Contains the HTML template (HTMLElement) that was bound to the current controller. This shall be used as the scope of **ALL** your DOM manipulation. Everything you need to access in the DOM to fullfill the role of the current controller action needs to be inside it. Using any HTML that doesn't reside in it is a violation of the Law of Demeter.

###Using it
```javascript
stik.register("YourCtrl", "YourAction", function($template){
  // you can use plain JS to access the DOM
  $template.getElementsByClass("my-elm");

  // or any DOM lib to help you out
  $($template).getElement(".my-elm"); // MooTools
  $($template).find(".my-elm"); // Zepto.js or jQuery

  // and do your stuff
  ...
});
```

##$courier
Enables a controller to send and receive messages from another controller.

###Using it
```javascript
stik.register("MessageCtrl", "Sender", function($courier){
  // delegate a new message to the controller responsible for it
  // can be either a String or a JS Object (POJO)
  $courier.$send("new-message", {
    your: "delegation"
  });
});

stik.register("MessageCtrl", "Receiver", function($courier){
  // specify what messages this controller should expect
  $courier.$receive("new-message", function(msg){
    // do something with the message
    ...
  });
  // a message can be delivered to any number of controllers that
  // defines an expectation for it
});
```

##$viewBag
Enables a controller to do a semi 1 way binding with its current template.

###Using it
```javascript
stik.register("MessageCtrl", "Revelation", function($viewBag){
  // the $render method receives an object with the
  // values that it will use
  $viewBag.$render({
    senderName: "Darth Vader",
    receiverName: "Luke Skywalker"
    message: "I'm your father!"
  });
});
```
```html
<div data-controller="MessageCtrl" data-action="Revelation">
  <span data-bind="senderName"></span>
  <span data-bind="receiverName"></span>
  <span data-bind="message"></span>
</div>
```

##$context
Each controller can be bound to 1 or more templates and vice-versa. For each bind that Stik.js is able to perform, a `context` object will be created holding some basic information about the current execution. For day-to-day development you don't need this module. But it's there if you want to spy on some low level stuff.

###Using it
```javascript
stik.register("YourCtrl", "YourAction", function($context){
  ...
});
```

#Helping Stik.js
##I found a bug!
If you found a repeatable bug then file an issue on [issues page](https://github.com/lukelex/stik.js/issues), preferably with a working example or repo.

##I have a new sugestion!
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
