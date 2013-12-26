(function() {
  if (window.stik.$$manager){
    throw "Stik.js is already loaded. Check your requires ;)";
  };

  window.stik.$$manager = new window.stik.Manager({
    $courier: new window.stik.Courier(),
    $urlState: new window.stik.UrlState()
  });

  window.stik.controller = function(controller, action, executionUnit){
    window.stik.$$manager.$addController(controller, action, executionUnit);
  };

  window.stik.register = function(controller, action, executionUnit){
    window.stik.controller(controller, action, executionUnit);
  };

  window.stik.behavior = function(name, executionUnit){
    return this.$$manager.$addBehavior(name, executionUnit);
  };

  window.stik.bindLazy = function(){
    this.$$manager.$buildContexts();
  };
})();
