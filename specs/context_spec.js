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

  describe("#load", function(){
    it("should run the execution unit it is bound to", function(){
      var template, modules, executionUnitDouble, injectedTemplate;

      injectedTemplate = false;

      template = document.createElement("div");

      executionUnitDouble = function($template){
        injectedTemplate = $template;
      };

      context = stik.context({
        controller: "AppCtrl",
        action: "list",
        template: template
      });

      context.load(executionUnitDouble, modulesDouble());

      expect(injectedTemplate).toEqual(template);
      expect(template.className).toEqual("stik-bound");
    });
  });
});
