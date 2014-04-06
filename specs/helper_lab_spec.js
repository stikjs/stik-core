describe("HelperLab", function(){
  describe("when not ok", function(){
    it("missing environment inputs", function(){
      expect(function(){
        stik.labs.helper();
      }).toThrow("Stik: Helper Lab needs an environment to run");

      expect(function(){
        stik.labs.helper( {} );
      }).toThrow("Stik: Helper Lab needs a name");
    });
  });
});
