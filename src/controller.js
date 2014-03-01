window.stik.createController = function(spec){
  if (!spec.name) {
    throw "Controller needs a name";
  }

  spec.$$actions = {};

  function action(actionName, executionUnit){
    var newAction = window.stik.action({
      name: actionName,
      controller: spec.name,
      executionUnit: executionUnit
    });
    spec.$$actions[actionName] = newAction;
    return newAction;
  } spec.action = action;

  function bind(modules){
    var act,
        boundAny = false;

    for (act in spec.$$actions){
      if (spec.$$actions[act].bind(modules)) {
        boundAny = true;
      }
    }

    return boundAny;
  } spec.bind = bind;

  return spec;
};
