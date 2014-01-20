(function(){
  function TempConstructor(){}

  function Injectable(module, instantiable, callable){
    this.$$module       = module;
    this.$$instantiable = instantiable || false;
    this.$$callable     = callable || false;
  }

  Injectable.prototype.$resolve = function(dependencies){
    if (this.$$instantiable) {
      return buildModule(
        this.$$module,
        resolveDependencies(this.$$module, dependencies)
      );
    } else if (this.$$callable) {
      return callWithDependencies(
        this.$$module,
        {},
        resolveDependencies(this.$$module, dependencies)
      );
    } else {
      return this.$$module;
    }
  };

  function buildModule(module, dependencies){
    var newInstance, value;

    TempConstructor.prototype = module.prototype;
    newInstance = new TempConstructor;

    value = callWithDependencies(
      module, newInstance, dependencies
    );

    return Object(value) === value ? value : newInstance;
  }

  function resolveDependencies(module, dependencies){
    var injector = new window.stik.Injector(module, dependencies);

    return injector.$resolveDependencies();
  }

  function callWithDependencies(module, context, dependencies){
    return module.apply(
      context, dependencies
    );
  }

  window.stik.Injectable = Injectable;
})();
