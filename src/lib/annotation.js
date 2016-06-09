var helpers = require('./utils/helpers');

var RunoverAnnotation = function (target,rect,x,y)
{
  this.target = target;
  
  this.dom   = {};
  this.data  = { content:'',stats:{},x:x||0,y:y||0 };
  this.state = {
    target:   target,
    rect:     rect,
    selected: false,
    random:   0.1 + Math.random() * 0.2
  };
  
  this.dom.annotation = document.createElement('div');
  this.dom.annotation.setAttribute('class','runover-annotation');
  
  this.dom.pin = document.createElement('div');
  this.dom.pin.setAttribute('class','runover-annotation-pin');
  this.dom.annotation.appendChild(this.dom.pin);
  
  this.dom.message = document.createElement('div');
  this.dom.message.setAttribute('class','runover-annotation-message');
  this.dom.annotation.appendChild(this.dom.message);
  
  this.dom.arrow = document.createElement('div');
  this.dom.arrow.setAttribute('class','runover-annotation-arrow');
  this.dom.message.appendChild(this.dom.arrow);
  
  this.dom.info = document.createElement('div');
  this.dom.info.setAttribute('class','runover-annotation-info');
  this.dom.message.appendChild(this.dom.info);
  
  this.dom.text = document.createElement('textarea');
  this.dom.text.disabled = true;
  this.dom.text.setAttribute('class','runover-annotation-text');
  this.dom.message.appendChild(this.dom.text);
  
  this.dom.text.addEventListener('blur',(ev) => {
    ev.preventDefault();
    this.deselect();
  });
  
  this.recalculate();
}

RunoverAnnotation.prototype.getElement = function ()
{
  return this.dom.annotation;
}

RunoverAnnotation.prototype.select = function ()
{
  if (this._selected) return this;
  this._selected = true;
  this.dom.text.disabled = false;
  this.dom.annotation.setAttribute('data-runover-selected',true);
  this.dom.text.focus();
}

RunoverAnnotation.prototype.deselect = function ()
{
  if (!this._selected) return this;
  this._selected = false;
  this.dom.annotation.setAttribute('data-runover-selected',false);
  this.dom.text.blur();
  this.dom.text.disabled = true;
}

RunoverAnnotation.prototype.recalculate = function ()
{
  var rect = this.state.target.getRect();
  
  var cx = typeof this.state.cx === 'number'
  ? this.state.cx
  : rect.left + (rect.width  * this.data.x) - 14;
  var cy = typeof this.state.cy === 'number'
  ? this.state.cy
  : rect.top  + (rect.height * this.data.y) - 15;
  
  var tx = rect.left + (rect.width  * this.data.x) - 14;
  var ty = rect.top  + (rect.height * this.data.y) - 15;
  
  if (cx === tx && cy === ty) {
    var nx = tx;
    var ny = ty;
  } else {
    var nx = helpers.tween(cx,tx,this.state.random);
    var ny = helpers.tween(cy,ty,this.state.random);
  }
    
  this.dom.annotation.style.transform = 'translate('+nx+'px,'+ny+'px)';

  this.state.cx = nx;
  this.state.cy = ny;
}

module.exports = RunoverAnnotation;