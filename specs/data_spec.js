describe("$data", function(){
  it("should retrieve one attribute from the template", function(){
    var template = document.createElement("div"),
        result;

    template.setAttribute("data-id", "$081209j09urr123");

    result = stik.labs.boundary({
      name: "$data"
    }).run({
      $template: template
    });

    expect(result).toEqual( { id: "$081209j09urr123" } );
  });

  it("should retrieve multiple attributes from the template", function(){
    var template = document.createElement("div"),
        result;

    template.setAttribute("data-id", "$081209j09urr123");
    template.setAttribute("data-active", "false");
    template.setAttribute("data-relative", "$0129740y4u2i2");

    result = stik.labs.boundary({
      name: "$data"
    }).run({
      $template: template
    });

    expect(result).toEqual({
      id: "$081209j09urr123",
      active: "false",
      relative: "$0129740y4u2i2"
    });
  });

  it("should handle an attribute with multiple dashes", function(){
    var template = document.createElement("div"),
        result;

    template.setAttribute("data-db-id", "$081209j09urr123");
    template.setAttribute("data-is-more-active", "true");

    result = stik.labs.boundary({
      name: "$data"
    }).run({
      $template: template
    });

    expect(result).toEqual({
      "dbId": "$081209j09urr123",
      "isMoreActive": "true"
    });
  });
});
