window.stik.manager = function manager(){
  var behaviors   = {},
      controllers = {},
      boundaries  = { all: {}, controller:{}, behavior:{} },
      obj = {};

  obj.addControllerWithAction = function addControllerWithAction( controllerName, actionName, executionUnit ){
    var ctrl = storeController( controllerName ),
        action = ctrl.action( actionName, executionUnit );
    action.bind( extractBoundaries( boundaries.controller ) );
    return ctrl;
  };

  obj.addController = function addController( controllerName, executionUnit ){
    var ctrl = storeController( controllerName );
    executionUnit.call( {}, ctrl );
    bindController( ctrl );
    return ctrl;
  };

  obj.addBehavior = function addBehavior( name, executionUnit ){
    if ( isBehaviorRegistered( name ) ) { throw "Stik: Another behavior already exist with name '" + name + "'"; }

    var behavior = createBehavior({
      name: name,
      executionUnit: executionUnit
    });
    behaviors[name] = behavior;

    obj.applyBehavior( behavior );

    return behavior;
  };

  obj.addBoundary = function addBoundary( spec ){
    var boundary;

    spec.from = spec.from || "all";

    if ( [ "all", "controller", "behavior" ].indexOf( spec.from ) === -1 ) {
      throw "Stik: Invalid boundary 'from' specified. Please use 'controller', 'behavior', 'all' or leave it blank to default to 'all'";
    } else {
      boundary = window.stik.createBoundary( spec );
      boundaries[ spec.from ][ spec.as ] = boundary;
    }

    return boundary;
  };

  obj.applyBehaviors = function applyBehaviors(){
    var boundAny = false,
        behavior;

    for ( behavior in behaviors ) {
      if ( obj.applyBehavior( behaviors[ behavior ] ) ) {
        boundAny = true;
      }
    }

    return boundAny;
  };

  obj.applyBehavior = function applyBehavior( behavior ){
    var modules = extractBoundaries( boundaries.behavior );
    return behavior.bind( modules );
  };

  obj.bindActionWithTemplate = function bindActionWithTemplate( controller, action, template ){
    var modules = extractBoundaries( boundaries.controller ),
        result;

    result = controllers[ controller ].actions[ action ].bindWithTemplate(
      template, modules
    );
    result.modules = modules;

    return result;
  };

  obj.bindBehaviorWithTemplate = function bindBehaviorWithTemplate( behavior, template ){
    var modules = extractBoundaries( boundaries.behavior ),
        result;

    result = behaviors[ behavior ].bindWithTemplate(
      template, modules
    );
    result.modules = modules;

    return result;
  };

  obj.bindActions = function bindActions(){
    var modules = extractBoundaries( boundaries.controller ),
        boundAny = false,
        ctrl;

    for ( ctrl in controllers ) {
      if ( controllers[ ctrl ].bind( modules ) ) {
        boundAny = true;
      }
    }

    return boundAny;
  };

  obj.getBoundary = function getBoundary(name){
    for ( type in boundaries ) {
      for ( boundaryName in boundaries[ type ] ) {
        if ( boundaryName === name ) {
          return boundaries[ type ][ boundaryName ];
        }
      }
    }
  };

  obj.$reset = function $reset(){
    controllers = {};
    behaviors = {};
  };

  function storeController( controllerName ){
    var ctrl = window.stik.createController({
      name: controllerName
    });
    controllers[ controllerName ] = ctrl;
    return ctrl;
  }

  function isBehaviorRegistered( name ){
    return !!behaviors[ name ];
  }

  function createBehavior( name, executionUnit ){
    return window.stik.createBehavior( name, executionUnit );
  }

  function extractBoundaries( collection ){
    var key,
        modules = {};

    for ( key in collection ) {
      modules[ key ] = collection[ key ].to;
    }
    for ( key in boundaries.all ) {
      modules[ key ] = boundaries.all[ key ].to;
    }

    return modules;
  }

  function bindController( controller ){
    var modules = extractBoundaries( boundaries.controller );
    controller.bind( modules );
  }

  return obj;
};
