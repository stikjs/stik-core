describe("helper", function(){
  describe("initializing", function(){
    expect(function(){
      stik.helper();
    }).toThrow("Stik helper needs a name");

    expect(function(){
      stik.helper("myHelper");
    }).toThrow("Stik helper needs a function");

    expect(function(){
      stik.helper("myHelper", {});
    }).toThrow("Stik helper needs a function");

    expect(function(){
      stik.helper("myHelper", function(){});
    }).not.toThrow();
  });

  it("should be injected in a behavior", function(){
    var helperDouble, template;

    helperDouble = jasmine.createSpy("hasClass");

    stik.helper("hasClass", helperDouble);

    template = document.createElement("div");
    spyOn(stik.$$manager, "$findBehaviorTemplates").andReturn([template]);

    stik.behavior("some-behavior", function($h){
      $h.hasClass();
    });

    expect(helperDouble).toHaveBeenCalled();
  });

  it("should be injected in a controller", function(){
    var helperDouble, template, ctrl;

    helperDouble = jasmine.createSpy("hasClass");

    stik.helper("hasClass", helperDouble);

    ctrl = stik.controller("AppCtrl", "List", function($h){
      $h.hasClass();
    });

    template = document.createElement("div");
    spyOn(ctrl.$$actions.List, "$findTemplates").andReturn([template]);
    stik.bindLazy();

    expect(helperDouble).toHaveBeenCalled();
  });
});
