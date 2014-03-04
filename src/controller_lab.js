window.stik.labs.controller = function controllerLab(spec){
  if (!spec) { throw "Lab needs an environment to run"; }
  if (!spec.name) { throw "name can't be empty"; }
  if (!spec.action) { throw "action can't be empty"; }
  if (!spec.template) { throw "template can't be empty"; }

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
