(function(){
  function Action(name, controller, executionUnit){
    if (!name)          { throw "Action name can't be empty"; }
    if (!executionUnit) { throw "Execution Unit is missing"; }

    this.$$name = name;
    this.$$controller = controller;
    this.$$executionUnit = executionUnit;
  }

  Action.prototype.$bind = function(modules){
    var templates, i;

    templates = this.$findTemplates();

    i = templates.length;

    while(i--){
      this.$bindWithTemplate(
        templates[i]
      ).context.$load(this.$$executionUnit, modules);
    }

    return templates.length > 0;
  };

  Action.prototype.$resolveDependencies = function(modules){
    var injector = new window.stik.Injector(
      this.$$executionUnit, modules
    );

    return injector.$resolveDependencies();
  };

  Action.prototype.$mergeModules = function(template, modules){
    modules.$context  = this;
    modules.$template = template;
    modules.$viewBag  = this.$$viewBag;

    return modules;
  };

  Action.prototype.$findTemplates = function(controller, DOMInjection){
    var DOMHandler = document;
    if (DOMInjection) { DOMHandler = DOMInjection; }

    var selector = "[data-controller=" + this.$$controller + "]" +
                   "[data-action=" + this.$$name + "]" +
                   ":not([class*=stik-bound])";
    return DOMHandler.querySelectorAll(selector);
  };

  Action.prototype.$bindWithTemplate = function(template, modules){
    return {
      context: new window.stik.Context(
        this.$$controller,
        this.$$name,
        template
      ),
      executionUnit: this.$$executionUnit
    };
  };

  window.stik.Action = Action;
})();
