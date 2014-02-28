describe("Injector", function(){
  function modulesDouble(){
    return {
      $template: new window.stik.Injectable(function(){}),
      $messaging: new window.stik.Injectable(function(){}),
      $viewBag: new window.stik.Injectable(function(){})
    };
  };

  describe("#$resolveDependencies", function(){
    it("without params", function(){
      var subject, contextDouble, modules;

      contextDouble = function(){};
      modules = modulesDouble();

      subject = new stik.Injector(contextDouble, modules);

      expect(
        subject.$resolveDependencies()
      ).toEqual([]);
    });

    it("with a single param", function(){
      var subject, modules;

      modules = modulesDouble();

      subject = new stik.Injector(
        function($template){}, modules
      );

      expect(
        subject.$resolveDependencies()
      ).toEqual([modules.$template.$resolve()]);
    });

    it("with two params", function(){
      var subject, contextDouble, modules;

      contextDouble = function($template, $messaging){};
      modules = modulesDouble();

      subject = new stik.Injector(contextDouble, modules);

      expect(
        subject.$resolveDependencies()
      ).toEqual([
        modules.$template.$resolve(),
        modules.$messaging.$resolve()
      ]);
    });

    it("with three params", function(){
      var subject, contextDouble, modules;

      contextDouble = function($template, $messaging, $viewBag){};
      modules = modulesDouble();

      subject = new stik.Injector(contextDouble, modules);

      expect(
        subject.$resolveDependencies()
      ).toEqual([
        modules.$template.$resolve(),
        modules.$messaging.$resolve(),
        modules.$viewBag.$resolve()
      ]);
    });
  });

  describe("#$extractArguments", function(){
    it("with a single param", function(){
      var contextDouble, modules, subject, result;

      contextDouble = function($viewBag){};
      modules = modulesDouble();

      subject = new stik.Injector(contextDouble, modules);

      expect(
        subject.$extractArguments()
      ).toEqual(['$viewBag']);
    });

    it("with two params", function(){
      var contextDouble, modules, subject, result;

      contextDouble = function($viewBag, $template){};
      modules = modulesDouble();

      subject = new stik.Injector(contextDouble, modules);

      expect(
        subject.$extractArguments()
      ).toEqual(['$viewBag', '$template']);
    });

    it("with three params", function(){
      var contextDouble, modules, subject, result;

      contextDouble = function($viewBag, $template, $context){};
      modules = modulesDouble();

      subject = new stik.Injector(contextDouble, modules);

      expect(
        subject.$extractArguments()
      ).toEqual(['$viewBag', '$template', '$context']);
    });
  });

  describe("#$grabModules", function(){
    it("should throw if no modules was found", function(){
      var injector, args, executionUnit;

      executionUnit = function($absentModule){};

      injector = new stik.Injector(executionUnit, {});

      expect(function(){
        injector.$resolveDependencies();
      }).toThrow("Stik could not find this module ($absentModule)");
    });
  });

  describe("#$trimmedArgs", function(){
    it("with a single param", function(){
      var subject, args;

      args = [' $template '];
      subject = new stik.Injector();

      expect(
        subject.$trimmedArgs(args)
      ).toEqual(['$template']);
    });

    it("with two params", function(){
      var subject, args;

      args = [' $viewBag ', ' $template '];
      subject = new stik.Injector();

      expect(
        subject.$trimmedArgs(args)
      ).toEqual(['$viewBag', '$template']);
    });

    it("with three params", function(){
      var subject, args;

      args = [' $viewBag ', ' $template ', ' $context '];
      subject = new stik.Injector();

      expect(
        subject.$trimmedArgs(args)
      ).toEqual(['$viewBag', '$template', '$context']);
    });
  });
});
