// ==========================================================================
// Project:   Stik.js - JavaScript Separation Of Concerns
// Copyright: Copyright 2013-2014 Lukas Alexandre
// License:   Licensed under MIT license
//            See https://github.com/stikjs/stik.js/blob/master/LICENSE
// ==========================================================================

// Version: 0.9.0 | From: 01-03-2014

window.stik = {
  labs: {}
};

(function(){
  Function.prototype.method = function(name, func){
    if (!this.hasOwnProperty(name)) {
      this.prototype[name] = func;
      return this;
    }
  }
})();

(function(){
  function TempConstructor(){}

  function Injectable(module, instantiable, callable){
    this.$$module       = module;
    this.$$instantiable = instantiable || false;
    this.$$callable     = callable || false;
  }

  Injectable.method("$resolve", function(dependencies){
    if (this.$$instantiable === true) {
      return buildModule(
        this.$$module,
        resolveDependencies(this.$$module, dependencies)
      );
    } else if (this.$$callable === true) {
      return callWithDependencies(
        this.$$module,
        {},
        resolveDependencies(this.$$module, dependencies)
      );
    } else {
      return this.$$module;
    }
  });

  function buildModule(module, dependencies){
    var newInstance, value;

    TempConstructor.prototype = module.prototype;
    newInstance = new TempConstructor();

    value = callWithDependencies(
      module, newInstance, dependencies
    );

    return Object(value) === value ? value : newInstance;
  }

  function resolveDependencies(module, dependencies){
    var injector = new window.stik.Injector(module, dependencies);

    return injector.$resolveDependencies();
  }

  function callWithDependencies(module, context, dependencies){
    return module.apply(context, dependencies);
  }

  window.stik.Injectable = Injectable;
})();

(function(){
  function Controller(name){
    if (!name) { throw "Controller name can't be empty"; }

    this.$$name = name;
    this.$$actions = {};
  }

  Controller.method("action", function(actionName, executionUnit){
    var action = new window.stik.Action(
      actionName, this.$$name, executionUnit
    );
    this.$$actions[actionName] = action;
    return action;
  });

  Controller.method("$bind", function(modules){
    var boundAny = false;

    for (var action in this.$$actions){
      if (this.$$actions[action].$bind(modules)) {
        boundAny = true;
      }
    }

    return boundAny;
  });

  window.stik.Controller = Controller;
})();

(function(){
  function Action(name, controller, executionUnit){
    if (!name)          { throw "Action name can't be empty"; }
    if (!executionUnit) { throw "Execution Unit is missing"; }

    this.$$name = name;
    this.$$controller = controller;
    this.$$executionUnit = executionUnit;
  }

  Action.method("$bind", function(modules){
    var templates, i;

    templates = this.$findTemplates();

    i = templates.length;

    while(i--){
      this.$bindWithTemplate(
        templates[i]
      ).context.$load(this.$$executionUnit, modules);
    }

    return templates.length > 0;
  });

  Action.method("$resolveDependencies", function(modules){
    var injector = new window.stik.Injector(
      this.$$executionUnit, modules
    );

    return injector.$resolveDependencies();
  });

  Action.method("$mergeModules", function(template, modules){
    modules.$context  = this;
    modules.$template = template;
    modules.$viewBag  = this.$$viewBag;

    return modules;
  });

  Action.method("$findTemplates", function(controller, DOMInjection){
    var DOMHandler = document;
    if (DOMInjection) { DOMHandler = DOMInjection; }

    var selector = "[data-controller=" + this.$$controller + "]" +
                   "[data-action=" + this.$$name + "]" +
                   ":not([class*=stik-bound])";
    return DOMHandler.querySelectorAll(selector);
  });

  Action.method("$bindWithTemplate", function(template, modules){
    return {
      context: new window.stik.Context(
        this.$$controller,
        this.$$name,
        template
      ),
      executionUnit: this.$$executionUnit
    };
  });

  window.stik.Action = Action;
})();

(function(){
  function Context(controller, action, template){
    this.$$controller    = controller;
    this.$$action        = action;

    this.$$template = new window.stik.Injectable(
      template, false
    );
    this.$$viewBag = new window.stik.Injectable(
      new window.stik.ViewBag(template), false
    );
  }

  Context.method("$load", function(executionUnit, modules){
    var dependencies = this.$resolveDependencies(
      executionUnit,
      this.$mergeModules(modules)
    );

    executionUnit.apply(this, dependencies);
    this.$markAsBound();
  });

  Context.method("$resolveDependencies", function(executionUnit, modules){
    var injector = new window.stik.Injector(
      executionUnit, modules
    );

    return injector.$resolveDependencies();
  });

  Context.method("$mergeModules", function(modules){
    modules.$context  = this;
    modules.$template = this.$$template;
    modules.$viewBag  = this.$$viewBag;

    return modules;
  });

  Context.method("$markAsBound", function(){
    var template = this.$$template.$resolve();
    template.className = (template.className + ' stik-bound').trim();
  });

  window.stik.Context = Context;
})();

(function(){
  var behaviorKey = "data-behaviors", namePrefix = "bh";

  function Behavior(name, executionUnit){
    if (!name)                    { throw "name is missing"; }
    if (name.indexOf(" ") !== -1) { throw "invalid name. Please use dash(-) instead of spaces"; }
    if (!executionUnit)           { throw "executionUnit is missing"; }

    this.$$className     = name;
    this.$$name          = namePrefix + "-" + name;
    this.$$executionUnit = executionUnit;
  }

  Behavior.method("$load", function(template, modules){
    modules.$template = new window.stik.Injectable(template);

    var dependencies = this.$resolveDependencies(modules);

    this.$$executionUnit.apply({}, dependencies);
    this.$markAsApplyed(template);
  });

  Behavior.method("$resolveDependencies", function(modules){
    var injector = new window.stik.Injector(
      this.$$executionUnit, modules
    );

    return injector.$resolveDependencies();
  });

  Behavior.method("$markAsApplyed", function(template){
    var behaviors;

    behaviors = template.getAttribute(behaviorKey);
    behaviors = ((behaviors || "") + " " + this.$$name).trim();

    template.setAttribute(behaviorKey, behaviors);
  });

  window.stik.Behavior = Behavior;
})();

(function(){
  function Boundary(as, to, instantiable, callable){
    if (as.indexOf(" ") !== -1) { throw "Invalid 'as'. Can't have spaces"; }
    if (!to)                    { throw "Invalid 'to'. Can't be null"; }

    this.$$as = as;
    this.$$to = new window.stik.Injectable(
      to, instantiable, callable
    );
  }

  window.stik.Boundary = Boundary;
})();

(function(){
  function Injector(executionUnit, modules){
    this.$$executionUnit = executionUnit;
    this.$$modules       = modules;
  }

  Injector.method("$resolveDependencies", function(){
    var args = this.$extractArguments();

    return this.$grabModules(args);
  });

  Injector.method("$extractArguments", function(){
    var argsPattern, funcString, args;

    argsPattern = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;

    funcString = this.$$executionUnit.toString();

    args = funcString.match(argsPattern)[1].split(',');

    return this.$trimmedArgs(args);
  });

  Injector.method("$trimmedArgs", function(args){
    var result = [];
    args.forEach(function(arg){
      result.push(arg.trim());
    });
    return result;
  });

  Injector.method("$grabModules", function(args){
    var module, dependencies;

    dependencies = [];

    if (args.length === 1 && args[0] === "") { return []; }

    for (var i = 0; i < args.length; i++) {
      if (!(module = this.$$modules[args[i]])) {
        throw "Stik could not find this module (" + args[i] + ")";
      }

      dependencies.push(
        module.$resolve(this.$$modules)
      );
    }

    return dependencies;
  });

  window.stik.Injector = Injector;
})();

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
    action.$bind(
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
    var ctrl = new window.stik.Controller(controllerName);
    this.$$controllers[controllerName] = ctrl;
    return ctrl;
  });

  Manager.method("$addBehavior", function(name, executionUnit){
    var behavior;

    if (this.$isBehaviorRegistered(name)) {
      throw "behavior already exist with the specified name";
    }

    behavior = this.$createBehavior(name, executionUnit);
    this.$$behaviors.push(behavior);
    this.$applyBehavior(behavior);

    return behavior;
  });

  Manager.method("$addBoundary", function(as, from, to, instantiable, callable){
    var boundary, that;

    that = this;
    this.$parseFrom(from, function(parsedFrom){
      boundary = new window.stik.Boundary(as, to, instantiable, callable);
      that.$$boundaries[parsedFrom][as] = boundary;
    });

    return boundary;
  });

  Manager.method("$parseFrom", function(from, forEachFound){
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
  });

  Manager.method("$isBehaviorRegistered", function(name){
    var i = this.$$behaviors.length;

    while (i--) {
      if (this.$$behaviors[i].$$name === name) {
        return true;
      }
    }

    return false;
  });

  Manager.method("$createBehavior", function(name, executionUnit){
    return new window.stik.Behavior(name, executionUnit);
  });

  Manager.method("$applyBehavior", function(behavior){
    var templates, modules, i;

    templates = this.$findBehaviorTemplates(behavior);
    modules   = this.$extractBoundaries(this.$$boundaries.behavior);
    i         = templates.length;

    while (i--) {
      behavior.$load(templates[i], modules);
    }

    return templates.length > 0;
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
      modules[key] = collection[key].$$to;
    }

    return modules;
  });

  Manager.method("$findBehaviorTemplates", function(behavior, DOMInjection){
    var DOMHandler = document;
    if (DOMInjection) { DOMHandler = DOMInjection; }

    var selector = "[class*=" + behavior.$$className + "]" +
                   ":not([data-behaviors*=" + behavior.$$name + "])";

    return DOMHandler.querySelectorAll(selector);
  });

  Manager.method("$bindActionWithTemplate", function(controller, action, template){
    var modules, result;

    modules = this.$extractBoundaries(this.$$boundaries.controller);

    result = this.$$controllers[controller].$$actions[action].$bindWithTemplate(
      template, modules
    );

    result.modules = modules;
    return result;
  });

  Manager.method("$bindActions", function(){
    var modules, boundAny;

    modules = this.$extractBoundaries(this.$$boundaries.controller);

    boundAny = false;

    for (var ctrl in this.$$controllers) {
      if (this.$$controllers[ctrl].$bind(modules)) {
        boundAny = true;
      }
    }

    return boundAny;
  });

  Manager.method("$bindController", function(controller){
    var modules = this.$extractBoundaries(this.$$boundaries.controller);
    controller.$bind(modules);
  });

  window.stik.Manager = Manager;
})();

(function() {
  if (window.stik.$$manager){
    throw "Stik.js is already loaded. Check your requires ;)";
  }

  window.stik.$$manager = new window.stik.Manager();

  window.stik.controller = function(controllerName, action, executionUnit){
    if (typeof action === "string") {
      return window.stik.$$manager.$addControllerWithAction(
        controllerName, action, executionUnit
      );
    } else {
      return window.stik.$$manager.$addController(
        controllerName, action
      );
    }
  };

  window.stik.behavior = function(name, executionUnit){
    return this.$$manager.$addBehavior(name, executionUnit);
  };

  window.stik.bindLazy = function(){
    if (!this.$$manager.$bindActions() & !this.$$manager.$applyBehaviors()) {
      throw "nothing to bind!";
    }
  };

  window.stik.boundary = function(boundary){
    return this.$$manager.$addBoundary(
      boundary.as,
      boundary.from,
      boundary.to,
      boundary.inst,
      boundary.call
    );
  };
})();

(function(){
  var helpers = {},
      modules = {};

  function helper(as, func){
    if (!as) { throw "Stik helper needs a name"; }
    if (!func || typeof func !== "function") {
      throw "Stik helper needs a function";
    }

    modules[as] = new window.stik.Injectable(func, false, true);
    helpers[as] = function(){
      return modules[as].$resolve(modules).apply({}, arguments);
    };
  }

  window.stik.boundary({
    as: "$h",
    from: "controller|behavior",
    to: helpers
  });

  window.stik.helper = helper;
})();

(function(){
  function Courier(){
    this.$$subscriptions = {};
  }

  Courier.method("$receive", function(box, opener){
    var subscription = new Subscription(box, opener);

    this.$$subscriptions[box] = (this.$$subscriptions[box] || []);
    this.$$subscriptions[box].push(subscription);

    return this.$unsubscribe.bind(this, subscription);
  });

  Courier.method("$unsubscribe", function(subscription){
    this.$$subscriptions[subscription.$$box] =
    this.$$subscriptions[subscription.$$box].filter(function(subs){
      return subs.$$id !== subscription.$$id;
    });
  });

  Courier.method("$send", function(box, message){
    var openers, i;

    openers = this.$$subscriptions[box];

    if (!openers || openers.length === 0) {
      throw "no one is waiting for this message";
    }

    i = openers.length;
    while (i--) {
      openers[i].$$opener(message);
    }
  });

  function Subscription(box, opener){
    this.$$id = '#' + Math.floor(
      Math.random()*16777215
    ).toString(16);

    this.$$box    = box;
    this.$$opener = opener;
  }

  window.stik.Courier = Courier;

  window.stik.boundary({
    as: "$courier",
    from: "controller|behavior",
    to: new Courier()
  });
})();

(function(){
  var bindingKey = "data-bind";

  function ViewBag($template){
    this.$$template = $template;
  }

  ViewBag.method("$push", function(dataSet){
    var fields, dataToBind, i;

    fields = fieldsToBind(this.$$template);

    i = fields.length;

    while(i--) {
      dataToBind = fields[i].getAttribute(bindingKey);

      if (dataSet[dataToBind] !== undefined) {
        updateElementValue(fields[i], dataSet[dataToBind]);
      }
    }
  });

  ViewBag.method("$pull", function(){
    var fields, dataSet, key, i;

    dataSet = {};
    fields = fieldsToBind(this.$$template);

    i = fields.length;

    while(i--) {
      key = fields[i].getAttribute(bindingKey);
      dataSet[key] = extractValueOf(fields[i]);
    }

    return dataSet;
  });

  function extractValueOf(element){
    if (isInput(element)) {
      return element.value;
    } else {
      return element.textContent;
    }
  }

  function updateElementValue(element, value){
    if (isInput(element)) {
      element.value = value;
    } else {
      element.textContent = value;
    }
  }

  function fieldsToBind(template){
    if (template.getAttribute(bindingKey)) {
      return [template];
    }

    return template.querySelectorAll(
      "[" + bindingKey + "]"
    );
  }

  function isInput(element){
    return element.nodeName.toUpperCase() === "INPUT" || element.nodeName.toUpperCase() === "TEXTAREA";
  }

  window.stik.ViewBag = ViewBag;

  window.stik.boundary({
    as: "$viewBag",
    from: "controller|behavior",
    inst: true,
    to: ViewBag
  });
})();

(function(){
  function ControllerLab(env){
    validate(env);

    this.$$env      = env;
    this.$$template = parseAsDOM(env.template);
    this.$$context  = undefined;

    var result = window.stik.$$manager.$bindActionWithTemplate(
      this.$$env.name,
      this.$$env.action,
      this.$$template
    );

    this.$$context = result.context;
    this.$$modules = result.modules;
    this.$$executionUnit = result.executionUnit;
  }

  function validate(env){
    if (!env) { throw "Lab needs an environment to run"; }
    if (!env.name) { throw "name can't be empty"; }
    if (!env.action) { throw "action can't be empty"; }
    if (!env.template) { throw "template can't be empty"; }
  }

  function parseAsDOM(template){
    var tmp = document.implementation.createHTMLDocument();
    tmp.body.innerHTML = template;
    return tmp.body.firstChild;
  }

  ControllerLab.method("run", function(){
    this.$$context.$load(this.$$executionUnit, this.$$modules);
  });

  window.stik.labs.Controller = ControllerLab;
})();
