describe("Main", function(){
  it(".controller", function(){
    var controller, action, executionUnit;

    controller    = "AppCtrl";
    action        = "Login";
    executionUnit = function(){};

    spyOn(stik.$$manager, "$addController");

    stik.controller(controller, action, executionUnit);

    expect(
      stik.$$manager.$addController
    ).toHaveBeenCalledWith(controller, action, executionUnit);
  });

  it(".register", function(){
    var controller, action, executionUnit;

    controller    = "AppCtrl";
    action        = "Login";
    executionUnit = function(){};

    spyOn(stik, "controller");

    stik.register(controller, action, executionUnit);

    expect(
      stik.controller
    ).toHaveBeenCalledWith(controller, action, executionUnit);
  });

  it(".bindLazy", function(){
    spyOn(stik.$$manager, "$buildContexts");

    stik.bindLazy();

    expect(stik.$$manager.$buildContexts).toHaveBeenCalled();
  });

  it(".behavior", function(){
    var name, executionUnit;

    name          = "some-behavior"
    executionUnit = function(){};

    spyOn(stik.$$manager, "$addBehavior");

    stik.behavior(name, executionUnit);

    expect(
      stik.$$manager.$addBehavior
    ).toHaveBeenCalledWith(name, executionUnit);
  });
});
