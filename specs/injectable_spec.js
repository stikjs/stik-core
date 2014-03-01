describe("Injectable", function(){
  describe("#resolve", function(){
    it("an instantiable module", function(){
      var templateCheck, customModuleCheck, dependencies;

      function MockClass($template, customModule){
        templateCheck = $template;
        customModuleCheck = customModule;
      }

      dependencies = {
        $template: stik.injectable({ module:{} }),
        customModule: stik.injectable({ module: {} })
      };

      injectable = stik.injectable({
        module: MockClass,
        instantiable: true
      });

      expect(
        injectable.resolve(dependencies).constructor.name
      ).toEqual("MockClass");
      expect(
        templateCheck
      ).toEqual(dependencies.$template.resolve());
      expect(
        customModuleCheck
      ).toEqual(dependencies.customModule.resolve());
    });

    it("a simple function module", function(){
      var dependencies, mockFunc;

      dependencies = {
        $template: stik.injectable({ module: {} }),
        customModule: stik.injectable({ module: {} })
      };

      mockFunc = function(){};

      injectable = stik.injectable({
        module: mockFunc
      });

      expect(
        injectable.resolve(dependencies)
      ).toEqual(mockFunc);
    });

    it("a callable function module", function(){
      var dependencies, mockFunc;

      dependencies = {
        $template: stik.injectable({ module: "worked!" }),
        customModule: stik.injectable({ module: {} })
      };

      mockFunc = function($template){ return $template };

      injectable = stik.injectable({
        module: mockFunc,
        callable: true
      });

      expect(
        injectable.resolve(dependencies)
      ).toEqual("worked!");
    });

    it("a simple object module", function(){
      var dependencies, mockObj;

      dependencies = {
        $template: stik.injectable({ module: {} }),
        customModule: stik.injectable({ module: {} })
      };

      mockObj = {};

      injectable = stik.injectable({
        module: mockObj
      });

      expect(
        injectable.resolve(dependencies)
      ).toEqual(mockObj);
    });
  });
});
