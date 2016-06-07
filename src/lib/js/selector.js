var defaultrect = { height:0,width:0,top:0,bottom:0 };
var RunoverTarget = require('./target');

var RunoverSelector = function (wrap,cb)
{
  this._highlighter = document.createElement('div');
  this._highlighter.setAttribute('class','runover-selector');
  this._element = null;
  this._rect = defaultrect;
  
  wrap.appendChild(this._highlighter);
  this._highlighter.addEventListener('click',(ev) => {
    ev.preventDefault();
    ev.stopImmediatePropagation();
    if (!this._element) return;
    cb (new RunoverTarget(this._element),this._rect);
  });
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
  : defaultrect;
  
  this._highlighter.style.top    = rect.top   .toFixed(0) + 'px';
  this._highlighter.style.left   = rect.left  .toFixed(0) + 'px';
  this._highlighter.style.width  = rect.width .toFixed(0) + 'px';
  this._highlighter.style.height = rect.height.toFixed(0) + 'px';
}

module.exports = RunoverSelector;