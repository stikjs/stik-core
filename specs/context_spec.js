var subject, elmDouble;

function setupElmDouble(){
  return {
    getAttribute: function(){},
  };
};

describe("Context", function(){
  beforeEach(function(){
    elmDouble = setupElmDouble();
  });

  afterEach(function(){
    subject = null;
    elmDouble = null;
  });

  describe("#initialize", function(){
    it("when ok", function(){
      spyOn(elmDouble, 'getAttribute').andReturn('AppCtrl');

      var executionUnitDouble = function(){};

      subject = new slik.Context('AppCtrl', 'list', elmDouble, executionUnitDouble);

      expect(subject.$$controller).toBe('AppCtrl');
      expect(subject.$$action).toBe('list');
      expect(subject.$$template).toBe(elmDouble);
      expect(subject.$$executionUnit).toBe(executionUnitDouble);
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

    it("should throw if execution unit is missing", function(){
      expect(function(){
        new slik.Context('AppCtrl', 'list', '<br>');
      }).toThrow("execution unit is missing");
    });
  });

  describe("$load", function(){
    var executed = false;

    afterEach(function(){
      executed = false;
    });

    it("should run the execution unit it is bound to", function(){
      var template = '<div data-controller="ItemCtrl" data-action="detail"></div>';

      var executionUnitDouble = jasmine.createSpy('executionUnitDouble').andCallFake(
        function($teardown, $template){
          executed = true;
        }
      );

      new slik.Context('AppCtrl', 'list', template, executionUnitDouble).$load();

      expect(
        executionUnitDouble
      ).toHaveBeenCalledWith(jasmine.any(Function), template);

      expect(executed).toBeTruthy();
    });
  });
});
