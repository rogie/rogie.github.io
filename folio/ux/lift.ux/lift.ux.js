// This changes everything
"use strict";

var _STARFIELD = document.querySelectorAll('.starfield.masthead')[0];

function randomImageColor(sources,callback){

  var _this,
      callback = callback || function(){},
      _imagesLoaded = 0,
      _sources = sources.constructor.name == 'Array'? sources : [sources];

  function rgb2Hex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
  }
  function getColor(){
    var _c = _this._canvas.getContext('2d').getImageData(Math.random() * _this._image.width,0, 1, 1).data;
    return "#" + ("000000" + rgb2Hex(_c[0],_c[1],_c[2])).slice(-6);
  }
  _sources.forEach(function(src){

    var _this;

    if(src in randomImageColor){
      _this = randomImageColor[src];
      callback();
    } else {
      _this = randomImageColor[src] = {};
      _this._image = document.createElement('img');
      _this._image.src = src;
      _this._canvas = document.createElement('canvas');
      var imageLoaded = function(){
        _imagesLoaded++;
        _this._canvas.width = _this._image.width;
        _this._canvas.height = _this._image.height;
        _this._canvas.getContext('2d').drawImage(_this._image, 0, 0, _this._image.width, _this._image.height );
        if(_imagesLoaded == _sources.length){
          callback();
        }
      }
      if(_this._image.complete){
        imageLoaded();
      } else {
        _this._image.addEventListener('load',imageLoaded);
      }
    }
  });

  if(typeof sources == 'string' && sources in randomImageColor){
    _this = randomImageColor[sources];
    return getColor();
  } else {
    return false;
  }

}

var _starSpectrum = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAAKCAYAAABCOaxXAAAACXBIWXMAAAsTAAALEwEAmpwYAAANTklEQVR42s1cWa4kuQ1kZPXYwMAY+FS+uw/1FP6QRAUXVb3uwQz8gO5aUlIqJS7BIFX4739+p8HMaAaYmcEIzvcwf/X3j3x+5j97Zj97zPCiPTBjun59/1r9X3P8/RkPzB7Otvs7QK7z9NE2r3MPH+dFwwN79vx3f5g9LxgfMwPteeQ65J7Ps555vscDI2DAbIg1CfhkZmfgMXsQHhz2Mnv2RF8GWRA8j9Fesw1eq/0P78f1gFh9fQy8zLj7rGv2Y7a1szCwH8bVb36fxlmfiR9z/vaa85HxYY9xfd7X7VnPsTdSX7Gvwb+nr0VabGsEjI0QMgujyfd22pp94/Wv+WO6w/7MD235pj3X/1j/M1zFukp5fxtjvvF7SUNa6qTf7bbrGlMfpslT+6ex9d5+++Z7v2f+nuu9jLfbcazPct8x5PpuwzOejjso19ZnI20Q6760Meb6c8zvx6C39ffDbHC9/zL7Wvccg8Zh9kXONoP2NWgcsDHMvgZtkDbGvM985ew/zL6+eNqt/qfdGo9m40uu04wyxum/5jLm9T3nvV77u72m5x5zHbjWI6wnt5xwXcORGdLAJLsUEV7CgHQNUcwNzJIfX7cZgIlvW68QYX22Nq3rj20/uMYhwljTDaw+a7zHEPq4BcNpDx+XBoM94OwX2s25zfezHTBdSBgb05f98dtj//4n7I9/wP7122O//3jsmbt0FMQ4J7oVd2+UEUdpiLmgqx2GGZaJAeP+6L60xmxdAOEN99jef+wNVGmJm3qM+r4Z/DqYrQ1P8zWeChA6w4Rk1NabY0a5RmaUU05Hg2CtES3j2lCOKshWRs3Wed0ZLKsNn5U0B914+sNSbwl3Gr6H4nGon7HGcwvauCx9TkN83uxZuj/VZGQvpd5lf68bheiNLDv7n/TQP/GXV6Jz5vyJ/ucpIC7d1d/ge37ef3wW1BVB0ivaMYbaj7LEe5uRt72bhQIFpmfFfetblIR6D3fyx3TMuaEZJz04LnOd+oI1T/ouKNAA4nvIfp01ZgFnezKws8jeP+kTZKEpxt83TV/3PHAcCqmzoDsRx8GyGGepsO5H2S8awFanpg+Y/87CypxWwFg2GsnuCtDcc6Q6c7xXa3Zm1JecZ7+R/Afg6zSDWxFQnv5QcNBZaFQQHtbccIC0DysKKRe2biELmtxsbj3tsbGkfghqHekBtlZspEUG5z5ENvcYjrh5/IaCACbRoWjHdjYOKoLthrV+gGY2KOOKypCujCEaYo6OZJcd1aHeLDYLChCtBpND3hrG6B3JJDgJVRDF/uw2rkY+z7iOAaiYhDRgDxyWg78qRArVoLNCijWXIp+xDhCjgoVk4Eu4Wha+EWx39rLubkh0oPFrIfefCOh5GeYaPV+gR/RnsTfFjYtUFCgd7q8OWowkrXFUuDhn3gFIAOWI9vTteqboC4kRyDKiW4ws8zi2qDAQt8VnNfYegRECjpOeoNm5gmfX7gSvRAnRDmxgmgR9g+ABDmHi7aZ+T9PAiLZoAvoO6qDaLljv6GgOOLgQXrFF+pA+tqUoINrfgv0h8sYEJNV/SDxU9AMxMg9rj2q/He2tNSOrXdRxA/KlJVaMV2A+gl5aAN1UGWvADkwCFb6nBJ+516g+aCS6jDuaXUhC0coQJ738FYkkjLKvYiGozo4ZSVmgDzMXB1HSPP7BvgzgAhLkIwkXlHcL1idtz5ImMgtztIQo0iN84KJTeMWUDIgjxNopHIICgM7nqc/NSpUdHmUPdfXBVkO4HSQqhYbUDRLdgc1zAGc5kUMm4ViZ3BuszqEL5X41Ov8FB84LhX6bGe+BbLEhAYAKeD3xerZiKOwKb4CFHwP6Ix+X5ST6RTkR44eoKvvDbpsvjO1M/yUQgeIvq9GEtY76ajk9CofM6TjQY6SnjA8B/uxoB0a0g4aZKfTlNiDbESzF2g6brniIztpOQIahNjTlWaj0xrJpi9Uc+vTIsk8BCkx+kBVIJdOCpOLEBcSlqB05yEMf0DqsIYoEoUkvoQEPE1gkB80+nCvaSovUgxptWtPTFqvBjpYOxn6K/8qjnAgb7ntuloYFpcQInSFBJRF8jqap1HGOZhDsNC+KBnZB1KG5KbkKNQ4RBECIkUS1i3BTKX2L/UqEvJ+KlcuH0P5qxQJLcNCR3IHhOt9EOGSzZ/pIMOXbjkPIeSyBp6hqcXAWY1imqQoHJIuOy0Z7oy68EexMKd6B181L0f6Ovw7M45J24jdIgHtevY4WAHIeXwiazp7hA/2vrAqTY2UX+ScfmBk3CFujxhAXIMFP6bsuwmfM0KBDVjGTd90gmuYfImUamLeA4eGptONwGGmKhi6/azh61MgYODCkoJi0FZMWN5v1Q7ZKfZqcBxDBILuajxxUEk65T4o9cAMB8KEh/loCJ7MlKZdeakPQ2MIQCHbCy8ACeTILncydFIz7FNQEf0xGCMCR6B7riYfa5JQEqXmdXhOekyO3UIXCcfLQBamsqNxS8clNy4IiN6GMFy6klaMucqIIizAVpMfoZJqUa5B5cbJFalGtNFN0S0ZJZcMr5qgm048gVzGEmGM+NWJgBA/MGXCc6CDndqi5P8bcBQN/yUKZoUEIRxxV3qrL8Twe4ACLOTeYUUgXAhIdx9lwYu8c+F/v2FvDd3Hi72BHzzNouiNHcfU5A2ZM7EmXVcrkCMUR0nrqErinut8yAnhPe+MCOHBDQWw+8tRQjgboWiM63fiHEZSYmVWPNvNomYVCoqXzSrH3YG6fVh1TyqMFdxFzEEjsBttgKJQYtYt6IruZO85IEFVFYQmOwPAJhOG9YmjxZZuN04xm2lvkVIJQNsgVD0h0eMeoY/MQ1iS4kKYPA+i14wP09MIuRJ/iyQg4g5lDpKvY79UDNlS7aDLF0eaKUDQ0GEJBEopWk7EAIdjykpCjJR9TnPdGf5fktutN3WMcdk4cR0gVDIt1YykXdujp5DRpgW4qwuH0f8x8hlwz6+YWTr1xdNQ0RQmDD9Uf1K1UM0mhlXBZ6qSCQ84wmX0lOQ3LiZxcFUtIgg/WOSXbcu3Bt6Lxv552/85dcuSNbzh5lodWKMri2IsT7GoGG7aty6MjYS4kfQwMUBI7NJWymvq6LRgvC8vuuTILmYAMWSO8kBr6EO3v4rCdj76IeQiWKYH74IVdCQwTLBbZ5jxHtXMIkSUElNXSu8J07/k14F/zqN0ZipICDIzHQQkIT5VIjURGomMU0ZTCKObvUl2pgLngrhBoRgcOCuAC2zRNjIngdVq5PotiZ8ea8K5un6cizi5dS1l3ft9S6jWcdOGJ0JVyouRzKGiTSXnAdIQETaRoMQ/rpC1hHAyrTV5KFGnz2IP1FEt0pizCxgZlM9PnokB4dgUnwubUNC2Ck0fz7D31y+C8khicEwWoeRWtB8iGKzpnVtXVHPqV590RwHAyKCaqEmMi9RJscx+n4pUlZWBSqHOLUBo0ii6HYzGn+H/wd6ONv+vw+Y2AtlPoCqJ4dYpJZM5W3yjzrIOS/mOTY+8iLvIDr5+dNj8UFvBD7p+xHgTVMIXAp1141rCWbfbnnD7wYlxCyKNzLqFutHgt4rDwJid8fP6UeAINSlK7pTaW0UmCDgaowRjUPtkdyUek0/PvjJXeiFxCkDcFmIERT0W0ufapeHMkMUlFjlLDHsHXcuaUTi47iHFcmEeoV2NIwkLWZ7Mhw9ZxRj8tQF9/dDSRswyspUUpUHwKXCO96A0605SLYFPU8IRU8SIfeIsyYl4KhRpWo8FS5B434Q7f83lFXkIhN2oj0fTWUCBMFD3Q53lau3XEertMY6rggAAOGylnzlBdipzNlo0B2Gw+7N2DQUoJkQFIgA87H8bqRjR/ZkgFMku49/n9RCRbpg7ZQHJ8JxH97iz63/OXmbpPDvw73AKL9mTCMFo2NGkfNdBoologlY6gOuycym0r9hkjlrwrLcX9Dteh0a0PW/s2AdPk2rM9iCeIJM3B5kApUhoEKOVNp5bkQptYRApSbVNiZMDqETDLTBz8PHP0+xA7/4aigSIh9JR4OQK0Zh3KgC6s0eU8OVDJOkp8obV6Xl/2AV13NbMebGzgpSwXY3qQ+TdZJL0arDOR6ij2qQV45DzPkiOebWcfpYO5YumyDbaq3A/qqAcBQ4lNOXdZKVUa5g8xdFSYmG4EYcqVdmh/WCBEp8JtEdYauSJAjF2LQOc8bCMkaCt7k/NBk+RJOXU2aeGQn1IlohoMMbBAX0BiGvnXsowyixCtPEo+RSqX9Vy6l4ZIxeEpAKJX+bLQls2RqpujLhYgGxba2+rA77hK/oSX/skoHb+QAMD1PQJfhuBW6CfRL2npUpbARke6HCW+Uyig6oC70enEj9mwi6yxicyRf/hG7Q0b3bJU4d6sQ4FK+eciqHlWRBuIlDt3UL2ZiSaezgVI76r3w9HX2IJ6ZBOoa5B2MVPMxp17/cA0tYxEXXQ0aY999jrX5rQ/NtTJF+ztMUnNRNxAZmFd8rHAxYyGQ0OwcpIJXXU24/PldMnModMDme6HlMaiPOE1S5YSaXz/y1Qw+x/JTadA9a6VPAAAAABJRU5ErkJggg==';
var _coolSpectrum = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAABCAIAAACnuZzqAAAAeElEQVQY011OCQ4DMAgC7bv3wn1pZXhsWdY0BgFRPh+6gVdISYObxlBX40vdZLUfMIYbKrU8bMx2DtMeYsybyc3UX75ngwv6gJF8D5IJHbgaIoVTVYfN1L00c4yBGBXVFmNPGXbKIVFRmNlT/snRl8n9vfFn0Ujz3s/6Tv+5fc+1AAAAAElFTkSuQmCC';
var _hotSpectrum = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAABCAIAAACnuZzqAAAAbElEQVQY002NwXHDQBDDQEI1uNL0Tz8k+fLDYHfA7O+DXYvSolPsw69fyyUViy7hcjV2lavLKZzgw67JKZ+HtdHZG54tXYPvHE1kBaHhH8QglAW8DTTISsqaCLLcEAo/39c8wdFg6NbknADgCxiwHf/C7vveAAAAAElFTkSuQmCC';
var _hotterSpectrum = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAABCAIAAACnuZzqAAAAV0lEQVQYV32OSwrAMAgFR6H3P2TPoXbhJ0kLhSyeOsyLxH3hYILn08q1AddtbMAgFOvrAINliLElyfLv2ArdVf4POZhBCDbtr59k18n/+RswKW0CqxdcH5dXZHAAitD0AAAAAElFTkSuQmCC';
var _vibrantCoolSpectrum = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAABCAIAAACnuZzqAAAAmUlEQVR4ATWLB4JCIQxEHxmK7Qx7WG9tGVii31Aytdz/1jt4Fs+Qg7d4F6Z4BRYufkur8toBaYpZM2PZlRm4btGzaUYqGeiZcbDagVf/0ZY4lfHDzatp07XBSWuLp2/RnBXZU4EQYZS/JQUHkKigpDQhkjaoUrWrqKaLgYQHdKnBCbY7pI7P0oAzdBhp+YJOYthX6Qy3dI/5BzxATv/4WQQXAAAAAElFTkSuQmCC';
var _vibrantHotSpectrum = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAABCAIAAAATs2rlAAAAS0lEQVR4AS1KhRVDMRCKcNl/iQ75BegrPcfgz/ZzdMPv8ZN5K+B39WBEV2hwKXR0LMn38IWEV5DBPxDoUjC11W5R6DHIzVY2VXJbXz1dYJH9Rco7AAAAAElFTkSuQmCC';

randomImageColor([_vibrantHotSpectrum,_vibrantCoolSpectrum,_starSpectrum], renderEffects);

function renderEffects(){
  renderNavEffects();
  renderStarField();
  renderButtonEffects();
}

var starfield, starEffects;

function renderStarField(){

  // render stars
  starEffects = new Jubilee(
    _STARFIELD,
    {
      distance: 1,
      particles: 15,
      jitter: 0,
      delay: [0,4000],
      loop: true,
      direction: null,
      duration: [10000,20000],
      cssClass: 'starfield',
      container: 'parent',
      onParticleCreate: function(p,i){
        var _max_x = _STARFIELD.clientWidth*2,
            _max_y = _STARFIELD.clientHeight*2,
            _max_z = -200,
            _min_z = -1000;

        var starColor = randomImageColor(_starSpectrum);

        p.states.start.style.transform = 'scale(0.1)';
        p.states.start.style.backgroundColor = p.states.start.style.color = starColor;
        p.states.end.style.backgroundColor = p.states.end.style.color = starColor;
        p.states.start.x = p.states.end.x = _max_x*Math.random() - _max_x/2;
        p.states.start.y = p.states.end.y = _max_y*Math.random() - _max_y/2;
        p.states.start.z = p.states.end.z = _min_z*Math.random()/2 + _max_z*Math.random();
        p.states.end.z = function(){
          return 1000 + 200*Math.random();
        };
        p.states.end.style.transform = 'scale(0.5)';

        //random stars vs planets
        if(Math.random() > 0.2){
          p.particleNode.classList.add('star');
        }

        p.duration = function(){
          if(Math.random()<0.1){
            return [300,1000];
          } else {
            return [2000,5000];
          }
        };

        // a portion of the stars dont ever move — they just twinkle
        if(i%3 == 0){
          var distantColor = randomImageColor(_vibrantCoolSpectrum);
          p.states.start.style.transform = p.states.end.style.transform = 'scale(.3)';
          p.duration = [2000,4000];
          p.delay = [0,3000];
          p.particleNode.classList.add('twinkle');
          p.states.start.z = p.states.end.z = _min_z*Math.random()/2 + _min_z/2*Math.random();
          p.states.start.style.backgroundColor = p.states.start.style.color = distantColor;
          p.states.end.style.backgroundColor = p.states.end.style.color = distantColor;
        }

      }
    }
  ).play();

  var _clusterX = 0,
      _clusterY = 0,
      _clusterColor = _vibrantCoolSpectrum,
      _clusterRange = 200;

  new Jubilee(
    _STARFIELD,
    {
      distance: 0,
      particles: 15,
      jitter: 0,
      delay: 0,
      loop: false,
      direction: null,
      duration: [0,40000],
      cssClass: 'space-gas',
      container: 'parent',
      onParticleCreate: function(p,i){
        var _max_x = _STARFIELD.clientWidth,
            _max_y = _STARFIELD.clientHeight,
            _max_z = -200,
            _min_z = -1000,
            _randBlur = 50 + Math.random()*50,
            _randSize = 10 + Math.random()*50;

        //5 clusters
        if(i%6==0){
          _clusterX = _max_x*Math.random();
          _clusterY = _max_y*Math.random();
          _clusterColor = Math.random()>0.8? _vibrantHotSpectrum : _vibrantCoolSpectrum;
        }
        p.particleNode.style.opacity = 0.2 + Math.random()*0.2;
        p.states.end.style.color = p.states.start.style.color = randomImageColor(_clusterColor);
        p.states.start.x = p.states.end.x = _clusterX + Math.random()*_clusterRange;
        p.states.start.y = p.states.end.y = _clusterY + Math.random()*_clusterRange;
        p.states.start.style.boxShadow = p.states.end.style.boxShadow = '0 0 ' + _randBlur + 'px ' + _randSize + 'px';

      }
    }
  ).play();

}

function renderNavEffects(){
  new Jubilee(
    '.menu-item',
    {
      particles: 50,
      loop: true,
      direction: 'down',
      distance: 40,
      delay: [0,300],
      jitter: 0.1,
      duration: [100,200],
      cssClass: 'jetwash',
      container: 'parent',
      event:{play:'mouseenter',pause:'mouseleave'},
      onParticleCreate: function(p,i){
        p.states.start.x = 30 * Math.random() - 30/2;
        p.states.end.x = 0;

        var startColor = randomImageColor(_vibrantHotSpectrum),
            endColor = randomImageColor(_vibrantCoolSpectrum);

        p.states.start.style.boxShadow = '0 0 3px 2px ' + startColor;
        p.states.end.style.boxShadow = '0 0 0px 0px ' + endColor;

        p.states.start.style.backgroundColor = p.states.start.style.color = startColor;
        p.states.end.style.backgroundColor = p.states.end.style.color = endColor;

        p.states.start.style.transform = 'scale(2,2)';
        p.states.end.style.transform = 'scale(.25,.25)';
      }
    }
  );
}

function renderButtonEffects(){
  new Jubilee('.fl-button',{
    particles: 30,
    loop: false,
    direction: 'radial',
    distance: {start: 40, end: 100},
    delay: 0,
    jitter: 0.5,
    duration: 250,
    cssClass: 'burst',
    container: 'parent',
    event:{ play: 'click' },
    onParticleCreate: function(p,i){
      p.states.start.style.backgroundColor = p.states.start.style.color = function(){ return randomImageColor(Math.random() > 0.5? _vibrantHotSpectrum: _vibrantCoolSpectrum); };
      p.states.start.style.transform = function(){ return 'scale(' + (0.5 + Math.random()/2) + ',' + (0.5 + Math.random()/2) + ')'; };
      p.states.end.style.transform = p.states.start.style.transform;
      p.states.start.style.opacity = 1;
      p.states.end.style.opacity = 0;
    }
  });
}
