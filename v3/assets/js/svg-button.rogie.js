function SVGButton( btn, viewBox, svgPath ){

    if(!btn) return;
    if('length' in btn && btn.length == 0) return;

    if( !(this instanceof SVGButton) ){
      new SVGButton( btn, svg );
      return;
    }

    function getObjects(selector){
      var objs = [];
      if( typeof selector == 'string' ){
        objs = document.querySelectorAll(selector);
      } else {
        if( 'length' in selector ){
          objs = selector;
        } else {
          objs = [selector];
        }
      }
      return objs;
    }

    var btnObjects = getObjects(btn);

    function initBtn(b){

      if(b.tagName.toLowerCase() == 'input') return;

        b.innerHTML = '<span>' + b.innerHTML + '</span>';
      //insert an svg/path
      var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      s.setAttribute('preserveAspectRatio','none');
      s.setAttribute('viewBox',viewBox);
      var path = document.createElementNS(s.namespaceURI,'path');
      s.appendChild(path);
      path.setAttribute('d',svgPath);
      s.setAttribute('fill','black');
      b.insertBefore(s,b.firstChild);

      b.classList.add('svg-button');
    }

    //inject the svg
    Array.prototype.forEach.call(btnObjects,initBtn);
};
