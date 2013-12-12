window.slik || (window.slik = {});

(function(){
  function Manager(){
    this.$$contexts = [];
    this.$$executionUnits = {};
  };

  Manager.prototype.register = function(controller, action, executionUnit){
    if (!executionUnit)
      throw "execution unit is missing";

    this.$storeExecutionUnit(controller, action, executionUnit);
  };

  Manager.prototype.$storeExecutionUnit = function(controller, action, executionUnit){
    this.$$executionUnits[controller] || (this.$$executionUnits[controller] = {});
    this.$$executionUnits[controller][action] = executionUnit;
  };

  Manager.prototype.$storeContext = function(controller, action, template){
    newContext = this.$createContext(controller, action, template)
    this.$$contexts.push(newContext);
    return newContext
  };

  Manager.prototype.$createContext = function(controller, action, template){
    return new slik.Context(controller, action, template);
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

  Manager.prototype.$bindExecutionUnit = function(controller, action){
    var templates = this.$findTemplate(controller, action);

    for (var i = 0; i < templates.length; i++) {
      this.$storeContext(controller, action, templates[i]).$load();
    };
  };

  slik.Manager = Manager;
})();
