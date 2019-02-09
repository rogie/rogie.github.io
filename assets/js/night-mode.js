/*jshint esversion: 6 */

function NightMode( checkbox ){
  checkbox.addEventListener('change',function(){
    localStorage.setItem("night-mode", JSON.stringify(checkbox.checked))
  })
  // check local storage
  var nm = JSON.parse(localStorage.getItem("night-mode"))
  if(nm == null){
    nm = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  checkbox.checked = nm || false
}
