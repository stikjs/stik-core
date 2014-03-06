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
