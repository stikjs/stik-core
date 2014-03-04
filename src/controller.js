window.stik.createController = function(spec){
  if (!spec.name) {
    throw "Stik: Controller needs a name";
  }

  spec.actions = {};

  function action(actionName, executionUnit){
    var newAction = window.stik.action({
      name: actionName,
      controller: spec.name,
      executionUnit: executionUnit
    });
    spec.actions[actionName] = newAction;
    return newAction;
  } spec.action = action;

  function bind(modules){
    var name,
        boundAny = false;

    for (name in spec.actions){
      if (spec.actions[name].bind(modules)) {
        boundAny = true;
      }
    }

    return boundAny;
  } spec.bind = bind;

  return spec;
};
