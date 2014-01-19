(function(){
  function Boundary(as, to){
    if (as.indexOf(" ") != -1) { throw "Invalid 'as'. Can't have spaces" }
    if (!to)                   { throw "Invalid 'to'. Can't be null" }

    this.$$as = as;
    this.$$to = to;
  };

  window.stik.Boundary = Boundary;
})();
