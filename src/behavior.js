(function(){
  var behaviorKey = "data-behaviors";

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
    behaviors = template.getAttribute(behaviorKey);
    behaviors = ((behaviors || "") + " " + this.$$name).trim();

    template.setAttribute(behaviorKey, behaviors);
  };

  window.stik.Behavior = Behavior;
})();
