describe("Load DOM Library", function() {

  afterEach(function () {
    delete window.jQuery;
    delete window.Zepto;
    delete window.MooTools;
    delete window.document.id
  });

  it("should discover if MooTools is loaded", function() {
    var DOMLibLoader;

    window.MooTools = jasmine.createSpy("MooTools");
    window.document.id = jasmine.createSpy("MooTools Selector");

    expect(
      stik.DOMLibLoader.$currentDOMSelector()
    ).toEqual(window.document.id);
  });

  it("should discover if Zepto is loaded", function() {
    var DOMLibLoader;

    window.Zepto = jasmine.createSpy("Zepto");

    expect(
      stik.DOMLibLoader.$currentDOMSelector()
    ).toEqual(Zepto);
  });

  it("should discover if jQuery is loaded", function() {
    var DOMLibLoader;

    window.jQuery = jasmine.createSpy("jQuery");

    expect(
      stik.DOMLibLoader.$currentDOMSelector()
    ).toEqual(jQuery);
  });
});
