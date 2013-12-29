describe("Injector", function(){
  function modulesDouble(){
    return {
      $template: function(){},
      $messaging: function(){},
      $viewBag: function(){}
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
      var subject, contextDouble, modules;

      contextDouble = function($template){};
      modules = modulesDouble();

      subject = new stik.Injector(contextDouble, modules);

      expect(
        subject.$resolveDependencies()
      ).toEqual([modules.$template]);
    });

    it("with two params", function(){
      var subject, contextDouble, modules;

      contextDouble = function($template, $messaging){};
      modules = modulesDouble();

      subject = new stik.Injector(contextDouble, modules);

      expect(
        subject.$resolveDependencies()
      ).toEqual([
        modules.$template,
        modules.$messaging
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
        modules.$template,
        modules.$messaging,
        modules.$viewBag
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
      }).toThrow("¿$absentModule? These are not the droids you are looking for! (e.g. this module does not exists)");
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
