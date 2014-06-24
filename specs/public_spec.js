require("./spec_helper");

var stik = window.stik;

describe("Public", function(){
  describe(".controller", function(){
    it("with action", function(){
      var controller, action, executionUnit;

      controller    = "AppCtrl";
      action        = "Login";
      executionUnit = function(){};

      spyOn( stik.$$manager, "addControllerWithAction" );

      stik.controller( controller, action, executionUnit );

      expect(
        stik.$$manager.addControllerWithAction
      ).toHaveBeenCalledWith( controller, action, executionUnit );
    });

    it("without action", function(){
      var controller, executionUnit, ctrl;

      controller    = "AppCtrl";
      executionUnit = jasmine.createSpy("executionUnit");

      ctrl = stik.controller(controller, executionUnit);

      expect(
        executionUnit
      ).toHaveBeenCalledWith(ctrl);
    });
  });

  it(".behavior", function(){
    var name, executionUnit;

    name          = "some-behavior"
    executionUnit = function(){};

    spyOn( stik.$$manager, "addBehavior" );

    stik.behavior( name, executionUnit );

    expect(
      stik.$$manager.addBehavior
    ).toHaveBeenCalledWith( name, executionUnit );
  });

  describe(".bindLazy", function(){
    it("when ok", function(){
      spyOn( stik.$$manager, "applyBehaviors" ).andReturn( true );

      expect(function(){
        stik.bindLazy();
      }).not.toThrow();

      expect( stik.$$manager.applyBehaviors ).toHaveBeenCalled();
    });

    it("when no controllers were bound", function(){
      spyOn( stik.$$manager, "applyBehaviors").andReturn( true );

      expect(function(){
        stik.bindLazy()
      }).not.toThrow();
    });

    it("when no behaviors were bound", function(){
      spyOn(stik.$$manager, "bindActions").andReturn( true );
      spyOn(stik.$$manager, "applyBehaviors").andReturn( false );

      expect(function(){
        stik.bindLazy()
      }).not.toThrow();
    });

    it("when nothing was bound", function(){
      spyOn( stik.$$manager, "bindActions" ).andReturn( false );
      spyOn( stik.$$manager, "applyBehaviors" ).andReturn( false );

      expect(function(){
        stik.bindLazy()
      }).toThrow( "Stik: Nothing new to bind!" );
    });
  });

  it(".boundary", function(){
    var myBoundary = {
      as: "AwesomeFunc",
      from: "Controller",
      to: function(){},
      instiable: false,
      resolvable: false
    };

    spyOn( stik.$$manager, "addBoundary" );

    stik.boundary( myBoundary );

    expect(
      stik.$$manager.addBoundary
    ).toHaveBeenCalledWith( myBoundary );
  });
});
