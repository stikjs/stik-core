(function () {
  var DOMLibLoader = {
    $currentDOMSelector: function() {
      if (window.hasOwnProperty("MooTools")) {
        return window.document.id;
      }
      else if(window.hasOwnProperty("Zepto")) {
        return window.Zepto;
      }
      else if (window.hasOwnProperty("jQuery")) {
        return window.jQuery;
      }
    }
  };

  window.stik.DOMLibLoader = DOMLibLoader;
})();
