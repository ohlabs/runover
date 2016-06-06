require('./lib/js/polyfill');

var Browser = require('./lib/js/browser');
var css     = require('raw!./lib/css/style.styl');

var RunOverNote = function ()
{
  
}

var RunOver = function ()
{
  this._ = {};
  
  this._.af   = {};
  this._.tm   = {};
  this._.data = {};
  
  this._.state = {
    power:     true,
    selecting: false,
    mouse:     { x:0,y:0 },
    target:    null
  };
  
  this._.dom = {};
  this._.dom.html = document.querySelector('html');
  
  this._.dom.content = document.createElement('div');
  this._.dom.content.setAttribute('class','runover-content');
  document.querySelector('body').appendChild(this._.dom.content);
  
  this._.dom.selector = document.createElement('div');
  this._.dom.selector.setAttribute('class','runover-selector');
  this._.dom.content.appendChild(this._.dom.selector);
  
  this._.dom.anotations = document.createElement('div');
  this._.dom.anotations.setAttribute('class','runover-anotations');
  this._.dom.content.appendChild(this._.dom.anotations);
  
  this._.dom.style = document.createElement('style');
  this._.dom.style.appendChild(document.createTextNode(css));
  document.querySelector('head').appendChild(this._.dom.style);
  
  this._.dom.html.setAttribute('data-runover',this._.state.power);
  this._.dom.html.setAttribute('data-runover-selecting',this._.state.selecting);
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
  window.addEventListener('keyup',    this._stopSelecting.bind(this));
  
  window.addEventListener('keydown',(ev) => {
    if ((ev.keyCode || ev.which) == 16) this._startSelecting();
  });
}

RunOver.prototype.ison = function ()
{
  return this._.state.power === true;
}

RunOver.prototype.poweron = function ()
{
  this._.state.power = true;
  this._.dom.html.setAttribute('data-runover',true);
  return this;
}

RunOver.prototype.poweroff = function ()
{
  this.stopSelecting();
  this._.state.power = false;
  this._.dom.html.setAttribute('data-runover',false);
  return this;
}

RunOver.prototype._startSelecting = function (ev)
{
  if (!this._.state.power) return this;
  this._requestAnimationFrame (ev,'selectorTarget');
  this._requestAnimationFrame (ev,'selectorPosition');
  this._.state.selecting = true;
  this._.dom.html.setAttribute('data-runover-selecting',true);
  return this;
}

RunOver.prototype._stopSelecting = function ()
{
  if (!this._.state.selecting) return this;
  this._.state.selecting = false;
  this._.dom.html.setAttribute('data-runover-selecting',false); 
  return this;
}

RunOver.prototype._chooseSelection = function ()
{
  if (!this._.state.power) return this;
  
}

RunOver.prototype._requestAnimationFrame = function (ev,which)
{
  window.cancelAnimationFrame  (this._.af[which]); this._.af[which] =
  window.requestAnimationFrame (this['_'+which].bind(this,ev));
}

RunOver.prototype._selectorTarget = function (ev)
{
  var target = document.elementFromPoint(
    this._.state.mouse.x,
    this._.state.mouse.y
  );
  
  if (this._.state.target !== target) {
    this._.state.target = target;
    this._requestAnimationFrame(ev,'selectorPosition');
  }
}

RunOver.prototype._selectorPosition = function (ev)
{
  if (this._.state.target) {
    var box = this._.state.target.getBoundingClientRect();
  } else {
    var box = { height:0,width:0,top:0,left:0 };
  }
  
  this._.dom.selector.style.top    = box.top;
  this._.dom.selector.style.left   = box.left;
  this._.dom.selector.style.width  = box.width;
  this._.dom.selector.style.height = box.height;
}

RunOver.prototype._anotationPosition = function (ev)
{ 
  Object.keys(this._.data).forEach((a) => this._.data[a]._reposition());
}

RunOver.prototype._recalculate = function (ev)
{
  if (ev.type === 'mousemove') {
    
    this._.state.mouse.x = ev.clientX;
    this._.state.mouse.y = ev.clientY;
    
    if (!this._.state.power || !this._.state.selecting) return;
    
    clearTimeout(this._.tm.mousemove);
    
    this._.dom.html.setAttribute('data-runover-mousemove',true);
    
    this._.tm.mousemove = setTimeout(function(){
      this._.dom.html.setAttribute('data-runover-mousemove',false);
    }.bind(this),20);
    
    this._requestAnimationFrame (ev,'selectorTarget');
  }
  
  if (ev.type === 'scroll' || ev.type === 'resize') {
    if (!this._.state.power) return;
    clearTimeout(this._.tm.scroll);
    this._.dom.html.setAttribute('data-runover-scrolling',true);
    this._.tm.scroll = setTimeout(function(){
      this._.dom.html.setAttribute('data-runover-scrolling',false);
    }.bind(this),50);
    if (this._.state.selecting) {
      this._requestAnimationFrame (ev,'selectorPosition');
    }
    this._requestAnimationFrame (ev,'anotationPosition');
  }
}

window.addEventListener('load',function (ev) {
  
  var runover = new RunOver ();
  
});