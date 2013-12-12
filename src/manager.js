window.slik || (window.slik = {});

(function(){
  function Manager(){
    this.contexts = [];
  };

  Manager.prototype.register = function(controller, action, execution){
    if (!execution)
      throw "execution unit is missing";

    var templates = this.$findTemplate(controller, action);

    for (var i = 0; i < templates.length; i++) {
      this.$storeContext(controller, action, templates[i]);
    };
  };

  Manager.prototype.$storeContext = function(controller, action, template){
    this.contexts.push(
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
