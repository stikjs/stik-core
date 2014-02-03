describe("Controller", function(){
  describe("#action", function(){
    it("single action controller", function(){
      var template, ctrl, result;

      template = document.createElement("div");
      template.innerHTML = "<span data-bind=\"iAmYour\"></span>";

      ctrl = stik.controller("StarWarsCtrl", "Revelation", function($viewBag){
        $viewBag.$push({
          iAmYour: "Father!!!!!!"
        });
        result = $viewBag.$pull().iAmYour;
      });

      spyOn(
        ctrl.$$actions["Revelation"], "$findTemplates"
      ).andReturn([template]);

      ctrl.$bind({});

      expect(result).toEqual("Father!!!!!!");
    });

    it("multiple action controller", function(){
      var template, result, ctrl, action;

      template = document.createElement("div");
      template.innerHTML = "<span data-bind=\"no\"></span>";

      ctrl = stik.controller("StarWarsCtrl", function(ctrl){});

      action = ctrl.action("Response", function($viewBag){
        $viewBag.$push({
          no: "NNNOOOOOOO!!!!!!"
        });
        result = $viewBag.$pull().no;
      });

      spyOn(action, "$findTemplates").andReturn([template]);

      action.$bind({});

      expect(result).toEqual("NNNOOOOOOO!!!!!!");
    });
  });
});
