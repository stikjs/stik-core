(function(){
  var bindingKey = "data-bind";

  function ViewBag($template){
    this.$$template = $template;
  }

  ViewBag.method("$push", function(dataSet){
    var fields, dataToBind, i;

    fields = fieldsToBind(this.$$template);

    i = fields.length;

    while(i--) {
      dataToBind = fields[i].getAttribute(bindingKey);

      if (dataSet[dataToBind] !== undefined) {
        updateElementValue(fields[i], dataSet[dataToBind]);
      }
    }
  });

  ViewBag.method("$pull", function(){
    var fields, dataSet, key, i;

    dataSet = {};
    fields = fieldsToBind(this.$$template);

    i = fields.length;

    while(i--) {
      key = fields[i].getAttribute(bindingKey);
      dataSet[key] = extractValueOf(fields[i]);
    }

    return dataSet;
  });

  function extractValueOf(element){
    if (isInput(element)) {
      return element.value;
    } else {
      return element.textContent;
    }
  }

  function updateElementValue(element, value){
    if (isInput(element)) {
      element.value = value;
    } else {
      element.textContent = value;
    }
  }

  function fieldsToBind(template){
    if (template.getAttribute(bindingKey)) {
      return [template];
    }

    return template.querySelectorAll(
      "[" + bindingKey + "]"
    );
  }

  function isInput(element){
    return element.nodeName.toUpperCase() === "INPUT" || element.nodeName.toUpperCase() === "TEXTAREA";
  }

  window.stik.ViewBag = ViewBag;

  window.stik.boundary({
    as: "$viewBag",
    from: "controller|behavior",
    inst: true,
    to: ViewBag
  });
})();
