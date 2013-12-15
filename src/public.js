window.stik || (window.stik = {});

(function() {
  if (stik.$$manager)
    throw "Stik.js is already loaded. Check your requires ;)"

  stik.$$manager = new stik.Manager({});

  stik.register = function(controller, action, executionUnit){
    stik.$$manager.$register(controller, action, executionUnit);
  };

  stik.binddLazy = function(){
    this.$$manager.$buildContexts();
  };
})();
