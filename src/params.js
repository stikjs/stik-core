stik.boundary({
  as: "$params",
  resolvable: true,
  to: function( $template ){
    var attrs = {}, name;

    for ( attr in $template.attributes ) {
      if ( $template.attributes[ attr ].value ) {
        name = $template.attributes[ attr ].name
        attrs[ parseName( name ) ] =
          $template.attributes[ attr ].value;
      }
    }

    function parseName( name ){
      return name.match(/(data-)(.+)/)[ 2 ];
    }

    return attrs;
  }
});
