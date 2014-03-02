window.stik.createBoundary = function(spec){
  if (spec.as.indexOf(" ") !== -1) {
    throw "Invalid 'as'. Can't have spaces";
  }
  if (!spec.to) {
    throw "Invalid 'to'. Can't be null";
  }

  var obj = {};

  obj.to = window.stik.injectable({
    module: spec.to,
    instantiable: spec.instantiable,
    resolvable: spec.resolvable
  });

  return obj;
};
