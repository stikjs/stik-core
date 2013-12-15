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
});
