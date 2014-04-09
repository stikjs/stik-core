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

    for ( var dbl in doubles ) {
      injectableDoubles[ dbl ] = window.stik.injectable({
        module: doubles[ dbl ]
      });
    }

    return injectableDoubles;
  }

  return env;
};
