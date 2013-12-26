(function(){
  function Behavior(name, executionUnit){
    if (!name)          { throw "name is missing"; }
    if (!executionUnit) { throw "executionUnit is missing"; }

    this.$$name = name;
    this.$$executionUnit = executionUnit;
  }

  Behavior.prototype.$load = function(template, modules){
    modules.$template = template;

    var dependencies = this.$resolveDependencies(modules);

    this.$$executionUnit.apply({}, dependencies);
    this.$markAsApplyed(template);
  };

  Behavior.prototype.$resolveDependencies = function(modules){
    var injector = new window.stik.Injector(this.$$executionUnit, modules);

    return injector.$resolveDependencies();
  };

  Behavior.prototype.$markAsApplyed = function(template){
    template.className += " " + this.$$name + "-applyed";
  };

  window.stik.Behavior = Behavior;
})();
