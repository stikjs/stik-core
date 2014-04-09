window.stik.boundary({
  as: "$courier",
  resolvable: true,
  cache: true,
  to: function courier(){
    var obj = {},
        subscriptions = {};

    obj.receive = function receive( box, opener ){
      var subscription = createSubscription({
        box: box, opener: opener
      });

      subscriptions[ box ] = ( subscriptions[ box ] || [] );
      subscriptions[ box ].push( subscription );

      return unsubscribe.bind( {}, subscription );
    };

    obj.send = function send( box, message ){
      var i = 0,
          foundAny = false;

      fetchSubscriptions( box , function( openers ){
        foundAny = true;
        i = openers.length;
        while ( i-- ) {
          openers[ i ].opener( message );
        }
      });

      if ( !foundAny ) { throw "Stik: No receiver registered for '" + box + "'"; }
    };

    function fetchSubscriptions( box, callback ){
      var pattern = new RegExp( box );

      for ( var sub in subscriptions ) {
        if ( pattern.exec( sub ) ) {
          callback( subscriptions[ sub ] );
        }
      }
    }

    function unsubscribe( subscription ){
      subscriptions[ subscription.box ] =
      subscriptions[ subscription.box ].filter( function( subs ){
        return subs.id !== subscription.id;
      });

      if ( subscriptions[ subscription.box ].length === 0 ) {
        delete subscriptions[ subscription.box ];
      }
    }

    function createSubscription( spec ){
      spec.id = '#' + Math.floor(
        Math.random()*16777215
      ).toString( 16 );

      return spec;
    }

    return obj;
  }
});
