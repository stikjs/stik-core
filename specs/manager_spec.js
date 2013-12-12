var subject;

function DOMDouble(){
  return {
    querySelectorAll: function(){}
  };
};

describe("Manager", function(){
  var count = 0;

  beforeEach(function(){
    subject = new slik.Manager();
  });

  afterEach(function(){
    subject = null;
  });

  describe("#initialize", function(){
    it("when ok", function(){
      subject = new slik.Manager();

      expect(subject.contexts).toEqual([]);
    });
  });

  describe("#register", function(){
    it("should throw if execution unit is missing", function(){
      spyOn(subject, "$findTemplate").andReturn([]);

      expect(function(){
        subject.register("ItemCtrl", "detail");
      }).toThrow("execution unit is missing");
    });

    it("should register the new context", function(){
      var template    = '<div data-controller="ItemCtrl" data-action="detail"></div>';
      var controller  = "ItemCtrl"
      var action      = "detail"

      spyOn(subject, "$findTemplate").andReturn([template]);
      spyOn(subject, "$storeContext");

      subject.register(controller, action, function(){});

      expect(
        subject.$findTemplate
      ).toHaveBeenCalledWith(controller, action);

      expect(
        subject.$storeContext.calls.length
      ).toEqual(1);
    });

    it("should register the new context for multiple templates", function(){
      var template1    = '<div id="item-1" data-controller="ItemCtrl" data-action="detail"></div>';
      var template2    = '<div id="item-2" data-controller="ItemCtrl" data-action="detail"></div>';
      var controller  = "ItemCtrl"
      var action      = "detail"

      spyOn(subject, "$findTemplate").andReturn([template1, template2]);
      spyOn(subject, "$storeContext");

      subject.register(controller, action, function(){});

      expect(
        subject.$storeContext.calls.length
      ).toEqual(2);

      expect(
        subject.$storeContext
      ).toHaveBeenCalledWith(controller, action, template1);

      expect(
        subject.$storeContext
      ).toHaveBeenCalledWith(controller, action, template2);
    });
  });

  describe("#$storeContext", function(){
    it("should store the new context", function(){
      var template    = '<div data-controller="ItemCtrl" data-action="detail"></div>';
      var controller  = "ItemCtrl"
      var action      = "detail"

      spyOn(subject, "$createContext").andReturn(1);

      subject.$storeContext(controller, action, template);

      expect(
        subject.$createContext
      ).toHaveBeenCalledWith(controller, action, template);

      expect(subject.contexts.length).toBe(1);
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
});
