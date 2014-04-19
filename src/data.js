window.stik.boundary({
  as: "$data",
  resolvable: true,
  to: function( $template ){
    var attrs = {},
        attr, name;

    for ( attr in $template.attributes ) {
      if ( $template.attributes[ attr ].value ) {
        name = $template.attributes[ attr ].name;
        if (name.match(/^data-/m)) {
          attrs[ parseName( name ) ] =
            $template.attributes[ attr ].value;
        }
      }
    }

    function parseName( name ){
      return toCamelCase( name.match( /(data-)(.+)/ )[ 2 ] );
    }

    function toCamelCase(name){
      return name.replace( /-([a-z])/g, function( match ){
        return match[ 1 ].toUpperCase();
      });
    }

    return attrs;
  }
});
