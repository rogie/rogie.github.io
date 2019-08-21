/*jshint esversion: 6 */

var Rogie = Rogie || {};

Rogie.Zoom = ({
    element = null,
    padding = {top: 40, right: 40, left: 40, bottom: 40},
    duration = 200,
    clone = false,
    scrollOffset = 0,
    closeOnScroll = false,
    parent = document.documentElement,
    callback = () => {}
  } = {}) => {

  // trigger the zoom
  if(element.zoomed === true){
    return;
  }

  const getOffset = (el) => {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
  };

  // utils
  const applyCSS = (o,styles) => {
    var pre = (Array.prototype.slice
      .call(styles)
      .join('')
      .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1];
    for(var s in styles){
      o.style[s] = styles[s];
      o.style['-' + pre] = styles[s];
    }
  };

  const getFit = (el,to,padding) => {
    const elWidth = (el.naturalWidth || el.clientWidth);
    const elHeight = (el.naturalHeight || el.clientHeight);
    var hRatio = (Math.min(to.clientWidth - (padding.right + padding.left),elWidth)) / elWidth;
    var vRatio = (Math.min(to.clientHeight - (padding.top + padding.bottom),elHeight)) / elHeight;
    var ratio  = Math.min(hRatio,vRatio);
    var width =  (elWidth * ratio);
    var height = (elHeight * ratio);
    return {
      left: (to.clientWidth - width)/2 + (padding.left - padding.right) + 'px',
      top: (to.clientHeight - height)/2 + (padding.top - padding.bottom) + 'px',
      width: width + 'px',
      height: height + 'px'
    };
  };

  let reflow = (el) => {
    window.getComputedStyle(el);
    el.offsetLeft = el.offsetLeft;
  };

  const applyDefaults = (el) => {
    var cs = window.getComputedStyle(element);
    applyCSS(el,{
      position: "fixed",
      "will-change": "transform",
      display: cs.display,
      cursor: "zoom-out",
      borderRadius: cs.borderRadius,
      zIndex: Number(new Date().getTime().toString().match(/.{0,6}$/)) // last 6 characters of time
    });
  };

  // positions the object exactly the same as the to object
  const fixTo = (el,to) => {
    const toRect = to.getBoundingClientRect();
    toRect.width = to.clientWidth;
    toRect.height = to.clientHeight;
    const elRect = el.getBoundingClientRect();
    const left = (elRect.left + elRect.width/2) - (toRect.left + toRect.width/2);
    const top = (elRect.top + elRect.height/2) - (toRect.top + toRect.height/2);
    const xScale = toRect.width/elRect.width;
    const yScale = toRect.width/elRect.width;
    applyCSS(el,{
      transform: `translate(${-left}px,${-top}px) scale(${xScale},${yScale})`
    });
  };

  const setToFit = (el) => {
    var toFit = getFit(el,body,padding);
    applyCSS(el,toFit);
  };

  //setup vars
  const root = document.documentElement;
  const body = document.body;
  const placeholder = clone? element.cloneNode(): document.createElement('div');

  // chain it to its origin position
  //...if the user scrolls, reposition it
  const reChain = () => fixTo(element,placeholder);
  const reFit = () => applyCSS(element,getFit(element,body,padding));

  const zoomOut = (e) => {
    if(e && e.preventDefault){
      e.preventDefault();
    }
    element.zoomed = false;
    fixTo(element,placeholder);
    root.classList.remove('zoomed');
    element.classList.remove('zoomed');
    root.removeEventListener('click',zoomOut);
    window.removeEventListener('scroll',trackScroll);
    window.removeEventListener('resize',reFit);
    delete trackScroll.prevScrollY;
    setTimeout(() => {
      element.style = null;
      if(placeholder.parentNode !== parent){
        placeholder.parentNode.insertBefore(element,placeholder);
      }
      placeholder.parentNode.removeChild(placeholder);

      callback(element);
    },duration);
  };

  const trackScroll = (e) => {
    if(!closeOnScroll){
      return;
    }
    if(Math.abs(window.scrollY - trackScroll.prevScrollY) > scrollOffset){
      zoomOut();
    }
  };

  const zoom = () => {
    // create a placeholder object in its place
    placeholder.style.width = element.clientWidth + "px";
    placeholder.style.height = element.clientHeight + "px";
    placeholder.style.pointerEvents = 'none';
    placeholder.style.display = "block";

    // convert the element to fixed position, scaled
    setToFit(element);
    applyDefaults(element);

    // add the placeholder
    element.parentNode.insertBefore(placeholder,element);
    if(element.parentNode !== parent){
      parent.appendChild(element);
    }
    fixTo(element,placeholder);

    element.zoomed = true;
    root.classList.add('zoomed');
    element.classList.add('zoomed');

    setTimeout(() => {
      root.addEventListener('click',zoomOut);
      trackScroll.prevScrollY = window.scrollY;
      window.addEventListener('scroll',trackScroll);
      window.addEventListener('resize',reFit);

      // undo it scaling, to its fit/fixed position
      applyCSS(element,{
        transition: `transform ${duration}ms ease-in-out`,
        transform: 'none'
      });
    },1);
  };

  element.zoomOut = zoomOut;
  element.zoom = zoom;

  zoom();

};
