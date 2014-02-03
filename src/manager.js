(function(){
  function Manager(){
    this.$$behaviors      = [];
    this.$$controllers    = {};
    this.$$boundaries     = {controller:{}, behavior:{}};
  }

  Manager.prototype.$addControllerWithAction = function(controllerName, actionName, executionUnit){
    var ctrl, action;
    ctrl = this.$storeController(controllerName);
    action = ctrl.action(actionName, executionUnit);
    action.$bind(
      this.$extractBoundaries(this.$$boundaries.controller)
    );
    return ctrl;
  };

  Manager.prototype.$addController = function(controllerName, executionUnit){
    var ctrl = this.$storeController(controllerName);
    executionUnit.apply({}, [ctrl]);
    this.$bindController(ctrl);
    return ctrl;
  };

  Manager.prototype.$storeController = function(controllerName){
    var ctrl = new window.stik.Controller(controllerName);
    this.$$controllers[controllerName] = ctrl;
    return ctrl;
  };

  Manager.prototype.$addBehavior = function(name, executionUnit){
    var behavior;

    if (this.$isBehaviorRegistered(name)) {
      throw "behavior already exist with the specified name";
    }

    behavior = this.$createBehavior(name, executionUnit);
    this.$$behaviors.push(behavior);
    this.$applyBehavior(behavior);

    return behavior;
  };

  Manager.prototype.$addBoundary = function(as, from, to, instantiable, callable){
    var boundary, that;

    that = this;
    this.$parseFrom(from, function(parsedFrom){
      boundary = new window.stik.Boundary(as, to, instantiable, callable);
      that.$$boundaries[parsedFrom][as] = boundary;
    });

    return boundary;
  };

  Manager.prototype.$parseFrom = function(from, forEachFound){
    var targets, i;

    targets = from.toLowerCase().split("|");

    i = targets.length;
    while (i--) {
      if (targets[i] !== "controller" && targets[i] !== "behavior") {
        throw "Invalid 'from'. Needs to be 'controller' or 'behavior'";
      } else {
        forEachFound(targets[i]);
      }
    }
  };

  Manager.prototype.$isBehaviorRegistered = function(name){
    var i = this.$$behaviors.length;

    while (i--) {
      if (this.$$behaviors[i].$$name === name) {
        return true;
      }
    }

    return false;
  };

  Manager.prototype.$createBehavior = function(name, executionUnit){
    return new window.stik.Behavior(name, executionUnit);
  };

  Manager.prototype.$applyBehavior = function(behavior){
    var templates, modules, i;

    templates = this.$findBehaviorTemplates(behavior);
    modules   = this.$extractBoundaries(this.$$boundaries.behavior);
    i         = templates.length;

    while (i--) {
      behavior.$load(templates[i], modules);
    }

    return templates.length > 0;
  };

  Manager.prototype.$applyBehaviors = function(){
    var boundAny, i;

    boundAny = false;
    i        = this.$$behaviors.length;

    while (i--) {
      if (this.$applyBehavior(this.$$behaviors[i])) {
        boundAny = true;
      }
    }

    return boundAny;
  };

  Manager.prototype.$extractBoundaries = function(collection){
    var modules, key;

    modules = {};

    for (key in collection) {
      modules[key] = collection[key].$$to;
    }

    return modules;
  };

  Manager.prototype.$findBehaviorTemplates = function(behavior, DOMInjection){
    var DOMHandler = document;
    if (DOMInjection) { DOMHandler = DOMInjection; }

    var selector = "[class*=" + behavior.$$className + "]" +
                   ":not([data-behaviors*=" + behavior.$$name + "])";

    return DOMHandler.querySelectorAll(selector);
  };

  Manager.prototype.$bindActionWithTemplate = function(controller, action, template){
    var modules, context;

    modules = this.$extractBoundaries(this.$$boundaries.controller);

    result = this.$$controllers[controller].$$actions[action].$bindWithTemplate(
      template, modules
    );

    result.modules = modules;
    return result;
  };

  Manager.prototype.$bindActions = function(){
    var modules = this.$extractBoundaries(this.$$boundaries.controller);

    for (ctrl in this.$$controllers) {
      this.$$controllers[ctrl].$bind(modules);
    }
  };

  Manager.prototype.$bindController = function(controller){
    var modules = this.$extractBoundaries(this.$$boundaries.controller);
    controller.$bind(modules);
  };

  window.stik.Manager = Manager;
})();
