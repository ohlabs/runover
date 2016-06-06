require('./lib/js/events');

var Browser = require('./lib/js/browser');
var css     = require('raw!./lib/css/style.styl');

/*
window.addEventListener('load',function (ev) {
  
  var doc = document;
  
  var style = doc.createElement('style');
      style.appendChild(doc.createTextNode(css));
      doc.querySelector('head').appendChild(style);
      
  var body     = doc.querySelector('body');
  var selector = doc.createElement('div');
      selector.setAttribute('class','runover-selector');
      body.appendChild(selector);
      
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
*/

var RunOverNote = function ()
{
  
}

var RunOver = function ()
{
  this._ = {};
  this._.on        = false;
  this._.selecting = false;
  
  this._.dom = {};
  this._.dom.html = document.querySelector('html');
  
  this._.dom.selector = document.createElement('div');
  this._.dom.selector.setAttribute('class','runover-selector');
  document.querySelector('body').appendChild(this._.dom.selector);
  
  this._.dom.style = document.createElement('style');
  this._.dom.style.appendChild(document.createTextNode(css));
  document.querySelector('head').appendChild(this._.dom.style);
  
  this._.dom.html.setAttribute('data-runover',false);
  this._.dom.html.setAttribute('data-runover-selecting',false);
}

RunOver.prototype.poweron = function ()
{
  this._.on = true;
  this._.dom.html.setAttribute('data-runover',true);
  return this;
}

RunOver.prototype.poweroff = function ()
{
  this.stopSelecting()._.on = false;
  this._.dom.html.setAttribute('data-runover',false);
  return this;
}

RunOver.prototype.startSelecting = function ()
{
  if (!this._.on) return this;
  this._.selecting = true;
  this._.dom.html.setAttribute('data-runover-selecting',true);
  return this;
}

RunOver.prototype.stopSelecting = function ()
{
  this._.selecting = false;
  this._.dom.html.setAttribute('data-runover-selecting',false); 
  return this;
}

RunOver.prototype._mousemove = function ()
{
  if (!this._.selecting) return this;
  
}

RunOver.prototype.chooseSelection = function ()
{
  if (!this._.on) return this;
  
}

window.addEventListener('load',function (ev) {
  
  var runover = new RunOver ();
  
});