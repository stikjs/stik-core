describe("Context", function(){
  var subject, elmDouble;

  function setupElmDouble(){
    return {
      getAttribute: function(){},
    };
  };

  function modulesDouble(){
    return {
      $template: function(){},
      $messaging: function(){},
      $courier: function(){}
    };
  };

  beforeEach(function(){
    elmDouble = setupElmDouble();
  });

  afterEach(function(){
    subject = null;
    elmDouble = null;
  });

  describe("#initialize", function(){
    it("when ok", function(){
      spyOn(elmDouble, 'getAttribute').andReturn('AppCtrl');

      var executionUnitDouble = function(){};

      subject = new stik.Context('AppCtrl', 'list', elmDouble, executionUnitDouble);

      expect(subject.$$controller).toEqual('AppCtrl');
      expect(subject.$$action).toEqual('list');
      expect(subject.$$template).toBe(elmDouble);
      expect(subject.$$executionUnit).toBe(executionUnitDouble);
    });

    it("should throw if controller is missing", function(){
      expect(function(){
        new stik.Context(null, 'application');
      }).toThrow("controller is missing");
    });

    it("should throw if action is missing", function(){
      expect(function(){
        new stik.Context('AppCtrl');
      }).toThrow("action is missing");
    });

    it("should throw if template is missing", function(){
      expect(function(){
        new stik.Context('AppCtrl', 'list');
      }).toThrow("template is missing");
    });

    it("should throw if execution unit is missing", function(){
      expect(function(){
        new stik.Context('AppCtrl', 'list', '<br>');
      }).toThrow("execution unit is missing");
    });
  });

  describe("$load", function(){
    var injectedTemplate = false;

    afterEach(function(){
      injectedTemplate = false;
    });

    it("should run the execution unit it is bound to", function(){
      var template, modules, executionUnitDouble;

      template = '<div data-controller="ItemCtrl" data-action="detail"></div>';

      executionUnitDouble = function($template){
        injectedTemplate = $template;
      };

      context = new stik.Context('AppCtrl', 'list', template, executionUnitDouble);

      spyOn(context, "$markAsBound");

      context.$load(modulesDouble());

      expect(injectedTemplate).toEqual(template);
      expect(context.$markAsBound).toHaveBeenCalled();
    });
  });

  describe("#$mergeModules", function(){
    it("should attach the context and template", function(){
      var context, template, modules, expectedModules = {};

      template = '<div data-controller="ItemCtrl" data-action="detail"></div>';

      modules = modulesDouble();

      context = new stik.Context('AppCtrl', 'list', template, function(){});

      expectedModules.$template  = modules.$template,
      expectedModules.$messaging = modules.$messaging,
      expectedModules.$courier   = modules.$courier,
      expectedModules.$viewBag   = context.$$viewBag,
      expectedModules.$context   = context;
      expectedModules.$template  = template;

      expect(
        context.$mergeModules(modules)
      ).toEqual(
        expectedModules
      );
    });
  });

  describe("$markAsBound", function(){
    it("should flag the template as bound", function(){
      var context, template, attribute;

      template = document.createElement("div");

      context = new stik.Context("AppCtrl", "List", template, function(){});

      context.$markAsBound();

      expect(template.className).toEqual(" stik-bound");
    });

    it("should not messup current classes", function(){
      var context, template, attribute;

      template = document.createElement("div");
      template.className += "wierd-class"

      context = new stik.Context("AppCtrl", "List", template, function(){});

      context.$markAsBound();

      expect(template.className).toEqual("wierd-class stik-bound");
    });
  });
});
