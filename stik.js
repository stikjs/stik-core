// ==========================================================================
// Project:   Stik.js - JavaScript Separation Of Concerns
// Copyright: Copyright 2011-2013 Lukas Alexandre
// License:   Licensed under MIT license
//            See https://github.com/lukelex/stik.js/blob/master/LICENSE
// ==========================================================================

// Version: 0.1.0 | From: 14-12-2013

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

  Context.prototype.$load = function(modules){
    var dependencies = this.$resolveDependencies(
      this.$mergeModules(modules)
    );

    this.$$executionUnit.apply(
      new function(){},
      dependencies
    );
  };

  Context.prototype.$mergeModules = function(modules){
    modules.$context = this;
    modules.$template = this.$$template;

    return modules;
  };

  Context.prototype.$resolveDependencies = function(modules){
    var injector = new stik.Injector(this.$$executionUnit, modules);

    return injector.$resolveDependencies();
  };

  stik.Context = Context;
})();

window.stik || (window.stik = {});

(function(){
  function Injector(executionUnit, modules){
    this.$$executionUnit = executionUnit;
    this.$$modules = modules;
  };

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
    var dependencies = [];

    if (args.length === 1 && args[0] === '')
      return [];

    for (var i = 0; i < args.length; i++) {
      dependencies.push(this.$$modules[args[i]]);
    };

    return dependencies;
  };

  Injector.prototype.$trimmedArgs = function(args){
    var result = [];
    args.forEach(function(arg){
      result.push(arg.trim());
    });
    return result;
  };

  stik.Injector = Injector;
})();

window.stik || (window.stik = {});

(function(){
  function Manager(modules){
    this.$$contexts = [];
    this.$$executionUnits = {};
    this.$$modules = modules;
  };

  Manager.prototype.$register = function(controller, action, executionUnit){
    if (!executionUnit)
      throw "execution unit is missing";

    this.$storeExecutionUnit(controller, action, executionUnit);
  };

  Manager.prototype.$storeExecutionUnit = function(controller, action, executionUnit){
    this.$$executionUnits[controller] || (this.$$executionUnits[controller] = {});
    this.$$executionUnits[controller][action] = executionUnit;
  };

  Manager.prototype.$storeContext = function(controller, action, template, executionUnit){
    newContext = this.$createContext(controller, action, template, executionUnit);
    this.$$contexts.push(newContext);
    return newContext;
  };

  Manager.prototype.$createContext = function(controller, action, template, executionUnit){
    return new stik.Context(controller, action, template, executionUnit);
  };

  Manager.prototype.$findTemplate = function(controller, action, DOMInjection){
    var DOMHandler = document;
    if (DOMInjection)
      DOMHandler = DOMInjection;

    var selector = "[data-controller=" + controller + "][data-action=" + action + "]";
    return DOMHandler.querySelectorAll(selector);
  };

  Manager.prototype.$buildContexts = function(){
    var controller, action, executionUnit;
    var boundAny;

    if (Object.keys(this.$$executionUnits).length === 0)
      throw "no execution units available";

    for (controller in this.$$executionUnits) {
      for (action in this.$$executionUnits[controller]) {
        executionUnit = this.$$executionUnits[controller][action];
        if (this.$bindExecutionUnit(controller, action, executionUnit))
          boundAny = true;
      };
    };

    if (!boundAny)
      throw "no templates were bound";
  };

  Manager.prototype.$bindExecutionUnit = function(controller, action, executionUnit){
    var context, templates;

    templates = this.$findTemplate(controller, action);

    for (var i = 0; i < templates.length; i++) {
      this.$markAsBound(templates[i]);
      context = this.$storeContext(controller, action, templates[i], executionUnit);
      context.$load(this.$$modules);
    };

    return templates.length > 0;
  };

  Manager.prototype.$markAsBound = function(template){
    template.className += ' stik-bound';
  };

  stik.Manager = Manager;
})();

window.stik || (window.stik = {});

(function() {
  stik.$$manager = new stik.Manager({});

  stik.register = function(controller, action, executionUnit){
    stik.$$manager.$register(controller, action, executionUnit);
  };

  stik.init = function(){
    this.$$manager.$buildContexts();
  };
})();
