// ==========================================================================
// Project:   Stik.js - JavaScript Separation Of Concerns
// Copyright: Copyright 2011-2013 Lukas Alexandre
// License:   Licensed under MIT license
//            See https://github.com/lukelex/stik.js/blob/master/LICENSE
// ==========================================================================

// Version: 0.4.2 | From: 16-12-2013

window.stik || (window.stik = {});

(function(){
  function Context(controller, action, template, executionUnit){
    if (!controller)    { throw "controller is missing"; }
    if (!action)        { throw "action is missing"; }
    if (!template)      { throw "template is missing"; }
    if (!executionUnit) { throw "execution unit is missing"; }

    this.$$controller = controller;
    this.$$action = action;
    this.$$template = template;
    this.$$executionUnit = executionUnit;
    this.$$disposable = false;
    this.$$viewBag = new stik.ViewBag(template);
  }

  Context.prototype.$load = function(modules){
    var dependencies = this.$resolveDependencies(
      this.$mergeModules(modules)
    );

    this.$$executionUnit.apply({}, dependencies);
  };

  Context.prototype.$mergeModules = function(modules){
    modules.$context = this;
    modules.$template = this.$$template;
    modules.$viewBag = this.$$viewBag;

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
  function Courier(){
    this.$$subscriptions = {};
  }

  Courier.prototype.$receive = function(box, opener){
    var subscription = new Subscription(box, opener)

    this.$$subscriptions[box] || (this.$$subscriptions[box] = []);
    this.$$subscriptions[box].push(subscription);

    var self = this;
    return function(){
      self.$unsubscribe(subscription);
    };
  };

  Courier.prototype.$unsubscribe = function(subscription){
    this.$$subscriptions[subscription.$$box] =
    this.$$subscriptions[subscription.$$box].filter(function(subs){
      return subs.$$id !== subscription.$$id;
    });
  };

  Courier.prototype.$send = function(box, message){
    var openers = this.$$subscriptions[box];

    if (!openers || openers.length === 0) {
      throw "no one is waiting for this message"
    }

    for (var i = 0; i < openers.length; i++) {
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

  stik.Courier = Courier;
})();

window.stik || (window.stik = {});

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
    var dependencies = [];

    if (args.length === 1 && args[0] === '') { return []; }

    for (var i = 0; i < args.length; i++) {
      dependencies.push(this.$$modules[args[i]]);
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

  stik.Injector = Injector;
})();

window.stik || (window.stik = {});

(function(){
  function Manager(modules){
    this.$$contexts = [];
    this.$$executionUnits = {};
    this.$$modules = modules;
  }

  Manager.prototype.$register = function(controller, action, executionUnit){
    if (!controller)    { throw "controller can't be empty"; }
    if (!action)        { throw "action can't be empty"; }
    if (!executionUnit) { throw "execution unit is missing"; }

    this.$storeExecutionUnit(controller, action, executionUnit);
    this.$bindExecutionUnit(controller, action, executionUnit);
  };

  Manager.prototype.$storeExecutionUnit = function(controller, action, executionUnit){
    this.$$executionUnits[controller] || (this.$$executionUnits[controller] = {});

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
    return new stik.Context(controller, action, template, executionUnit);
  };

  Manager.prototype.$findTemplate = function(controller, action, DOMInjection){
    var DOMHandler = document;
    if (DOMInjection) { DOMHandler = DOMInjection; }

    var selector = "[data-controller=" + controller + "]" +
                   "[data-action=" + action + "]" +
                   ":not([class*=stik-bound])"
    return DOMHandler.querySelectorAll(selector);
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

    templates = this.$findTemplate(controller, action);

    for (var i = 0; i < templates.length; i++) {
      this.$markAsBound(templates[i]);
      context = this.$storeContext(controller, action, templates[i], executionUnit);
      context.$load(this.$$modules);
    }

    return templates.length > 0;
  };

  Manager.prototype.$markAsBound = function(template){
    template.className += ' stik-bound';
  };

  stik.Manager = Manager;
})();

window.stik || (window.stik = {});

(function() {
  if (stik.$$manager)
    throw "Stik.js is already loaded. Check your requires ;)";

  stik.$$manager = new stik.Manager({$courier: new stik.Courier});

  stik.register = function(controller, action, executionUnit){
    stik.$$manager.$register(controller, action, executionUnit);
  };

  stik.bindLazy = function(){
    this.$$manager.$buildContexts();
  };
})();

window.stik || (window.stik = {});

(function(){
  var bindingKey = "data-bind";

  function ViewBag(template){
    this.$$template = template;
  }

  ViewBag.prototype.$render = function(dataSet){
    var fields, dataToBind;

    fields = this.$fieldsToBind();

    for (var i = 0; i < fields.length; i++) {
      dataToBind = fields[i].getAttribute(bindingKey);

      if (dataSet[dataToBind]) {
        fields[i].textContent = dataSet[dataToBind];
      }
    }
  };

  ViewBag.prototype.$fieldsToBind = function(){
    if (this.$$template.getAttribute(bindingKey)) {
      return [this.$$template];
    }

    return this.$$template.querySelectorAll(
      "[" + bindingKey + "]"
    );
  }

  stik.ViewBag = ViewBag;
})();
