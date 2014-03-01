if (window.stik.$$manager){
  throw "Stik is already loaded. Check your requires ;)";
}

window.stik.$$manager = new window.stik.Manager();

window.stik.controller = function(controllerName, action, executionUnit){
  if (typeof action === "string") {
    return window.stik.$$manager.$addControllerWithAction(
      controllerName, action, executionUnit
    );
  } else {
    return window.stik.$$manager.$addController(
      controllerName, action
    );
  }
};

window.stik.behavior = function(name, executionUnit){
  return this.$$manager.$addBehavior(name, executionUnit);
};

window.stik.bindLazy = function(){
  if (!this.$$manager.$bindActions() & !this.$$manager.$applyBehaviors()) {
    throw "nothing to bind!";
  }
};

window.stik.boundary = function(boundary){
  return this.$$manager.$addBoundary(
    boundary.as,
    boundary.from,
    boundary.to,
    boundary.inst,
    boundary.call
  );
};
