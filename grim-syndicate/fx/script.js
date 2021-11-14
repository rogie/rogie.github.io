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