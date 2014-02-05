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
    for (var action in this.$$actions){
      this.$$actions[action].$bind(modules);
    }
  };

  window.stik.Controller = Controller;
})();
