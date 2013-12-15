describe("Courier", function(){
  it("#initialize", function(){
    courier = new stik.Courier();

    expect(courier.$$receivers).toEqual({});
  });

  describe("#$receive", function(){
    it("should store one", function(){
      var courier, box, opener;

      box    = "new-item";
      opener = function(){};

      courier = new stik.Courier();

      courier.$receive(box, opener);

      expect(
        Object.keys(courier.$$receivers)[0]
      ).toEqual(box);

      expect(
        courier.$$receivers[box].length
      ).toEqual(1);

      expect(
        courier.$$receivers[box][0]
      ).toEqual(opener);
    });

    it("should store multiple boxes", function(){
      var courier, createBox, updateBox, opener;

      createBox    = "create-item";
      updateBox    = "updated-item";
      opener       = function(){};

      courier = new stik.Courier();

      courier.$receive(createBox, opener);
      courier.$receive(updateBox, opener);

      expect(
        Object.keys(courier.$$receivers)
      ).toEqual([createBox, updateBox]);

      expect(
        courier.$$receivers[createBox].length
      ).toEqual(1);

      expect(
        courier.$$receivers[updateBox].length
      ).toEqual(1);

      expect(
        courier.$$receivers[createBox][0]
      ).toEqual(opener);

      expect(
        courier.$$receivers[updateBox][0]
      ).toEqual(opener);
    });
  });

  describe("#$send", function(){
    it("a text message", function(){
      var courier, message, receiver;

      message = "some message";
      receiver = jasmine.createSpy("receiver");

      courier = new stik.Courier();
      courier.$receive("new-message", receiver)
      courier.$send("new-message", message);

      expect(receiver).toHaveBeenCalledWith(message);
    });

    it("an object message", function(){
      var courier, message, receiver;

      message = {
        some: "super",
        deeply: {
          nested: "message"
        }
      };
      receiver = jasmine.createSpy("receiver");

      courier = new stik.Courier();
      courier.$receive("new-message", receiver)
      courier.$send("new-message", message);

      expect(receiver).toHaveBeenCalledWith(message);
    });
  });
});
