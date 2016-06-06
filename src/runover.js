require('./lib/js/events');

var style   = require('raw!./lib/css/style.styl');
var Browser = require('./lib/js/browser');
var doc     = document;

console.log(style);

window.addEventListener('load',function (ev) {
  
  var body     = doc.querySelector('body');
  var selector = doc.createElement('div');
      selector.setAttribute('class','runover-selector');
      body.appendChild (selector);
      
  doc.addEventListener('mousemove',function (ev) {
    
    var target = document.elementFromPoint(ev.clientX,ev.clientY);
    if (!target) return;
    var box    = target.getBoundingClientRect();
    
    selector.style.top    = box.top;
    selector.style.left   = box.left;
    selector.style.width  = box.width;
    selector.style.height = box.height;
    
    selector.style.background = 'red';
    selector.style.opacity    = 0.5;
    selector.style.zIndex     = 9999999999999;
    selector.style.position   = 'fixed';
    
    selector.style.webkitPointerEvents
  = selector.style.mozPointerEvents
  = selector.style.msPointerEvents
  = selector.style.pointerEvents
  = 'none';
    
  });
  
});