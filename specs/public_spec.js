describe("Main", function(){
  it(".register", function(){
    var controller, action, executionUnit;

    controller    = "AppCtrl";
    action        = "Login";
    executionUnit = function(){};

    spyOn(stik.$$manager, "$register");

    stik.register(controller, action, executionUnit);

    expect(
      stik.$$manager.$register
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
