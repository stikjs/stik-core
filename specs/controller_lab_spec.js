describe("ControllerLab", function(){
  describe("when not ok", function(){
    it("missing environment inputs", function(){
      expect(function(){
        stik.labs.controller();
      }).toThrow("Lab needs an environment to run");

      expect(function(){
        stik.labs.controller({});
      }).toThrow("name can't be empty");

      expect(function(){
        stik.labs.controller({
          name: "AppCtrl"
        });
      }).toThrow("action can't be empty");

      expect(function(){
        stik.labs.controller({
          name: "AppCtrl",
          action: "List"
        });
      }).toThrow("template can't be empty");
    });
  });

  it("in and out data", function(){
    var template, lab;

    stik.controller("StarWarsCtrl", "Dialog", function($viewBag){
      $viewBag.$push({
        luke: "You killed my father",
        vader: "Luke, I'm your father"
      });
    });

    template = "<div data-controller=\"StarWarsCtrl\" data-action=\"Dialog\">" +
      "<span class=\"luke\" data-bind=\"luke\"></span>" +
      "<span class=\"vader\" data-bind=\"vader\"></span>" +
    "</div>";

    lab = stik.labs.controller({
      name: "StarWarsCtrl",
      action: "Dialog",
      template: template
    });
    lab.run();

    expect(
      lab.template.getElementsByClassName("luke")[0].value
    ).toEqual(null);

    expect(
      lab.template.getElementsByClassName("vader")[0].value
    ).toEqual(null);
  });
});
