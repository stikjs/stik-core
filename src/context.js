(function(){
  function Context(controller, action, template){
    this.$$controller    = controller;
    this.$$action        = action;

    this.$$template = new window.stik.Injectable(
      template, false
    );
    this.$$viewBag = new window.stik.Injectable(
      new window.stik.ViewBag(template), false
    );
  }

  Context.prototype.$load = function(executionUnit, modules){
    var dependencies = this.$resolveDependencies(
      executionUnit,
      this.$mergeModules(modules)
    );

    executionUnit.apply(this, dependencies);
    this.$markAsBound();
  };

  Context.prototype.$resolveDependencies = function(executionUnit, modules){
    var injector = new window.stik.Injector(
      executionUnit, modules
    );

    return injector.$resolveDependencies();
  };

  Context.prototype.$mergeModules = function(modules){
    modules.$context  = this;
    modules.$template = this.$$template;
    modules.$viewBag  = this.$$viewBag;

    return modules;
  };

  Context.prototype.$markAsBound = function(){
    var template = this.$$template.$resolve();
    template.className = (template.className + ' stik-bound').trim();
  };

  window.stik.Context = Context;
})();
