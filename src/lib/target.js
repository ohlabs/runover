var helpers = require('../utils/helpers');
var shutter = require('../utils/shutter');
var cache = {};

shutter.push(() => cache = {});

var RunoverTarget = function (element,x,y,segments)
{
  this._element  = element;
  this._x = x; this._y = y;
  this._r = 0.15 + Math.random() * 0.2;
  this._segments = segments || RunoverTarget.element2segments(element);
  this._selector = RunoverTarget.segments2selector(this._segments);
  this._path     = RunoverTarget.segments2path(this._segments);
}

RunoverTarget.fromPath = function (path)
{
  var segments = RunoverTarget.path2segments (path);
  var selector = RunoverTarget.segments2selector(segments);
  return new RunoverTarget (document.querySelector(selector),segments);
}

RunoverTarget.segments2path = function (segments)
{
  return segments.map(p => p.join(':')).join('/');
}

RunoverTarget.path2segments = function (path)
{
  return path
  .replace(/^\s*body\s*>\s*/,'')
  .split('/')
  .map(p => p.split(':'));
}

RunoverTarget.segments2selector = function (segments)
{
  if (!segments || !segments.length) return false;
  return 'body > ' + segments.map(p => p[0]+':nth-child('+p[1]+')')
  .join(' > ');
}

RunoverTarget.element2segments = function (element)
{
  if (!element) return [];
  
  var curr = element;
  var segments = [];
  
  while (curr.parentNode) {
    var parent = curr.parentNode;
    var index  = false;
    for (var i=0,c=0; i<parent.childNodes.length; i++) {
      var child = parent.childNodes[i];
      if (child === curr) { index = i-c+1; break; }
      if (child.nodeType !== Node.ELEMENT_NODE) { c++; continue; }
    }
    if (index === false) return [];
    segments.unshift([curr.tagName.toLowerCase(),index]);
    if (curr.parentNode.tagName === 'BODY') break;
    curr = parent;
  }
  
  return segments;
}

RunoverTarget.prototype.getElement = function ()
{
  return this._element;
}

RunoverTarget.prototype.getSelector = function ()
{
  return this._selector;
}

RunoverTarget.prototype.getPath = function ()
{
  return this._path;
}

RunoverTarget.prototype.getRect = function ()
{
  if (cache[this._path]) return cache[this._path];
  cache[this._path] = this._element
  ? this._element.getBoundingClientRect()
  : helpers.getDefaultRect();
  return cache[this._path];
}

RunoverTarget.prototype.getCurrXY = function ()
{
  var rect = this.getRect(); return {
    x: Math.round(rect.left + (rect.width  * this._x)),
    y: Math.round(rect.top  + (rect.height * this._y))
  }
}

RunoverTarget.prototype.isValid = function ()
{
  this._target !== null;
}

RunoverTarget.prototype.isMounted = function ()
{
  return document.documentElement.contains(this._element);
}

module.exports = RunoverTarget;