var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

let svgFX = {
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
  blur: ({element, selectors = null, amount = 0, edgeMode = "duplicate"} = {}) => {
    let filterId = svgFX.getFilterId("blur")
    let stdDeviation = parseFloat(amount)
    var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    if(isSafari){
      stdDeviation = stdDeviation + "px"
    }
    let filter = `<filter id="${filterId}">
      <feGaussianBlur 
        in="SourceGraphic"
        edgeMode="${edgeMode}"
        stdDeviation="${stdDeviation}" />
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


async function svgStringToCanvas({svgString, width = null, height = null} = {}) {
  return new Promise((resolve, reject) => {
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    let dpr = (window.devicePixelRatio || 1) * 2

    const createSVGElement = (svg) => {
      let div = document.createElement('div')
      div.innerHTML = svg
      return div.firstChild
    }
    let svgElement = createSVGElement(svgString)

    let canvasWidth = width || svgElement.getAttribute("width")
    let canvasHeight = height || svgElement.getAttribute("height")
    svgElement.clientWidth = width * dpr
    svgElement.clientHeight = height * dpr

    let img = new Image()
    img.onload = () => {
       canvas.width = canvasWidth * dpr
       canvas.height = canvasHeight * dpr
       canvas.style.width = `${canvasWidth}px`
       canvas.style.height = `${canvasHeight}px`
       //ctx.scale(dpr, dpr)
       ctx.drawImage(img,0,0,canvas.width,canvas.height)
      resolve(canvas)
    }
    img.onerror = reject
    img.src = `data:image/svg+xml;base64,${btoa(svgElement.outerHTML)}`    
  })
}

new Vue({
  el: '#app',
  data: {
    image: '',
    svg: '',
    file: null
  },
  methods:{
    fileSelected(event){
      this.file = event.target.files.item(0);
      const reader = new FileReader();
      reader.addEventListener('load', this.imageLoaded);
      reader.readAsDataURL(this.file);
    },
    createSVGElement(svg){
      let div = document.createElement('div')
      div.innerHTML = svg
      return div.firstChild
    },
    imageLoaded(event){
      this.image = event.target.result;
      
      this.svg = atob(this.image.replace("data:image/svg+xml;base64,",""))
      let svgElement = this.createSVGElement(this.svg)
      svgFX.chromaticAberration({
        element: svgElement,
        offset: 1.5,
        selectors: null,
        blur: isSafari? 0 : 0.25 // Safari's minimum blur is 1 (too big for this effect)
      })
      this.svg = svgElement.outerHTML   
      
    },
    async download(){  
      let canvas = await svgStringToCanvas({svgString: this.svg, width: 640, height: 640})
      let downloadLink = document.createElement('a')
      downloadLink.setAttribute('download', this.file.name.replace(".svg",".png"))

      canvas.toBlob(function(blob) {
        let url = URL.createObjectURL(blob)
        downloadLink.setAttribute('href', url)
        downloadLink.click()
      })
    }
  }
})