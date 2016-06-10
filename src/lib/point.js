var helpers = require('./utils/helpers');

function RunoverPoint (target,rect,x,y)
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
  
  this.dom.point = document.createElement('div');
  this.dom.point.setAttribute('class','runover-point');
  this.dom.point.setAttribute('data-runover-pulse',true);
  
  this.dom.pin = document.createElement('div');
  this.dom.pin.setAttribute('class','runover-point-pin');
  this.dom.point.appendChild(this.dom.pin);
  
  this.dom.message = document.createElement('div');
  this.dom.message.setAttribute('class','runover-point-message');
  this.dom.point.appendChild(this.dom.message);
  
  this.dom.arrow = document.createElement('div');
  this.dom.arrow.setAttribute('class','runover-point-arrow');
  this.dom.message.appendChild(this.dom.arrow);
  
  this.dom.info = document.createElement('div');
  this.dom.info.setAttribute('class','runover-point-info');
  this.dom.message.appendChild(this.dom.info);
  
  this.dom.text = document.createElement('textarea');
  this.dom.text.disabled = true;
  this.dom.text.setAttribute('class','runover-point-text');
  this.dom.message.appendChild(this.dom.text);
  
  this.dom.text.addEventListener('blur',(ev) => {
    ev.preventDefault();
    this.deselect();
  });
  
  this.recalculate();
}

RunoverPoint.prototype.getElement = function ()
{
  return this.dom.point;
}

RunoverPoint.prototype.select = function ()
{
  if (this._selected) return this;
  this._selected = true;
  this.dom.text.disabled = false;
  this.dom.point.setAttribute('data-runover-selected',true);
  this.dom.text.focus();
}

RunoverPoint.prototype.deselect = function ()
{
  if (!this._selected) return this;
  this._selected = false;
  this.dom.point.setAttribute('data-runover-selected',false);
  this.dom.text.blur();
  this.dom.text.disabled = true;
}

RunoverPoint.prototype.recalculate = function ()
{
  var rect = this.state.target.getRect();
  
  var tx = rect.left + (rect.width  * this.data.x) - 14;
  var ty = rect.top  + (rect.height * this.data.y) - 15;
  
  var cx = typeof this.state.cx === 'number'
  ? this.state.cx
  : rect.left + (rect.width  * this.data.x) - 14;
  var cy = typeof this.state.cy === 'number'
  ? this.state.cy
  : rect.top  + (rect.height * this.data.y) - 15;
  
  if (cx === tx && cy === ty) {
    var nx = tx;
    var ny = ty;
  } else {
    var nx = helpers.tween(cx,tx,this.state.random);
    var ny = helpers.tween(cy,ty,this.state.random);
  }
  
  this.dom.point.style.transform = 'translate('+nx+'px,'+ny+'px)';

  this.state.cx = nx;
  this.state.cy = ny;
}

module.exports = RunoverPoint;