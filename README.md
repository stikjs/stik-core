#Stik.js

An opinionated JS lib that wires your JavaScript execution to your HTML templates by creating pseudo closures of execution and scoping. Allowing you to manage, in a more consistant way, your events `binding/unbind` and your DOM scope manipulation.

```HTML
<div id="characters-list" data-controller="CharactersCtrl" data-action="List">
  <ul>
    <li>Mario</li>
    <li>Samus</li>
    <li>Link</li>
  </ul>
</div>
```

```javascript
stik.register("CharactersCtrl", "List", function($teardown, $template){
  // use your favorite DOM library to attach events
  elm = $($template);

  herosList = elm.find("ul");

  herosList.on('click', 'li', function(event){
    alert("It's me Mario!!");
  });

  $teardown(function(){
    // here you should detach all you event handlers (e.g. jquery .unbind)
    herosList.unbind('click');
  });
});
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
