(function(){
  var helpers = {},
      modules = {};

  function helper(as, func){
    if (!as) { throw "Stik helper needs a name"; }
    if (!func || typeof func !== "function") {
      throw "Stik helper needs a function";
    }

    modules[as] = new window.stik.Injectable(func, false, true);
    helpers[as] = function(){
      return modules[as].$resolve(modules).apply({}, arguments);
    };
  }

  window.stik.boundary({
    as: "$h",
    from: "controller|behavior",
    to: helpers
  });

  window.stik.helper = helper;
}());
