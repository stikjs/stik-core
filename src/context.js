window.stik.context = function context(spec){
  spec.template = window.stik.injectable({
    module: spec.template
  });

  function load(executionUnit, modules){
    var dependencies = resolveDependencies(
      executionUnit,
      mergeModules(modules)
    );

    executionUnit.apply(spec, dependencies);
    markAsBound();
  } spec.load = load;

  function resolveDependencies(executionUnit, modules){
    var injector = window.stik.injector({
      executionUnit: executionUnit,
      modules: modules
    });

    return injector.resolveDependencies();
  }

  function mergeModules(modules){
    modules.$template = spec.template;

    return modules;
  }

  function markAsBound(){
    var template = spec.template.resolve();
    template.className = (template.className + ' stik-bound').trim();
  }

  return spec;
};
