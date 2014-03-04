describe("ViewBag", function(){
  it("#initializing", function(){
    expect(function(){
      stik.viewBag()
    }).toThrow("Stik: ViewBag needs a template to be attached to");
  });

  describe("#$push", function(){
    it("with a single binding", function(){
      var template, viewBag, data;

      template = new DOMParser().parseFromString(
        '<div><span data-bind="userName"></span></div>', "text/xml"
      ).firstChild;

      viewBag = stik.viewBag(template);

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

      viewBag = stik.viewBag(template);

      data = {
        userName: 'Luke Skywalker',
        removal: 'kill Luke Skywalker'
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

      viewBag = stik.viewBag(template);

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

      viewBag = stik.viewBag(template);

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

      viewBag = stik.viewBag(template);

      data = {userName: 'Luke Skywalker'};

      viewBag.$push(data);

      expect(
        template.getElementsByTagName("span")[0].textContent
      ).toEqual(data.userName);

      expect(
        template.getElementsByTagName("strong")[0].textContent
      ).toEqual("");
    });

    it("should set empty values", function(){
      var template, viewBag, data;

      template = new DOMParser().parseFromString(
        '<div><span data-bind="userName">Luke</span></div>',
        "text/xml"
      ).firstChild;

      viewBag = stik.viewBag(template);

      viewBag.$push({userName: ""});

      expect(viewBag.$pull()).toEqual({userName: ""});
    });
  });

  describe("#pull", function(){
    it("out of one bound node", function(){
      var template, viewBag;

      template = new DOMParser().parseFromString(
        '<div data-bind="userName">Luke Skywalker</div>',
        "text/xml"
      ).firstChild;

      viewBag = stik.viewBag(template);

      dataSet = viewBag.$pull();

      expect(dataSet.userName).toEqual("Luke Skywalker");
    });

    it("out of multiple bound nodes", function(){
      var template, viewBag;

      template = new DOMParser().parseFromString(
        '<div>'+
          '<span data-bind="userName">Luke Skywalker</span>' +
          '<a href="#" data-bind="removal">kill Luke Skywalker</a>' +
        '</div>',
        "text/xml"
      ).firstChild;

      viewBag = stik.viewBag(template);

      dataSet = viewBag.$pull();

      expect(dataSet.userName).toEqual("Luke Skywalker");
      expect(dataSet.removal).toEqual("kill Luke Skywalker");
    });
  });
});
