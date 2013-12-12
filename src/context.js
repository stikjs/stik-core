window.slik || (window.slik = {});

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
  };

  Context.prototype.$load = function(){
    this.$$executionUnit(this.$teardown, this.$$template);
  };

  Context.prototype.$teardown = function(){

  };

  slik.Context = Context;
})();
