window.stik.context = function context( spec ){
  spec.template = window.stik.injectable({
    module: spec.template
  });

  spec.load = function load( executionUnit, modules ){
    var dependencies = resolveDependencies(
      executionUnit,
      mergeModules( modules )
    );

    executionUnit.apply( spec, dependencies );
  };

  function resolveDependencies( executionUnit, modules ){
    var injector = window.stik.injector({
      executionUnit: executionUnit,
      modules: modules
    });

    return injector.resolveDependencies();
  }

  function mergeModules( modules ){
    modules.$template = spec.template;

    return modules;
  }

  return spec;
};
