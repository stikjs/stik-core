describe("Manager", function(){
  function DOMDouble(){
    return {
      querySelectorAll: function(){}
    };
  };

  describe("#$addControllerWithAction", function(){
    it("should throw if any parameters is empty or missing", function(){
      var manager = new stik.Manager();

      expect(function(){
        manager.$addControllerWithAction("", "detail", function(){})
      }).toThrow("Stik: Controller needs a name");

      expect(function(){
        manager.$addControllerWithAction("ItemCtrl", "", function(){})
      }).toThrow("Stik: Action name can't be empty");

      expect(function(){
        manager.$addControllerWithAction("ItemCtrl", "detail");
      }).toThrow("Stik: Action needs a function to use as its execution unit");
    });

    it("should register and bind the new execution unit", function(){
      var manager;

      manager = new stik.Manager();

      manager.$addControllerWithAction(
        "ItemCtrl", "detail", function(){}
      );

      expect(
        manager.$$controllers["ItemCtrl"]
      ).not.toBeUndefined();
    });
  });

  describe("#$addController", function(){
    it("should register and bind the new execution unit", function(){
      var manager, controller, action, executionUnit;

      controller    = "ItemCtrl";
      action        = "Detail";
      executionUnit = function(){};

      manager = new stik.Manager();

      manager.$addController(controller, executionUnit);

      expect(
        manager.$$controllers["ItemCtrl"]
      ).not.toBeUndefined();
    });
  });

  describe("#$addBoundary", function(){
    it("when not ok", function(){
      var manager = new stik.Manager();

      expect(function(){
        manager.$addBoundary({
          as: "CustomObj",
          from: "different",
          to: {}
        });
      }).toThrow("Stik: Invalid boundary 'from' specified. Please use 'controller' or 'behavior' or leave it blank to default to both");

      expect(function(){
        manager.$addBoundary({
          as: "with space",
          from: "controller",
          to: {}
        });
      }).toThrow("Stik: 'with space' is not a valid Boundary name. Please replace empty spaces with dashes ('-')");

      expect(function(){
        manager.$addBoundary({
          as: "CustomObj",
          from: "controller",
          to: null
        });
      }).toThrow("Stik: Boundary needs an object or function as 'to'");
    });

    it("should default to both controller and behavior", function(){
      var manager = new stik.Manager();

      manager.$addBoundary({
        as: "CustomObj",
        to: function(){}
      });

      expect(
        manager.$$boundaries.controller["CustomObj"]
      ).toBeDefined();

      expect(
        manager.$$boundaries.behavior["CustomObj"]
      ).toBeDefined();
    });

    it("should create a new controller boundary", function(){
      var manager = new stik.Manager();

      manager.$addBoundary({
        as: "CustomObj",
        from: "controller",
        to: function(){}
      });

      expect(
        manager.$$boundaries.controller["CustomObj"]
      ).toBeDefined();
    });

    it("should be injectable into behaviors", function(){
      var manager, executionUnit, injectable, template, result, behavior;

      manager = new stik.Manager();

      injectable = function(){};
      manager.$addBoundary({
        as: "CustomFunc",
        from: "behavior",
        to: injectable
      });

      behavior = manager.$addBehavior("new-behavior", function(CustomFunc){
        result = CustomFunc;
      });

      template = document.createElement("div");
      spyOn(behavior, "findTemplates").andReturn([template]);

      manager.$applyBehaviors();

      expect(result).toEqual(injectable);
    });

    it("should be injectable into an action", function(){
      var manager, injectable, elm, template, result, ctrl;

      manager = new stik.Manager();

      injectable = {};
      manager.$addBoundary({
        as: "CustomObj",
        from: "controller",
        to: injectable
      });

      template = 'div';

      ctrl = manager.$addControllerWithAction("AppCtrl", "List", function(CustomObj){
        result = CustomObj;
      });

      spyOn(
         ctrl.actions["List"], "findTemplates"
      ).andReturn([template]);

      manager.$bindActions();

      expect(result).toEqual(injectable);
    });
  });

  describe("#$addBehavior", function(){
    it("should throw if trying to add a behavior with an existing name", function(){
      var manager, name, executionUnit;

      name          = "some-behavior";
      executionUnit = function(){};

      manager = new stik.Manager();

      spyOn(manager, "$isBehaviorRegistered").andReturn(true);
      spyOn(manager, "$applyBehavior");

      expect(function(){
        manager.$addBehavior(name, executionUnit);
      }).toThrow("Stik: Another behavior already exist with name 'some-behavior'");
    });

    it("should store the new behavior", function(){
      var manager, behavior, executionUnit;

      manager = new stik.Manager();

      behavior      = "some-behavior"
      action        = "detail"
      executionUnit = function(){};

      spyOn(manager, "$createBehavior").andReturn(1);
      spyOn(manager, "$applyBehavior");

      manager.$addBehavior(behavior, executionUnit);

      expect(
        manager.$createBehavior
      ).toHaveBeenCalledWith({
        name: behavior,
        executionUnit: executionUnit
      });

      expect(manager.$$behaviors.length).toBe(1);
    });
  });

  describe("$isBehaviorRegistered", function(){
    it("when it does not exist", function(){
      var manager = new stik.Manager();

      expect(manager.$isBehaviorRegistered("some-behavior")).toBeFalsy();
    });

    it("when it does exist", function(){
      var manager = new stik.Manager();
      spyOn(manager, "$applyBehavior");

      manager.$addBehavior("some-behavior", function(){});

      expect(manager.$isBehaviorRegistered("some-behavior")).toBeTruthy();
    });
  });

  describe("#$applyBehaviors", function(){
    it("without behaviors", function(){
      var manager;

      manager = new stik.Manager();

      spyOn(manager, "$applyBehavior");

      expect(manager.$applyBehaviors()).toBeFalsy();
      expect(manager.$applyBehavior.calls.length).toEqual(0);
    });

    it("with one behavior", function(){
      var manager, behavior;

      manager = new stik.Manager();
      spyOn(manager, "$applyBehavior").andReturn(true);

      behavior = manager.$addBehavior(
        "some-behavior", function(){}
      );

      expect(manager.$applyBehaviors()).toBeTruthy();
      expect(
        manager.$applyBehavior
      ).toHaveBeenCalledWith(behavior);
    });

    it("with many behaviors", function(){
      var manager, behavior;

      manager = new stik.Manager();
      spyOn(manager, "$applyBehavior").andReturn(true);

      behavior1 = manager.$addBehavior(
        "some-behavior-1", function(){}
      );
      behavior2 = manager.$addBehavior(
        "some-behavior-2", function(){}
      );
      behavior3 = manager.$addBehavior(
        "some-behavior-3", function(){}
      );

      expect(manager.$applyBehaviors()).toBeTruthy();
      expect(
        manager.$applyBehavior
      ).toHaveBeenCalledWith(behavior1);
      expect(
        manager.$applyBehavior
      ).toHaveBeenCalledWith(behavior2);
      expect(
        manager.$applyBehavior
      ).toHaveBeenCalledWith(behavior3);
    });
  });
});
