// ==========================================================================
// Project:   Stik.js - JavaScript Separation Of Concerns
// Copyright: Copyright 2013-2014 Lukas Alexandre
// License:   Licensed under MIT license
//            See https://github.com/stikjs/stik.js/blob/master/LICENSE
// ==========================================================================

// Version: 0.11.0 | From: 05-04-2014

if ( window.stik ){
  throw "Stik is already loaded. Check your requires ;)";
}

window.stik = {
  labs: {}
};

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

  spec.action = function( actionName, executionUnit ){
    var newAction = window.stik.action({
      name: actionName,
      controller: spec.name,
      executionUnit: executionUnit
    });
    spec.actions[ actionName ] = newAction;
    return newAction;
  };

  spec.bind = function( modules ){
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

  spec.bind = function( modules ){
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

  spec.findTemplates = function( DOMInjection ){
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
    template.className = (template.className + ' stik-bound').trim();
  }

  return spec;
};

window.stik.context = function context( spec ){
  spec.template = window.stik.injectable({
    module: spec.template
  });

  spec.load = function( executionUnit, modules ){
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
  };

  function markAsApplyed( template ){
    var behaviors = template.getAttribute( behaviorKey );
    behaviors = ( ( behaviors || "" ) + " " + spec.name ).trim();

    template.setAttribute( behaviorKey, behaviors );
  };

  return spec;
}

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

  spec.resolveDependencies = function(){
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

  obj.getBoundary = function getBoundary(name){
    for ( type in boundaries ) {
      for ( boundaryName in boundaries[ type ] ) {
        if ( boundaryName === name ) {
          return boundaries[ type ][ boundaryName ];
        }
      }
    }
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

window.stik.lazyBind = window.stik.bindLazy = function(){
  if ( !window.stik.$$manager.bindActions() & !window.stik.$$manager.applyBehaviors() ) {
    throw "Stik: Nothing new to bind!";
  }
};

window.stik.boundary = function( spec ){
  return window.stik.$$manager.addBoundary( spec );
};

(function(){
  var helpers = {},
      modules = {};

  window.stik.helper = function helper( as, func ){
    if ( !as ) { throw "Stik: Helper needs a name"; }
    if ( !func || typeof func !== "function" ) { throw "Stik: Helper needs a function"; }

    modules[ as ] = window.stik.injectable({
      module: func,
      resolvable: true
    });
    helpers[ as ] = function(){
      return modules[ as ].resolve( modules ).apply( {}, arguments );
    };

    return helpers[ as ];
  }

  window.stik.boundary( { as: "$h", to: helpers } );
}());

window.stik.boundary({
  as: "$courier",
  resolvable: true,
  cache: true,
  to: function courier(){
    var obj = {},
        subscriptions = {};

    obj.$receive = function( box, opener ){
      var subscription = createSubscription({
        box: box, opener: opener
      });

      subscriptions[ box ] = ( subscriptions[ box ] || [] );
      subscriptions[ box ].push( subscription );

      return unsubscribe.bind( {}, subscription );
    };

    obj.$send = function $send( box, message ){
      var i = 0,
          openedBoxes,
          foundAny = false;

      fetchSubscriptions( box , function( openers ){
        foundAny = true;
        i = openers.length;
        while ( i-- ) {
          openers[ i ].opener( message );
        }
      });

      if ( !foundAny ) { throw "Stik: No receiver registered for '" + box + "'"; }
    };

    function fetchSubscriptions( box, callback ){
      var pattern = new RegExp( box );

      for ( sub in subscriptions ) {
        if ( pattern.exec( sub ) ) {
          callback( subscriptions[ sub ] );
        }
      }
    }

    function unsubscribe( subscription ){
      subscriptions[ subscription.box ] =
      subscriptions[ subscription.box ].filter( function( subs ){
        return subs.id !== subscription.id;
      });

      if ( subscriptions[ subscription.box ].length === 0 ) {
        delete subscriptions[ subscription.box ];
      }
    }

    function createSubscription( spec ){
      spec.id = '#' + Math.floor(
        Math.random()*16777215
      ).toString( 16 );

      return spec;
    }

    return obj;
  }
});

window.stik.boundary({
  as: "$viewBag",
  resolvable: true,
  to: function viewBag( $template ){
    if (!$template) { throw "Stik: ViewBag needs a template to be attached to"; }

    var obj = {},
        bindingKey = "data-key";

    obj.$push = function( dataSet ){
      var fields = fieldsToBind(),
          i = fields.length,
          dataToBind;

      while( i-- ) {
        dataToBind = fields[ i ].getAttribute( bindingKey );

        if ( dataSet[ dataToBind ] !== undefined ) {
          updateElementValue( fields[ i ], dataSet[ dataToBind ] );
        }
      }
    };

    obj.$pull = function(){
      var fields = fieldsToBind( $template ),
          dataSet = {},
          i = fields.length,
          key;

      while( i-- ) {
        key = fields[ i ].getAttribute( bindingKey );
        dataSet[ key ] = extractValueOf( fields[ i ] );
      }

      return dataSet;
    };

    function extractValueOf( element ){
      if ( isInput( element ) ) {
        return element.value;
      } else {
        return element.textContent;
      }
    }

    function updateElementValue( element, value ){
      if ( isInput( element ) ) {
        element.value = value;
      } else {
        element.textContent = value;
      }
    }

    function fieldsToBind(){
      if ( $template.getAttribute( bindingKey ) ) {
        return [ $template ];
      }

      return $template.querySelectorAll(
        "[" + bindingKey + "]"
      );
    }

    function isInput( element ){
      return element.nodeName.toUpperCase() === "INPUT" || element.nodeName.toUpperCase() === "TEXTAREA";
    }

    return obj;
  }
});

stik.boundary({
  as: "$data",
  resolvable: true,
  to: function( $template ){
    var attrs = {}, name;

    for ( attr in $template.attributes ) {
      if ( $template.attributes[ attr ].value ) {
        name = $template.attributes[ attr ].name
        if (name.match(/^data-/m)) {
          attrs[ parseName( name ) ] =
            $template.attributes[ attr ].value;
        }
      }
    }

    function parseName( name ){
      return name.match(/(data-)(.+)/)[ 2 ];
    }

    return attrs;
  }
});

stik.boundary({ as: "$window", to: window });

stik.helper( "$window", function(){
  return window;
});

stik.helper( "debounce", function(){
  return function debounce( func, wait, immediate ){
    // copied from underscore.js
  	var timeout;
  	return function(){
  		var context = this, args = arguments;
  		var later = function() {
  			timeout = null;
  			if ( !immediate ) func.apply( context, args );
  		};
  		var callNow = immediate && !timeout;
  		clearTimeout( timeout );
  		timeout = setTimeout( later, wait );
  		if ( callNow ) func.apply( context, args );
  	}
  }
});

stik.helper( "goTo", function($window){
  return function(url){
    $window.location = url;
  }
});

stik.helper("hasClass", function(){
  return function(elm, selector){
    var className = " " + selector + " ";
    return (" " + elm.className + " ").replace(/[\n\t]/g, " ").indexOf(className) > -1;
  }
});

stik.helper("removeClass", function(){
  return function removeClass(elm, selector){
    var regex = new RegExp("\\b\\s?" + selector + "\\b", "g");
    elm.className = elm.className.replace(regex, '');
  }
});

stik.helper("addClass", function(){
  return function addClass(elm, selector){
    elm.className += " " + selector;
  }
});

stik.helper("toggleClass", function(hasClass, addClass, removeClass){
  return function toggleClass(elm, selector){
    if (hasClass(elm, selector)) {
      removeClass();
    } else if (!hasClass(elm, selector)) {
      addClass();
    }
  }
});

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
    for ( dbl in doubles ) {
      result.modules[ dbl ] = window.stik.injectable({
        module: doubles[ dbl ]
      });
    }
    return result.modules;
  }

  return env;
};

window.stik.labs.controller = function controllerLab( spec ){
  if ( !spec ) { throw "Stik: Controller Lab needs an environment to run"; }
  if ( !spec.name ) { throw "Stik: Controller Lab needs a name"; }
  if ( !spec.action ) { throw "Stik: Controller Lab needs the action name"; }
  if ( !spec.template ) { throw "Stik: Controller Lab needs a template"; }

  var env = {},
      result;

  env.template = parseAsDOM();

  result = window.stik.$$manager.bindActionWithTemplate(
    spec.name, spec.action, env.template
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
    for ( dbl in doubles ) {
      result.modules[ dbl ] = window.stik.injectable({
        module: doubles[ dbl ]
      });
    }
    return result.modules;
  }

  return env;
};

window.stik.labs.boundary = function boundaryLab( spec ){
  if ( !spec ) { throw "Stik: Boundary Lab needs an environment to run"; }
  if ( !spec.name ) { throw "Stik: Boundary Lab needs a name"; }

  var env = {},
      boundary = window.stik.$$manager.getBoundary( spec.name );

  env.run = function run( doubles ){
    return boundary.to.resolve( asInjectables( doubles ) );
  };

  function asInjectables( doubles ){
    var injectableDoubles = {};

    for ( dbl in doubles ) {
      injectableDoubles[ dbl ] = window.stik.injectable({
        module: doubles[ dbl ]
      });
    }

    return injectableDoubles;
  }

  return env;
};
