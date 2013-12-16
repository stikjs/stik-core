window.stik || (window.stik = {});

(function(){
  var bindingKey = "data-bind";

  function ViewBag(template){
    this.$$template = template;
  }

  ViewBag.prototype.$render = function(dataSet){
    var fields, dataToBind;

    fields = this.$fieldsToBind();

    for (var i = 0; i < fields.length; i++) {
      dataToBind = fields[i].getAttribute(bindingKey);

      if (dataSet[dataToBind]) {
        fields[i].textContent = dataSet[dataToBind];
      }
    }
  };

  ViewBag.prototype.$fieldsToBind = function(){
    if (this.$$template.getAttribute(bindingKey)) {
      return [this.$$template];
    }

    return this.$$template.querySelectorAll(
      "[" + bindingKey + "]"
    );
  }

  stik.ViewBag = ViewBag;
})();
