describe("Behavior", function(){
  describe("#initialize", function(){
    it("when ok", function(){
      var behavior, name, executionUnit;

      name          = "some-behavior";
      executionUnit = function(){};

      behavior = new stik.Behavior(name, executionUnit);

      expect(behavior.$$name).toEqual(name);
      expect(behavior.$$executionUnit).toEqual(executionUnit);
    });

    it("when not ok", function(){
      expect(function(){
        new stik.Behavior(null, function(){});
      }).toThrow("name is missing");
      expect(function(){
        new stik.Behavior("some-behavior");
      }).toThrow("executionUnit is missing");
    });
  });

  describe("#$load", function(){
    it("should resolve its own dependencies", function(){
      var behavior, modules;

      modules = {
        $some: "$module"
      };

      behavior = new stik.Behavior("some-behavior", function(){});

      spyOn(behavior, "$resolveDependencies");

      behavior.$load("div", modules);

      expect(
        behavior.$resolveDependencies
      ).toHaveBeenCalledWith({
        $some: "$module",
        $template: "div"
      });
    });

    it("should mark the template as applyed", function(){
      var behavior, template;

      template = "div"

      behavior = new stik.Behavior("some-behavior", function(){});

      spyOn(behavior, "$markAsApplyed");

      behavior.$load(template, {});

      expect(
        behavior.$markAsApplyed
      ).toHaveBeenCalledWith(template);
    });

    it("should run its execution unit", function(){
      var template, modules, executionUnitDouble, injectedTemplate;

      template = document.createElement("div");
      template.className += "some-behavior";

      executionUnitDouble = function($template){
        injectedTemplate = $template;
      };

      subject = new stik.Behavior('some-behavior', executionUnitDouble);
      subject.$load(template, {});

      expect(
        template.className
      ).toEqual(
        "some-behavior some-behavior-applyed"
      );
      expect(injectedTemplate).toEqual(template);
    });
  });
});
