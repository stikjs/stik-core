window.stik.labs.controller = function controllerLab(spec){
  if (!spec) { throw "Stik: Controller Lab needs an environment to run"; }
  if (!spec.name) { throw "Stik: Controller Lab needs a name"; }
  if (!spec.action) { throw "Stik: Controller Lab needs the action name"; }
  if (!spec.template) { throw "Stik: Controller Lab needs a template"; }

  var env = {},
      result;

  env.template = parseAsDOM();

  result = window.stik.$$manager.$bindActionWithTemplate(
    spec.name, spec.action, env.template
  );

  function parseAsDOM(){
    var container = document.implementation.createHTMLDocument();
    container.body.innerHTML = spec.template;
    return container.body.firstChild;
  }

  function run(doubles){
    result.context.load(result.executionUnit, mergeModules(doubles));
  } env.run = run;

  function mergeModules(doubles){
    for (dbl in doubles) {
      result.modules[dbl] = window.stik.injectable({
        module: doubles[dbl]
      });
    }
    return result.modules;
  }

  return env;
}
