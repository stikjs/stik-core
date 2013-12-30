describe("UrlState", function(){
  describe("#$mainPath", function(){
    it("with a simples path", function(){
      var urlState = new stik.UrlState();

      spyOn(urlState, "$pathName").andReturn("/list");

      expect(
        urlState.$mainPath()
      ).toEqual('/list');
    });

    it("with a doubled path", function(){
      var urlState = new stik.UrlState();

      spyOn(urlState, "$pathName").andReturn("/list/1234");

      expect(
        urlState.$mainPath()
      ).toEqual('/list');
    });

    it("with an empty path", function(){
      var urlState = new stik.UrlState();

      spyOn(urlState, "$pathName").andReturn("/");

      expect(
        urlState.$mainPath()
      ).toEqual('/');
    });
  });

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

  describe("#$hash", function(){
    it("having a hash", function(){
      var urlState = new stik.UrlState();

      spyOn(urlState, "$locationHash").andReturn("#123");

      expect(urlState.$hash()).toEqual("123");
    });

    it("with an empty hash", function(){
      var urlState = new stik.UrlState();

      spyOn(urlState, "$locationHash").andReturn("");

      expect(urlState.$hash()).toEqual("");
    });

    it("setting a new hash", function(){
      var urlState = new stik.UrlState();

      spyOn(urlState, "$locationHash").andReturn("some-hash");

      urlState.$hash("some-hash");

      expect(
        urlState.$locationHash
      ).toHaveBeenCalledWith("some-hash");
    });
  });
});
