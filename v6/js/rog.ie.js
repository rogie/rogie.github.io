let svgFX = {
  easings : {
  "easeInSine": "0.47, 0, 0.745, 0.715",
  "easeOutSine": "0.39, 0.575, 0.565, 1",
  "easeInOutSine": "0.445, 0.05, 0.55, 0.95",
  "easeInQuad": "0.55, 0.085, 0.68, 0.53",
  "easeOutQuad": "0.25, 0.46, 0.45, 0.94",
  "easeInOutQuad": "0.455, 0.03, 0.515, 0.955",
  "easeInCubic": "0.55, 0.055, 0.675, 0.19",
  "easeOutCubic": "0.215, 0.61, 0.355, 1",
  "easeInOutCubic": "0.645, 0.045, 0.355, 1",
  "easeInQuart": "0.895, 0.03, 0.685, 0.22",
  "easeOutQuart": "0.165, 0.84, 0.44, 1",
  "easeInOutQuart": "0.77, 0, 0.175, 1",
  "easeInQuint": "0.755, 0.05, 0.855, 0.06",
  "easeOutQuint": "0.23, 1, 0.32, 1",
  "easeInOutQuint": "0.86, 0, 0.07, 1",
  "easeInExpo": "0.95, 0.05, 0.795, 0.035",
  "easeOutExpo": "0.19, 1, 0.22, 1",
  "easeInOutExpo": "1, 0, 0, 1",
  "easeInCirc": "0.6, 0.04, 0.98, 0.335",
  "easeOutCirc": "0.075, 0.82, 0.165, 1",
  "easeInOutCirc": "0.785, 0.135, 0.15, 0.86",
  "easeInBack": "0.6, -0.28, 0.735, 0.045",
  "easeOutBack": "0.175, 0.885, 0.32, 1.275",
  "easeInOutBack": "0.68, -0.55, 0.265, 1.55"
},
animate: ({element, from, to, attribute = "d", duration = "2s", easing = svgFX.easings.easeInOutSine, direction = "alternate", repeatCount = "indefinite", fill = "remove"} = {}) => { 
  let elements = [].concat(element.forEach? Array.from(element) : [element])
  
  elements.forEach(e => {
    let fromPath = from || e.getAttribute(attribute)
    let values = [fromPath,to]
    if(direction === "alternate"){
      values.push(fromPath)
    }
    let keySplines = new Array(values.length-1)
    keySplines.fill(easing.replace(/,/g,""))
    let animation = document.createElementNS("http://www.w3.org/2000/svg", "animate")
    animation.setAttribute("attributeName","d")
    animation.setAttribute("keySplines", keySplines.join(";"))
    animation.setAttribute("calcMode","spline")
    animation.setAttribute("dur", duration)
    animation.setAttribute("values", values.join(";"))
    animation.setAttribute("fill",fill)
    animation.setAttribute("repeatCount",repeatCount)
    e.appendChild(animation)
  })
},  
addFilter: (svgElement,selectors,filter) => {
  
  let defs =  document.createElementNS("http://www.w3.org/2000/svg",'defs')
  svgElement.appendChild(defs)
  defs.innerHTML = filter
  let filterId = defs.querySelector('filter').getAttribute('id')
  let applyToNodes = selectors? svgElement.querySelectorAll(selectors) : [svgElement]
  
  applyToNodes.forEach((element) => {
    let priorFilters = element.getAttribute("filter") || element.style.filter || ""
    let newFilters = `${priorFilters} url(#${filterId})`.trim()
    //element.setAttribute("filter", newFilters)
    element.style.filter = newFilters
  })
},
getFilterId: (filterName) => {
  if(!svgFX.index){
    svgFX.index = 0
  }
  svgFX.index++
  return `${filterName}_${svgFX.index}`
},
noise: ({element, selectors = null, id = svgFX.getFilterId("noise"), numOctaves = 2, baseFrequency = 0.65} = {}) => {
  let filter = `<filter id="${id}">
    <feTurbulence 
      type='fractalNoise' 
      baseFrequency="${baseFrequency}"
      numOctaves="${numOctaves}" 
      stitchTiles='stitch' />
  </filter>`
  svgFX.addFilter(element,selectors,filter)
},
grainyShadow: ({
    element, 
    selectors = null, 
    id = svgFX.getFilterId("grainy-shadow"),
    numOctaves = 6,
    stdDeviation = 10, 
    baseFrequency = 0.75, 
    offsetX = 0, 
    offsetY = 10,
    opacity = 1,
    color = {
      r: 0, g: 0, b: 0
    } 
  } = {}) => {
  let filter = `<filter id="${id}" 
    x="-100%" 
    y="-100%" 
    width="400%" 
    height="400%">
    <feOffset result="offOut" in="SourceAlpha" dx="${offsetX}" dy="${offsetY}" />
    <feGaussianBlur result="blurOut" in="offOut" stdDeviation="${stdDeviation}" />
    <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
    <feTurbulence result="fNoise" type="fractalNoise" numOctaves="${numOctaves}" baseFrequency="${baseFrequency}" />
    <feColorMatrix in="fNoise" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 7 -3" result="clipNoise" />
    <feComposite id="noisemix" operator="arithmetic" in="blurOut" in2="clipNoise" k1="1" k2="1" result="SA-o-b-c-s-r-mix" />
    <feColorMatrix type="matrix" values="0 0 0 0 ${color.r/255}
                                           0 0 0 0 ${color.g/255}
                                           0 0 0 0 ${color.b/255}
                                           0 0 0 ${opacity} 0"/>
    <feMerge>
      <feMergeNode  />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>`
  svgFX.addFilter(element,selectors,filter)
},
insetGrainyShadow: ({
  element, 
  selectors = null, 
  id = svgFX.getFilterId("inset-grainy-shadow"),
  stdDeviation = 10, 
  offsetX = 0, 
  offsetY = 10,
  opacity = 1,
  baseFrequency = 0.05,
  color = "#000000" 
} = {}) => {
  let filter = `<filter id="${id}">
      <feOffset dx="${offsetX}" dy="${offsetY}" /><!-- Shadow Offset -->
      <feGaussianBlur stdDeviation="${stdDeviation}" result="offset-blur" /><!-- Shadow Blur -->
      <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" /> <!-- Invert the drop shadow to create an inner shadow -->
      <feFlood flood-color="${color}" flood-opacity="1" result="color" /> <!-- Color & Opacity -->
      <feTurbulence result="fNoise" type="fractalNoise" numOctaves="10" baseFrequency="${baseFrequency}" />
      <feColorMatrix in="fNoise" type="matrix" 
        values="1 0 0 0 0 
                0 1 0 0 0 
                0 0 1 0 0 
                0 0 0 8 -3" result="clipNoise" />
      <feComposite id="noisemix" operator="arithmetic" in="color" in2="clipNoise" k1="1" k2=".1" result="noisyShadow" />
      <feComposite operator="in" in="noisyShadow" in2="inverse" result="shadow" /> <!-- Clip color inside shadow -->
      <feComponentTransfer in="shadow" result="shadow">
        <!-- Shadow Opacity -->
        <feFuncA type="linear" slope="${opacity}" />
      </feComponentTransfer>
      <feBlend in="shadow" in2="SourceGraphic" mode="multiply" out="blend"/>
      <!-- Put shadow over original object -->
    </filter>`
    svgFX.addFilter(element,selectors,filter)
},
solidShadow: ({element, selectors = null, id = svgFX.getFilterId("solid-shadow"), dx = 2, dy = 4, stdDeviation = 0, color = "#000"} = {}) => {
  let filter = `<filter id="${id}">
    <feDropShadow dx="${dx}" dy="${dy}" stdDeviation="${stdDeviation}" flood-color="${color}"/>
  </filter>`
  svgFX.addFilter(element,selectors,filter)
},
strokedText: ({element, selectors = null, id = svgFX.getFilterId("stroked-text"), radius = 4, color = "#000"} = {}) => {
  let filter = `<filter id="${id}">
    <feMorphology in="SourceAlpha" operator="dilate" radius="${radius}" result="stroke"></feMorphology>            
    <feMerge>
      <feMergeNode in="stroke"></feMergeNode>
      <feMergeNode in="SourceGraphic"></feMergeNode>
    </feMerge>
  </filter>`
  svgFX.addFilter(element,selectors,filter)
},
dropShadow: ({
  element, 
  selectors = null, 
  id = svgFX.getFilterId("drop-shadow"),
  blur = 4.25, 
  x = 0, 
  y = 4,
  opacity = 1,
  grain = 2,
  spread = 1,
  color = "#000000" 
} = {}) => {

    let filter = `<filter id="${id}" color-interpolation-filters="sRGB" x="-50%" y="-50%" height="200%" width="200%">
      <!-- Take source alpha, offset it by angle/distance and blur it by size -->
      <feOffset in="SourceAlpha" dx="${x}" dy="${y}" result="SA-offset"/>
      <feGaussianBlur in="SA-offset" stdDeviation="${blur}" result="SA-o-blur"/>

      <!-- Apply a contour by using a color curve transform on the alpha and clipping the result to the input -->

      <feComponentTransfer in="SA-o-blur" result="SA-o-b-contIN">
        <feFuncA type="table" tableValues="0 0.05 0.15 0.4 0.5 0.6 0.85 0.95 1"/>
      </feComponentTransfer>

      <feComposite operator="in" in="SA-o-blur" in2="SA-o-b-contIN" result="SA-o-b-cont"/>

      <!-- Adjust the spread by multiplying alpha by a constant factor --> <feComponentTransfer in="SA-o-b-cont" result="SA-o-b-c-sprd">
        <feFuncA type="linear" slope="${spread}"/>
      </feComponentTransfer>

      <!-- Adjust color and opacity by adding fixed offsets and an opacity multiplier -->
      <feColorMatrix in="SA-o-b-c-sprd" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 ${opacity} 0" result="SA-o-b-c-s-recolor"/>

      <!-- Generate a reasonably grainy noise input with baseFrequency between approx .5 to 2.0. And add the noise with k1 and k2 multipliers that sum to 1 -->
      <feTurbulence result="fNoise" type="fractalNoise" numOctaves="6" baseFrequency="${grain}"/>
      <feColorMatrix in="fNoise" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 7 -3" result="clipNoise"/>
      <feComposite operator="arithmetic" in="SA-o-b-c-s-recolor" in2="clipNoise" k1="1" k2="0" result="SA-o-b-c-s-r-mix"/>

      <!-- Merge the shadow with the original -->
      <feMerge>
        <feMergeNode in="SA-o-b-c-s-r-mix"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>`
    
    svgFX.addFilter(element,selectors,filter)
},
turbulence: ({
  element, 
  selectors = null, 
  id = svgFX.getFilterId("turbulence"), 
  animated = false, numOctaves = 1, 
  baseFrequency = 1, 
  scale = 20 } = {}) => {

  let filter = `<filter 
    id="${id}" 
    width="100%" 
    height="100%" 
    x="0%" 
    y="0%">
      <feTurbulence 
        type="fractalNoise" 
        baseFrequency="${baseFrequency}" 
        numOctaves="${numOctaves}" 
        result="turbulenceOut" 
        seed="2">
        ${animated? `<animate attributeName="baseFrequency" values="0.04 0.02;0 0.04;" 
        from="0" to="100" dur="8s" 
        repeatCount="indefinite"></animate>` : ""}
      </feTurbulence>
      <feDisplacementMap 
        in="SourceGraphic" 
        in2="turbulenceOut" 
        scale="${scale}">
      </feDisplacementMap>
</filter>`
  svgFX.addFilter(element,selectors,filter)
},
chromaticAberration: ({element, selectors = null, id = svgFX.getFilterId("chromatic-aberration"), offset = 1, blur = 0} = {}) => {
  let filter = `<filter 
  id="${id}"
  x="-50%" 
  y="-50%" 
  width="150%" 
  height="150%">
    <feOffset
       dx="-${offset}"
       dy="0"
       id="feOffset22"
       in="SourceGraphic"
       result="result1" />
    <feOffset
       dx="0"
       dy="0"
       id="feOffset24"
       in="SourceGraphic"
       result="result2" />
    <feOffset
       dx="${offset}"
       dy="0"
       id="feOffset26"
       in="SourceGraphic"
       result="result3" />
    <feColorMatrix
       id="feColorMatrix28"
       in="result1"
       values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 "
       result="result4" />
    <feColorMatrix
       id="feColorMatrix30"
       in="result2"
       values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0 "
       result="result5" />
    <feColorMatrix
       id="feColorMatrix32"
       in="result3"
       values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0 "
       result="result6" />
    <feBlend
       mode="screen"
       id="feBlend34"
       in="result4"
       in2="result5"
       result="result7" />
    <feBlend
       mode="screen"
       id="feBlend36"
       in="result6"
       in2="result7"
       result="result8"/>
     <feGaussianBlur 
      in="SourceGraphic"
      result="blurred"
      stdDeviation="${blur}" />
    <feComponentTransfer in="blurred" result="alphablur">
      <feFuncA type="linear" slope="0.2"/>
    </feComponentTransfer>
    <feMerge> 
      <feMergeNode in="result8"/>
      <feMergeNode in="alphablur" /> 
    </feMerge>
  </filter>`
    svgFX.addFilter(element,selectors,filter)
}
}


function svgStringToCanvas(svgString) {

let canvas = document.createElement('canvas')
let ctx = canvas.getContext('2d')
let dpr = (window.devicePixelRatio || 1) * 2

const createSVGElement = (svg) => {
  let div = document.createElement('div')
  div.innerHTML = svg
  return div.firstChild
}
let svgElement = createSVGElement(svgString)

let width = svgElement.getAttribute("width")
let height = svgElement.getAttribute("height")
svgElement.clientWidth = width * dpr
svgElement.clientHeight = height * dpr

document.body.appendChild(svgElement)

let img = new Image()
img.onload = () => {
   canvas.width = width * dpr
   canvas.height = height * dpr
   canvas.style.width = `${width}px`
   canvas.style.height = `${height}px`
   //ctx.scale(dpr, dpr)
   ctx.drawImage(img,0,0,canvas.width,canvas.height)
  console.log(img.naturalWidth, img.naturalHeight)
}
img.src = `data:image/svg+xml;base64,${btoa(svgElement.outerHTML)}`

return canvas;
}

Rogie = {
  origin: (() => {
    let scripts = document.getElementsByTagName('script')
    let url = new URL(scripts[scripts.length - 1].src)
    return url.origin;
  })(),
  static: function(parent = document.body, canvasStyle = {
    position: 'absolute',
    opacity: 0.5
  }) {
    var viewWidth,
        viewHeight,
        canvas = document.createElement("canvas"),
        ctx;

    // change these settings
    var patternSize = 128,
        patternScaleX = 1,
        patternScaleY = 1,
        patternRefreshInterval = 6,
        patternAlpha = canvasStyle.opacity * 255; // int between 0 and 255,

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
        canvas.style.position = canvasStyle.position
        canvas.style.left = '0px'    
        canvas.style.right = '0px'    
        canvas.style.top = '0px' 
        canvas.style.bottom = '0px' 
        canvas.style.width = "100%"
        canvas.style.height = "100%"
        canvas.style.zIndex = '9999'
        canvas.style.pointerEvents = 'none'
        parent.append(canvas)
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
  slugify: function(text){
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  },

  funLetters: function(elements){

    function spanWords(e){
      e.childNodes.forEach(n => {
        if(n.nodeType === Node.TEXT_NODE){
         let span = document.createElement('span')
         span.innerHTML = n.textContent.replace(/([a-zA-Z'!•’-]+)/g,(word) => {
           let letters = word.replace(/(.)/ig,'<span class="letter">$1</span>')
           return `<span class="word">${letters}</span>`
         })
         n.parentNode.replaceChild(span,n)
        } else {
          spanWords(n)
        }
      })
    }
    
    elements.forEach((element) => {
      if(element.querySelectorAll(".letter").length === 0 && element.querySelectorAll(".word").length === 0 ){
        element.classList.add('fun-letters');
        spanWords(element)
        element.querySelectorAll("span.word").forEach(word => {
          word.querySelectorAll('span.letter').forEach((letter,i) => {
            var r = (Math.cos(i)) * -10;
            letter.style.transform = "rotate(" + r + "deg)"
          })
        })
      }
    })
  },

  circularText(selector, size) {

    function tSpanText(element){
      element.childNodes.forEach(node => {
        if(node.textContent.trim()){
          if(node.nodeType === Node.TEXT_NODE){
            let span = document.createElement('tspan')
            span.className = "letter"
            span.textContent = node.textContent
            node.parentNode.replaceChild(span,node)
          } else { 
            node.innerHTML = node.textContent.replace(/(.)/ig,'<tspan class="letter">$1</tspan>')
          }
        }
      })
      let letters = element.querySelectorAll(".letter")
      letters.forEach((letter,i) => {
        var r = (Math.cos(i)) * -10;
        letter.setAttribute("rotate",r);
      })
      return element.innerHTML
    }
    
    let elements = document.querySelectorAll(selector)
    elements.forEach(element => {
      let svg = `<svg 
        class="${element.className}" 
        xmlns="http://www.w3.org/2000/svg" 
        x="0px" 
        y="0px" 
        width="${size}" 
        height="${size}" 
        viewBox="0 0 ${size} ${size}">
        <defs>
          <path 
            id="circlePath" 
            d="M 0, ${size/2}
            a ${size/2},${size/2} 0 1,1 ${size},0
            a ${size/2},${size/2} 0 1,1 -${size},0"/>
        </defs>
        <g>
            <text fill="#fff">
                <textPath href="#circlePath">${tSpanText(element)}</textPath>
            </text>
        </g>
      </svg>`
      let div = document.createElement('div')
      div.innerHTML = svg
      element.parentNode.replaceChild(div.firstChild,element)
    })    
  },

  setupNotionNav(){
    let navItems = document.querySelectorAll(".super-navbar__item-list a")  
    if(navItems.length > 0){
      let nav = document.createElement("nav")
      nav.classList.add("global")
      let ul = document.createElement("ul")
      navItems.forEach(navItem => {
        let li = document.createElement("li")
        li.classList.add(this.slugify(navItem.innerText))
        navItem.removeAttribute("class")
        navItem.innerHTML = `<span>${navItem.innerHTML}</span>`
        li.append(navItem)
        ul.append(li)
      })
      nav.append(ul)
      document.body.prepend(nav)
    }
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
  hoverFx( object, move = () => {}, leave = () => {} ) {

    var frameId = null
  
    const frameListener = (e) => {
      animationFrameID = requestAnimationFrame(frameListener)
    }

    let active = false 
  
    const mouseMove = (e) => {
      active = true 
      cancelAnimationFrame(frameId)
        frameId = requestAnimationFrame(() => {
        var data = {
          rect: object.getBoundingClientRect(),
          mouseX: e.clientX,
          mouseY: e.clientY
        }
        data.xPercent = Math.abs(data.rect.x - data.mouseX)/data.rect.width * 100
        data.yPercent = Math.abs(data.rect.y - data.mouseY)/data.rect.height * 100
        if(active){
          move(object,data)
        }
      });
    }
    const mouseLeave = (e) => {
      active = false
      leave(object)
    }
    object.addEventListener('mousemove', mouseMove)
    object.addEventListener('mouseleave', mouseLeave)
  },
  fx: function() {
    // chromatic abberrations
    let fxSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    fxSVG.style.overflow = "visible"
    fxSVG.setAttribute("width",0)
    fxSVG.setAttribute("height",0)
    fxSVG.setAttribute("xmlns","http://www.w3.org/2000/svg")
    document.body.appendChild(fxSVG)
    let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

    svgFX.chromaticAberration({
      element: fxSVG,
      offset: 1, 
      id: "chromatic-aberration",
      blur: isSafari? 0 : 0.5 // Safari's minimum blur is 1 (too big for this effect)
    })
    svgFX.chromaticAberration({
      element: fxSVG,
      offset: 1, 
      id: "chromatic-aberration-small",
      blur: isSafari? 0 : 0.1 // Safari's minimum blur is 1 (too big for this effect)
    })

    svgFX.turbulence({
      element: fxSVG,
      numOctaves: 5, 
      scale: 1.25, 
      baseFrequency: 0.5, 
      id: "turbulence"
    })

    svgFX.turbulence({
      element: fxSVG,
      numOctaves: 5, 
      scale: 1.25, 
      baseFrequency: 0.5, 
      animated: true, 
      id: "turbulence-animated"
    })

    svgFX.noise({
      element: fxSVG,
      id: "noise"
    })

    svgFX.strokedText({
      element: fxSVG,
      radius: 2,
      id: "stroked-text"
    })

    svgFX.solidShadow({
      element: fxSVG,
      dx: 0,
      dy: 2,
      id: "solid-shadow"
    })

    svgFX.solidShadow({
      element: fxSVG,
      dx: 4,
      dy: 8,
      id: "solid-shadow-big"
    })

    svgFX.grainyShadow({
      element: fxSVG,
      offsetY: 0,
      baseFrequency: 1.25,
      stdDeviation: 20,
      opacity: 0.3,
      color: {r:255,g:0,b:0},
      id: "horror-shadow"
    })

    svgFX.grainyShadow({
      element: fxSVG,
      offsetY: 6,
      offsetX: 0,
      stdDeviation: 10,
      baseFrequency: 1,
      opacity: 1,
      id: "grainy-shadow-small"
    })

    svgFX.insetGrainyShadow({
      element: fxSVG,
      offsetY: 0,
      offsetX: -1.5,
      opacity: 2,
      stdDeviation: 3.5,
      baseFrequency: 1.5,
      id: "inset-grainy-shadow"
    })

    svgFX.insetGrainyShadow({
      element: fxSVG,
      offsetY: 0,
      offsetX: -2,
      opacity: 1.5,
      stdDeviation: 2,
      baseFrequency: 1,
      id: "inset-grainy-shadow-small"
    })

    svgFX.dropShadow({
      element: fxSVG,
      x: 0,  
      y: 6, 
      opacity: 1, 
      spread: 1, 
      grain: 1, 
      id: "grainy-shadow"
    })  

    // flexy nav
    let nav = document.querySelector("nav")
    let navItems = document.querySelectorAll("nav ul>li")
    let navTimeout
    if(nav){
      this.hoverFx(nav, (item,data) => {
        navItems.forEach((navItem,i) => {
          let rect = navItem.getBoundingClientRect()
          let xCenter = rect.left + rect.width/2
          let distFromXCenter = Math.abs(data.mouseX - xCenter)
          let scale = (1 - distFromXCenter/data.rect.width)*4
          navItem.style.width = navItem.style.height = `${24 * (1 + scale)}px`;
        })
      }, () => {
        clearTimeout(navTimeout)
        navTimeout = setTimeout(()=> {
          nav.style.background = ""
          navItems.forEach(li => li.style.width = li.style.height = "")
        },10)
      })
    }

  },

  init: function() {

    // Setup the Notion nav
    this.setupNotionNav()

    // FX
    this.fx();

    this.circularText('.rogie-intro .circular-text',256)

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

    //this.loadRandomTune();
    let funLettersSelector = "h1,h2 .notion-semantic-string>span,h3 .notion-semantic-string>span"
    let pageSelector = 'div[class^="page__"]'

    
    // Fun Letters
    this.funLetters(document.querySelectorAll(funLettersSelector));

    function updatePagePath(){
      document.documentElement.removeAttribute('page')
      document.documentElement.setAttribute('page',document.location.pathname)
    }

    updatePagePath()

    // Listen to DOM subtree changes for funletters
    var oldHref = document.location.href;

    window.onload = function() {
        var observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (oldHref != document.location.href) {
                    oldHref = document.location.href;
                    /* Changed ! your code here */
                    updatePagePath()
                    let funLetters = document.querySelectorAll(funLettersSelector)
                    Rogie.funLetters(funLetters)
                }
            })
        })
        observer.observe(document.querySelector("body"), {childList: true, subtree: true })
    };

    // Sounds
    var hover = new Audio(`${this.origin}/assets/audio/ffvii-cursor-move.mp3`)
    document.querySelectorAll('.notion-link').forEach(function(link){
      if(link.querySelector('.notion-page__icon')){
        link.addEventListener('mouseenter',function(){
          hover.volume = 0.05
          hover.load()
          hover.play()
        })
      }
    })
    var click = new Audio(`${this.origin}/assets/audio/click.mp3`)
    document.querySelectorAll('nav a,.btn').forEach(function(link){
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