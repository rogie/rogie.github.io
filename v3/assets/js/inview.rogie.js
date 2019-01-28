function inview( objects, opts ){

  if( !(this instanceof inview) ){
    inview.instance = new inview( objects, opts );
    return inview.instance;
  }

  var _objects        = [],
      _observing      = false,
      _opts           = {
        threshold:    200,
        callback:     function(){},
        class:        'inview',
        delay:        100
      };

    _ext( _opts, opts );

    function _ext( o1,o2 ){

      for (var k in o2) {
          if (o2.hasOwnProperty(k)) o1[k] = o2[k];
      }

    }

    function _remove( objects ){

        var i,j;

        for( i=0;i<objects.length;++i ){
          j = _objects.indexOf(objects[i]);

          if( j > -1 ){
              _objects.splice(j,1);
          }

        }

    }

    function _apply( o, delay ){

      setTimeout(
        function(){
          o.classList.add( _opts.class );
          _opts.callback( o );
        },
        delay
      );

    }

  function _scan(){

    var toRemove = [], o, i;
    for( i=0; i<_objects.length; ++i ){

        o = _objects[i];

        if( inview.is( o, _opts.threshold ) ){

           _apply( o, _opts.delay );
          toRemove.push( o );

        }

    }

    _remove( toRemove );

  };

  for( var i=0; i<objects.length; ++i ){
    _objects.push( objects[i] );
  }

  if( !_observing ){

    window.addEventListener( 'scroll', _scan );
    _observing = true;

  }

  _scan();

};

inview.is = function( object, threshold ){

  var rect      = object.getBoundingClientRect(),
      midY      = rect.top + rect.height/2,
      winHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
      threshold = threshold || 0;

  //get percentage values
  if( typeof threshold == 'string' && threshold.indexOf('%') > 0 ){
    threshold = winHeight * parseInt(threshold,10)/100;
  }

  return (midY < (winHeight - winHeight/4 + threshold) && midY > (0 + winHeight/4 - threshold));

}
