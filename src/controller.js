(function(){
  function Controller(name){
    if (!name) { throw "Controller name can't be empty"; }

    this.$$name = name;
    this.$$actions = {};
  }

  Controller.prototype.action = function(actionName, executionUnit){
    var action = new window.stik.Action(
      actionName, this.$$name, executionUnit
    );
    this.$$actions[actionName] = action;
    return action;
  };

  Controller.prototype.$bind = function(modules){
    var boundAny = false;

    for (var action in this.$$actions){
      if (this.$$actions[action].$bind(modules)) {
        boundAny = true;
      }
    }

    return boundAny;
  };

  window.stik.Controller = Controller;
})();
