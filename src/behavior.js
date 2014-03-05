window.stik.createBehavior = function behavior(spec){
  if (!spec.name) { throw "Stik: Behavior name is missing"; }
  if (spec.name.indexOf(" ") !== -1) { throw "Stik: '" + spec.name + "' is not a valid Behavior name. Please replace empty spaces with dashes ('-')"; }
  if (!spec.executionUnit) { throw "Stik: Behavior needs a function to use as its execution unit"; }

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
    modules.$template = window.stik.injectable({
      module: template
    });

    var dependencies = resolveDependencies(modules);

    spec.executionUnit.apply({}, dependencies);
    markAsApplyed(template);
  };

  function findTemplates(){
    var selector = "[class*=" + spec.name + "]" +
                   ":not([data-behaviors*=" + spec.name + "])";

    return document.querySelectorAll(selector);
  } spec.findTemplates = findTemplates;

  function resolveDependencies(modules){
    var injector = window.stik.injector({
      executionUnit: spec.executionUnit,
      modules: modules
    });

    return injector.resolveDependencies();
  };

  function markAsApplyed(template){
    var behaviors = template.getAttribute(behaviorKey);
    behaviors = ((behaviors || "") + " " + spec.name).trim();

    template.setAttribute(behaviorKey, behaviors);
  };

  return spec;
}
