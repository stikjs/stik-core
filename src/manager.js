window.slik || (window.slik = {});

(function(){
  function Manager(){
    this.$contexts = [];
    this.$executionUnits = {};
  };

  Manager.prototype.register = function(controller, action, executionUnit){
    if (!executionUnit)
      throw "execution unit is missing";

    this.$storeExecutionUnit(controller, action, executionUnit);

    var templates = this.$findTemplate(controller, action);

    for (var i = 0; i < templates.length; i++) {
      this.$storeContext(controller, action, templates[i]);
    };
  };

  Manager.prototype.$storeExecutionUnit = function(controller, action, executionUnit){
    this.$executionUnits[controller] || (this.$executionUnits[controller] = {});
    this.$executionUnits[controller][action] = executionUnit;
  };

  Manager.prototype.$storeContext = function(controller, action, template){
    this.$contexts.push(
      this.$createContext(controller, action, template)
    );
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

  slik.Manager = Manager;
})();
