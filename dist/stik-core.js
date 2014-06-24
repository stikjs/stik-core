// Stik-core - Version: 1.0.1 | From: 24-6-2014
if ( window.stik ){
  throw "Stik is already loaded. Check your requires ;)";
}

window.stik = {};

window.stik.injectable = function injectable( spec ){
  spec.instantiable = spec.instantiable || false;
  spec.resolvable = spec.resolvable || false;
  spec.cache = spec.cache || false;

  spec.resolve = function resolve( dependencies ){
    if ( !!spec.cachedValue ) { return spec.cachedValue; }

    if ( spec.instantiable === true ) {
      return buildModule(
        resolveDependencies( dependencies )
      );
    } else if ( spec.resolvable === true ) {
      return callWithDependencies(
        {},
        resolveDependencies( dependencies )
      );
    } else {
      return spec.module;
    }
  };

  function buildModule( dependencies ){
    var newInstance, value;

    function TempConstructor(){}
    TempConstructor.prototype = spec.module.prototype;
    newInstance = new TempConstructor();

    value = callWithDependencies(
      newInstance, dependencies
    );

    return Object( value ) === value ? value : newInstance;
  }

  function resolveDependencies( dependencies ){
    var injector = window.stik.injector({
      executionUnit: spec.module,
      modules: dependencies
    });

    return injector.resolveDependencies();
  }

  function callWithDependencies( context, dependencies ){
    var result = spec.module.apply( context, dependencies );

    cacheValue(result);

    return result;
  }

  function cacheValue( value ){
    if ( spec.cache === true ){
      spec.cachedValue = value;
    }
  }

  return spec;
};

window.stik.createController = function controller( spec ){
  if ( !spec.name ) { throw "Stik: Controller needs a name"; }

  spec.actions = {};

  spec.action = function action( actionName, executionUnit ){
    var newAction = window.stik.action({
      name: actionName,
      controller: spec.name,
      executionUnit: executionUnit
    });
    spec.actions[ actionName ] = newAction;
    return newAction;
  };

  spec.bind = function bind( modules ){
    var name,
        boundAny = false;

    for ( name in spec.actions ){
      if ( spec.actions[ name ].bind( modules ) ) {
        boundAny = true;
      }
    }

    return boundAny;
  };

  return spec;
};

window.stik.action = function action( spec ){
  if ( !spec.controller ) { throw "Stik: Action needs an controller name"; }
  if ( !spec.name ) { throw "Stik: Action name can't be empty"; }
  if ( !spec.executionUnit ) { throw "Stik: Action needs a function to use as its execution unit"; }

  spec.bind = function bind( modules ){
    var templates = spec.findTemplates(),
        i = templates.length;

    while( i-- ){
      bindWithTemplate(
        templates[ i ]
      ).context.load( spec.executionUnit, modules );
      markAsBound( templates[ i ] );
    }

    return templates.length > 0;
  };

  spec.findTemplates = function findTemplates( DOMInjection ){
    var DOMHandler = document;
    if (DOMInjection) { DOMHandler = DOMInjection; }

    var selector = "[data-controller=" + spec.controller + "]" +
                   "[data-action=" + spec.name + "]" +
                   ":not([class*=stik-bound])";
    return DOMHandler.querySelectorAll( selector );
  };

  function bindWithTemplate( template ){
    return {
      context: window.stik.context({
        controller: spec.controller,
        action: spec.name,
        template: template
      }),
      executionUnit: spec.executionUnit
    };
  } spec.bindWithTemplate = bindWithTemplate;

  function markAsBound( template ){
    template.className = ( template.className + ' stik-bound').trim();
  }

  return spec;
};

window.stik.context = function context( spec ){
  spec.template = window.stik.injectable({
    module: spec.template
  });

  spec.load = function load( executionUnit, modules ){
    var dependencies = resolveDependencies(
      executionUnit,
      mergeModules( modules )
    );

    executionUnit.apply( spec, dependencies );
  };

  function resolveDependencies( executionUnit, modules ){
    var injector = window.stik.injector({
      executionUnit: executionUnit,
      modules: modules
    });

    return injector.resolveDependencies();
  }

  function mergeModules( modules ){
    modules.$template = spec.template;

    return modules;
  }

  return spec;
};

window.stik.createBehavior = function behavior( spec ){
  if ( !spec.name ) { throw "Stik: Behavior name is missing"; }
  if ( spec.name.indexOf(" ") !== -1 ) { throw "Stik: '" + spec.name + "' is not a valid Behavior name. Please replace empty spaces with dashes ('-')"; }
  if ( !spec.executionUnit ) { throw "Stik: Behavior needs a function to use as its execution unit"; }

  var behaviorKey = "data-behaviors";

  spec.bind = function bind( modules ){
    var templates = spec.findTemplates(),
        i = templates.length;

    while ( i-- ) {
      bindWithTemplate(
        templates[ i ]
      ).context.load( spec.executionUnit, modules );
      markAsApplyed( templates[ i ] );
    }

    return templates.length > 0;
  };

  function bindWithTemplate( template ){
    return {
      context: window.stik.context({
        behavior: spec.behavior,
        template: template
      }),
      executionUnit: spec.executionUnit
    };
  } spec.bindWithTemplate = bindWithTemplate;

  function findTemplates(){
    var selector = "[class*=" + spec.name + "]" +
                   ":not([data-behaviors*=" + spec.name + "])";

    return document.querySelectorAll( selector );
  } spec.findTemplates = findTemplates;

  function resolveDependencies( modules ){
    var injector = window.stik.injector({
      executionUnit: spec.executionUnit,
      modules: modules
    });

    return injector.resolveDependencies();
  }

  function markAsApplyed( template ){
    var behaviors = template.getAttribute( behaviorKey );
    behaviors = ( ( behaviors || "" ) + " " + spec.name ).trim();

    template.setAttribute( behaviorKey, behaviors ) &
             removeBehaviorClass( template );
  }

  function removeBehaviorClass( template ){
    var regex = new RegExp( "(^|\\s)?" + spec.name + "(\\s|$)", "g" );
    template.className = template.className.replace( regex, " " ).trim();
  }

  return spec;
};

window.stik.createBoundary = function boundary( spec ){
  if ( spec.as.indexOf(" ") !== -1 ) { throw "Stik: '" + spec.as + "' is not a valid Boundary name. Please replace empty spaces with dashes ('-')"; }
  if ( !spec.to ) { throw "Stik: Boundary needs an object or function as 'to'"; }

  var obj = {};

  obj.to = window.stik.injectable({
    module: spec.to,
    instantiable: spec.instantiable,
    resolvable: spec.resolvable,
    cache: spec.cache
  });

  obj.name = spec.as;

  return obj;
};

window.stik.injector = function injector( spec ){
  if ( !spec.executionUnit ) { throw "Stik: Injector needs a function to use as its execution unit"; }

  spec.resolveDependencies = function resolveDependencies(){
    var args = extractArguments();

    return grabModules( args );
  };

  function extractArguments(){
    var argsPattern, funcString, args;

    argsPattern = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;

    funcString = spec.executionUnit.toString();

    args = funcString.match( argsPattern )[ 1 ].split( ',' );

    return trimmedArgs( args );
  }

  function trimmedArgs( args ){
    var result = [];
    args.forEach( function( arg ){
      result.push( arg.trim() );
    });
    return result;
  }

  function grabModules( args ){
    var module, dependencies;

    dependencies = [];

    if ( args.length === 1 && args[ 0 ] === "" ) { return []; }

    for ( var i = 0; i < args.length; i++ ) {
      if ( !( module = spec.modules[ args[ i ] ] ) ) {
        throw "Stik could not find this module (" + args[ i ] + ")";
      }

      dependencies.push(
        module.resolve( spec.modules )
      );
    }

    return dependencies;
  }

  return spec;
};

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
    var type, boundaryName;

    for ( type in boundaries ) {
      for ( boundaryName in boundaries[ type ] ) {
        if ( boundaryName === name ) {
          return boundaries[ type ][ boundaryName ];
        }
      }
    }
  };

  obj.boundariesFor = function boundariesFor( which ){
    return extractBoundaries( boundaries[ which ] );
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

window.stik.$$manager = window.stik.manager();

window.stik.controller = function controller( controllerName, action, executionUnit ){
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

window.stik.behavior = function behavior( name, executionUnit ){
  return window.stik.$$manager.addBehavior( name, executionUnit );
};

window.stik.lazyBind = window.stik.bindLazy = function bindLazy(){
  if ( !window.stik.$$manager.bindActions() & !window.stik.$$manager.applyBehaviors() ) {
    throw "Stik: Nothing new to bind!";
  }
};

window.stik.boundary = function boundary( spec ){
  return window.stik.$$manager.addBoundary( spec );
};
