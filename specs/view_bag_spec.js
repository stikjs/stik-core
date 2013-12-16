describe("ViewBag", function(){
  describe("#initialize", function(){
    it("when ok", function(){
      var template, viewBag;

      template = '<div></div>';

      viewBag = new stik.ViewBag(template);

      expect(viewBag.$$template).toEqual(template);
    });
  });

  describe("#$render", function(){
    it("with a single binding", function(){
      var template, viewBag, data;

      template = new DOMParser().parseFromString(
        '<div><span data-bind="userName"></span></div>', "text/xml"
      ).firstChild;

      viewBag = new stik.ViewBag(template);

      data = {userName: 'Luke Skywalker'};

      viewBag.$render(data);

      expect(
        template.textContent
      ).toEqual(data.userName);
    });

    it("with a multiple bindings", function(){
      var template, viewBag, data;

      template = new DOMParser().parseFromString(
        '<div>'+
          '<span data-bind="userName"></span>' +
          '<a href="#" data-bind="removal"></a>' +
        '</div>',
        "text/xml"
      ).firstChild;

      viewBag = new stik.ViewBag(template);

      data = {
        userName: 'Luke Skywalker',
        removal: 'Remove Luke Skywalker'
      };

      viewBag.$render(data);

      expect(
        template.getElementsByTagName("span")[0].textContent
      ).toEqual(data.userName);

      expect(
        template.getElementsByTagName("a")[0].textContent
      ).toEqual(data.removal);
    });

    it("with self-bound template", function(){
      var template, viewBag, data;

      template = new DOMParser().parseFromString(
        '<div data-bind="userName"></div>',
        "text/xml"
      ).firstChild;

      viewBag = new stik.ViewBag(template);

      data = {userName: 'Luke Skywalker'};

      viewBag.$render(data);

      expect(
        template.textContent
      ).toEqual(data.userName);
    });
  });
});
