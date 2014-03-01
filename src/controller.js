(function(){
  function Controller(name){
    if (!name) { throw "Controller name can't be empty"; }

    this.$$name = name;
    this.$$actions = {};
  }

  Controller.method("action", function(actionName, executionUnit){
    var action = window.stik.action({
      name: actionName,
      controller: this.$$name,
      executionUnit: executionUnit
    });
    this.$$actions[actionName] = action;
    return action;
  });

  Controller.method("$bind", function(modules){
    var boundAny = false;

    for (var action in this.$$actions){
      if (this.$$actions[action].bind(modules)) {
        boundAny = true;
      }
    }

    return boundAny;
  });

  window.stik.Controller = Controller;
})();
