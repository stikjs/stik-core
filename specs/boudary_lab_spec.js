describe("BoundaryLab", function(){
  describe("when not ok", function(){
    it("missing environment inputs", function(){
      expect(function(){
        stik.labs.boundary();
      }).toThrow("Stik: Boundary Lab needs an environment to run");

      expect(function(){
        stik.labs.boundary( {} );
      }).toThrow("Stik: Boundary Lab needs a name");
    });
  });

  beforeEach(function(){
    stik.$$manager.$reset();
  });

  afterEach(function(){
    stik.$$manager.$reset();
  });

  it("with a resolvable boundary", function(){
    var template, lab, result;

    stik.boundary({
      as: "myAwesomeBoundary",
      resolvable: true,
      to: function( $template ){
        return $template;
      }
    });

    template = "<span data-id=\"$910293u412018d23\"></span>";

    lab = stik.labs.boundary({
      name: "myAwesomeBoundary"
    });
    result = lab.run({
      $template: template
    });

    expect( result ).toEqual( template );
  });

  it("with a function boundary", function(){
    var boundaryMock = jasmine.createSpy("boundaryMock");

    stik.boundary({
      as: "myAwesomeBoundary",
      to: boundaryMock
    });

    stik.labs.boundary({
      name: "myAwesomeBoundary"
    }).run()();

    expect( boundaryMock ).toHaveBeenCalled();
  });

  it("with a function boundary", function(){
    var obj = {}, result;

    stik.boundary({
      as: "myAwesomeBoundary",
      to: obj
    });

    result = stik.labs.boundary({
      name: "myAwesomeBoundary"
    }).run();

    expect( result ).toEqual( obj );
  });
});
