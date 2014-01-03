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

  Context.prototype.$wrapTemplate = function(template, selector) {
    return (selector ? selector(template) : template);
  };

  Context.prototype.$mergeModules = function(modules, selector){
    modules.$context  = this;
    modules.$template = this.$wrapTemplate(this.$$template, selector);
    modules.$viewBag  = this.$$viewBag;

    return modules;
  };

  Context.prototype.$resolveDependencies = function(modules){
    var injector = new window.stik.Injector(this.$$executionUnit, modules);

    return injector.$resolveDependencies();
  };

  Context.prototype.$markAsBound = function(){
    this.$$template.className += ' stik-bound';
  };

  window.stik.Context = Context;
})();
