(function(){
  function Manager(){
    this.$$behaviors   = [];
    this.$$controllers = {};
    this.$$boundaries  = {controller:{}, behavior:{}};
  }

  Manager.method("$addControllerWithAction", function(controllerName, actionName, executionUnit){
    var ctrl, action;
    ctrl = this.$storeController(controllerName);
    action = ctrl.action(actionName, executionUnit);
    action.bind(
      this.$extractBoundaries(this.$$boundaries.controller)
    );
    return ctrl;
  });

  Manager.method("$addController", function(controllerName, executionUnit){
    var ctrl = this.$storeController(controllerName);
    executionUnit.call({}, ctrl);
    this.$bindController(ctrl);
    return ctrl;
  });

  Manager.method("$storeController", function(controllerName){
    var ctrl = window.stik.createController({
      name: controllerName
    });
    this.$$controllers[controllerName] = ctrl;
    return ctrl;
  });

  Manager.method("$addBehavior", function(name, executionUnit){
    var behavior;

    if (this.$isBehaviorRegistered(name)) {
      throw "Stik: Another behavior already exist with name '" + name + "'";
    }

    behavior = this.$createBehavior({
      name: name,
      executionUnit: executionUnit
    });
    this.$$behaviors.push(behavior);
    this.$applyBehavior(behavior);

    return behavior;
  });

  Manager.method("$addBoundary", function(spec){
    var boundary,
        that = this;

    spec.from = spec.from || 'controller|behavior';

    this.$parseFrom(spec.from, function(parsedFrom){
      boundary = window.stik.createBoundary(spec);
      that.$$boundaries[parsedFrom][spec.as] = boundary;
    });

    return boundary;
  });

  Manager.method("$parseFrom", function(from, forEachFound){
    var targets, i;

    targets = from.toLowerCase().split("|");

    i = targets.length;
    while (i--) {
      if (targets[i] !== "controller" && targets[i] !== "behavior") {
        throw "Stik: Invalid boundary 'from' specified. Please use 'controller' or 'behavior' or leave it blank to default to both";
      } else {
        forEachFound(targets[i]);
      }
    }
  });

  Manager.method("$isBehaviorRegistered", function(name){
    var i = this.$$behaviors.length;

    while (i--) {
      if (this.$$behaviors[i].name === name) {
        return true;
      }
    }

    return false;
  });

  Manager.method("$createBehavior", function(name, executionUnit){
    return window.stik.createBehavior(name, executionUnit);
  });

  Manager.method("$applyBehavior", function(behavior){
    var modules = this.$extractBoundaries(
      this.$$boundaries.behavior
    );
    return behavior.bind(modules);
  });

  Manager.method("$applyBehaviors", function(){
    var boundAny, i;

    boundAny = false;
    i        = this.$$behaviors.length;

    while (i--) {
      if (this.$applyBehavior(this.$$behaviors[i])) {
        boundAny = true;
      }
    }

    return boundAny;
  });

  Manager.method("$extractBoundaries", function(collection){
    var modules, key;

    modules = {};

    for (key in collection) {
      modules[key] = collection[key].to;
    }

    return modules;
  });

  Manager.method("$bindActionWithTemplate", function(controller, action, template){
    var modules, result;

    modules = this.$extractBoundaries(this.$$boundaries.controller);

    result = this.$$controllers[controller].actions[action].bindWithTemplate(
      template, modules
    );

    result.modules = modules;
    return result;
  });

  Manager.method("$bindActions", function(){
    var modules, boundAny, ctrl;

    modules = this.$extractBoundaries(this.$$boundaries.controller);

    boundAny = false;

    for (ctrl in this.$$controllers) {
      if (this.$$controllers[ctrl].bind(modules)) {
        boundAny = true;
      }
    }

    return boundAny;
  });

  Manager.method("$bindController", function(controller){
    var modules = this.$extractBoundaries(this.$$boundaries.controller);
    controller.bind(modules);
  });

  window.stik.Manager = Manager;
})();
