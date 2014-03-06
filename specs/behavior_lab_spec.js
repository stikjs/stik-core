describe("BehaviorLab", function(){
  describe("when not ok", function(){
    it("missing environment inputs", function(){
      expect(function(){
        stik.labs.behavior();
      }).toThrow("Stik: Behavior Lab needs an environment to run");

      expect(function(){
        stik.labs.behavior( {} );
      }).toThrow("Stik: Behavior Lab needs a name");

      expect(function(){
        stik.labs.behavior({
          name: "LightsaberSparks",
        });
      }).toThrow("Stik: Behavior Lab needs a template");
    });
  });

  it("should run the specified behavior", function(){
    var template, lab;

    stik.behavior( "lightsaber-sparks", function( $template ){
      $template.className += " sparkling";
    });

    template = "<span class=\"lightsaber-sparks\"></span>";

    lab = stik.labs.behavior({
      name: "lightsaber-sparks",
      template: template
    });
    lab.run();

    expect(
      lab.template.className
    ).toEqual( "lightsaber-sparks sparkling" );
  });

  it("mocking dependencies", function(){
    var template, lab, courierMock;

    stik.behavior("lightsaber-clash", function($courier){
      $courier.$send("lashing", {});
    });

    template = "<span class=\"lightsaber-clash\"></span>";

    courierMock = jasmine.createSpyObj("courier", ["$send"]);

    lab = stik.labs.behavior({
      name: "lightsaber-clash",
      template: template
    });
    lab.run({
      $courier: courierMock
    });

    expect(courierMock.$send).toHaveBeenCalledWith(
      "lashing", jasmine.any(Object)
    );
  });
});
