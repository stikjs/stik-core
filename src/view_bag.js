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
        this.$updateElementValue(fields[i], dataSet[dataToBind]);
      }
    }
  };

  ViewBag.prototype.$updateElementValue = function(element, value){
    if(element.nodeName.toUpperCase() === "INPUT" || element.nodeName.toUpperCase() === "TEXTAREA") {
      element.value = value;
    } else {
      element.textContent = value;
    }
  };

  ViewBag.prototype.$fieldsToBind = function(){
    if (this.$$template.getAttribute(bindingKey)) {
      return [this.$$template];
    }

    return this.$$template.querySelectorAll(
      "[" + bindingKey + "]"
    );
  };

  window.stik.ViewBag = ViewBag;
})();
