(function(){
  function Boundary(as, to, inst){
    if (as.indexOf(" ") !== -1) { throw "Invalid 'as'. Can't have spaces"; }
    if (!to)                    { throw "Invalid 'to'. Can't be null"; }

    this.$$as = as;
    this.$$to = new window.stik.Injectable(to, inst);
  }

  window.stik.Boundary = Boundary;
})();
