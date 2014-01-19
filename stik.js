// ==========================================================================
// Project:   Stik.js - JavaScript Separation Of Concerns
// Copyright: Copyright 2011-2013 Lukas Alexandre
// License:   Licensed under MIT license
//            See https://github.com/stikjs/stik.js/blob/master/LICENSE
// ==========================================================================

// Version: 0.7.0 | From: 19-01-2014

window.stik = {};

(function(){
  function Context(controller, action, template, executionUnit){
    if (!controller)    { throw "controller is missing"; }
    if (!action)        { throw "action is missing"; }
    if (!template)      { throw "template is missing"; }
    if (!executionUnit) { throw "execution unit is missing"; }

    this.$$controller    = controller;
    this.$$action        = action;
    this.$$template      = template;
    this.$$executionUnit = executionUnit;
    this.$$viewBag       = new window.stik.ViewBag(template);
  }

  Context.prototype.$load = function(modules, selector){
    var dependencies = this.$resolveDependencies(
      this.$mergeModules(modules, selector)
    );

    this.$$executionUnit.apply({}, dependencies);
    this.$markAsBound();
  };

  Context.prototype.$resolveDependencies = function(modules){
    var injector = new window.stik.Injector(this.$$executionUnit, modules);

    return injector.$resolveDependencies();
  };

  Context.prototype.$mergeModules = function(modules, selector){
    modules.$context  = this;
    modules.$template = this.$wrapTemplate(this.$$template, selector);
    modules.$viewBag  = this.$$viewBag;

    return modules;
  };

  Context.prototype.$wrapTemplate = function(template, selector) {
    return (selector ? selector(template) : template);
  };

  Context.prototype.$markAsBound = function(){
    this.$$template.className = (this.$$template.className + ' stik-bound').trim();
  };

  window.stik.Context = Context;
})();

(function(){
  var behaviorKey = "data-behaviors", namePrefix = "bh";

  function Behavior(name, executionUnit){
    if (!name)                   { throw "name is missing"; }
    if (name.indexOf(" ") !== -1) { throw "invalid name. Please use dash(-) instead of spaces"; }
    if (!executionUnit)          { throw "executionUnit is missing"; }

    this.$$className     = name;
    this.$$name          = namePrefix + "-" + name;
    this.$$executionUnit = executionUnit;
  }

  Behavior.prototype.$load = function(template, modules, selector){
    modules.$template = this.$wrapTemplate(template, selector);

    var dependencies = this.$resolveDependencies(modules);

    this.$$executionUnit.apply({}, dependencies);
    this.$markAsApplyed(template);
  };

  Behavior.prototype.$wrapTemplate = function(template, selector) {
    return (selector ? selector(template) : template);
  };

  Behavior.prototype.$resolveDependencies = function(modules){
    var injector = new window.stik.Injector(this.$$executionUnit, modules);

    return injector.$resolveDependencies();
  };

  Behavior.prototype.$markAsApplyed = function(template){
    var behaviors;

    behaviors = template.getAttribute(behaviorKey);
    behaviors = ((behaviors || "") + " " + this.$$name).trim();

    template.setAttribute(behaviorKey, behaviors);
  };

  window.stik.Behavior = Behavior;
})();

(function(){
  function Boundary(as, to){
    if (as.indexOf(" ") !== -1) { throw "Invalid 'as'. Can't have spaces"; }
    if (!to)                    { throw "Invalid 'to'. Can't be null"; }

    this.$$as = as;
    this.$$to = to;
  }

  window.stik.Boundary = Boundary;
})();

(function(){
  function Courier(){
    this.$$subscriptions = {};
  }

  Courier.prototype.$receive = function(box, opener){
    var subscription = new Subscription(box, opener);

    this.$$subscriptions[box] = (this.$$subscriptions[box] || []);
    this.$$subscriptions[box].push(subscription);

    return this.$unsubscribe.bind(this, subscription);
  };

  Courier.prototype.$unsubscribe = function(subscription){
    this.$$subscriptions[subscription.$$box] =
    this.$$subscriptions[subscription.$$box].filter(function(subs){
      return subs.$$id !== subscription.$$id;
    });
  };

  Courier.prototype.$send = function(box, message){
    var openers, i;

    openers = this.$$subscriptions[box];

    if (!openers || openers.length === 0) {
      throw "no one is waiting for this message";
    }

    i = openers.length;
    while (i--) {
      openers[i].$$opener(message);
    }
  };

  function Subscription(box, opener){
    this.$$id = '#' + Math.floor(
      Math.random()*16777215
    ).toString(16);

    this.$$box    = box;
    this.$$opener = opener;
  }

  window.stik.Courier = Courier;
})();

(function(){
  function Injector(executionUnit, modules){
    this.$$executionUnit = executionUnit;
    this.$$modules = modules;
  }

  Injector.prototype.$resolveDependencies = function(){
    var args = this.$extractArguments();

    return this.$grabModules(args);
  };

  Injector.prototype.$extractArguments = function(){
    var argsPattern, funcString, args;

    argsPattern = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;

    funcString = this.$$executionUnit.toString();

    args = funcString.match(argsPattern)[1].split(',');

    return this.$trimmedArgs(args);
  };

  Injector.prototype.$grabModules = function(args){
    var module,
        dependencies = [];

    if (args.length === 1 && args[0] === '') { return []; }

    for (var i = 0; i < args.length; i++) {
      if (!(module = this.$$modules[args[i]])) {
        throw "¿" + args[i] + "? These are not the droids you are looking for! (e.g. this module does not exists)";
      }
      dependencies.push(module);
    }

    return dependencies;
  };

  Injector.prototype.$trimmedArgs = function(args){
    var result = [];
    args.forEach(function(arg){
      result.push(arg.trim());
    });
    return result;
  };

  window.stik.Injector = Injector;
})();

(function(){
  var bindingKey = "data-bind";

  function ViewBag(template){
    this.$$template = template;
  }

  ViewBag.prototype.$push = function(dataSet){
    var fields, dataToBind;

    fields = this.$fieldsToBind();

    for (var i = 0; i < fields.length; i++) {
      dataToBind = fields[i].getAttribute(bindingKey);

      if (dataSet[dataToBind]) {
        this.$updateElementValue(fields[i], dataSet[dataToBind]);
      }
    }
  };

  ViewBag.prototype.$render = ViewBag.prototype.$push;

  ViewBag.prototype.$pull = function(){
    var fields, dataSet, key;

    dataSet = {};
    fields = this.$fieldsToBind();

    for (var i = 0; i < fields.length; i++) {
      key = fields[i].getAttribute(bindingKey);
      dataSet[key] = this.$extractValueOf(fields[i]);
    }

    return dataSet;
  };

  ViewBag.prototype.$extractValueOf = function(element){
    if(element.nodeName.toUpperCase() === "INPUT" || element.nodeName.toUpperCase() === "TEXTAREA") {
      return element.value;
    } else {
      return element.textContent;
    }
  };

  ViewBag.prototype.$updateElementValue = function(element, value){
    if(element.nodeName.toUpperCase() === "INPUT" || element.nodeName.toUpperCase() === "TEXTAREA") {
      element.value = value;
    } else {
      element.textContent = value;
    }
  };

  ViewBag.prototype.$fieldsToBind = function(){
    if (this.$$template.getAttribute(bindingKey)) {
      return [this.$$template];
    }

    return this.$$template.querySelectorAll(
      "[" + bindingKey + "]"
    );
  };

  window.stik.ViewBag = ViewBag;
})();

(function(){
  function Manager(selector){
    this.$$contexts       = [];
    this.$$behaviors      = [];
    this.$$executionUnits = {};
    this.$$selector       = selector;
    this.$$boundaries     = {controller:{}, behavior:{}};
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

    behavior = this.$createBehavior(name, executionUnit);
    this.$$behaviors.push(behavior);
    this.$applyBehavior(behavior);

    return behavior;
  };

  Manager.prototype.$addBoundary = function(as, from, to){
    var boundary, that;

    that = this;
    this.$parseFrom(from, function(parsedFrom){
      boundary = new window.stik.Boundary(as, to);
      that.$$boundaries[parsedFrom][as] = boundary
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
    var controller,
        action,
        executionUnit,
        boundAny = false;

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

    return boundAny;
  };

  Manager.prototype.$bindExecutionUnit = function(controller, action, executionUnit){
    var templates, modules, i, context;

    templates = this.$findControllerTemplates(controller, action);
    modules   = this.$extractBoundaries(this.$$boundaries.controller);
    i         = templates.length;

    while (i--) {
      context = this.$storeContext(
        controller, action, templates[i], executionUnit
      );
      context.$load(modules, this.$$selector);
    }

    return templates.length > 0;
  };

  Manager.prototype.$applyBehavior = function(behavior){
    var templates, modules, i;

    templates = this.$findBehaviorTemplates(behavior);
    modules   = this.$extractBoundaries(this.$$boundaries.behavior);
    i         = templates.length;

    while (i--) {
      behavior.$load(
        templates[i], modules, this.$$selector
      );
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
    var modules, i, key, rp;

    modules = {};

    for (key in collection) {
      modules[key] = collection[key].$$to;
    }

    return modules;
  };

  Manager.prototype.$findControllerTemplates = function(controller, action, DOMInjection){
    var DOMHandler = document;
    if (DOMInjection) { DOMHandler = DOMInjection; }

    var selector = "[data-controller=" + controller + "]" +
                   "[data-action=" + action + "]" +
                   ":not([class*=stik-bound])";
    return DOMHandler.querySelectorAll(selector);
  };

  Manager.prototype.$findBehaviorTemplates = function(behavior, DOMInjection){
    var DOMHandler = document;
    if (DOMInjection) { DOMHandler = DOMInjection; }

    var selector = "[class*=" + behavior.$$className + "]" +
                   ":not([data-behaviors*=" + behavior.$$name + "])";

    return DOMHandler.querySelectorAll(selector);
  };

  window.stik.Manager = Manager;
})();

(function () {
  var DOMLibLoader = {
    $currentDOMSelector: function() {
      if (window.hasOwnProperty("MooTools")) {
        return window.document.id;
      }
      else if(window.hasOwnProperty("Zepto")) {
        return window.Zepto;
      }
      else if (window.hasOwnProperty("jQuery")) {
        return window.jQuery;
      }
    }
  };

  window.stik.DOMLibLoader = DOMLibLoader;
})();

(function() {
  if (window.stik.$$manager){
    throw "Stik.js is already loaded. Check your requires ;)";
  }

  window.stik.$$manager = new window.stik.Manager(
    window.stik.DOMLibLoader.$currentDOMSelector()
  );

  window.stik.controller = function(controller, action, executionUnit){
    window.stik.$$manager.$addController(controller, action, executionUnit);
  };

  window.stik.behavior = function(name, executionUnit){
    return this.$$manager.$addBehavior(name, executionUnit);
  };

  window.stik.bindLazy = function(){
    if (!this.$$manager.$buildContexts() & !this.$$manager.$applyBehaviors()) {
      throw "nothing to bind!";
    }
  };

  window.stik.boundary = function(boundary){
    this.$$manager.$addBoundary(
      boundary.as,
      boundary.from,
      boundary.to
    );
  };

  window.stik.boundary({
    as: "$courier",
    from: "controller|behavior",
    to: new window.stik.Courier()
  });
})();
