describe("Injector", function(){
  function modulesDouble(){
    return {
      $template: window.stik.injectable(function(){}),
      $messaging: window.stik.injectable(function(){}),
      $viewBag: window.stik.injectable(function(){})
    };
  };

  it("should not allow empty execution units", function(){
    expect(function(){
      stik.injector({});
    }).toThrow("Stik: Injector needs a function to use as its execution unit");
  });

  describe("#resolveDependencies", function(){
    it("without params", function(){
      var subject, contextDouble, modules;

      contextDouble = function(){};
      modules = modulesDouble();

      subject = stik.injector({
        executionUnit: contextDouble,
        modules: modules
      });

      expect(
        subject.resolveDependencies()
      ).toEqual([]);
    });

    it("with a single param", function(){
      var subject, modules;

      modules = modulesDouble();

      subject = stik.injector({
        executionUnit: function($template){},
        modules: modules
      });

      expect(
        subject.resolveDependencies()
      ).toEqual([modules.$template.resolve()]);
    });

    it("with two params", function(){
      var subject, contextDouble, modules;

      contextDouble = function($template, $messaging){};
      modules = modulesDouble();

      subject = stik.injector({
        executionUnit: contextDouble,
        modules: modules
      });

      expect(
        subject.resolveDependencies()
      ).toEqual([
        modules.$template.resolve(),
        modules.$messaging.resolve()
      ]);
    });

    it("with three params", function(){
      var subject, contextDouble, modules;

      contextDouble = function($template, $messaging, $viewBag){};
      modules = modulesDouble();

      subject = stik.injector({
        executionUnit: contextDouble,
        modules: modules
      });

      expect(
        subject.resolveDependencies()
      ).toEqual([
        modules.$template.resolve(),
        modules.$messaging.resolve(),
        modules.$viewBag.resolve()
      ]);
    });
  });
});
