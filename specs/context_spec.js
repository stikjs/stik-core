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
        new stik.Context("AppCtrl", "list", "<br>");
      }).toThrow("execution unit is missing");
    });
  });

  describe("$load", function(){
    it("should run the execution unit it is bound to", function(){
      var template, modules, executionUnitDouble, injectedTemplate;

      injectedTemplate = false;

      template = document.createElement("div");

      executionUnitDouble = function($template){
        injectedTemplate = $template;
      };

      context = new stik.Context("AppCtrl", "list", template, executionUnitDouble);

      context.$load(modulesDouble());

      expect(injectedTemplate).toEqual(template);
      expect(template.className).toEqual("stik-bound");
    });
  });

  describe("$markAsBound", function(){
    it("being to only class", function(){
      var context, template, attribute;

      template = document.createElement("div");

      context = new stik.Context("AppCtrl", "List", template, function(){});

      context.$markAsBound();

      expect(template.className).toEqual("stik-bound");
    });

    it("having another class in the template", function(){
      var context, template, attribute;

      template = document.createElement("div");
      template.className += "wierd-class"

      context = new stik.Context("AppCtrl", "List", template, function(){});

      context.$markAsBound();

      expect(template.className).toEqual("wierd-class stik-bound");
    });
  });
});
