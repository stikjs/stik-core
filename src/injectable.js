(function( stik ){
  stik.injectable = function injectable( spec ){
    spec.instantiable = spec.instantiable || false;
    spec.resolvable = spec.resolvable || false;
    spec.cache = spec.cache || false;

    spec.resolve = function resolve( dependencies ){
      if ( !!spec.cachedValue ) { return spec.cachedValue; }

      if ( spec.instantiable === true ) {
        return buildModule(
          resolveDependencies( dependencies )
        );
      } else if ( spec.resolvable === true ) {
        return callWithDependencies(
          {},
          resolveDependencies( dependencies )
        );
      } else {
        return spec.module;
      }
    };

    function buildModule( dependencies ){
      var newInstance, value;

      function TempConstructor(){}
      TempConstructor.prototype = spec.module.prototype;
      newInstance = new TempConstructor();

      value = callWithDependencies(
        newInstance, dependencies
      );

      return Object( value ) === value ? value : newInstance;
    }

    function resolveDependencies( dependencies ){
      var injector = stik.injector({
        executionUnit: spec.module,
        modules: dependencies
      });

      return injector.resolveDependencies();
    }

    function callWithDependencies( context, dependencies ){
      var result = spec.module.apply( context, dependencies );

      cacheValue(result);

      return result;
    }

    function cacheValue( value ){
      if ( spec.cache === true ){
        spec.cachedValue = value;
      }
    }

    return spec;
  };
})( window.stik );
