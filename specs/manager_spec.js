describe("Manager", function(){
  var subject;

  function DOMDouble(){
    return {
      querySelectorAll: function(){}
    };
  };

  beforeEach(function(){
    subject = new stik.Manager();
  });

  afterEach(function(){
    subject = null;
  });

  describe("#initialize", function(){
    it("when ok", function(){
      subject = new stik.Manager();

      expect(subject.$$contexts).toEqual([]);
      expect(subject.$$executionUnits).toEqual({});
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
        subject.$register("ItemCtrl", "detail");
      }).toThrow("execution unit is missing");
    });

    it("should register and bind the new execution unit", function(){
      var controller, action, executionUnit;

      controller    = "ItemCtrl"
      action        = "detail"
      executionUnit = function(){};

      spyOn(subject, "$storeExecutionUnit").andCallThrough();
      spyOn(subject, "$bindExecutionUnit");

      subject.$register(controller, action, executionUnit);

      expect(
        subject.$storeExecutionUnit
      ).toHaveBeenCalledWith(controller, action, executionUnit)

      expect(
        subject.$bindExecutionUnit
      ).toHaveBeenCalledWith(controller, action, executionUnit);
    });
  });

  describe("#$storeExecutionUnit", function(){
    it("should store the execution unit in its own namespace", function(){
      var controller, action, executionUnit;

      controller    = "ItemCtrl";
      action        = "detail";
      executionUnit = function(){};

      subject.$storeExecutionUnit(controller, action, executionUnit);

      expect(subject.$$executionUnits[controller]).toBeDefined();
      expect(subject.$$executionUnits[controller][action]).toBeDefined();
      expect(subject.$$executionUnits[controller][action]).toBe(executionUnit);
    });

    it("should throw if trying to store a controller and action twice", function(){
      var controller, action, executionUnit;

      controller    = "ItemCtrl"
      action        = "detail"
      executionUnit = function(){};

      subject.$storeExecutionUnit(controller, action, executionUnit);

      expect(function(){
        subject.$storeExecutionUnit(controller, action, executionUnit);
      }).toThrow("Controller and Action already exist!");
    });
  });

  describe("#$storeContext", function(){
    it("should store the new context", function(){
      var template, controller, action, executionUnit;

      template      = '<div data-controller="ItemCtrl" data-action="detail"></div>';
      controller    = "ItemCtrl"
      action        = "detail"
      executionUnit = function(){};

      spyOn(subject, "$createContext").andReturn(1);

      subject.$storeContext(controller, action, template, executionUnit);

      expect(
        subject.$createContext
      ).toHaveBeenCalledWith(controller, action, template, executionUnit);

      expect(subject.$$contexts.length).toBe(1);
    });
  });

  describe("#$findTemplate", function(){
    it("should look for templates in the DOM based on the controller and action", function(){
      var DOM, controller, action;

      DOM = DOMDouble();

      controller = "ItemCtrl";
      action     = "detail";

      spyOn(DOM, "querySelectorAll").andReturn([1,2,3]);

      result = subject.$findTemplate(controller, action, DOM);

      expect(DOM.querySelectorAll).toHaveBeenCalledWith(
        "[data-controller=" + controller + "][data-action=" + action + "]"
      );

      expect(result).toEqual([1,2,3]);
    });
  });

  describe("#$buildContexts", function(){
    it("should not address any context if there is now execution unit available", function(){
      expect(function(){
        subject.$buildContexts();
      }).toThrow("no execution units available");
    });

    it("should throw if no templates were bound", function(){
      subject.$storeExecutionUnit("ItemCtrl", "detail", function(){});

      expect(function(){
        subject.$buildContexts("AppCtrl", "List", function(){});
      }).toThrow("no templates were bound");
    });

    it("should address the binding of one context", function(){
      var controller, action, executionUnit;

      controller    = "ItemCtrl";
      action        = "detail";
      executionUnit = function(){};

      subject.$storeExecutionUnit(controller, action, executionUnit);

      spyOn(subject, "$bindExecutionUnit").andReturn(true);

      subject.$buildContexts();

      expect(
        subject.$bindExecutionUnit
      ).toHaveBeenCalledWith(controller, action, executionUnit);
    });

    it("should address the binding of multiple contexts", function(){
      var controller, detail, creation, update, executionUnit;

      controller    = "ItemCtrl";
      detail        = "detail";
      creation      = "creation";
      update        = "update";
      executionUnit = function(){};

      subject.$storeExecutionUnit(controller, detail, executionUnit);
      subject.$storeExecutionUnit(controller, creation, executionUnit);
      subject.$storeExecutionUnit(controller, update, executionUnit);

      spyOn(subject, "$bindExecutionUnit").andReturn(true);

      subject.$buildContexts();

      expect(
        subject.$bindExecutionUnit.calls.length
      ).toEqual(3);

      expect(
        subject.$bindExecutionUnit
      ).toHaveBeenCalledWith(controller, detail, executionUnit);

      expect(
        subject.$bindExecutionUnit
      ).toHaveBeenCalledWith(controller, creation, executionUnit);

      expect(
        subject.$bindExecutionUnit
      ).toHaveBeenCalledWith(controller, update, executionUnit);
    });
  });

  describe("#$bindExecutionUnit", function(){
    it("should create and store the new context", function(){
      var template, controller, action, executionUnit, contextDouble;

      template      = '<div data-controller="ItemCtrl" data-action="detail"></div>';
      controller    = "ItemCtrl";
      action        = "detail";
      executionUnit = function(){};

      contextDouble = jasmine.createSpyObj('contextDouble', ['$load']);

      spyOn(subject, "$findTemplate").andReturn([template]);
      spyOn(subject, "$createContext").andReturn(contextDouble);
      spyOn(subject, "$markAsBound");

      subject.$bindExecutionUnit(controller, action, executionUnit);

      expect(
        subject.$findTemplate
      ).toHaveBeenCalledWith(controller, action);

      expect(
        subject.$markAsBound
      ).toHaveBeenCalledWith(template);

      expect(
        subject.$createContext
      ).toHaveBeenCalledWith(controller, action, template, executionUnit);

      expect(subject.$$contexts.length).toEqual(1);

      expect(contextDouble.$load).toHaveBeenCalled();
    });

    it("should create and store contexts for multiple templates", function(){
      var template1, template2, controller, action, executionUnit, contextDouble;

      template1  = '<div id="item-1" data-controller="ItemCtrl" data-action="detail"></div>';
      template2  = '<div id="item-2" data-controller="ItemCtrl" data-action="detail"></div>';
      controller = "ItemCtrl";
      action     = "detail";
      executionUnit = function(){};

      contextDouble = jasmine.createSpyObj('contextDouble', ['$load']);

      spyOn(subject, "$findTemplate").andReturn([template1, template2]);
      spyOn(subject, "$createContext").andReturn(contextDouble);
      spyOn(subject, "$markAsBound");

      subject.$bindExecutionUnit(controller, action, executionUnit);

      expect(
        subject.$createContext
      ).toHaveBeenCalledWith(controller, action, template1, executionUnit);

      expect(
        subject.$createContext
      ).toHaveBeenCalledWith(controller, action, template2, executionUnit);

      expect(subject.$$contexts.length).toEqual(2);
    });

    it("should return false if no templates were bound", function(){
      spyOn(subject, "$findTemplate").andReturn([]);

      expect(
        subject.$bindExecutionUnit("AppCtrl", "List", function(){})
      ).toBeFalsy();
    });
  });

  describe("$markAsBound", function(){
    it("should flag it as bound", function(){
      var templateDouble = {className: ""};

      subject.$markAsBound(templateDouble);

      expect(templateDouble.className).toEqual(" stik-bound");
    });

    it("should not messup current classes", function(){
      var templateDouble = {className: "wierd-class"};

      subject.$markAsBound(templateDouble);

      expect(templateDouble.className).toEqual("wierd-class stik-bound");
    });
  });
});
