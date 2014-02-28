(function(){
  var helpers = {};

  function helper(as, func){
    if (!as) { throw "Stik helper needs a name"; }
    if (!func || (typeof func !== 'function')) {
      throw "Stik helper needs a function";
    }

    helpers[as] = func;
  }

  window.stik.boundary({
    as: "$h",
    from: "controller|behavior",
    to: helpers
  });

  window.stik.helper = helper;
})();
