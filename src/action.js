window.stik.action = function(spec){
  if (!spec.controller) {
    throw "Action needs an controller name";
  }
  if (!spec.name) {
    throw "Action name can't be empty";
  }
  if (!spec.executionUnit) {
    throw "Action needs an execution unit";
  }

  function bind(modules){
    var templates, i;

    templates = spec.findTemplates();

    i = templates.length;
    while(i--){
      bindWithTemplate(
        templates[i]
      ).context.load(spec.executionUnit, modules);
    }

    return templates.length > 0;
  } spec.bind = bind;

  function $resolveDependencies(modules){
    var injector = window.stik.injector(
      this.$$executionUnit, modules
    );

    return injector.$resolveDependencies();
  } spec.$resolveDependencies = $resolveDependencies;

  function mergeModules(template, modules){
    modules.$context  = this;
    modules.$template = template;

    return modules;
  }

  function findTemplates(DOMInjection){
    var DOMHandler = document;
    if (DOMInjection) { DOMHandler = DOMInjection; }

    var selector = "[data-controller=" + spec.controller + "]" +
                   "[data-action=" + spec.name + "]" +
                   ":not([class*=stik-bound])";
    return DOMHandler.querySelectorAll(selector);
  } spec.findTemplates = findTemplates;

  function bindWithTemplate(template, modules){
    return {
      context: window.stik.context({
        controller: spec.controller,
        action: spec.name,
        template: template
      }),
      executionUnit: spec.executionUnit
    };
  } spec.bindWithTemplate = bindWithTemplate;

  return spec;
};
