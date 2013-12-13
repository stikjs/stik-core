// ==========================================================================
// Project:   Stik.js - JavaScript Separation Of Concerns
// Copyright: Copyright 2011-2013 Lukas Alexandre
// License:   Licensed under MIT license
//            See https://github.com/lukelex/stik.js/blob/master/LICENSE
// ==========================================================================

// Version: 0.1.0 | From: 13-12-2013

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

window.stik || (window.stik = {});

(function(){
  function Manager(){
    this.$$contexts = [];
    this.$$executionUnits = {};
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

    if (Object.keys(this.$$executionUnits).length === 0)
      throw "no execution units available";

    for (controller in this.$$executionUnits) {
      for (action in this.$$executionUnits[controller]) {
        executionUnit = this.$$executionUnits[controller][action];
        this.$bindExecutionUnit(controller, action, executionUnit);
      };
    };
  };

  Manager.prototype.$bindExecutionUnit = function(controller, action, executionUnit){
    var templates = this.$findTemplate(controller, action);

    for (var i = 0; i < templates.length; i++) {
      this.$markAsBound(templates[i]);
      this.$storeContext(controller, action, templates[i], executionUnit).$load();
    };
  };

  Manager.prototype.$markAsBound = function(template){
    template.className += ' stik-bound';
  };

  stik.Manager = Manager;
})();

window.stik || (window.stik = {});

(function() {
  stik.$$manager = new stik.Manager();

  stik.register = function(controller, action, executionUnit){
    stik.$$manager.$register(controller, action, executionUnit);
  };

  stik.init = function(){
    this.$$manager.$buildContexts();
  };
})();
