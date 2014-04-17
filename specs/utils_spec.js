describe("utils", function(){
  describe("$window", function(){
    it("should pass in the global window object", function(){
      var result = stik.labs.boundary({
        name: "$window"
      }).run();

      expect(result).toEqual(window);
    });
  });

  describe("goTo", function(){
    it("should assign the location value", function(){
      var windowMock = {}, result;

      helper = stik.labs.helper({
        name: "goTo"
      }).run({
        $window: windowMock
      });

      helper("/heroes/hell-boy");

      expect(windowMock.location).toEqual("/heroes/hell-boy");
    });
  });
});
