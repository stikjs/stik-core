stik.boundary({ as: "$window", to: window });

stik.helper( "$window", function(){
  return window;
});

stik.helper( "debounce", function(){
  return function( func, wait, immediate ){
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
