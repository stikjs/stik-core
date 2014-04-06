describe("helper", function(){
  it("initializing", function(){
    expect(function(){
      stik.helper();
    }).toThrow("Stik: Helper needs a name");

    expect(function(){
      stik.helper("myHelper");
    }).toThrow("Stik: Helper needs a function");

    expect(function(){
      stik.helper("myHelper", {});
    }).toThrow("Stik: Helper needs a function");

    expect(function(){
      stik.helper("myHelper", function(){});
    }).not.toThrow();
  });

  it("should be injectable into behaviors", function(){
    var helperDouble, template, behavior;

    helperDouble = jasmine.createSpy("hasClassName");

    stik.helper("hasClassName", function(){
      return helperDouble;
    });

    template = document.createElement("div");

    behavior = stik.behavior("some-behavior", function($h){
      $h.hasClassName();
    });
    spyOn(behavior, "findTemplates").andReturn([template]);

    stik.bindLazy();

    expect(helperDouble).toHaveBeenCalled();
  });

  it("should be injectable into controllers", function(){
    var helperDouble, template, ctrl;

    helperDouble = jasmine.createSpy("hasClassName");

    stik.helper("hasClassName", function(){
      return helperDouble;
    });

    ctrl = stik.controller("AppCtrl", "List", function($h){
      $h.hasClassName();
    });

    template = document.createElement("div");
    spyOn(ctrl.actions.List, "findTemplates").andReturn([template]);
    stik.bindLazy();

    expect(helperDouble).toHaveBeenCalled();
  });

  it("should allow injection of other helpers in itself", function(){
    var template, hasClassCheck, toggleClassCheck, behavior;

    hasClassCheck = jasmine.createSpy('hasClassCheck');
    toggleClassCheck = jasmine.createSpy('toggleClassCheck');

    stik.helper("hasClassName", function(){
      return hasClassCheck;
    });
    stik.helper("toggleClassName", function(hasClassName){
      return function(elm, className){
        hasClassName(elm, className);
        toggleClassCheck(elm, className);
      };
    });

    template = document.createElement("div");

    behavior = stik.behavior("my-behavior", function($template, $h){
      $h.toggleClassName($template, 'some-class');
      $h.hasClassName($template, 'some-class');
    });

    spyOn(behavior, "findTemplates").andReturn([template]);

    stik.bindLazy();

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
