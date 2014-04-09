window.stik.labs.behavior = function behaviorLab( spec ){
  if ( !spec ) { throw "Stik: Behavior Lab needs an environment to run"; }
  if ( !spec.name ) { throw "Stik: Behavior Lab needs a name"; }
  if ( !spec.template ) { throw "Stik: Behavior Lab needs a template"; }

  var env = {},
      result;

  env.template = parseAsDOM();

  result = window.stik.$$manager.bindBehaviorWithTemplate(
    spec.name, env.template
  );

  env.run = function run( doubles ){
    result.context.load(
      result.executionUnit, mergeModules( doubles )
    );
  };

  function parseAsDOM(){
    var container = document.implementation.createHTMLDocument();
    container.body.innerHTML = spec.template;
    return container.body.firstChild;
  }

  function mergeModules( doubles ){
    for ( var dbl in doubles ) {
      result.modules[ dbl ] = window.stik.injectable({
        module: doubles[ dbl ]
      });
    }
    return result.modules;
  }

  return env;
};
