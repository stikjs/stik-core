window.stik || (window.stik = {});

(function(){
  function Context(controller, action, template, executionUnit){
    if (!controller)
      throw "controller is missing";
    if (!action)
      throw "action is missing";
    if (!template)
      throw "template is missing";
    if (!executionUnit)
      throw "execution unit is missing";

    this.$$controller = controller;
    this.$$action = action;
    this.$$template = template;
    this.$$executionUnit = executionUnit;
    this.$$disposable = false;
  };

  Context.prototype.$load = function(){
    this.$$executionUnit(this, this.$$template);
  };

  stik.Context = Context;
})();
