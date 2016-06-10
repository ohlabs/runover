var helpers = require('./utils/helpers');

var measure = document.createElement('div');
measure.setAttribute('display','none');


function RunoverPoint (target,rect,x,y,measure)
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
  
  this.dom.measure = measure;
  
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
  if (this.state.selected) return this;
  this.state.selected = true;
  this.dom.text.disabled = false;
  this.dom.point.setAttribute('data-runover-selected',true);
  this.dom.text.focus();
}

RunoverPoint.prototype.deselect = function ()
{
  if (!this.state.selected) return this;
  this.state.selected = false;
  this.dom.point.setAttribute('data-runover-selected',false);
  this.dom.text.blur();
  this.dom.text.disabled = true;
}

RunoverPoint.prototype.recalculate = function ()
{
  var rect = this.state.target.getRect();
  
  if (rect.top == 0 && rect.left == 0 && rect.height == 0 && rect.width == 0) {
    if (!this.hidden) this.dom.point.setAttribute('data-runover-hidden',true);
    this.hidden = true;
    return;
  } else {
    if (this.hidden) this.dom.point.setAttribute('data-runover-hidden',false);
    this.hidden = false;
  }
  
  var tx = Math.round(rect.left + (rect.width  * this.data.x) - 14);
  var ty = Math.round(rect.top  + (rect.height * this.data.y) - 15);
  
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
  
  this.dom.point.style
  .transform = 'translate('+nx+'px,'+ny+'px)';
  
  this.state.cx = nx;
  this.state.cy = ny;
}

module.exports = RunoverPoint;