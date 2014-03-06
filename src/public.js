window.stik.$$manager = window.stik.manager();

window.stik.controller = function( controllerName, action, executionUnit ){
  if ( typeof action === "string" ) {
    return window.stik.$$manager.addControllerWithAction(
      controllerName, action, executionUnit
    );
  } else {
    return window.stik.$$manager.addController(
      controllerName, action
    );
  }
};

window.stik.behavior = function( name, executionUnit ){
  return window.stik.$$manager.addBehavior( name, executionUnit );
};

window.stik.bindLazy = function(){
  if ( !window.stik.$$manager.bindActions() & !window.stik.$$manager.applyBehaviors() ) {
    throw "Stik: Nothing new to bind!";
  }
};

window.stik.boundary = function( spec ){
  return window.stik.$$manager.addBoundary( spec );
};
