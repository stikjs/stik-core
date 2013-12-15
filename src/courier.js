window.stik || (window.stik = {});

(function(){
  function Courier(){
    this.$$receivers = {};
  }

  Courier.prototype.$receive = function(box, opener){
    this.$$receivers[box] || (this.$$receivers[box] = []);
    this.$$receivers[box].push(opener);
  };

  Courier.prototype.$send = function(box, message){
    var openers = this.$$receivers[box];

    for (var i = 0; i < openers.length; i++) {
      openers[i](message);
    }
  };

  stik.Courier = Courier;
})();
