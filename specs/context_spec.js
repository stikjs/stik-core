var subject, elmDouble;

function setupElmDouble(){
  elmDouble = {
    getAttribute: function(){},
  };
};

describe("Context", function(){
  beforeEach(function(){
    setupElmDouble();
  });

  describe("#initialize", function(){
    it("when ok", function(){
      spyOn(elmDouble, 'getAttribute').andReturn('AppCtrl');

      subject = new slik.Context('AppCtrl', 'list', elmDouble);

      expect(subject.controller).toBe('AppCtrl');
      expect(subject.action).toBe('list');
      expect(subject.template).toBe(elmDouble);
    });

    it("should throw if controller is missing", function(){
      expect(function(){
        new slik.Context(null, 'application');
      }).toThrow("controller is missing");
    });

    it("should throw if action is missing", function(){
      expect(function(){
        new slik.Context('AppCtrl');
      }).toThrow("action is missing");
    });

    it("should throw if template is missing", function(){
      expect(function(){
        new slik.Context('AppCtrl', 'list');
      }).toThrow("template is missing");
    });
  });

  describe("$validateTemplate", function(){
    it("should throw if template does not have the controller definition", function(){
      spyOn(elmDouble, 'getAttribute').andReturn(null);

      expect(function(){
        subject.$validateTemplate(elmDouble);
      }).toThrow("template does not define a controller");
    });

    it("should not throw if template has the controller definition", function(){
      spyOn(elmDouble, 'getAttribute').andReturn('AppCtrl');

      expect(function(){
        subject.$validateTemplate(elmDouble);
      }).not.toThrow();
    });

    it("should throw if template does not have the action definition", function(){
      spyOn(elmDouble, 'getAttribute').andCallFake(function(selector){
        if (selector == "controller") {
          return "AppCtrl";
        } else{
          return null;
        };
      });

      expect(function(){
        subject.$validateTemplate(elmDouble);
      }).toThrow("template does not define an action");
    });

    it("should throw if template has the action definition", function(){
      spyOn(elmDouble, 'getAttribute').andCallFake(function(selector){
        if (selector === "controller") {
          return "AppCtrl";
        } else{
          return "list";
        };
      });

      expect(function(){
        subject.$validateTemplate(elmDouble);
      }).not.toThrow();
    });
  });
});
