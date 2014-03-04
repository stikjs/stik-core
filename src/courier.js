window.stik.courier = function courier(){
  var obj = {},
      subscriptions = {};

  obj.$receive = function $receive(box, opener){
    var subscription = createSubscription({
      box: box, opener: opener
    });

    subscriptions[box] = (subscriptions[box] || []);
    subscriptions[box].push(subscription);

    return unsubscribe.bind({}, subscription);
  };

  function unsubscribe(subscription){
    subscriptions[subscription.box] =
    subscriptions[subscription.box].filter(function(subs){
      return subs.id !== subscription.id;
    });
  }

  obj.$send = function $send(box, message){
    var openers = subscriptions[box],
        i;

    if (!openers || openers.length === 0) {
      throw "Stik: No receiver registered for '" + box + "'";
    }

    i = openers.length;
    while (i--) {
      openers[i].opener(message);
    }
  };

  function createSubscription(spec){
    spec.id = '#' + Math.floor(
      Math.random()*16777215
    ).toString(16);

    return spec;
  }

  return obj;
};

window.stik.boundary({
  as: "$courier",
  from: "controller|behavior",
  to: window.stik.courier()
});
