window.stik.boundary({
  as: "$viewBag",
  resolvable: true,
  to: function viewBag( $template ){
    if (!$template) { throw "Stik: ViewBag needs a template to be attached to"; }

    var obj = {},
        bindingKey = "data-key";

    obj.push = function push( dataSet ){
      var fields = fieldsToBind(),
          i = fields.length,
          dataToBind;

      while( i-- ) {
        dataToBind = fields[ i ].getAttribute( bindingKey );

        if ( dataSet[ dataToBind ] !== undefined ) {
          updateElementValue( fields[ i ], dataSet[ dataToBind ] );
        }
      }
    };

    obj.pull = function pull(){
      var fields = fieldsToBind( $template ),
          dataSet = {},
          i = fields.length,
          key;

      while( i-- ) {
        key = fields[ i ].getAttribute( bindingKey );
        dataSet[ key ] = extractValueOf( fields[ i ] );
      }

      return dataSet;
    };

    function extractValueOf( element ){
      if ( isInput( element ) ) {
        return element.value;
      } else {
        return element.textContent;
      }
    }

    function updateElementValue( element, value ){
      if ( isInput( element ) ) {
        element.value = value;
      } else {
        element.textContent = value;
      }
    }

    function fieldsToBind(){
      if ( $template.getAttribute( bindingKey ) ) {
        return [ $template ];
      }

      return $template.querySelectorAll(
        "[" + bindingKey + "]"
      );
    }

    function isInput( element ){
      return element.nodeName.toUpperCase() === "INPUT" || element.nodeName.toUpperCase() === "TEXTAREA";
    }

    return obj;
  }
});
