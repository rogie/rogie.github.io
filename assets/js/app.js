Rogie = {
  static: function() {
    var viewWidth,
        viewHeight,
        canvas = document.getElementById("canvas"),
        ctx;

    // change these settings
    var patternSize = 128,
        patternScaleX = 1.5,
        patternScaleY = 1.5,
        patternRefreshInterval = 6,
        patternAlpha = 20; // int between 0 and 255,

    var patternPixelDataLength = patternSize * patternSize * 4,
        patternCanvas,
        patternCtx,
        patternData,
        frame = 0;

    window.onload = function() {
        initCanvas();
        initGrain();
        requestAnimationFrame(loop);
    };

    // create a canvas which will render the grain
    function initCanvas() {
        viewWidth = canvas.width = canvas.clientWidth;
        viewHeight = canvas.height = canvas.clientHeight;
        ctx = canvas.getContext('2d');

        ctx.scale(patternScaleX, patternScaleY);
    }

    // create a canvas which will be used as a pattern
    function initGrain() {
        patternCanvas = document.createElement('canvas');
        patternCanvas.width = patternSize;
        patternCanvas.height = patternSize;
        patternCtx = patternCanvas.getContext('2d');
        patternData = patternCtx.createImageData(patternSize, patternSize);
    }

    // put a random shade of gray into every pixel of the pattern
    function update() {
        var value;

        for (var i = 0; i < patternPixelDataLength; i += 4) {
            value = (Math.random() * 255) | 0;

            patternData.data[i    ] = value;
            patternData.data[i + 1] = value;
            patternData.data[i + 2] = value;
            patternData.data[i + 3] = patternAlpha;
        }

        patternCtx.putImageData(patternData, 0, 0);
    }

    // fill the canvas using the pattern
    function draw() {
        ctx.clearRect(0, 0, viewWidth, viewHeight);

        ctx.fillStyle = ctx.createPattern(patternCanvas, 'repeat');
        ctx.fillRect(0, 0, viewWidth, viewHeight);
    }

    function loop() {
        if (++frame % patternRefreshInterval === 0) {
            update();
            draw();
        }

        requestAnimationFrame(loop);
    }

  },
  funLetters: function(fragment){
    var elements = fragment.querySelectorAll('.fun-letters');
    [].forEach.call(elements,function(word){
      [].forEach.call(word.childNodes,function(str){
        if(str.wholeText){
          word.innerHTML = str.wholeText.replace(/(.)/ig,'<span class="rgb-text-shift">$1</span>');
          [].forEach.call(word.querySelectorAll('span'),function(element,i){
            var r = (Math.cos(i)) * -10;
            element.style.transform = "rotate(" + r + "deg)";
          });
        }
      });
    });
  },

  addTunes: function(tracks) {
    this.tunes = tracks
  },
  loadRandomTune: function(autoplay){
    var player = document.querySelector(".tunes")
    var autoplay = autoplay || false;
    var track = this.tunes[Math.floor(Math.random()*this.tunes.length)]
    var name = player.querySelector(".tunes-name")
    var btn = player.querySelector(".tunes-play")
    var audio = this.audio = new Audio(track.audio)
    player.classList.remove("loaded")
    audio.volume = "0.05"
    name.innerHTML = track.name
    name.setAttribute('text', track.name)
    audio.addEventListener("loadeddata",function(){
      player.classList.add("loaded")
      btn.addEventListener("click",Rogie.toggleTune.bind(Rogie))
      if(autoplay){
        Rogie.toggleTune()
      }
    })
    audio.addEventListener("ended", function(){
      Rogie.loadRandomTune(true)
    });
  },
  toggleTune: function(){
    if(!this.audio) return

    var btn = document.querySelector(".tunes-play")
    if(this.audio.paused){
      this.audio.play()
      btn.setAttribute("text",btn.innerHTML = "❚❚")
    } else {
      this.audio.pause()
      btn.setAttribute("text",btn.innerHTML = "►")
    }
  },

  init: function() {

    // Static
    this.static();

    // audio
    this.addTunes([{
      audio: "assets/audio/inkwell-isle.mp3",
      name: "Inkwell Isle"
    },{
      audio: "assets/audio/maple-leaf-rag.mp3",
      name: "Maple Leaf Rag"
    },{
      audio: "assets/audio/steamboat-willie.mp3",
      name: "Steamboat Willie"
    },{
      audio: "assets/audio/delirium-tremens-rag.mp3",
      name: "Delirium Tremens Rag"
    }]);

    this.loadRandomTune();

    // Fun Letters
    this.funLetters(document.querySelector('body'));

    // CRT Text
    document.querySelectorAll('.rgb-text-shift').forEach(function(link){
      link.setAttribute('text',link.innerText)
    })

    // Sounds
    var hover = new Audio("assets/audio/ffvii-cursor-move.mp3")
    document.querySelectorAll('.nav-links a').forEach(function(link){
      link.addEventListener('mouseenter',function(){
        hover.volume = 0.1
        hover.load()
        hover.play()
      })
    })
    var click = new Audio("assets/audio/click.mp3")
    document.querySelectorAll('.nav-links a,.btn').forEach(function(link){
      link.addEventListener('mousedown',function(){
        click.volume = 0.05
        click.load()
        click.play()
      })
    })

    // fade in
    window.addEventListener("load",function(){
      document.body.classList.add("loaded")
    })
  }
}

Rogie.init()
