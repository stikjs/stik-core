var subject;

describe("Main", function(){
  it(".register", function(){
    var controller = "AppCtrl";
    var action     = "Login";
    var closure    = function(){};

    spyOn(stik.$$manager, "$register");

    stik.register(controller, action, closure);

    expect(
      stik.$$manager.$register
    ).toHaveBeenCalledWith(controller, action, closure);
  });

  it(".init", function(){
    spyOn(stik.$$manager, "$buildContexts");

    stik.init();

    expect(stik.$$manager.$buildContexts).toHaveBeenCalled();
  });
});
