(function( stik ){
  stik.$$manager = stik.manager();

  stik.controller = function controller( controllerName, action, executionUnit ){
    if ( typeof action === "string" ) {
      return stik.$$manager.addControllerWithAction(
        controllerName, action, executionUnit
      );
    } else {
      return stik.$$manager.addController(
        controllerName, action
      );
    }
  };

  stik.behavior = function behavior( name, executionUnit ){
    return stik.$$manager.addBehavior( name, executionUnit );
  };

  stik.lazyBind = window.stik.bindLazy = function bindLazy(){
    if ( !stik.$$manager.bindActions() & !stik.$$manager.applyBehaviors() ) {
      throw "Stik: Nothing new to bind!";
    }
  };

  stik.boundary = function boundary( spec ){
    return stik.$$manager.addBoundary( spec );
  };
})( window.stik );
