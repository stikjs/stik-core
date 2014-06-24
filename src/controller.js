(function( stik ){
  stik.createController = function controller( spec ){
    if ( !spec.name ) { throw "Stik: Controller needs a name"; }

    spec.actions = {};

    spec.action = function action( actionName, executionUnit ){
      var newAction = stik.action({
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
})( window.stik );
