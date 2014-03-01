(function(){
  function TempConstructor(){}

  window.stik.injectable = function(spec){
    spec.instantiable = spec.instantiable || false;
    spec.callable     = spec.callable || false;

    function resolve(dependencies){
      if (spec.instantiable === true) {
        return buildModule(
          resolveDependencies(dependencies)
        );
      } else if (spec.callable === true) {
        return callWithDependencies(
          {},
          resolveDependencies(dependencies)
        );
      } else {
        return spec.module;
      }
    } spec.resolve = resolve;

    function buildModule(dependencies){
      var newInstance, value;

      TempConstructor.prototype = spec.module.prototype;
      newInstance = new TempConstructor();

      value = callWithDependencies(
        newInstance, dependencies
      );

      return Object(value) === value ? value : newInstance;
    }

    function resolveDependencies(dependencies){
      var injector = window.stik.injector({
        executionUnit: spec.module,
        modules: dependencies
      });

      return injector.resolveDependencies();
    }

    function callWithDependencies(context, dependencies){
      return spec.module.apply(context, dependencies);
    }

    return spec;
  }
})();
