(function () {
  var DOMLibLoader = {
    $currentDOMSelector: function() {
      if (window.hasOwnProperty("jQuery")) {
        return window.jQuery;
      }
      else if(window.hasOwnProperty("Zepto")) {
        return window.Zepto;
      }
      else if (window.hasOwnProperty("MooTools")) {
        return window.document.id;
      }
    }
  }

  window.stik.DOMLibLoader = DOMLibLoader;
})();
