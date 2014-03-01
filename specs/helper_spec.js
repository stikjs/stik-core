describe("helper", function(){
  it("initializing", function(){
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

    stik.helper("hasClass", function(){
      return helperDouble;
    });

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

    stik.helper("hasClass", function(){
      return helperDouble;
    });

    ctrl = stik.controller("AppCtrl", "List", function($h){
      $h.hasClass();
    });

    template = document.createElement("div");
    spyOn(ctrl.$$actions.List, "$findTemplates").andReturn([template]);
    stik.bindLazy();

    expect(helperDouble).toHaveBeenCalled();
  });

  it("should allow injection of other helpers in itself", function(){
    var template, hasClassCheck, toggleClassCheck;

    hasClassCheck = jasmine.createSpy('hasClassCheck');
    toggleClassCheck = jasmine.createSpy('toggleClassCheck');

    stik.helper("hasClass", function(){
      return hasClassCheck;
    });
    stik.helper("toggleClass", function(hasClass){
      return function(elm, className){
        hasClass(elm, className);
        toggleClassCheck(elm, className);
      };
    });

    template = document.createElement("div");
    spyOn(stik.$$manager, "$findBehaviorTemplates").andReturn([template]);

    stik.behavior("my-behavior", function($template, $h){
      $h.toggleClass($template, 'some-class');
      $h.hasClass($template, 'some-class');
    });

    expect(
      hasClassCheck
    ).toHaveBeenCalledWith(
      jasmine.any(Object), jasmine.any(String)
    );

    expect(
      toggleClassCheck
    ).toHaveBeenCalledWith(
      jasmine.any(Object), jasmine.any(String)
    );
  });
});
