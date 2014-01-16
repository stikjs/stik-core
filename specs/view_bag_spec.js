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
    it("should delegate to #push", function(){
      var viewBag = new stik.ViewBag();

      expect(viewBag.$render).toEqual(viewBag.$push);
    });
  });

  describe("#$push", function(){
    it("with a single binding", function(){
      var template, viewBag, data;

      template = new DOMParser().parseFromString(
        '<div><span data-bind="userName"></span></div>', "text/xml"
      ).firstChild;

      viewBag = new stik.ViewBag(template);

      data = {userName: 'Luke Skywalker'};

      viewBag.$push(data);

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

      viewBag.$push(data);

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

      viewBag.$push(data);

      expect(
        template.textContent
      ).toEqual(data.userName);
    });

    it("should update input elements", function(){
      var template, viewBag, data;

      template = new DOMParser().parseFromString(
        '<div>'+
          '<input type="text" data-bind="speaker" />' +
          '<textarea data-bind="catchPhrase"></textarea>' +
        '</div>',
        "text/xml"
      ).firstChild;

      viewBag = new stik.ViewBag(template);

      data = {
        speaker: "Darth Vader",
        catchPhrase: "I'm you father!!"
      };

      viewBag.$push(data);

      expect(
        template.getElementsByTagName("input")[0].value
      ).toEqual(data.speaker);

      expect(
        template.getElementsByTagName("textarea")[0].value
      ).toEqual(data.catchPhrase);
    });

    it("should only try to bind properties that are in the object", function(){
      var template, viewBag, data;

      template = new DOMParser().parseFromString(
        '<div>'+
          '<span data-bind="userName"></span>' +
          '<strong data-bind="dontBind"></strong>' +
          '<a href="#" data-bind="removal"></a>' +
        '</div>',
        "text/xml"
      ).firstChild;

      viewBag = new stik.ViewBag(template);

      data = {userName: 'Luke Skywalker'};

      viewBag.$push(data);

      expect(
        template.getElementsByTagName("span")[0].textContent
      ).toEqual(data.userName);

      expect(
        template.getElementsByTagName("strong")[0].textContent
      ).toEqual("");
    });
  });
});
