require("./spec_helper");

var stik = window.stik;

describe("Behavior", function(){
  it("#initializing", function(){
    expect(function(){
      stik.createBehavior({
        name: null, executionUnit: function(){}
      });
    }).toThrow( "Stik: Behavior name is missing" );
    expect(function(){
      stik.createBehavior({
        name: "some-behavior"
      });
    }).toThrow( "Stik: Behavior needs a function to use as its execution unit" );
    expect(function(){
      stik.createBehavior({
        name: "some behavior"
      });
    }).toThrow( "Stik: 'some behavior' is not a valid Behavior name. Please replace empty spaces with dashes ('-')" );
  });

  describe("#load", function(){
    it("should run its execution unit", function(){
      var template, modules, executionUnitMock;

      executionUnitMock = jasmine.createSpy('EUM');

      template = document.createElement("div");
      template.className += "some-behavior";

      behavior = stik.createBehavior({
        name: "some-behavior",
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

      template = document.createElement( "div" );
      template.className += "some-behavior";

      behavior = stik.createBehavior({
        name: "some-behavior",
        executionUnit: function(){}
      });

      spyOn( behavior, "findTemplates" ).andReturn( [ template ] );

      behavior.bind( template, {} );

      expect(
        template.getAttribute( "data-behaviors" )
      ).toEqual( "some-behavior" );

      expect( template.className ).toEqual( "" );
    });

    it("with two behavior", function(){
      var behavior, template;

      template = document.createElement( "div" );
      template.setAttribute( "data-behaviors", "old-behavior" );

      behavior = stik.createBehavior({
        name: "some-behavior",
        executionUnit: function(){}
      });

      spyOn( behavior, "findTemplates" ).andReturn( [ template ] );

      behavior.bind( template, {} );

      expect(
        template.getAttribute( "data-behaviors" )
      ).toEqual(
        "old-behavior some-behavior"
      );
    });

    it("with three behavior", function(){
      var behavior, template;

      template = document.createElement( "div" );
      template.setAttribute( "data-behaviors", "old-behavior wierd-behavior" );

      behavior = stik.createBehavior({
        name: "some-behavior",
        executionUnit: function(){}
      });

      spyOn( behavior, "findTemplates" ).andReturn( [ template ] );

      behavior.bind( template, {} );

      expect(
        template.getAttribute( "data-behaviors" )
      ).toEqual(
        "old-behavior wierd-behavior some-behavior"
      );
    });
  });
});
