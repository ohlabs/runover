var RunoverTarget = require('./target');
var EE = require('events').EventEmitter;
var assign = require('lodash/assign');
var helpers = require('./utils/helpers');

var RunoverSelector = function (mask)
{
  EE.call(this);
  
  this._last_rect = helpers.getDefaultRect();
  this._mask = mask || document.createElement('div');
  this._mask.addEventListener('click',(ev) => {
    ev.preventDefault();
    ev.stopImmediatePropagation();
    this.emit('select',new RunoverTarget(this._element),this._rect);
  });
  
  this._rect = helpers.getDefaultRect();
  this._element = null;
  
}

RunoverSelector.prototype.getTarget = function ()
{
  return this._element
  ? new RunoverTarget (this._element)
  : null;
}

RunoverSelector.prototype.hasElement = function ()
{
  return this._element !== null;
}

RunoverSelector.prototype.getElement = function ()
{
  return this._element;
}

RunoverSelector.prototype.getRect = function ()
{
  return this._rect;
}

RunoverSelector.prototype.getHighlighter = function ()
{
  return this._mask;
}

RunoverSelector.prototype.recalculate = function (x,y)
{
  this._mask.style.display = 'none';
  
  var element
  = this._element
  = document.elementFromPoint(x,y);
  
  this._mask.style.display = 'block';
  
  if (element === this._mask) { this._element = null; return }
  
  var rect
  = this._rect
  = element
  ? element.getBoundingClientRect()
  : helpers.getDefaultRect();
  
  var top    = opa(this._last_rect.top,   rect.top);
  var left   = opa(this._last_rect.left,  rect.left);
  var width  = opa(this._last_rect.width, rect.width);
  var height = opa(this._last_rect.height,rect.height);
  
  this._mask.style.top    = top   .toFixed(0) + 'px';
  this._mask.style.left   = left  .toFixed(0) + 'px';
  this._mask.style.width  = width .toFixed(0) + 'px';
  this._mask.style.height = height.toFixed(0) + 'px';
  
  this._last_rect = { top:top,left:left,width:width,height:height };
}

function opa (curr,next)
{
  var diff = Math.abs(curr-next) * 0.2;
  return curr > next ? (curr - diff) : (curr + diff);
}

assign (RunoverSelector.prototype,EE.prototype);

module.exports = RunoverSelector;