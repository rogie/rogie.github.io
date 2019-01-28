/*jshint esversion: 6 */

function Palette(opts) {
  var canvas = document.createElement("canvas")
  var ctx = canvas.getContext("2d")
  var palette = []
  var dominant = []
  var key
  var that = this

  if (!opts.hasOwnProperty("passes")) {
    opts.passes = 500
  }
  if (opts.hasOwnProperty("palette") && opts.palette.length > 0) {
    palette = opts.palette
  }

  this.renderImage = function(img) {
    opts.canvasWidth = img.naturalWidth
    opts.canvasHeight = img.naturalHeight
    canvas.width = opts.canvasWidth
    canvas.height = opts.canvasHeight
    ctx.drawImage(img, 0, 0, opts.canvasWidth, opts.canvasHeight)
    if (palette.length > 0) {
      this.repositionColors(palette)
    } else {
      this.buildPalette()
    }

    if (typeof opts.load === "function") {
      opts.load.call(this, this)
    }
  }

  this.getImage = function() {
    return opts.image
  }

  this.removeImage = function() {
    delete opts.image
  }

  function toHex(num) {
    return ("0" + (Number(num).toString(16))).slice(-2).toUpperCase()
  }
  function rgba2Hex(rgba) {
    return `#${toHex(rgba[0])}${toHex(rgba[1])}${toHex(rgba[2])}`
  }
  function hex2Rgba(hex) {
    hex = hex.replace("#", "")
    return [
      parseInt(hex.substring(0, 2), 16),
      parseInt(hex.substring(2, 4), 16),
      parseInt(hex.substring(4, 6), 16)
    ]
  }
  function rgbaDistill(rgba) {
    var tmp = []
    for (var i in rgba) {
      tmp[i] = Math.min(255, Math.round(rgba[i] / 100) * 100)
    }
    return tmp
  }
  function darkestColor(color1, color2) {
    if (!color1) return color2
    if (!color2) return color1
    return parseInt(color1.hex.replace("#", ""), 16) < parseInt(color2.hex.replace("#", ""), 16) ? color1 : color2
  }

  function imageLoadCallback() {
    that.renderImage(opts.image)
    opts.image.removeEventListener("load", imageLoadCallback)
  }

  function isTransparent(color) {
    return color.alpha <= 0
  }

  function isOpaque(color) {
    return !isTransparent(color)
  }

  this.getAverageColor = function() {
    var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    var r = 0
    var g = 0
    var b = 0

    for (var i = 0, l = data.length; i < l; i += 4) {
      r += data[i]
      g += data[i+1]
      b += data[i+2]
    }

    r = Math.floor(r / (data.length / 4))
    g = Math.floor(g / (data.length / 4))
    b = Math.floor(b / (data.length / 4))

    var rgba = [r,g,b,1]
    return {
      rgba: rgba,
      alpha: rgba[3],
      hex: rgba2Hex(rgba)
    }
  }

  this.buildPalette = function() {
    palette = []
    for (var i = 0; i < opts.passes; ++i) {
      var color = this.getRandomColor()

      if (isTransparent(color)) {
        continue
      }

      if (palette[color.key]) {
        palette[color.key].frequency++
      } else {
        palette[color.key] = color
      }
    }
    this.getDominantColors()
  }

  this.getPalette = function() {
    return {
      palette: palette,
      dominant: dominant
    }
  }

  this.getDarkestColor = function(colors) {
    var darkest = null
    for (var c in colors) {
      if (colors[c] && colors[c].hex) {
        darkest = darkestColor(colors[c], darkest)
      }
    }
    return darkest
  }

  this.getDominantColors = function(num) {
    if (dominant.length === 0) {
      var tmp = {}
      var i = 0
      num = num || 5

      for (key in palette) {
        tmp[palette[key].frequency] = palette[key]
      }
      var frequencies = tmp.constructor.keys(tmp)
      frequencies.reverse()
      for (i in frequencies) {
        dominant.push(tmp[frequencies[i]])
      }
    }
    return dominant.slice(0, num)
  }

  this.getColorObject = function(rgba, x, y) {
    return {
      frequency: 1,
      rgba: rgba,
      alpha: rgba[3],
      hex: rgba2Hex(rgba),
      key: rgba2Hex(rgbaDistill(rgba)),
      x: x,
      y: y,
      dominant: false,
      xPercent: x / canvas.width * 100,
      yPercent: y / canvas.height * 100
    }
  }

  this.getRandomColor = function() {
    var x = Math.floor(Math.random() * canvas.width)
    var y = Math.floor(Math.random() * canvas.height)
    var rgba = ctx.getImageData(x, y, 1, 1).data

    return this.getColorObject(rgba, x, y)
  }

  this.getXYFromImageData = function(index, data) {
    return {
      x: (index / 4) % canvas.width,
      y: Math.floor(Math.floor(index / canvas.width) / 4)
    }
  }

  function lsd(c1, c2) {
    return Math.sqrt((Math.pow(c1[0] - c2[0], 2) + Math.pow(c1[1] - c2[1], 2) + Math.pow(c1[2] - c2[2], 2)))
  }

  this.repositionColor = function(color) {
    if (!color || !color.hex) return
    var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    var min = 999999
    var diff = 0
    var coords = {x: 0, y: 0}
    color.rgba = hex2Rgba(color.hex)
    for (var i = 0; i < data.length; i += 4) {
      diff = lsd(color.rgba, [data[i], data[i + 1], data[i + 2]])
      if (diff < min) {
        min = diff
        coords = this.getXYFromImageData(i, data)
      }
    }
    color.x = coords.x
    color.y = coords.y
    color.xPercent = (coords.x / (canvas.width)) * 100
    color.yPercent = (coords.y / (canvas.height)) * 100
  }

  this.repositionColors = function(colors) {
    for (var c in colors) {
      this.repositionColor(colors[c])
    }
  }

  this.rgba2Hex = rgba2Hex
  this.hex2Rgba = hex2Rgba

  this.getColorAt = function(x, y, relativeWidth, relativeHeight) {
    relativeWidth = relativeWidth || canvas.width
    relativeHeight = relativeHeight || canvas.height
    x = canvas.width / relativeWidth * x
    y = canvas.height / relativeHeight * y
    return this.getColorObject(ctx.getImageData(x, y, 1, 1).data, x, y)
  }

  if (opts.renderTo) {
    opts.renderTo.appendChild(canvas)
    canvas.width = opts.width * 2
    canvas.height = opts.height * 2
    canvas.style.width = `${opts.width}px`
    canvas.style.height = `${opts.height}px`
    ctx.scale(0.5, 0.5)
  }

  if (opts.image) {
    if (typeof opts.image === "string") {
      var tmpImg = new Image()
      tmpImg.crossOrigin = "Anonymous"
      tmpImg.src = opts.image
      opts.image = tmpImg
    } else {
      opts.image.crossOrigin = "Anonymous"
    }
    if(opts.image.complete){
      imageLoadCallback()
    }else{
      opts.image.addEventListener("load", imageLoadCallback)
    }
  }
}
