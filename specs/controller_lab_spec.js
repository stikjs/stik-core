describe("ControllerLab", function(){
  describe("when not ok", function(){
    it("missing environment inputs", function(){
      expect(function(){
        stik.labs.controller();
      }).toThrow("Stik: Controller Lab needs an environment to run");

      expect(function(){
        stik.labs.controller({});
      }).toThrow("Stik: Controller Lab needs a name");

      expect(function(){
        stik.labs.controller({
          name: "AppCtrl"
        });
      }).toThrow("Stik: Controller Lab needs the action name");

      expect(function(){
        stik.labs.controller({
          name: "AppCtrl",
          action: "List"
        });
      }).toThrow("Stik: Controller Lab needs a template");
    });
  });

  it("should run the specified controller action", function(){
    var template, lab;

    stik.controller("StarWarsCtrl", "Dialog", function($viewBag){
      $viewBag.push({
        luke: "You killed my father",
        vader: "Luke, I'm your father"
      });
    });

    template = "<div data-controller=\"StarWarsCtrl\" data-action=\"Dialog\">" +
      "<span class=\"luke\" data-key=\"luke\"></span>" +
      "<span class=\"vader\" data-key=\"vader\"></span>" +
    "</div>";

    lab = stik.labs.controller({
      name: "StarWarsCtrl",
      action: "Dialog",
      template: template
    });
    lab.run();

    expect(
      lab.template.getElementsByClassName("luke")[0].textContent
    ).toEqual("You killed my father");

    expect(
      lab.template.getElementsByClassName("vader")[0].textContent
    ).toEqual("Luke, I'm your father");
  });

  it("mocking dependencies", function(){
    var template, lab, viewBagDoubleMock;

    stik.controller("StarWarsCtrl", "LightsaberDuel", function($viewBag){
      $viewBag.push({
        luke: "You killed my father",
        vader: "Luke, I'm your father"
      });
    });

    template = "<div data-controller=\"StarWarsCtrl\" data-action=\"LightsaberDuel\">" +
      "<span class=\"luke\" data-key=\"luke\"></span>" +
      "<span class=\"vader\" data-key=\"vader\"></span>" +
    "</div>";

    viewBagDoubleMock = jasmine.createSpyObj("viewBag", ["push"]);

    lab = stik.labs.controller({
      name: "StarWarsCtrl",
      action: "LightsaberDuel",
      template: template
    });
    lab.run({
      $viewBag: viewBagDoubleMock
    });

    expect(viewBagDoubleMock.push).toHaveBeenCalledWith({
      luke: "You killed my father", vader: "Luke, I'm your father"
    });

    expect(
      lab.template.getElementsByClassName("vader")[0].textContent
    ).toEqual('');
  });
});
