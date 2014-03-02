// ==========================================================================
// Project:   Stik.js - JavaScript Separation Of Concerns
// Copyright: Copyright 2013-2014 Lukas Alexandre
// License:   Licensed under MIT license
//            See https://github.com/stikjs/stik.js/blob/master/LICENSE
// ==========================================================================

// Version: 0.10.0 | From: 03-03-2014

if (window.stik){
  throw "Stik is already loaded. Check your requires ;)";
}

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

  window.stik.injectable = function(spec){
    spec.instantiable = spec.instantiable || false;
    spec.resolvable = spec.resolvable || false;

    function resolve(dependencies){
      if (spec.instantiable === true) {
        return buildModule(
          resolveDependencies(dependencies)
        );
      } else if (spec.resolvable === true) {
        return callWithDependencies(
          {},
          resolveDependencies(dependencies)
        );
      } else {
        return spec.module;
      }
    } spec.resolve = resolve;

    function buildModule(dependencies){
      var newInstance, value;

      TempConstructor.prototype = spec.module.prototype;
      newInstance = new TempConstructor();

      value = callWithDependencies(
        newInstance, dependencies
      );

      return Object(value) === value ? value : newInstance;
    }

    function resolveDependencies(dependencies){
      var injector = window.stik.injector({
        executionUnit: spec.module,
        modules: dependencies
      });

      return injector.resolveDependencies();
    }

    function callWithDependencies(context, dependencies){
      return spec.module.apply(context, dependencies);
    }

    return spec;
  }
}());

window.stik.createController = function(spec){
  if (!spec.name) {
    throw "Controller needs a name";
  }

  spec.$$actions = {};

  function action(actionName, executionUnit){
    var newAction = window.stik.action({
      name: actionName,
      controller: spec.name,
      executionUnit: executionUnit
    });
    spec.$$actions[actionName] = newAction;
    return newAction;
  } spec.action = action;

  function bind(modules){
    var act,
        boundAny = false;

    for (act in spec.$$actions){
      if (spec.$$actions[act].bind(modules)) {
        boundAny = true;
      }
    }

    return boundAny;
  } spec.bind = bind;

  return spec;
};

window.stik.action = function(spec){
  if (!spec.controller) {
    throw "Action needs an controller name";
  }
  if (!spec.name) {
    throw "Action name can't be empty";
  }
  if (!spec.executionUnit) {
    throw "Action needs an execution unit";
  }

  function bind(modules){
    var templates, i;

    templates = spec.findTemplates();

    i = templates.length;
    while(i--){
      bindWithTemplate(
        templates[i]
      ).context.load(spec.executionUnit, modules);
    }

    return templates.length > 0;
  } spec.bind = bind;

  function $resolveDependencies(modules){
    var injector = window.stik.injector(
      this.$$executionUnit, modules
    );

    return injector.$resolveDependencies();
  } spec.$resolveDependencies = $resolveDependencies;

  function mergeModules(template, modules){
    modules.$context  = this;
    modules.$template = template;

    return modules;
  }

  function findTemplates(DOMInjection){
    var DOMHandler = document;
    if (DOMInjection) { DOMHandler = DOMInjection; }

    var selector = "[data-controller=" + spec.controller + "]" +
                   "[data-action=" + spec.name + "]" +
                   ":not([class*=stik-bound])";
    return DOMHandler.querySelectorAll(selector);
  } spec.findTemplates = findTemplates;

  function bindWithTemplate(template, modules){
    return {
      context: window.stik.context({
        controller: spec.controller,
        action: spec.name,
        template: template
      }),
      executionUnit: spec.executionUnit
    };
  } spec.bindWithTemplate = bindWithTemplate;

  return spec;
};

window.stik.context = function(spec){
  spec.template = window.stik.injectable({
    module: spec.template
  });

  function load(executionUnit, modules){
    var dependencies = resolveDependencies(
      executionUnit,
      mergeModules(modules)
    );

    executionUnit.apply(spec, dependencies);
    markAsBound();
  } spec.load = load;

  function resolveDependencies(executionUnit, modules){
    var injector = window.stik.injector({
      executionUnit: executionUnit,
      modules: modules
    });

    return injector.resolveDependencies();
  }

  function mergeModules(modules){
    modules.$template = spec.template;

    return modules;
  }

  function markAsBound(){
    var template = spec.template.resolve();
    template.className = (template.className + ' stik-bound').trim();
  }

  return spec;
};

window.stik.createBehavior = function(spec){
  if (!spec.name) {
    throw "name is missing";
  }
  if (spec.name.indexOf(" ") !== -1) {
    throw "invalid name. Please use dash(-) instead of spaces";
  }
  if (!spec.executionUnit) {
    throw "executionUnit is missing";
  }

  var behaviorKey = "data-behaviors"

  function bind(modules){
    var templates = spec.findTemplates(),
        i = templates.length;

    while (i--) {
      load(templates[i], modules);
    }

    return templates.length > 0;
  } spec.bind = bind;

  function load(template, modules){
    modules.$template = window.stik.injectable({
      module: template
    });

    var dependencies = resolveDependencies(modules);

    spec.executionUnit.apply({}, dependencies);
    markAsApplyed(template);
  };

  function findTemplates(DOMInjection){
    var DOMHandler = document;
    if (DOMInjection) { DOMHandler = DOMInjection; }

    var selector = "[class*=" + spec.name + "]" +
                   ":not([data-behaviors*=" + spec.name + "])";

    return DOMHandler.querySelectorAll(selector);
  } spec.findTemplates = findTemplates;

  function resolveDependencies(modules){
    var injector = window.stik.injector({
      executionUnit: spec.executionUnit,
      modules: modules
    });

    return injector.resolveDependencies();
  };

  function markAsApplyed(template){
    var behaviors = template.getAttribute(behaviorKey);
    behaviors = ((behaviors || "") + " " + spec.name).trim();

    template.setAttribute(behaviorKey, behaviors);
  };

  return spec;
}

window.stik.createBoundary = function(spec){
  if (spec.as.indexOf(" ") !== -1) {
    throw "Invalid 'as'. Can't have spaces";
  }
  if (!spec.to) {
    throw "Invalid 'to'. Can't be null";
  }

  var obj = {};

  obj.to = window.stik.injectable({
    module: spec.to,
    instantiable: spec.instantiable,
    resolvable: spec.resolvable
  });

  return obj;
};

window.stik.injector = function(spec){
  if (!spec.executionUnit) {
    throw "Injector needs an execution unit to run against";
  }

  function resolveDependencies(){
    var args = extractArguments();

    return grabModules(args);
  } spec.resolveDependencies = resolveDependencies;

  function extractArguments(){
    var argsPattern, funcString, args;

    argsPattern = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;

    funcString = spec.executionUnit.toString();

    args = funcString.match(argsPattern)[1].split(',');

    return trimmedArgs(args);
  }

  function trimmedArgs(args){
    var result = [];
    args.forEach(function(arg){
      result.push(arg.trim());
    });
    return result;
  }

  function grabModules(args){
    var module, dependencies;

    dependencies = [];

    if (args.length === 1 && args[0] === "") { return []; }

    for (var i = 0; i < args.length; i++) {
      if (!(module = spec.modules[args[i]])) {
        throw "Stik could not find this module (" + args[i] + ")";
      }

      dependencies.push(
        module.resolve(spec.modules)
      );
    }

    return dependencies;
  }

  return spec;
};

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
      throw "behavior already exist with the specified name";
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
    var boundary, that;

    that = this;
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
        throw "Invalid 'from'. Needs to be 'controller' or 'behavior'";
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

    result = this.$$controllers[controller].$$actions[action].bindWithTemplate(
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

window.stik.boundary = function(spec){
  return this.$$manager.$addBoundary(spec);
};

(function(){
  var helpers = {},
      modules = {};

  window.stik.helper = function(as, func){
    if (!as) { throw "Stik helper needs a name"; }
    if (!func || typeof func !== "function") {
      throw "Stik helper needs a function";
    }

    modules[as] = window.stik.injectable({
      module: func,
      resolvable: true
    });
    helpers[as] = function(){
      return modules[as].resolve(modules).apply({}, arguments);
    };

    return helpers[as];
  }

  window.stik.boundary({
    as: "$h",
    from: "controller|behavior",
    to: helpers
  });
}());

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

window.stik.viewBag = function($template){
  var obj = {},
      bindingKey = "data-bind";

  if (!$template) {
    throw "Stik viewBag needs to a view to be attached to";
  }

  function $push(dataSet){
    var fields = fieldsToBind(),
        i = fields.length,
        dataToBind;

    while(i--) {
      dataToBind = fields[i].getAttribute(bindingKey);

      if (dataSet[dataToBind] !== undefined) {
        updateElementValue(fields[i], dataSet[dataToBind]);
      }
    }
  } obj.$push = $push;

  function $pull(){
    var fields = fieldsToBind($template),
        dataSet = {},
        i = fields.length,
        key;

    while(i--) {
      key = fields[i].getAttribute(bindingKey);
      dataSet[key] = extractValueOf(fields[i]);
    }

    return dataSet;
  } obj.$pull = $pull;

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

  function fieldsToBind(){
    if ($template.getAttribute(bindingKey)) {
      return [$template];
    }

    return $template.querySelectorAll(
      "[" + bindingKey + "]"
    );
  }

  function isInput(element){
    return element.nodeName.toUpperCase() === "INPUT" || element.nodeName.toUpperCase() === "TEXTAREA";
  }

  return obj;
}

window.stik.boundary({
  as: "$viewBag",
  from: "controller|behavior",
  resolvable: true,
  to: window.stik.viewBag
});

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
    this.$$context.load(this.$$executionUnit, this.$$modules);
  });

  window.stik.labs.Controller = ControllerLab;
})();
