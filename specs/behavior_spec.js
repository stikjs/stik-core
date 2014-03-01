describe("Behavior", function(){
  it("#initializing", function(){
    expect(function(){
      stik.createBehavior({
        name: null, executionUnit: function(){}
      });
    }).toThrow("name is missing");
    expect(function(){
      stik.createBehavior({
        name: "some-behavior"
      });
    }).toThrow("executionUnit is missing");
    expect(function(){
      stik.createBehavior({
        name: "some behavior"
      });
    }).toThrow("invalid name. Please use dash(-) instead of spaces");
  });

  describe("#load", function(){
    it("should run its execution unit", function(){
      var template, modules, executionUnitMock;

      executionUnitMock = jasmine.createSpy('EUM');

      template = document.createElement("div");
      template.className += "some-behavior";

      behavior = stik.createBehavior({
        name: 'some-behavior',
        executionUnit: executionUnitMock
      });

      spyOn(behavior, "findTemplates").andReturn([template]);

      behavior.bind({});

      expect(executionUnitMock).toHaveBeenCalled();
    });
  });

  describe("should mark the template as applyed", function(){
    it("with one template", function(){
      var behavior, template;

      template = document.createElement("div");
      template.className += "some-behavior";

      behavior = stik.createBehavior({
        name: "some-behavior",
        executionUnit: function(){}
      });

      spyOn(behavior, "findTemplates").andReturn([template]);

      behavior.bind(template, {});

      expect(
        template.getAttribute("data-behaviors")
      ).toEqual('some-behavior');
    });

    it("with two behavior", function(){
      var behavior, template;

      template = document.createElement("div");
      template.setAttribute("data-behaviors", "old-behavior");

      behavior = stik.createBehavior({
        name: "some-behavior",
        executionUnit: function(){}
      });

      spyOn(behavior, "findTemplates").andReturn([template]);

      behavior.bind(template, {});

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

      behavior = stik.createBehavior({
        name: "some-behavior",
        executionUnit: function(){}
      });

      spyOn(behavior, "findTemplates").andReturn([template]);

      behavior.bind(template, {});

      expect(
        template.getAttribute("data-behaviors")
      ).toEqual(
        "old-behavior wierd-behavior some-behavior"
      );
    });
  });
});
