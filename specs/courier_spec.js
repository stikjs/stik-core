describe("Courier", function(){
  describe("#$receive", function(){
    it("should be able to send to one box", function(){
      var courier = stik.courier(),
          box = "create-item",
          opener = jasmine.createSpy('createBoxOpener');

      courier.$receive(box, opener);

      expect(opener).not.toHaveBeenCalled();

      courier.$send(box);
      expect(opener).toHaveBeenCalled();
    });

    it("should be able to send to multiple boxes", function(){
      var courier = stik.courier(),
          createBox = "create-item",
          updateBox = "updated-item",
          createBoxOpener = jasmine.createSpy('createBoxOpener'),
          updateBoxOpener = jasmine.createSpy('updateBoxOpener');

      courier.$receive(createBox, createBoxOpener);
      courier.$receive(updateBox, updateBoxOpener);

      expect(createBoxOpener).not.toHaveBeenCalled();
      expect(updateBoxOpener).not.toHaveBeenCalled();

      courier.$send(createBox);
      expect(createBoxOpener).toHaveBeenCalled();
      expect(updateBoxOpener).not.toHaveBeenCalled();

      courier.$send(updateBox);
      expect(updateBoxOpener).toHaveBeenCalled();
    });

    it("should return a function to allow removing the receiver", function(){
      var courier = stik.courier(),
          box = "missing-message",
          unsubscribe;

      unsubscribe = courier.$receive(box, function(){});
      unsubscribe();

      expect(function(){
        courier.$send(box, {});
      }).toThrow("Stik: No receiver registered for 'missing-message'");
    });

    it("while unsubscribing should maintain the other boxes intact", function(){
      var courier = stik.courier(),
          newItemBox = "new-item",
          changeItemBox = "change-item",
          changeItemOpener = jasmine.createSpy("opener"),
          newItemUnsubscribe, changeItemUnsubscribe;

      newItemUnsubscribe = courier.$receive(newItemBox, function(){});
      changeItemUnsubscribe = courier.$receive(changeItemBox, changeItemOpener);

      newItemUnsubscribe();

      expect(function(){
        courier.$send(newItemBox, {});
      }).toThrow("Stik: No receiver registered for 'new-item'");

      expect(changeItemOpener).not.toHaveBeenCalled();

      expect(function(){
        courier.$send(changeItemBox, {});
      }).not.toThrow();

      expect(changeItemOpener).toHaveBeenCalled();
    });
  });

  describe("#$send", function(){
    it("should throw if no $receiver is register", function(){
      var courier = stik.courier();

      expect(function(){
        courier.$send('new-item', {});
      }).toThrow("Stik: No receiver registered for 'new-item'");
    });

    it("a text message", function(){
      var courier = stik.courier(),
          message = "some message",
          receiver = jasmine.createSpy("receiver");

      courier.$receive("new-message", receiver)
      courier.$send("new-message", message);

      expect(receiver).toHaveBeenCalledWith(message);
    });

    it("an object message", function(){
      var courier = stik.courier(),
          receiver = jasmine.createSpy("receiver"),
          message;

      message = {
        some: "super",
        deeply: {
          nested: "message"
        }
      };

      courier.$receive("new-message", receiver)
      courier.$send("new-message", message);

      expect(receiver).toHaveBeenCalledWith(message);
    });

    it("should be able to wildcard a message", function(){
      var courier = stik.courier(),
          message = "some message",
          newReceiver = jasmine.createSpy("newReceiver"),
          addedReceiver = jasmine.createSpy("addedReceiver");

      courier.$receive("message-new", newReceiver);
      courier.$receive("message-added", addedReceiver);

      courier.$send("message-*", message);

      expect(newReceiver).toHaveBeenCalledWith(message);
      expect(addedReceiver).toHaveBeenCalledWith(message);
    });
  });
});
