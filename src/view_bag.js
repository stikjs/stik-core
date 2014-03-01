function viewBag($template){
  var obj = {},
      bindingKey = "data-bind";

  if (!$template) {
    throw "Stik viewBag needs to a view to be attached to";
  }

  function $push(dataSet){
    var fields = fieldsToBind(),
        i = fields.length,
        dataToBind;

    while(i--) {
      dataToBind = fields[i].getAttribute(bindingKey);

      if (dataSet[dataToBind] !== undefined) {
        updateElementValue(fields[i], dataSet[dataToBind]);
      }
    }
  } obj.$push = $push;

  function $pull(){
    var fields = fieldsToBind($template),
        dataSet = {},
        i = fields.length,
        key;

    while(i--) {
      key = fields[i].getAttribute(bindingKey);
      dataSet[key] = extractValueOf(fields[i]);
    }

    return dataSet;
  } obj.$pull = $pull;

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

  function fieldsToBind(){
    if ($template.getAttribute(bindingKey)) {
      return [$template];
    }

    return $template.querySelectorAll(
      "[" + bindingKey + "]"
    );
  }

  function isInput(element){
    return element.nodeName.toUpperCase() === "INPUT" || element.nodeName.toUpperCase() === "TEXTAREA";
  }

  return obj;
}

window.stik.viewBag = viewBag;

window.stik.boundary({
  as: "$viewBag",
  from: "controller|behavior",
  call: true,
  to: viewBag
});
