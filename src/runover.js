require('./lib/js/polyfill');

var Browser = require('./lib/js/browser');
var css     = require('raw!./lib/css/style.styl');

var RunOverNote = function ()
{
  
}

var RunOver = function ()
{
  this._ = {};
  this._.af         = {};
  this._.on         = true;
  this._.selecting  = false;
  this._.target     = null;
  this._.mouse      = { x:0,y:0 };
  this._.scrolltm   = null;
  this._.anotations = {};
  
  this._.dom = {};
  this._.dom.html = document.querySelector('html');
  
  this._.dom.content = document.createElement('div');
  this._.dom.content.setAttribute('class','runover-content');
  document.querySelector('body').appendChild(this._.dom.content);
  
  this._.dom.selector = document.createElement('div');
  this._.dom.selector.setAttribute('class','runover-selector');
  this._.dom.content.appendChild(this._.dom.selector);
  
  this._.dom.style = document.createElement('style');
  this._.dom.style.appendChild(document.createTextNode(css));
  document.querySelector('head').appendChild(this._.dom.style);
  
  this._.dom.html.setAttribute('data-runover',this._.on);
  this._.dom.html.setAttribute('data-runover-selecting',this._.selecting);
  this._.dom.html.setAttribute('data-runover-mousemove',false);
  this._.dom.html.setAttribute('data-runover-scrolling',false);
  
  this._.dom.selector.addEventListener('click',function (ev) {
    
    ev.preventDefault();
    ev.stopImmediatePropagation();
    console.log('click');
    
  });
  
  window.addEventListener('mousemove',this._recalculate.bind(this));
  window.addEventListener('scroll',   this._recalculate.bind(this));
  window.addEventListener('resize',   this._recalculate.bind(this));
  
  window.addEventListener('keyup',    this.stopSelecting.bind(this));
  window.addEventListener('keydown',  function (ev) {
    if ((code = ev.keyCode || ev.which) == 16) this.startSelecting();
  }.bind(this));
}

RunOver.prototype.ison = function ()
{
  return this._.on === true;
}

RunOver.prototype.poweron = function ()
{
  this._.on = true;
  this._.dom.html.setAttribute('data-runover',true);
  return this;
}

RunOver.prototype.poweroff = function ()
{
  this.stopSelecting();
  this._.on = false;
  this._.dom.html.setAttribute('data-runover',false);
  return this;
}

RunOver.prototype.startSelecting = function (ev)
{
  if (!this._.on) return this;
  this._requestAnimationFrame (ev,'selectorTarget');
  this._requestAnimationFrame (ev,'selectorPosition');
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

RunOver.prototype.chooseSelection = function ()
{
  if (!this._.on) return this;
  
}

RunOver.prototype._requestAnimationFrame = function (ev,which)
{
  window.cancelAnimationFrame  (this._.af[which]); this._.af[which] =
  window.requestAnimationFrame (this['_'+which].bind(this,ev));
}

RunOver.prototype._selectorTarget = function (ev)
{
  var target = document.elementFromPoint(this._.mouse.x,this._.mouse.y);
  if (this._.target !== target) {
    this._.target = target;
    this._requestAnimationFrame(ev,'selectorPosition');
  }
}

RunOver.prototype._selectorPosition = function (ev)
{
  if (this._.target) var box = this._.target.getBoundingClientRect();
  else               var box = { height:0,width:0,top:0,left:0 };
  
  this._.dom.selector.style.top    = box.top - 10;
  this._.dom.selector.style.left   = box.left - 10;
  this._.dom.selector.style.width  = box.width;
  this._.dom.selector.style.height = box.height;
}

RunOver.prototype._anotationPosition = function (ev)
{ 
  Object.keys(this._.anotations).forEach(function(a){
    this._.anotations[a]._reposition();
  });
}

RunOver.prototype._recalculate = function (ev)
{
  if (ev.type === 'mousemove') {
    this._.mouse.x = ev.clientX;
    this._.mouse.y = ev.clientY;
    if (!this._.on || !this._.selecting) return;
    clearTimeout(this._.mousemovetm);
    this._.dom.html.setAttribute('data-runover-mousemove',true);
    this._.mousemovetm = setTimeout(function(){
      this._.dom.html.setAttribute('data-runover-mousemove',false);
    }.bind(this),20);
    this._requestAnimationFrame (ev,'selectorTarget');
  }
  
  if (ev.type === 'scroll' || ev.type === 'resize') {
    if (!this._.on) return;
    clearTimeout(this._.scrolltm);
    this._.dom.html.setAttribute('data-runover-scrolling',true);
    this._.scrolltm = setTimeout(function(){
      this._.dom.html.setAttribute('data-runover-scrolling',false);
    }.bind(this),50);
    if (this._.selecting) this._requestAnimationFrame (ev,'selectorPosition');
    this._requestAnimationFrame (ev,'anotationPosition');
  }
}

window.addEventListener('load',function (ev) {
  
  var runover = new RunOver ();
  
});