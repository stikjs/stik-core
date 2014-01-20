(function(){
  function Boundary(as, to, instantiable, callable){
    if (as.indexOf(" ") !== -1) { throw "Invalid 'as'. Can't have spaces"; }
    if (!to)                    { throw "Invalid 'to'. Can't be null"; }

    this.$$as = as;
    this.$$to = new window.stik.Injectable(
      to, instantiable, callable
    );
  }

  window.stik.Boundary = Boundary;
})();
