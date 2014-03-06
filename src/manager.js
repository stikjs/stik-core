window.stik.manager = function manager(){
  var behaviors   = {},
      controllers = {},
      boundaries  = { controller:{}, behavior:{} },
      obj = {};

  obj.addControllerWithAction = function( controllerName, actionName, executionUnit ){
    var ctrl = storeController( controllerName ),
        action = ctrl.action( actionName, executionUnit );
    action.bind( extractBoundaries( boundaries.controller ) );
    return ctrl;
  };

  obj.addController = function( controllerName, executionUnit ){
    var ctrl = storeController( controllerName );
    executionUnit.call( {}, ctrl );
    bindController( ctrl );
    return ctrl;
  };

  obj.addBehavior = function( name, executionUnit ){
    if ( isBehaviorRegistered( name ) ) { throw "Stik: Another behavior already exist with name '" + name + "'"; }

    var behavior = createBehavior({
      name: name,
      executionUnit: executionUnit
    });
    behaviors[name] = behavior;

    obj.applyBehavior( behavior );

    return behavior;
  };

  obj.addBoundary = function( spec ){
    var boundary;

    spec.from = spec.from || "controller|behavior";

    parseFrom( spec.from, function( parsedFrom ){
      boundary = window.stik.createBoundary( spec );
      boundaries[ parsedFrom ][ spec.as ] = boundary;
    });

    return boundary;
  };

  obj.applyBehaviors = function(){
    var boundAny = false,
        behavior;

    for ( behavior in behaviors ) {
      if ( obj.applyBehavior( behaviors[ behavior ] ) ) {
        boundAny = true;
      }
    }

    return boundAny;
  };

  obj.applyBehavior = function( behavior ){
    var modules = extractBoundaries( boundaries.behavior );
    return behavior.bind( modules );
  };

  obj.bindActionWithTemplate = function( controller, action, template ){
    var modules = extractBoundaries( boundaries.controller ),
        result;

    result = controllers[ controller ].actions[ action ].bindWithTemplate(
      template, modules
    );
    result.modules = modules;

    return result;
  };

  obj.bindBehaviorWithTemplate = function( behavior, template ){
    var modules = extractBoundaries( boundaries.behavior ),
        result;

    result = behaviors[ behavior ].bindWithTemplate(
      template, modules
    );
    result.modules = modules;

    return result;
  };

  obj.bindActions = function(){
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

  obj.$reset = function(){
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

  function parseFrom( from, forEachFound ){
    var targets = from.toLowerCase().split( "|" ),
        i = targets.length;

    while ( i-- ) {
      if (targets[ i ] !== "controller" && targets[ i ] !== "behavior") {
        throw "Stik: Invalid boundary 'from' specified. Please use 'controller' or 'behavior' or leave it blank to default to both";
      } else {
        forEachFound( targets[ i ] );
      }
    }
  }

  function isBehaviorRegistered( name ){
    return !!behaviors[ name ];
  }

  function createBehavior( name, executionUnit ){
    return window.stik.createBehavior( name, executionUnit );
  }

  function extractBoundaries( collection ){
    var modules = {},
        key;

    for ( key in collection ) {
      modules[ key ] = collection[ key ].to;
    }

    return modules;
  }

  function bindController( controller ){
    var modules = extractBoundaries( boundaries.controller );
    controller.bind( modules );
  }

  return obj;
};
