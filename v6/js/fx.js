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
  turbulence: ({element, selectors = null, animated = true, numOctaves = 1, baseFrequency = 1, scale = 20 } = {}) => {
    let filterId = svgFX.getFilterId("turbulence")
    let filter = `<filter id="${filterId}" width="100%" height="100%" x="0%" y="0%"><feTurbulence type="fractalNoise" baseFrequency="${baseFrequency}" id="turbulence" numOctaves="${numOctaves}" result="turbulenceOut" seed="2">
${animated? `<animate attributeName="baseFrequency" values="0.04 0.02;0 0.04;" 
from="0" to="100" dur="8s" 
repeatCount="indefinite"></animate>` : ""}
</feTurbulence>
<feDisplacementMap in="SourceGraphic" in2="turbulenceOut" scale="${scale}" xChannelSelector="R" yChannelSelector="B"></feDisplacementMap>
</filter>`
    svgFX.addFilter(element,selectors,filter)
  },
  chromaticAberration: ({element, selectors = null, offset = 1, blur = 0} = {}) => {
    let filterId = svgFX.getFilterId("chromatic-aberration")
    let filter = `<filter id="${filterId}">
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
        stdDeviation="${blur*6}" />
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