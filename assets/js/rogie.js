/*jshint esversion: 6 */

var Rogie = {
  touchDevice: false,
  lazyLoadImages: function(fragment) {
    var images = fragment.querySelectorAll('img');
    var imagesToLoad = [];
    function addImageListeners(image){
      if(image.complete){
        image.setAttribute('data-loaded','yes');
      } else {
        image.addEventListener('load',function(){
          image.setAttribute('data-loaded','yes');
        });
        image.addEventListener('error',function(){
          image.setAttribute('data-loaded','error');
        });
      }
    }
    function loadIfInViewport(){
      var nextImagesToLoad = [];
      imagesToLoad.forEach(function(image){
        if(Rogie.isInViewport(image)){
          image.setAttribute('src',image.getAttribute('data-src'));
          addImageListeners(image);
        } else {
          nextImagesToLoad.push(image);
        }
      });
      imagesToLoad = nextImagesToLoad;
    }
    images
      .forEach(function(image){
        image.setAttribute('data-loaded','no');
        image.setAttribute('data-src',image.getAttribute('src'));
        image.removeAttribute('src');
        imagesToLoad.push(image);
        addImageListeners(image);
    });
    window.removeEventListener('scroll',loadIfInViewport);
    window.addEventListener('scroll',loadIfInViewport);
    loadIfInViewport();
  },

  isInViewport: function( object, threshold ){
    var rect      = object.getBoundingClientRect();
    var winHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var threshold = threshold || 200;
    return rect.top < winHeight + threshold && rect.bottom > -threshold;
  },

  funLetters: function(fragment){
    var elements = fragment.querySelectorAll('.fun-letters');
    [].forEach.call(elements,function(word){
      [].forEach.call(word.childNodes,function(str){
        if(str.wholeText){
          word.innerHTML = str.wholeText.replace(/(.)/ig,'<span>$1</span>');
          [].forEach.call(word.querySelectorAll('span'),function(element,i){
            var r = (Math.cos(i)) * -10;
            element.style.transform = "rotate(" + r + "deg)";
          });
        }
      });
    });
  },

  getOffset: function(el) {
    var x = 0;
    var y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        x += el.offsetLeft - el.scrollLeft;
        y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: y, left: x };
  },

  mouseDistance: function(parent,objects,change,leave){
    function mouseMove(e) {
      var parentOffset = Rogie.getOffset(parent);
      var scrollTop = document.documentElement.scrollTop;
      //measure distance of mouse from children
      objects
        .forEach(function(object){
          var offset = Rogie.getOffset(object);
          var data = {
            parentX: e.clientX/(parentOffset.left + parent.clientWidth),
            parentY: (scrollTop + e.clientY)/(parentOffset.top + parent.clientHeight),
            x: (offset.left + object.clientWidth/2)/(parentOffset.left + parent.clientWidth),
            y: (offset.top + object.clientHeight/2)/(parentOffset.top + parent.clientHeight),
          };
          change(object,data);
        });
      }
      var mouseLeave = function(e){
    };
    parent.removeEventListener('mousemove', mouseMove);
    parent.removeEventListener('mouseleave', mouseLeave);
    parent.addEventListener('mousemove', mouseMove);
    parent.addEventListener('mouseleave', mouseLeave);
  },

  fetchPage: function(url, callback){
    // TODO: proper promise style js, not just a callback
    return fetch(url)
      .then(function(res){
        res.text().then(function(htmlTxt) {
          var domParser = new DOMParser();
          var doc = domParser.parseFromString(htmlTxt, 'text/html');
          callback( doc);
        });
    }).catch(function(){
      console.error('Error in fetching page at: ' + url);
    });
  },

  load: function(assets, onLoaded = () => {}){
    Rogie.loading();
    var numLoaded = 0;
    function assetLoaded(){
      numLoaded++;
      if(numLoaded == assets.length){
        onLoaded();
        Rogie.loaded();
      }
    }
    [].forEach.call(assets,function(asset){
      var img = new Image();
      img.addEventListener('loaded', assetLoaded);
      img.addEventListener('error', assetLoaded);
      if(img.complete){
        assetLoaded();
      }
      img.src = asset.src
    });
  },

  loading: function(){
    document.documentElement.classList.add("loading")
  },

  loaded: function(){
    document.documentElement.classList.remove("loading")
  },

  loadPage: function(url,callback){

    Rogie.loading();

    // TODO: error handling, 404 pages
    Rogie.fetchPage(url,function(doc){
      // Get page elements
      var pageContents = doc.querySelector('main');
      var pageTitle = doc.querySelector('title');

      var title = document.querySelector('title');
      title.parentNode.replaceChild(pageTitle,title);

      var main = document.querySelector('main');
      main.parentNode.replaceChild(pageContents,main);

      // eval scripts
      [].forEach.call(pageContents.querySelectorAll('script'),function(script){
        if(script.getAttribute('type') == 'text/javascript' || script.getAttribute('type') == null){
          eval(script.innerHTML);
        }
      });

      // Push this page into the url history/location
      history.pushState({title: pageTitle.innerText},pageTitle.innerText, url);
      document.location.hash = '✨';
      callback();

      Rogie.initFragment(pageContents);

      Rogie.loaded();

    });

    Rogie.Nav.close();

  },

  initPageLinks: function(fragment){
    var selector = '[href^="/"][href$="/"]';
    var currentPageClass = 'current-page';

    syncPageClasses();

    function syncPageClasses(){
      // Remove previous pages
      var previousPages = document.querySelectorAll('.' + currentPageClass + selector);
      [].forEach.call(previousPages,function(link){
        link.classList.remove(currentPageClass);
      });

      // Add classes
      var currentPages = document.querySelectorAll('[href="' + document.location.pathname + '"]');
      [].forEach.call(currentPages,function(link){
        link.classList.add(currentPageClass);
      });
    }

    function linkedPageLoad(e){
      e.preventDefault();
      Rogie.loadPage(this.getAttribute("href"),syncPageClasses);
    }

    window.addEventListener('popstate', syncPageClasses);

    [].forEach.call(fragment.querySelectorAll(selector),function(link){
      link.removeEventListener('click',linkedPageLoad);
      link.addEventListener('click',linkedPageLoad);
    });
  },

  Nav: function(){
    var nav = document.querySelector('nav');
    var items = nav.querySelectorAll('a:not([href^="#"])');
    var dist = 8;
    var time = 30;

    this.Nav.locationChanged = function(e){
      if(Rogie.Nav.isActive()){
        Rogie.Nav.open();
      } else {
        Rogie.Nav.close();
      }
    };

    this.Nav.isActive = function(){
      var hash = document.location.hash.replace('#','');
      return hash == nav.getAttribute('id');
    };

    this.Nav.open = function(){
      var active = this.isActive();

      items.forEach(function(item,i){
        var end = {
          x: Math.cos(-0.5 * Math.PI + 2*(1/items.length/(active? 1 : Math.PI))*i*Math.PI) * nav.clientWidth/2,
          y: Math.sin(-0.5 * Math.PI + 2*(1/items.length/(active? 1 : Math.PI))*i*Math.PI) * nav.clientWidth/2,
          r: 0,
          s: 1
        };
        item.style.transitionDuration = time;
        item.style.transitionDelay = (i+1)*time + "ms";
        item.style.transform = "scale(" + end.s + ") translate(calc(-50% + " + end.x + "px),calc(-50% + " + end.y + "px)) rotate(" + end.r + "deg)";
        setTimeout(function(){
          item.style.transitionDelay = "0ms";
        },(i+1)*time);
      });
    };

    this.Nav.close = function(){
      items.forEach(function(item,i){
        var start = {
          x: 0,
          y: 0,
          r: 0,
          s: 0
        };
        item.style.transitionDuration = time;
        item.style.transitionDelay = (i+1)*time + "ms";
        item.style.transform = "scale(" + start.s + ") translate(calc(-50% + " + start.x + "vw),calc(-50% + " + start.y + "vw)) rotate(" + start.r + "deg)";
      });
    };

    nav.addEventListener("mouseenter",function(e){
      if(!Rogie.Nav.isActive()){
        Rogie.Nav.open();
      }
    });
    nav.addEventListener("mouseleave",function(e){
      if(!Rogie.Nav.isActive()){
        Rogie.Nav.close();
      }
    });
    window.addEventListener("hashchange",this.Nav.locationChanged.bind(this.Nav));
    this.Nav.locationChanged();
  },

  initArt: function(fragment){
    //setup art galleries
    if(Rogie.hoverFx && Rogie.Zoom){
      if(Palette){
        /*fragment.querySelectorAll(".art-thumb img[src^='../assets']")
          .forEach(function(img){
            new Palette({image:img, load: function(p){
              img.parentNode.style.color = p.getDominantColors()[0].hex;
            }});
          });
        */
      }

      fragment.querySelectorAll(".art-thumb")
        .forEach((o) => {
          var link = o.querySelector('a');
          var shine = document.createElement('div');
          shine.className = "shine";
          link.appendChild(shine);
          Rogie.hoverFx(
            o,(object,data) => {
              link.style.transition = 'none';
              shine.style.transition = 'none';
              //link.style.boxShadow = `${(data.xPercent-50)/50 * 10}px ${(data.yPercent-50)/50 * 10}px 40px rgba(0,0,0,0.15)`;
              link.style.transform = "rotateY(" + -(data.xPercent - 50)/10 + "deg) rotateX(" + (data.yPercent - 50)/10 + "deg)";
              shine.style.display = 'block';
              shine.style.backgroundImage = `radial-gradient(circle at ${100-data.xPercent}% ${100-data.yPercent}%, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0))`;
            },
            (object) => {
              link.style.transition = null;
              shine.style.transition = null;
              link.style.transform = null;
            });
          o.addEventListener('click',(e) => {
            e.preventDefault();

            var img = o.querySelector('img');
            Rogie.Zoom({
              element: img,
              duration: 200,
              clone: true,
              padding: {top: 40, right: 40, left: 40, bottom: 40}
            });
          });
        });
    }
  },

  initFragment: function(fragment){
    Rogie.funLetters(fragment);
    Rogie.initPageLinks(fragment);
    Rogie.initArt(fragment);
    Rogie.load(fragment.querySelectorAll('img'));
    //Rogie.lazyLoadImages(fragment);
  },

  initNightMode: function(){
    var lightMode = document.getElementById('light-mode')
    NightMode(lightMode)
    function nightModeChanged(){
       if(lightMode.checked){
          setTimeout(function(){
            document.documentElement.classList.add("light-ui")
          },100);
       }else{
          setTimeout(function(){
            document.documentElement.classList.remove("light-ui")
          },100);
       }
    }

    lightMode.addEventListener('change',nightModeChanged)
    nightModeChanged()
  },

  init: function(){
    Rogie.Nav();
    Rogie.initFragment(document);
    Rogie.initNightMode();
    /*if(document.location.pathname == "/"){
      document.location.hash = '#nav';
    }*/
    window.addEventListener('touchstart', function() {
      Rogie.touchDevice = true;
      window.removeEventListener('touchstart', arguments.callee, false);
    });
  }

};
