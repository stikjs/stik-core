window.stik || (window.stik = {});

(function() {
  stik.$$manager = new stik.Manager({});

  stik.register = function(controller, action, executionUnit){
    stik.$$manager.$register(controller, action, executionUnit);
  };
})();
