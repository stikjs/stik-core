(function(){
  function Boundary(as, to, instantiable, callable){
    if (as.indexOf(" ") !== -1) { throw "Invalid 'as'. Can't have spaces"; }
    if (!to)                    { throw "Invalid 'to'. Can't be null"; }

    this.$$as = as;
    this.$$to = window.stik.injectable({
      module: to,
      instantiable: instantiable,
      callable: callable
    });
  }

  window.stik.Boundary = Boundary;
})();
