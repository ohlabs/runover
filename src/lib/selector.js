var Target = require('./target');
var EE = require('events').EventEmitter;
var assign = require('lodash/assign');
var helpers = require('./utils/helpers');

function RunoverSelector (mask)
{
  EE.call(this);
  
  this.state = {
    mask:    null,
    rect:    null,
    element: null
  };
  
  this.dom = {
    mask: mask || document.createElement('div')
  };
  
  this.dom.mask.addEventListener('click',(ev) => {
    ev.preventDefault();
    ev.stopImmediatePropagation();
    var x = (ev.clientX - this.state.rect.left) / this.state.rect.width;
    var y = (ev.clientY - this.state.rect.top)  / this.state.rect.height;
    this.emit('select',new Target(this.state.element),this.state.rect,x,y);
  });
}

RunoverSelector.prototype.getTarget = function ()
{
  return this.state.element
  ? new RunoverTarget (this.state.element)
  : null;
}

RunoverSelector.prototype.hasElement = function ()
{
  return this.state.element !== null;
}

RunoverSelector.prototype.getElement = function ()
{
  return this.state.element;
}

RunoverSelector.prototype.getRect = function ()
{
  return this.state.rect;
}

RunoverSelector.prototype.getMask = function ()
{
  return this.dom.mask;
}

RunoverSelector.prototype.resetMaskPosition = function ()
{
  this.state.mask = null;
}

RunoverSelector.prototype.stop = function ()
{
  this.dom.mask.style.pointerEvents = 'none';
}

RunoverSelector.prototype.start = function ()
{
  this.dom.mask.style.pointerEvents = 'all';
}

RunoverSelector.prototype.recalculate = function (x,y)
{
  this.dom.mask.style.pointerEvents = 'none';
  var element = document.elementFromPoint(x,y);
  this.dom.mask.style.pointerEvents = 'all';
  if (element === this.dom.mask) return;
  this.state.element = element;
  
  var rect = this.state.rect = element
  ? element.getBoundingClientRect()
  : helpers.getDefaultRect();
  
  var c = this.state.mask !== null
  ? this.state.mask
  : rect;
  
  if (c === rect) {
    var n = c
  } else {
    var n = {
      top:    helpers.tween(c.top,   rect.top,   0.2),
      left:   helpers.tween(c.left,  rect.left,  0.2),
      width:  helpers.tween(c.width, rect.width, 0.2),
      height: helpers.tween(c.height,rect.height,0.2)
    }
  }
  
  this.dom.mask.style.top    = n.top    + 'px';
  this.dom.mask.style.left   = n.left   + 'px';
  this.dom.mask.style.width  = n.width  + 'px';
  this.dom.mask.style.height = n.height + 'px';
  
  this.state.mask = n;
}

assign (RunoverSelector.prototype,EE.prototype);

module.exports = RunoverSelector;