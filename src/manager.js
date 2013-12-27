(function(){
  function Manager(modules){
    this.$$contexts       = [];
    this.$$behaviors      = [];
    this.$$executionUnits = {};
    this.$$modules        = modules || {};
  }

  Manager.prototype.$addController = function(controller, action, executionUnit){
    if (!controller)    { throw "controller can't be empty"; }
    if (!action)        { throw "action can't be empty"; }
    if (!executionUnit) { throw "execution unit is missing"; }

    this.$storeExecutionUnit(controller, action, executionUnit);
    this.$bindExecutionUnit(controller, action, executionUnit);
  };

  Manager.prototype.$addBehavior = function(name, executionUnit){
    var behavior;

    if (this.$isBehaviorRegistered(name)) {
      throw "behavior already exist with the specified name";
    }

    behavior = this.$createBehavior(name, executionUnit)
    this.$$behaviors.push(behavior);
    this.$applyBehavior(behavior);

    return behavior;
  };

  Manager.prototype.$isBehaviorRegistered = function(name){
    for (var i = 0; i < this.$$behaviors.length; i++) {
      if (this.$$behaviors[i].$$name === name) {
        return true;
      }
    }

    return false;
  };

  Manager.prototype.$createBehavior = function(name, executionUnit){
    return new window.stik.Behavior(name, executionUnit);
  };

  Manager.prototype.$storeExecutionUnit = function(controller, action, executionUnit){
    this.$$executionUnits[controller] = (this.$$executionUnits[controller] || {});

    if (this.$$executionUnits[controller][action]){
      throw "Controller and Action already exist!";
    }

    this.$$executionUnits[controller][action] = executionUnit;
  };

  Manager.prototype.$storeContext = function(controller, action, template, executionUnit){
    var newContext = this.$createContext(controller, action, template, executionUnit);
    this.$$contexts.push(newContext);
    return newContext;
  };

  Manager.prototype.$createContext = function(controller, action, template, executionUnit){
    return new window.stik.Context(controller, action, template, executionUnit);
  };

  Manager.prototype.$buildContexts = function(){
    var controller, action, executionUnit;
    var boundAny;

    if (Object.keys(this.$$executionUnits).length === 0){
      throw "no execution units available";
    }

    for (controller in this.$$executionUnits) {
      for (action in this.$$executionUnits[controller]) {
        executionUnit = this.$$executionUnits[controller][action];
        if (this.$bindExecutionUnit(controller, action, executionUnit)){
          boundAny = true;
        }
      }
    }

    if (!boundAny) { throw "no templates were bound"; }
  };

  Manager.prototype.$bindExecutionUnit = function(controller, action, executionUnit){
    var context, templates;

    templates = this.$findControllerTemplates(controller, action);

    for (var i = 0; i < templates.length; i++) {
      context = this.$storeContext(controller, action, templates[i], executionUnit);
      context.$load(this.$$modules);
    }

    return templates.length > 0;
  };

  Manager.prototype.$applyBehavior = function(behavior){
    var templates = this.$findBehaviorTemplates(behavior.$$name);

    for (var i = 0; i < templates.length; i++) {
      behavior.$load(templates[i], this.$$modules);
    }
  };

  Manager.prototype.$findControllerTemplates = function(controller, action, DOMInjection){
    var DOMHandler = document;
    if (DOMInjection) { DOMHandler = DOMInjection; }

    var selector = "[data-controller=" + controller + "]" +
                   "[data-action=" + action + "]" +
                   ":not([class*=stik-bound])";
    return DOMHandler.querySelectorAll(selector);
  };

  Manager.prototype.$findBehaviorTemplates = function(name, DOMInjection){
    var DOMHandler = document;
    if (DOMInjection) { DOMHandler = DOMInjection; }

    var selector = "[class*=" + name + "]" +
                   ":not([class*=" + name + "-applyed])";
    return DOMHandler.querySelectorAll(selector);
  };

  window.stik.Manager = Manager;
})();
