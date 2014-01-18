describe("Public", function(){
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

  describe(".bindLazy", function(){
    it("when ok", function(){
      spyOn(stik.$$manager, "$buildContexts").andReturn(true);
      spyOn(stik.$$manager, "$applyBehaviors").andReturn(true);

      expect(function(){
        stik.bindLazy();
      }).not.toThrow();

      expect(stik.$$manager.$buildContexts).toHaveBeenCalled();
      expect(stik.$$manager.$applyBehaviors).toHaveBeenCalled();
    });

    it("when no controllers was bound", function(){
      spyOn(stik.$$manager, "$buildContexts").andReturn(false);
      spyOn(stik.$$manager, "$applyBehaviors").andReturn(true);

      expect(function(){
        stik.bindLazy()
      }).not.toThrow();
    });

    it("when no behaviors was bound", function(){
      spyOn(stik.$$manager, "$buildContexts").andReturn(true);
      spyOn(stik.$$manager, "$applyBehaviors").andReturn(false);

      expect(function(){
        stik.bindLazy()
      }).not.toThrow();
    });

    it("when nothing was bound", function(){
      spyOn(stik.$$manager, "$buildContexts").andReturn(false);
      spyOn(stik.$$manager, "$applyBehaviors").andReturn(false);

      expect(function(){
        stik.bindLazy()
      }).toThrow("nothing to bind!");
    });
  });
});
