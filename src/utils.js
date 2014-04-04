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
      removeClass(elm, selector);
    } else if (!hasClass(elm, selector)) {
      addClass(elm, selector);
    }
  }
});
