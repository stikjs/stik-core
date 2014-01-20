describe("Injectable", function(){
  describe("#$resolve", function(){
    it("an instantiable module", function(){
      var templateCheck, customModuleCheck, dependencies;

      function MockClass($template, customModule){
        templateCheck = $template;
        customModuleCheck = customModule;
      }

      dependencies = {
        $template: new stik.Injectable({}),
        customModule: new stik.Injectable({})
      };

      injectable = new stik.Injectable(MockClass, true);

      expect(
        injectable.$resolve(dependencies).constructor.name
      ).toEqual("MockClass");
      expect(
        templateCheck
      ).toEqual(dependencies.$template.$resolve());
      expect(
        customModuleCheck
      ).toEqual(dependencies.customModule.$resolve());
    });

    it("a simple function module", function(){
      var dependencies, mockFunc;

      dependencies = {
        $template: new stik.Injectable({}),
        customModule: new stik.Injectable({})
      };

      mockFunc = function(){};

      injectable = new stik.Injectable(mockFunc, false);

      expect(
        injectable.$resolve(dependencies)
      ).toEqual(mockFunc);
    });

    it("a callable function module", function(){
      var dependencies, mockFunc;

      dependencies = {
        $template: new stik.Injectable("worked!"),
        customModule: new stik.Injectable({})
      };

      mockFunc = function($template){ return $template };

      injectable = new stik.Injectable(mockFunc, false, true);

      expect(
        injectable.$resolve(dependencies)
      ).toEqual("worked!");
    });

    it("a simple object module", function(){
      var dependencies, mockObj;

      dependencies = {
        $template: new stik.Injectable({}),
        customModule: new stik.Injectable({})
      };

      mockObj = {};

      injectable = new stik.Injectable(mockObj, false);

      expect(
        injectable.$resolve(dependencies)
      ).toEqual(mockObj);
    });
  });
});
