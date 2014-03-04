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

  it("should push data to the template", function(){
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
      lab.template.getElementsByClassName("luke")[0].textContent
    ).toEqual("You killed my father");

    expect(
      lab.template.getElementsByClassName("vader")[0].textContent
    ).toEqual("Luke, I'm your father");
  });

  it("mocking dependencies", function(){
    var template, lab, viewBagDoubleMock;

    stik.controller("StarWarsCtrl", "LightsaberDuel", function($viewBag){
      $viewBag.$push({
        luke: "You killed my father",
        vader: "Luke, I'm your father"
      });
    });

    template = "<div data-controller=\"StarWarsCtrl\" data-action=\"LightsaberDuel\">" +
      "<span class=\"luke\" data-bind=\"luke\"></span>" +
      "<span class=\"vader\" data-bind=\"vader\"></span>" +
    "</div>";

    viewBagDoubleMock = jasmine.createSpyObj("viewBag", ["$push"])

    lab = stik.labs.controller({
      name: "StarWarsCtrl",
      action: "LightsaberDuel",
      template: template
    });
    lab.run({
      $viewBag: viewBagDoubleMock
    });

    expect(viewBagDoubleMock.$push).toHaveBeenCalledWith({
      luke: "You killed my father", vader: "Luke, I'm your father"
    });

    expect(
      lab.template.getElementsByClassName("vader")[0].textContent
    ).toEqual('');
  });
});
