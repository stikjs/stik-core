describe("Manager", function(){
  function DOMDouble(){
    return {
      querySelectorAll: function(){}
    };
  };

  describe("#$addControllerWithAction", function(){
    it("should throw if any parameters is empty or missing", function(){
      var manager = stik.manager();

      expect(function(){
        manager.addControllerWithAction( "", "detail", function(){} );
      }).toThrow( "Stik: Controller needs a name" );

      expect(function(){
        manager.addControllerWithAction( "ItemCtrl", "", function(){} );
      }).toThrow( "Stik: Action name can't be empty" );

      expect(function(){
        manager.addControllerWithAction( "ItemCtrl", "detail" );
      }).toThrow( "Stik: Action needs a function to use as its execution unit" );
    });

    it("should register and bind the new execution unit", function(){
      var manager = stik.manager();

      expect(
        manager.addControllerWithAction(
          "ItemCtrl", "detail", function(){}
        )
      ).not.toBeUndefined();
    });
  });

  describe("#addBoundary", function(){
    it("when not ok", function(){
      var manager = stik.manager();

      expect(function(){
        manager.addBoundary({
          as: "CustomObj",
          from: "different",
          to: {}
        });
      }).toThrow( "Stik: Invalid boundary 'from' specified. Please use 'controller' or 'behavior' or leave it blank to default to both" );

      expect(function(){
        manager.addBoundary({
          as: "with space",
          from: "controller",
          to: {}
        });
      }).toThrow( "Stik: 'with space' is not a valid Boundary name. Please replace empty spaces with dashes ('-')" );

      expect(function(){
        manager.addBoundary({
          as: "CustomObj",
          from: "controller",
          to: null
        });
      }).toThrow( "Stik: Boundary needs an object or function as 'to'" );
    });

    it("should default to both controller and behavior", function(){
      var manager = stik.manager(),
          customFunc = jasmine.createSpy( "customFunc" );

      manager.addBoundary({
        as: "customFunc",
        callable: true,
        to: customFunc
      });

      manager.addController( 'some-controller', function(customObj){} );
      manager.addBehavior( 'some-behavior', function(customObj){} );

      manager.bindActions();

      expect( customObjMock.calls ).toEqual( 2 );
    });

    it("should create a new controller boundary", function(){
      var manager = stik.manager();

      manager.addBoundary({
        as: "CustomObj",
        from: "controller",
        to: function(){}
      });

      expect(
        manager.boundaries.controller["CustomObj"]
      ).toBeDefined();
    });

    it("should be injectable into behaviors", function(){
      var manager, executionUnit, injectable, template, result, behavior;

      manager = stik.manager();

      injectable = function(){};
      manager.addBoundary({
        as: "CustomFunc",
        from: "behavior",
        to: injectable
      });

      behavior = manager.addBehavior( "new-behavior", function( CustomFunc ){
        result = CustomFunc;
      });

      template = document.createElement("div");
      spyOn(behavior, "findTemplates").andReturn([template]);

      manager.applyBehaviors();

      expect(result).toEqual(injectable);
    });

    it("should be injectable into an action", function(){
      var manager, injectable, elm, template, result, ctrl;

      manager = stik.manager();

      injectable = {};
      manager.addBoundary({
        as: "CustomObj",
        from: "controller",
        to: injectable
      });

      template = 'div';

      ctrl = manager.addControllerWithAction("AppCtrl", "List", function(CustomObj){
        result = CustomObj;
      });

      spyOn(
         ctrl.actions["List"], "findTemplates"
      ).andReturn([template]);

      manager.$bindActions();

      expect(result).toEqual(injectable);
    });
  });

  describe("#addBehavior", function(){
    it("should throw if trying to add a behavior with an existing name", function(){
      var manager = stik.manager(),
          name = "some-behavior";

      spyOn( manager, "applyBehavior" );

      manager.addBehavior( name, function(){} );

      expect(function(){
        manager.addBehavior( name, function(){} );
      }).toThrow( "Stik: Another behavior already exist with name 'some-behavior'" );
    });

    it("should be able to inject the new store the new behavior", function(){
      var manager = stik.manager(),
          behavior = "some-behavior",
          executionUnit;

      executionUnit = function(){};

      spyOn( manager, "applyBehavior" );

      manager.addBehavior( behavior, executionUnit );

      expect( behavior.behaviors.length ).toBe( 1 );
    });
  });

  describe("#applyBehaviors", function(){
    it("without behaviors", function(){
      var manager = stik.manager();

      spyOn( manager, "applyBehavior" );

      expect( manager.applyBehaviors() ).toBeFalsy();
    });

    it("with one behavior", function(){
      var manager = stik.manager(),
          behavior;

      spyOn( manager, "applyBehavior" ).andReturn( true );

      behavior = manager.addBehavior(
        "some-behavior", function(){}
      );

      expect( manager.applyBehaviors() ).toBeTruthy();
      expect(
        manager.$applyBehavior
      ).toHaveBeenCalledWith( behavior );
    });

    it("with many behaviors", function(){
      var manager, behavior;

      manager = stik.manager();
      spyOn( manager, "applyBehavior" ).andReturn( true );

      behavior1 = manager.addBehavior(
        "some-behavior-1", function(){}
      );
      behavior2 = manager.addBehavior(
        "some-behavior-2", function(){}
      );
      behavior3 = manager.addBehavior(
        "some-behavior-3", function(){}
      );

      expect(manager.applyBehaviors()).toBeTruthy();
      expect(
        manager.applyBehavior
      ).toHaveBeenCalledWith(behavior1);
      expect(
        manager.applyBehavior
      ).toHaveBeenCalledWith(behavior2);
      expect(
        manager.applyBehavior
      ).toHaveBeenCalledWith(behavior3);
    });
  });
});
