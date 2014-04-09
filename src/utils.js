stik.boundary( { as: "$window", to: window } );

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

stik.helper( "goTo", function( $window ){
  return function goTo( url ){
    $window.location = url;
  }
});

stik.helper( "hasClass", function(){
  return function hasClass( elm, selector ){
    var className = " " + selector + " ";
    return ( " " + elm.className + " " ).
      replace( /[\n\t]/g, " " ).
      indexOf( className ) > -1;
  }
});

stik.helper( "removeClass", function( hasClass ){
  return function removeClass( elm, selector ){
    if ( hasClass( elm, selector ) ){
      var regex = new RegExp( "\\b\\s?" + selector + "\\b", "g" );
      elm.className = elm.className.replace( regex, '' );
    }
  }
});

stik.helper( "addClass", function( hasClass ){
  return function addClass( elm, selector ){
    if ( !hasClass( elm, selector ) ){
      elm.className = ( elm.className + " " + selector ).trim();
    }
  }
});

stik.helper( "toggleClass", function( hasClass, addClass, removeClass ){
  return function toggleClass( elm, selector ){
    if ( hasClass( elm, selector ) ) {
      removeClass( elm, selector );
    } else if ( !hasClass( elm, selector ) ) {
      addClass( elm, selector );
    }
  }
});

stik.helper( "hideElm", function(){
  return function hideElm( elm ){
    elm.style.display = "none";
  }
});

stik.helper( "showElm", function(){
  return function showElm( elm ){
    if ( elm.style.removeProperty ) {
      elm.style.removeProperty( "display" );
    } else {
      elm.style.removeAttribute( "display" );
    }
  }
});

stik.helper( "deepExtend", function(){
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
  }
});
