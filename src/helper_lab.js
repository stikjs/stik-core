window.stik.labs.helper = function helperLab( spec ){
  if ( !spec ) { throw "Stik: Helper Lab needs an environment to run"; }
  if ( !spec.name ) { throw "Stik: Helper Lab needs a name"; }

  var env = {},
      boundary = window.stik.labs.boundary( { name: "$h" } );

  env.run = function run( doubles ){
    var helpers = boundary.run( doubles );
    helpers.pushDoubles( doubles );
    return function(){
      return helpers[ spec.name ].apply( {}, arguments );
    };
    // helpers.cleanDoubles();
  };

  return env;
};
