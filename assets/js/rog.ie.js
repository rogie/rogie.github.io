// This changes everything
"use strict";

var colors = ['#FF43AD','#A732FF','#FFB948','#6122FF','#00CAFF','#66FFB0'],
    classes = ['squiggle','heart','triangle','circle','heart','noodle','cross','pacman','box','star'];

function styleLetters(){
  var words = document.querySelectorAll('.styled-letters');
  Array.prototype.forEach.call(words,function(word){
    Array.prototype.forEach.call(word.childNodes,function(str){
      if(str.wholeText){
        word.innerHTML = str.wholeText.replace(/(.)/ig,'<span>$1</span>');
      }
    });
  });
}

function getEmail(){
  var coded = "jS@N1F.SD",
  key = "wafu1eXvdKl4ctDrnWRxZqTiNBHbGmsASQJ359Vk2hEMypgL0Ij6YCOFUoP78z",
  shift=coded.length,
  link="",
  ltr;

  for (var i=0; i<coded.length; i++) {
    if (key.indexOf(coded.charAt(i))==-1) {
      ltr = coded.charAt(i)
      link += (ltr)
    }
    else {
      ltr = (key.indexOf(coded.charAt(i))-shift+key.length) % key.length
      link += (key.charAt(ltr))
    }
  }
  return link;
}

function randVal(num,append){
    append = append || '';
    return (Math.random()>0.5?-1:1) * (Math.random()*num).toFixed(2) + append;
}

function randomTransform(){
  return 'translate3d(0,0,' + randVal(0,'px') + ') skewX(' + randVal(10,'deg') + ') scale3d(' + randVal(2,',') + randVal(2,',') + randVal(2) + ') rotate3d(' + randVal(1,',')  + randVal(1,',') + randVal(1) + ',10deg)';
}
function randomEndTransform(){
  return 'translate3d(0,0,' + randVal(200,'px') + ') skewX(' + randVal(10,'deg') + ') scale3d(' + randVal(4,',') + randVal(4,',') + randVal(4) + ') rotate3d(' + randVal(1,',')  + randVal(1,',') + randVal(1) + ',10deg)';
}


function init(){

  var _HTML = document.documentElement,
      _NAV = document.querySelector('nav'),
      _IDENTITY = _NAV.querySelector('.identity'),
      _LOGO = _NAV.querySelector('.identity>a'),
      _LOGO_SHADOW = _LOGO.querySelector('.shadow'),
      _LOGO_GRAPHIC = _LOGO.querySelector('.graphic'),
      _TAGLINE = _IDENTITY.querySelector('.tagline');


  Array.prototype.forEach.call(
    document.querySelectorAll('a.email'),
    function(elm){
      elm.setAttribute('href','mailto:' + getEmail() + '?' + elm.getAttribute('data-email-args'));
    }
  )

  //SVG buttons
  if('SVGButton' in window){
    new SVGButton(
      document.body.querySelectorAll('.btn'),
      '0 0 28 10',
      'M 0.108245 3.33245C 0.312457 1.80982 1.64228 0.811825 3.16355 0.597672C 7.40919 0 11.427 0 14 0L 14 0 16.573 9.0267e-34 20.5908 -1.11022e-16 24.8365 0.597672C 26.3577 0.811825 27.6875 1.80983 27.8918 3.33246C 28.0361 4.40858 28.0361 5.59142 27.8918 6.66753C 27.6875 8.19017 26.3577 9.18817 24.8364 9.40233C 20.5908 10 16.573 10 14 10L 14 10C 11.427 10 7.40919 10 3.16354 9.40233C 1.64228 9.18817 0.312457 8.19018 0.108245 6.66755C -0.0360816 5.59143 -0.0360816 4.40857 0.108245 3.33245Z'
    );
  }

  styleLetters();

  function dockLogo(){
    var dockPosition = window.innerHeight - 100,
        navBottom = window.scrollY || document.documentElement.scrollTop,
        minScale = 0.4;

    if(window.scrollY > dockPosition){
      navBottom = dockPosition;
    }
    if(navBottom > 10){
      _HTML.classList.add('nav-docking');
    } else {
      _HTML.classList.remove('nav-docking');
    }

    _NAV.style.bottom = navBottom.toFixed(2) + 'px';
    _TAGLINE.style.opacity = (1-navBottom/dockPosition*2).toFixed(2);
    _TAGLINE.style.marginTop = -(_TAGLINE.clientHeight*navBottom/dockPosition).toFixed(2) + 'px';
    _IDENTITY.style.transform = 'scale(' + (minScale + (1-minScale)*(1-navBottom/dockPosition)).toFixed(2) + ')';
  }

  if( !_HTML.classList.contains('nav-docked') ){
    window.addEventListener('scroll',dockLogo);
    window.addEventListener('resize',dockLogo);
    dockLogo();
  }

  View('.slideshow');

  Array.prototype.forEach.call(
    document.images,
    function(element){
      if( !inview.is(element,'200%') ){
        element.setAttribute('data-inview-src',element.getAttribute('src'));
        element.removeAttribute('src');
      }
    }
  );

  inview(
    document.querySelectorAll('[data-inview-src]'),
    {
      threshold: '100%',
      callback: function(element){
        element.setAttribute('src',element.getAttribute('data-inview-src'));
      }
    }
  );

  setTimeout(function(){

    var razzleDazzle = new Jubilee(
      _LOGO,
      {
        distance: {start: 50, end:200},//{start:0, end: 300},
        particles: 40,
        jitter:0,
        delay: [0,400],
        loop: true,
        direction: 'radial',
        cssClass: 'celebrate',
        container: 'parent',
        duration: [200,800],
        event:{toggle:'click'},
        onParticleCreate: function(p,i){
          var particleClass = classes[Math.floor(classes.length*Math.random())];
          p.states.start.style.transform = randomTransform;
          p.states.end.style.transform = randomEndTransform;
          p.states.start.style.color = function(){return colors[Math.floor(colors.length * Math.random())]};
          p.states.end.style.color = function(){return colors[Math.floor(colors.length * Math.random())]};
          p.particleNode.classList.add(particleClass);
          if(particleClass == 'star'){
            p.particleNode.innerHTML = '<svg width="51" height="73" viewBox="0 0 51 73" xmlns="http://www.w3.org/2000/svg"><path d="M51 36.007v-.014c-13.736-.378-24.813-16.304-24.998-35.993h-.005c-.187 19.928-11.531 36-25.498 36l-.5-.007v.014l.5-.007c14.083 0 25.5 16.342 25.5 36.5l-.002.5h.005l-.002-.5c0-19.919 11.148-36.112 25-36.493z" fill="#FFB94A"/></svg>';
          } else if (particleClass == 'noodle'){
            p.particleNode.innerHTML = '<svg width="33" height="45" viewBox="0 0 33 45" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Canvas" transform="translate(101 -1)" figma:type="canvas"><g id="Vector" style="mix-blend-mode:normal;" figma:type="vector"><use xlink:href="#path0_stroke" transform="matrix(0.5 0.866025 -0.866025 0.5 -80.5946 -4.73557)" fill="#9B51E0" style="mix-blend-mode:normal;"/></g></g><defs><path id="path0_stroke" d="M 0.758427 17.5L -2.21465 19.3468L 0.758427 17.5ZM -2.97308 18.1259L -2.21465 19.3468L 3.7315 15.6532L 2.97308 14.4322L -2.97308 18.1259ZM 41.2685 19.3468L 42.0269 20.5678L 47.9731 16.8741L 47.2146 15.6532L 41.2685 19.3468ZM -2.21465 19.3468C 4.16105 29.6106 19.0974 29.6106 25.4731 19.3468L 19.5269 15.6532C 15.8897 21.5085 7.36874 21.5085 3.7315 15.6532L -2.21465 19.3468ZM 25.4731 19.3468C 29.1103 13.4915 37.6313 13.4915 41.2685 19.3468L 47.2146 15.6532C 40.8389 5.38943 25.9026 5.38943 19.5269 15.6532L 25.4731 19.3468Z"/></defs></svg>';
          }
        }
      }
    ).play();

    setTimeout(razzleDazzle.pause,5000);

    if(!('ontouchstart' in window)){

      document.body.addEventListener('mousemove',function(e){
        var _x = (e.clientX/this.clientWidth - 0.5) * 15,
            _y = (e.clientY/this.clientHeight - 0.5) * 15;

        _LOGO_GRAPHIC.style.transform = 'translateX(' + -_x*2 + 'px) translateY(' + (-_y*2) + 'px)';
        _LOGO_SHADOW.style.transform = 'translateZ(-40px) translateX(' + _x + 'px) translateY(' + (-_y + 10) + 'px)';
        _LOGO.style.transform = 'rotateX(' + -_y*2 + 'deg) rotateY(' + -_x*2 + 'deg)';
      });

    }


    /*
    var initMotionState = null,
        lastMotionState = {x:0,y:0,z:0};

    window.addEventListener('devicemotion',function(e) {
      var _a = e.accelerationIncludingGravity,
          _transform = '';
      if(initMotionState == null){
        initMotionState = _a;
      }
      //_LOGO_GRAPHIC.style.transform = 'translateX(' + -_x*2 + 'px) translateY(' + (-_y*2) + 'px)';
      //_LOGO_SHADOW.style.transform = 'translateZ(-40px) translateX(' + _x + 'px) translateY(' + (-_y + 20) + 'px)';
      if(Math.abs(_a.x - lastMotionState.x) > 0.3){
        _transform += ' rotateY(' + _a.x*4 + 'deg) ';
      }
      if(Math.abs(_a.y - lastMotionState.y) > 0.3){
        _transform += ' rotateX(' + _a.x*4 + 'deg) ';
      }
      if(_transform != ''){
        _LOGO.style.transform = _transform;
        lastMotionState = _a;
      }
    });*/


  },1500
  );

  if( window.twttr && twttr.widgets ){
    window.twttr.rndr();
  }

}
