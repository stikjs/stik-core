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
        manager.$addControllerWithAction("", "detal", function(){})
      }).toThrow("Controller name can't be empty");

      expect(function(){
        manager.$addControllerWithAction("ItemCtrl", "", function(){})
      }).toThrow("Action name can't be empty");

      expect(function(){
        manager.$addControllerWithAction("ItemCtrl", "detail");
      }).toThrow("Execution Unit is missing");
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
        manager.$addBoundary("CustomObj", "different", {});
      }).toThrow("Invalid 'from'. Needs to be 'controller' or 'behavior'");

      expect(function(){
        manager.$addBoundary("with space", "controller", {});
      }).toThrow("Invalid 'as'. Can't have spaces");

      expect(function(){
        manager.$addBoundary("CustomObj", "controller", null);
      }).toThrow("Invalid 'to'. Can't be null");
    });

    it("should create a new controller boundary", function(){
      var manager;

      manager = new stik.Manager();

      manager.$addBoundary("CustomObj", "controller", function(){});

      expect(
        manager.$$boundaries.controller["CustomObj"]
      ).toBeDefined();
    });

    it("should be injectable into a behavior", function(){
      var manager, executionUnit, injectable, template, result;

      manager = new stik.Manager();

      injectable = function(){};
      manager.$addBoundary("CustomFunc", "behavior", injectable);

      template = document.createElement("div");

      spyOn(manager, "$findBehaviorTemplates").andReturn([template]);

      manager.$addBehavior("new-behavior", function(CustomFunc){
        result = CustomFunc;
      });

      expect(result).toEqual(injectable);
    });

    it("should be injectable into a controller", function(){
      var manager, injectable, elm, template, result, ctrl;

      manager = new stik.Manager();

      injectable = {};
      manager.$addBoundary("CustomObj", "controller", injectable);

      template = {};

      ctrl = manager.$addControllerWithAction("AppCtrl", "List", function(CustomObj){
        result = CustomObj;
      });

      spyOn(
         ctrl.$$actions["List"], "$findTemplates"
      ).andReturn([template]);

      manager.$bindActions();

      expect(result).toEqual(injectable);
    });
  });

  describe("#$addHelper", function(){});

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
      }).toThrow("behavior already exist with the specified name");
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
      ).toHaveBeenCalledWith(behavior, executionUnit);

      expect(manager.$$behaviors.length).toBe(1);
    });
  });

  describe("$isBehaviorRegistered", function(){
    it("when it does not exist", function(){
      var manager;

      manager = new stik.Manager();

      expect(manager.$isBehaviorRegistered("some-behavior")).toBeFalsy();
    });

    it("when it does exist", function(){
      var manager;

      manager = new stik.Manager();
      spyOn(manager, "$applyBehavior");

      manager.$addBehavior("some-behavior", function(){});

      expect(manager.$isBehaviorRegistered("bh-some-behavior")).toBeTruthy();
    });
  });

  describe("#$applyBehavior", function(){
    it("with one template", function(){
      var manager, behavior, template, name;

      name     = "some-behavior";
      template = '<div id="item-1" class="some-behavior"></div>';

      manager  = new stik.Manager();
      behavior = new stik.Behavior(name, function(){});

      spyOn(manager, "$findBehaviorTemplates").andReturn([template]);
      spyOn(behavior, "$load");

      manager.$applyBehavior(behavior);

      expect(
        manager.$findBehaviorTemplates
      ).toHaveBeenCalledWith(behavior);

      expect(
        behavior.$load
      ).toHaveBeenCalledWith(template, {});
    });

    it("with two template", function(){
      var manager, behavior, template, name;

      firstName  = "some-behavior-1";
      secondName = "some-behavior-2";
      template1  = '<div id="item-1" class="some-behavior"></div>';
      template2  = '<div id="item-2" class="some-behavior"></div>';

      manager  = new stik.Manager();
      behavior = new stik.Behavior(firstName, function(){});

      spyOn(manager, "$findBehaviorTemplates").andReturn([template1, template2]);
      spyOn(behavior, "$load");

      manager.$applyBehavior(behavior);

      expect(
        behavior.$load
      ).toHaveBeenCalledWith(template1, {});

      expect(
        behavior.$load
      ).toHaveBeenCalledWith(template2, {});
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

  describe("#$findBehaviorTemplates", function(){
    it("should look for templates in the DOM based on the className", function(){
      var DOM, manager, behavior;

      DOM  = DOMDouble();

      manager = new stik.Manager();

      behavior = new stik.Behavior("some-behavior", function(){});

      spyOn(DOM, "querySelectorAll").andReturn([1,2,3]);

      result = manager.$findBehaviorTemplates(behavior, DOM);

      expect(
        DOM.querySelectorAll
      ).toHaveBeenCalledWith(
        "[class*=" + behavior.$$className + "]" +
        ":not([data-behaviors*=" + behavior.$$name + "])"
      );

      expect(result).toEqual([1,2,3]);
    });
  });
});
