describe("UrlState", function(){
  describe("#$queries", function(){
    it("an empty query", function(){
      var urlState = new stik.UrlState();

      spyOn(
        urlState, "$baseUrl"
      ).andReturn("http://mywebsite.com");

      expect(urlState.$queries()).toEqual({});
      expect(urlState.$baseUrl).toHaveBeenCalled();
    });

    it("one param query", function(){
      var urlState = new stik.UrlState();

      spyOn(
        urlState, "$baseUrl"
      ).andReturn("http://mywebsite.com?sample=query");

      expect(
        urlState.$queries()
      ).toEqual({
        sample: "query"
      });
    });

    it("one two queries", function(){
      var urlState = new stik.UrlState();

      spyOn(
        urlState, "$baseUrl"
      ).andReturn(
        "http://mywebsite.com?sample=query&more=advanced"
      );

      expect(
        urlState.$queries()
      ).toEqual({
        sample: "query",
        more: "advanced"
      });
    });

    it("multicharacter queries", function(){
      var urlState = new stik.UrlState();

      spyOn(
        urlState, "$baseUrl"
      ).andReturn(
        "http://mywebsite.com?spaces=qew%20ksd%20&number=123.98"
      );

      expect(
        urlState.$queries()
      ).toEqual({
        spaces: "qew%20ksd%20",
        number: "123.98"
      });
    });
  });
});
