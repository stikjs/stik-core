describe("Manager", function(){
  function DOMDouble(){
    return {
      querySelectorAll: function(){}
    };
  };

  describe("#initialize", function(){
    it("when ok", function(){
      var manager = new stik.Manager();

      expect(manager.$$contexts).toEqual([]);
      expect(manager.$$executionUnits).toEqual({});
    });
  });

  describe("#$register", function(){
    it("should throw if any parameters is empty or missing", function(){
      var manager = new stik.Manager();

      expect(function(){
        manager.$register("", "detal", function(){})
      }).toThrow("controller can't be empty");

      expect(function(){
        manager.$register("ItemCtrl", "", function(){})
      }).toThrow("action can't be empty");

      expect(function(){
        manager.$register("ItemCtrl", "detail");
      }).toThrow("execution unit is missing");
    });

    it("should register and bind the new execution unit", function(){
      var manager, controller, action, executionUnit;

      manager = new stik.Manager();

      controller    = "ItemCtrl"
      action        = "detail"
      executionUnit = function(){};

      spyOn(manager, "$storeExecutionUnit").andCallThrough();
      spyOn(manager, "$bindExecutionUnit");

      manager.$register(controller, action, executionUnit);

      expect(
        manager.$storeExecutionUnit
      ).toHaveBeenCalledWith(controller, action, executionUnit)

      expect(
        manager.$bindExecutionUnit
      ).toHaveBeenCalledWith(controller, action, executionUnit);
    });
  });

  describe("#$storeExecutionUnit", function(){
    it("should store the execution unit in its own namespace", function(){
      var manager, controller, action, executionUnit;

      manager = new stik.Manager();

      controller    = "ItemCtrl";
      action        = "detail";
      executionUnit = function(){};

      manager.$storeExecutionUnit(controller, action, executionUnit);

      expect(manager.$$executionUnits[controller]).toBeDefined();
      expect(manager.$$executionUnits[controller][action]).toBeDefined();
      expect(manager.$$executionUnits[controller][action]).toBe(executionUnit);
    });

    it("should throw if trying to store a controller and action twice", function(){
      var manager, controller, action, executionUnit;

      manager = new stik.Manager();

      controller    = "ItemCtrl"
      action        = "detail"
      executionUnit = function(){};

      manager.$storeExecutionUnit(controller, action, executionUnit);

      expect(function(){
        manager.$storeExecutionUnit(controller, action, executionUnit);
      }).toThrow("Controller and Action already exist!");
    });
  });

  describe("#$storeContext", function(){
    it("should store the new context", function(){
      var manager, template, controller, action, executionUnit;

      manager = new stik.Manager();

      template      = '<div data-controller="ItemCtrl" data-action="detail"></div>';
      controller    = "ItemCtrl"
      action        = "detail"
      executionUnit = function(){};

      spyOn(manager, "$createContext").andReturn(1);

      manager.$storeContext(controller, action, template, executionUnit);

      expect(
        manager.$createContext
      ).toHaveBeenCalledWith(controller, action, template, executionUnit);

      expect(manager.$$contexts.length).toBe(1);
    });
  });

  describe("#$findTemplate", function(){
    it("should look for templates in the DOM based on the controller and action", function(){
      var DOM, manager, controller, action;

      DOM = DOMDouble();

      manager = new stik.Manager();

      controller = "ItemCtrl";
      action     = "detail";

      spyOn(DOM, "querySelectorAll").andReturn([1,2,3]);

      result = manager.$findTemplate(controller, action, DOM);

      expect(DOM.querySelectorAll).toHaveBeenCalledWith(
        "[data-controller=" + controller + "][data-action=" + action + "]"
      );

      expect(result).toEqual([1,2,3]);
    });
  });

  describe("#$buildContexts", function(){
    it("should not address any context if there is now execution unit available", function(){
      var manager = new stik.Manager();

      expect(function(){
        manager.$buildContexts();
      }).toThrow("no execution units available");
    });

    it("should throw if no templates were bound", function(){
      var manager = new stik.Manager();

      manager.$storeExecutionUnit("ItemCtrl", "detail", function(){});

      expect(function(){
        manager.$buildContexts("AppCtrl", "List", function(){});
      }).toThrow("no templates were bound");
    });

    it("should address the binding of one context", function(){
      var manager, controller, action, executionUnit;

      manager = new stik.Manager();

      controller    = "ItemCtrl";
      action        = "detail";
      executionUnit = function(){};

      manager.$storeExecutionUnit(controller, action, executionUnit);

      spyOn(manager, "$bindExecutionUnit").andReturn(true);

      manager.$buildContexts();

      expect(
        manager.$bindExecutionUnit
      ).toHaveBeenCalledWith(controller, action, executionUnit);
    });

    it("should address the binding of multiple contexts", function(){
      var manager, controller, detail, creation, update, executionUnit;

      controller    = "ItemCtrl";
      detail        = "detail";
      creation      = "creation";
      update        = "update";
      executionUnit = function(){};

      manager = new stik.Manager();

      manager.$storeExecutionUnit(controller, detail, executionUnit);
      manager.$storeExecutionUnit(controller, creation, executionUnit);
      manager.$storeExecutionUnit(controller, update, executionUnit);

      spyOn(manager, "$bindExecutionUnit").andReturn(true);

      manager.$buildContexts();

      expect(
        manager.$bindExecutionUnit.calls.length
      ).toEqual(3);

      expect(
        manager.$bindExecutionUnit
      ).toHaveBeenCalledWith(controller, detail, executionUnit);

      expect(
        manager.$bindExecutionUnit
      ).toHaveBeenCalledWith(controller, creation, executionUnit);

      expect(
        manager.$bindExecutionUnit
      ).toHaveBeenCalledWith(controller, update, executionUnit);
    });

    it("", function(){

    });
  });

  describe("#$bindExecutionUnit", function(){
    it("should create and store the new context", function(){
      var manager, template, controller, action, executionUnit, contextDouble;

      template      = '<div data-controller="ItemCtrl" data-action="detail"></div>';
      controller    = "ItemCtrl";
      action        = "detail";
      executionUnit = function(){};

      manager = new stik.Manager();

      contextDouble = jasmine.createSpyObj('contextDouble', ['$load']);

      spyOn(manager, "$findTemplate").andReturn([template]);
      spyOn(manager, "$createContext").andReturn(contextDouble);
      spyOn(manager, "$markAsBound");

      manager.$bindExecutionUnit(controller, action, executionUnit);

      expect(
        manager.$findTemplate
      ).toHaveBeenCalledWith(controller, action);

      expect(
        manager.$markAsBound
      ).toHaveBeenCalledWith(template);

      expect(
        manager.$createContext
      ).toHaveBeenCalledWith(controller, action, template, executionUnit);

      expect(manager.$$contexts.length).toEqual(1);

      expect(contextDouble.$load).toHaveBeenCalled();
    });

    it("should create and store contexts for multiple templates", function(){
      var manager, template1, template2, controller, action, executionUnit, contextDouble;

      template1  = '<div id="item-1" data-controller="ItemCtrl" data-action="detail"></div>';
      template2  = '<div id="item-2" data-controller="ItemCtrl" data-action="detail"></div>';
      controller = "ItemCtrl";
      action     = "detail";
      executionUnit = function(){};

      manager = new stik.Manager();

      contextDouble = jasmine.createSpyObj('contextDouble', ['$load']);

      spyOn(manager, "$findTemplate").andReturn([template1, template2]);
      spyOn(manager, "$createContext").andReturn(contextDouble);
      spyOn(manager, "$markAsBound");

      manager.$bindExecutionUnit(controller, action, executionUnit);

      expect(
        manager.$createContext
      ).toHaveBeenCalledWith(controller, action, template1, executionUnit);

      expect(
        manager.$createContext
      ).toHaveBeenCalledWith(controller, action, template2, executionUnit);

      expect(manager.$$contexts.length).toEqual(2);
    });

    it("should return false if no templates were bound", function(){
      var manager = new stik.Manager();

      spyOn(manager, "$findTemplate").andReturn([]);

      expect(
        manager.$bindExecutionUnit("AppCtrl", "List", function(){})
      ).toBeFalsy();
    });
  });

  describe("$markAsBound", function(){
    it("should flag it as bound", function(){
      var manager = new stik.Manager();

      var templateDouble = {className: ""};

      manager.$markAsBound(templateDouble);

      expect(templateDouble.className).toEqual(" stik-bound");
    });

    it("should not messup current classes", function(){
      var manager = new stik.Manager();

      var templateDouble = {className: "wierd-class"};

      manager.$markAsBound(templateDouble);

      expect(templateDouble.className).toEqual("wierd-class stik-bound");
    });
  });
});
