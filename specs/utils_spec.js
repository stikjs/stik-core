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

  describe("hasClass", function(){
    it("whithout the class", function(){
      var elm = document.createElement("div");

      var hasClassHelper = stik.labs.helper({
        name: "hasClass"
      }).run();

      expect(hasClassHelper(elm, "active")).toBeFalsy();
    });

    it("with the class", function(){
      var elm = document.createElement("div");
      elm.className = "active";

      var hasClassHelper = stik.labs.helper({
        name: "hasClass"
      }).run();

      expect(hasClassHelper(elm, "active")).toBeTruthy();
    });

    it("with a different class", function(){
      var elm = document.createElement("div");
      elm.className = "not-active";

      var hasClassHelper = stik.labs.helper({
        name: "hasClass"
      }).run();

      expect(hasClassHelper(elm, "active")).toBeFalsy();
    });
  });

  describe("addClass", function(){
    it("whithout the class", function(){
      var elm = document.createElement("div");

      var addClassHelper = stik.labs.helper({
        name: "addClass"
      }).run();

      addClassHelper(elm, "active");

      expect(elm.className).toEqual("active");
    });

    it("with the class", function(){
      var elm = document.createElement("div");
      elm.className = "active";

      var addClassHelper = stik.labs.helper({
        name: "addClass"
      }).run();

      addClassHelper(elm, "active");

      expect(elm.className).toEqual("active");
    });

    it("with a different class", function(){
      var elm = document.createElement("div");
      elm.className = "not-active";

      var addClassHelper = stik.labs.helper({
        name: "addClass"
      }).run();

      addClassHelper(elm, "active");

      expect(elm.className).toEqual("not-active active");
    });
  });

  describe("removeClass", function(){
    it("whithout the class", function(){
      var elm = document.createElement("div");

      var removeClassHelper = stik.labs.helper({
        name: "removeClass"
      }).run();

      expect(function(){
        removeClassHelper(elm, "active");
      }).not.toThrow();
    });

    it("with the class", function(){
      var elm = document.createElement("div");
      elm.className = "active";

      var removeClassHelper = stik.labs.helper({
        name: "removeClass"
      }).run();

      removeClassHelper(elm, "active");

      expect(elm.className).toEqual("");
    });

    it("with a different class", function(){
      var elm = document.createElement("div");
      elm.className = "not-active";

      var removeClassHelper = stik.labs.helper({
        name: "removeClass"
      }).run();

      removeClassHelper(elm, "active");

      expect(elm.className).toEqual("not-active");
    });
  });

  describe("toggleClass", function(){
    it("whithout the class", function(){
      var elm = document.createElement("div");

      var toggleClassHelper = stik.labs.helper({
        name: "toggleClass"
      }).run();

      toggleClassHelper(elm, "active");

      expect(elm.className).toEqual("active");
    });

    it("with the class", function(){
      var elm = document.createElement("div");
      elm.className = "active";

      var toggleClassHelper = stik.labs.helper({
        name: "toggleClass"
      }).run();

      toggleClassHelper(elm, "active");

      expect(elm.className).toEqual("");
    });

    it("with a different class", function(){
      var elm = document.createElement("div");
      elm.className = "not-active";

      var toggleClassHelper = stik.labs.helper({
        name: "toggleClass"
      }).run();

      toggleClassHelper(elm, "active");

      expect(elm.className).toEqual("not-active active");
    });
  });

  describe("hideElm", function(){
    it("when visible", function(){
      var elm = document.createElement("div");

      var hideElmHelper = stik.labs.helper({
        name: "hideElm"
      }).run();

      hideElmHelper(elm);

      expect(elm.style.display).toEqual("none");
    });
  });

  describe("showElm", function(){
    it("when visible", function(){
      var elm = document.createElement("div");

      var showElmHelper = stik.labs.helper({
        name: "showElm"
      }).run();

      showElmHelper(elm);

      expect(elm.style.display).toEqual("");
    });

    it("when hidden should remove the property", function(){
      var elm = document.createElement("div");
      elm.style.display = 'none';

      var showElmHelper = stik.labs.helper({
        name: "showElm"
      }).run();

      showElmHelper(elm);

      expect(elm.style.display).toEqual("");
    });
  });
});
