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
