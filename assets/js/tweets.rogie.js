if( window.twttr && twttr.widgets ){
  window.twttr.rndr = function(){
    Array.prototype.forEach.call(
      document.querySelectorAll('[tweet-id]'),
      function(elm){
        twttr.widgets.createTweet(
          elm.getAttribute('tweet-id'),
          elm,
          {
            linkColor: "#6122FF",
            width: 300,
            cards: 'visible',
            theme: 'light'
          }
        );
      }
    );
  }
}
