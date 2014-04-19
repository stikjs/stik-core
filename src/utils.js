window.stik.boundary( { as: "$window", to: window } );

window.stik.helper( "$window", function(){
  return window;
});

window.stik.helper( "debounce", function(){
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
    };
  };
});

window.stik.helper( "goTo", function( $window ){
  return function goTo( url ){
    $window.location = url;
  };
});

window.stik.helper( "deepExtend", function(){
  return function deepExtend( destination, source ){
    for ( var property in source ) {
      if ( Object.isObjectLiteral( destination[ property ] ) && Object.isObjectLiteral( source[ property ] ) ) {
        destination[ property ] = destination[ property ] || {};
        arguments.callee( destination[ property ], source[ property ]);
      } else {
        destination[ property ] = source[ property ];
      }
    }
    return destination;
  };
});
