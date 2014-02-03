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

  describe("$load", function(){
    it("should run the execution unit it is bound to", function(){
      var template, modules, executionUnitDouble, injectedTemplate;

      injectedTemplate = false;

      template = document.createElement("div");

      executionUnitDouble = function($template){
        injectedTemplate = $template;
      };

      context = new stik.Context("AppCtrl", "list", template);

      context.$load(executionUnitDouble, modulesDouble());

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
