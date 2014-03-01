window.stik.createBehavior = function(spec){
  if (!spec.name) {
    throw "name is missing";
  }
  if (spec.name.indexOf(" ") !== -1) {
    throw "invalid name. Please use dash(-) instead of spaces";
  }
  if (!spec.executionUnit) {
    throw "executionUnit is missing";
  }

  var behaviorKey = "data-behaviors"

  function bind(modules){
    var templates = spec.findTemplates(),
        i = templates.length;

    while (i--) {
      load(templates[i], modules);
    }

    return templates.length > 0;
  } spec.bind = bind;

  function load(template, modules){
    modules.$template = new window.stik.Injectable(template);

    var dependencies = resolveDependencies(modules);

    spec.executionUnit.apply({}, dependencies);
    markAsApplyed(template);
  };

  function findTemplates(DOMInjection){
    var DOMHandler = document;
    if (DOMInjection) { DOMHandler = DOMInjection; }

    var selector = "[class*=" + spec.name + "]" +
                   ":not([data-behaviors*=" + spec.name + "])";

    return DOMHandler.querySelectorAll(selector);
  } spec.findTemplates = findTemplates;

  function resolveDependencies(modules){
    var injector = new window.stik.Injector(
      spec.executionUnit, modules
    );

    return injector.$resolveDependencies();
  };

  function markAsApplyed(template){
    var behaviors = template.getAttribute(behaviorKey);
    behaviors = ((behaviors || "") + " " + spec.name).trim();

    template.setAttribute(behaviorKey, behaviors);
  };

  return spec;
}
