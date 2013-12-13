var subject;

function DOMDouble(){
  return {
    querySelectorAll: function(){}
  };
};

describe("Manager", function(){
  var count = 0;

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
    it("should throw if execution unit is missing", function(){
      spyOn(subject, "$findTemplate").andReturn([]);

      expect(function(){
        subject.$register("ItemCtrl", "detail");
      }).toThrow("execution unit is missing");
    });

    it("should register the new execution unit", function(){
      var controller    = "ItemCtrl"
      var action        = "detail"
      var executionUnit = function(){};

      spyOn(subject, "$storeExecutionUnit");

      subject.$register(controller, action, executionUnit);

      expect(
        subject.$storeExecutionUnit
      ).toHaveBeenCalledWith(controller, action, executionUnit)
    });

    it("should register the new context for multiple templates", function(){
      var controller    = "ItemCtrl"
      var action        = "detail"
      var executionUnit = function(){};

      spyOn(subject, "$storeExecutionUnit");

      subject.$register(controller, action, executionUnit);

      expect(
        subject.$storeExecutionUnit
      ).toHaveBeenCalledWith(controller, action, executionUnit);
    });
  });

  describe("#$storeExecutionUnit", function(){
    it("should store the execution unit in its own namespace", function(){
      var controller    = "ItemCtrl";
      var action        = "detail";
      var executionUnit = function(){};

      subject.$storeExecutionUnit(controller, action, executionUnit);

      expect(subject.$$executionUnits[controller]).toBeDefined();
      expect(subject.$$executionUnits[controller][action]).toBeDefined();
      expect(subject.$$executionUnits[controller][action]).toBe(executionUnit);
    });
  });

  describe("#$storeContext", function(){
    it("should store the new context", function(){
      var template      = '<div data-controller="ItemCtrl" data-action="detail"></div>';
      var controller    = "ItemCtrl"
      var action        = "detail"
      var executionUnit = function(){};

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
      DOM = DOMDouble();

      var controller  = "ItemCtrl";
      var action      = "detail";

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

    it("should address the binding of one context", function(){
      var controller    = "ItemCtrl";
      var action        = "detail";
      var executionUnit = function(){};

      subject.$storeExecutionUnit(controller, action, executionUnit);

      spyOn(subject, "$bindExecutionUnit");

      subject.$buildContexts();

      expect(
        subject.$bindExecutionUnit
      ).toHaveBeenCalledWith(controller, action, executionUnit);
    });

    it("should address the binding of multiple contexts", function(){
      var controller    = "ItemCtrl";
      var detail        = "detail";
      var creation      = "creation";
      var update        = "update";
      var executionUnit = function(){};

      subject.$storeExecutionUnit(controller, detail, executionUnit);
      subject.$storeExecutionUnit(controller, creation, executionUnit);
      subject.$storeExecutionUnit(controller, update, executionUnit);

      spyOn(subject, "$bindExecutionUnit");

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
      var template      = '<div data-controller="ItemCtrl" data-action="detail"></div>';
      var controller    = "ItemCtrl";
      var action        = "detail";
      var executionUnit = function(){};

      contextDouble = jasmine.createSpyObj('contextDouble', ['$load']);

      spyOn(subject, "$findTemplate").andReturn([template]);
      spyOn(subject, "$createContext").andReturn(contextDouble);

      subject.$bindExecutionUnit(controller, action, executionUnit);

      expect(
        subject.$findTemplate
      ).toHaveBeenCalledWith(controller, action);

      expect(
        subject.$createContext
      ).toHaveBeenCalledWith(controller, action, template, executionUnit);

      expect(subject.$$contexts.length).toEqual(1);

      expect(contextDouble.$load).toHaveBeenCalled();
    });

    it("should create and store contexts for multiple templates", function(){
      var template1  = '<div id="item-1" data-controller="ItemCtrl" data-action="detail"></div>';
      var template2  = '<div id="item-2" data-controller="ItemCtrl" data-action="detail"></div>';
      var controller = "ItemCtrl";
      var action     = "detail";
      var executionUnit = function(){};

      contextDouble = jasmine.createSpyObj('contextDouble', ['$load']);

      spyOn(subject, "$findTemplate").andReturn([template1, template2]);
      spyOn(subject, "$createContext").andReturn(contextDouble);

      subject.$bindExecutionUnit(controller, action, executionUnit);

      expect(
        subject.$createContext
      ).toHaveBeenCalledWith(controller, action, template1, executionUnit);

      expect(
        subject.$createContext
      ).toHaveBeenCalledWith(controller, action, template2, executionUnit);

      expect(subject.$$contexts.length).toEqual(2);
    });
  });
});
