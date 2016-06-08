var RunoverTarget = require('./target');
var EE = require('events').EventEmitter;
var assign = require('lodash/assign');
var helpers = require('./utils/helpers');

var RunoverSelector = function (mask)
{
  EE.call(this);
  
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
  this._mask.setAttribute('data-runover-falltrough',true);
  
  var element
  = this._element
  = document.elementFromPoint(x,y);
  
  this._mask.setAttribute('data-runover-falltrough',false);
  
  var rect
  = this._rect
  = element
  ? element.getBoundingClientRect()
  : helpers.getDefaultRect();
  
  this._mask.style.top    = rect.top   .toFixed(0) + 'px';
  this._mask.style.left   = rect.left  .toFixed(0) + 'px';
  this._mask.style.width  = rect.width .toFixed(0) + 'px';
  this._mask.style.height = rect.height.toFixed(0) + 'px';
}

assign (RunoverSelector.prototype,EE.prototype);

module.exports = RunoverSelector;