(function( stik ){
  stik.createBoundary = function boundary( spec ){
    if ( spec.as.indexOf(" ") !== -1 ) { throw "Stik: '" + spec.as + "' is not a valid Boundary name. Please replace empty spaces with dashes ('-')"; }
    if ( !spec.to ) { throw "Stik: Boundary needs an object or function as 'to'"; }

    var obj = {};

    obj.to = stik.injectable({
      module: spec.to,
      instantiable: spec.instantiable,
      resolvable: spec.resolvable,
      cache: spec.cache
    });

    obj.name = spec.as;

    return obj;
  };
})( window.stik );
