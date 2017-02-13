function View(elements,opts){

  if( !(this instanceof View) ){
    new View( elements, opts );
    return;
  }

  // Utility functions
  function _ext( o1,o2 ){
    for (var k in o2) {
      if (o2.hasOwnProperty(k)) o1[k] = o2[k];
    }
  }
  function _getElements(selector){
    var e = null;
    if(!elements){
      return this;
    }
    if(typeof selector == 'string' ){
      e = document.querySelectorAll(selector);
    }else if(typeof selector == 'object' && 'length' in selector){
      e = selector;
    } else if(typeof selector == 'object' && elements.nodeName){
      e = [selector];
    }
    return e;
  }
  function _updateDOM(){
    Array.prototype.forEach.call( _CHILDREN, function(node,i){
      node.classList.remove('next','previous','current');
      if(i == _CURRENT){
        node.classList.add('current');
      }else if(i == _CURRENT - 1){
        node.classList.add('previous');
      }else if(i == _CURRENT + 1){
        node.classList.add('next');
      }
    });
  }
  function _getIndex(node){
    var idx = 0;
    Array.prototype.forEach.call( _CHILDREN, function(n,i){
      if(node == n){
        idx = i;
      }
    });
    return idx;
  }

  function _initChild(node){
    node.addEventListener('click',function(){
      _THIS.goto(this);
    });
  }
  function getDirectChildren(elm, sel){
    var ret = [], i = 0, l = elm.childNodes.length;
    for (var i; i < l; ++i){
        if (elm.childNodes[i].matchesSelector(sel)){
            ret.push(elm.childNodes[i]);
        }
    }
    return ret;
  }

  // get all of the elements that will become views
  elements = _getElements(elements);

  if(elements.length == 0){
    return this;
  }

  var _ELEMENT = null,
      _CHILDREN = [],
      _CURRENT = 0,
      _THIS = this,
      _OPTIONS = {
        className: 'view',
      };

  if(elements.length == 1){
    _ELEMENT = elements[0];
  } else {
    // create View logic to each of them
    Array.prototype.forEach.call( elements, function(el){ new View(el,opts); });
    return this;
  }

  // now that we have the dom shit figured, lets setup listeners
  _ELEMENT.classList.add(_OPTIONS.className)

  //get child nodes
  _CHILDREN = _ELEMENT.children;

  //setup interactions with child objects
  Array.prototype.forEach.call( _CHILDREN, _initChild );

  // PUBLIC functions
  this.goto = function(index){
    if(typeof index == 'number'){
      index = index<0 ? _CHILDREN.length : index;
      _CURRENT =  index%_CHILDREN.length;

    } else {
      _CURRENT = _getIndex(index);
    }
    _updateDOM();

  }

  this.next = function(){
    _THIS.goto(_CURRENT+1);
  }

  this.previous = function(){
    _THIS.goto(_CURRENT-1);
  }

  //selected in dom
  this.goto(_ELEMENT.querySelector('.current'));

  return this;

}
