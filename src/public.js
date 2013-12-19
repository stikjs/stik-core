(function() {
  if (stik.$$manager)
    throw "Stik.js is already loaded. Check your requires ;)";

  window.stik.$$manager = new stik.Manager({
    $courier: new stik.Courier,
    $urlState: new stik.UrlState
  });

  window.stik.register = function(controller, action, executionUnit){
    stik.$$manager.$register(controller, action, executionUnit);
  };

  window.stik.bindLazy = function(){
    this.$$manager.$buildContexts();
  };
})();
