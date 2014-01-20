(function(){
  function TempConstructor(){}

  function Injectable(module, instantiable){
    this.$$module       = module;
    this.$$instantiable = instantiable || false;
  }

  Injectable.prototype.$resolve = function(dependencies){
    if (this.$$instantiable) {
      return buildModule(
        this.$$module,
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

    value = module.apply(newInstance, dependencies);

    return Object(value) === value ? value : newInstance;
  };

  function resolveDependencies(module, dependencies){
    var injector = new window.stik.Injector(module, dependencies);

    return injector.$resolveDependencies();
  };

  window.stik.Injectable = Injectable;
})();
