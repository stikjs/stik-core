(function(){
  var bindingKey = "data-bind";

  function ViewBag($template){
    this.$$template = $template;
  }

  ViewBag.prototype.$push = function(dataSet){
    var fields, dataToBind, i;

    fields = this.$fieldsToBind();

    i = fields.length;

    while(i--) {
      dataToBind = fields[i].getAttribute(bindingKey);

      if (dataSet[dataToBind]) {
        this.$updateElementValue(fields[i], dataSet[dataToBind]);
      }
    }
  };

  ViewBag.prototype.$pull = function(){
    var fields, dataSet, key, i;

    dataSet = {};
    fields = this.$fieldsToBind();

    i = fields.length;

    while(i--) {
      key = fields[i].getAttribute(bindingKey);
      dataSet[key] = this.$extractValueOf(fields[i]);
    }

    return dataSet;
  };

  ViewBag.prototype.$extractValueOf = function(element){
    if(element.nodeName.toUpperCase() === "INPUT" || element.nodeName.toUpperCase() === "TEXTAREA") {
      return element.value;
    } else {
      return element.textContent;
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

  window.stik.boundary({
    as: "$viewBag",
    from: "controller|behavior",
    inst: true,
    to: ViewBag
  });
})();
