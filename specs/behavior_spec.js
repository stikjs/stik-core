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
      spyOn(behavior, "$markAsApplyed");

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

      template = document.createElement("div");
      template.className += "some-behavior";

      behavior = new stik.Behavior("some-behavior", function(){});

      spyOn(behavior, "$markAsApplyed");

      behavior.$load(template, {});

      expect(
        behavior.$markAsApplyed
      ).toHaveBeenCalledWith(template);
    });

    it("should run its execution unit", function(){
      var template, modules, executionUnitDouble, injectedTemplate;

      executionUnitDouble = function($template){
        injectedTemplate = $template;
      };

      template = document.createElement("div");
      template.className += "some-behavior";

      subject = new stik.Behavior('some-behavior', executionUnitDouble);
      subject.$load(template, {});

      expect(injectedTemplate).toEqual(template);
    });
  });

  describe("#$markAsApplyed", function(){
    it("with one behavior", function(){
      var behavior, template;

      template = document.createElement("div");

      behavior = new stik.Behavior("some-behavior", function(){});

      behavior.$markAsApplyed(template);

      expect(
        template.getAttribute("data-behaviors")
      ).toEqual(
        "some-behavior"
      );
    });

    it("with two behavior", function(){
      var behavior, template;

      template = document.createElement("div");
      template.setAttribute("data-behaviors", "old-behavior");

      behavior = new stik.Behavior("some-behavior", function(){});

      behavior.$markAsApplyed(template);

      expect(
        template.getAttribute("data-behaviors")
      ).toEqual(
        "old-behavior some-behavior"
      );
    });

    it("with three behavior", function(){
      var behavior, template;

      template = document.createElement("div");
      template.setAttribute("data-behaviors", "old-behavior wierd-behavior");

      behavior = new stik.Behavior("some-behavior", function(){});

      behavior.$markAsApplyed(template);

      expect(
        template.getAttribute("data-behaviors")
      ).toEqual(
        "old-behavior wierd-behavior some-behavior"
      );
    });
  });
});
