var RunoverTarget = require('./target');
var EE = require('events').EventEmitter;
var assign = require('lodash/assign');
var utils = require('./utils/helpers');

var RunoverSelector = function (highlighter)
{
  EE.call(this);
  
  this._highlighter = highlighter || document.createElement('div');
  this._highlighter.addEventListener('click',(ev) => {
    ev.preventDefault();
    ev.stopImmediatePropagation();
    this.emit('select',new RunoverTarget(this._element),this._rect);
  });
  
  this._element = null;
  this._rect = utils.getDefaultRect();
  
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
  return this._highlighter;
}

RunoverSelector.prototype.recalculate = function (x,y)
{
  var element
  = this._element
  = document.elementFromPoint(x,y);
  
  var rect
  = this._rect
  = element
  ? element.getBoundingClientRect()
  : utils.getDefaultRect();
  
  this._highlighter.style.top    = rect.top   .toFixed(0) + 'px';
  this._highlighter.style.left   = rect.left  .toFixed(0) + 'px';
  this._highlighter.style.width  = rect.width .toFixed(0) + 'px';
  this._highlighter.style.height = rect.height.toFixed(0) + 'px';
}

assign (RunoverSelector.prototype,EE.prototype);

module.exports = RunoverSelector;