var Rogie = Rogie || {};

Rogie.hoverFx = function( object, move, leave ) {

  move = move || function(){};
  var frameId = null;

  const frameListener = (e) => {
    animationFrameID = requestAnimationFrame(frameListener);
  };

  const mouseMove = (e) => {
    cancelAnimationFrame(frameId)
  	frameId = requestAnimationFrame(() => {
      var data = {
        rect: object.getBoundingClientRect(),
        mouseX: e.clientX,
        mouseY: e.clientY
      }
      data.xPercent = Math.abs(data.rect.x - data.mouseX)/data.rect.width * 100
      data.yPercent = Math.abs(data.rect.y - data.mouseY)/data.rect.height * 100
      move(object,data)
  	});
  }
  const mouseLeave = (e) => {
    leave(object)
  }
  object.addEventListener('mousemove', mouseMove)
  object.addEventListener('mouseleave', mouseLeave)

}
