var helpers = require('./utils/helpers');

var RunoverTarget = function (element,points)
{
  this._element  = element;
  this._points   = points || RunoverTarget.element2points(element);
  this._selector = RunoverTarget.points2selector(this._points);
  this._path     = RunoverTarget.points2path(this._points);
}

RunoverTarget.fromPath = function (path)
{
  var points   = RunoverTarget.path2points (path);
  var selector = RunoverTarget.points2selector(points);
  return new RunoverTarget (document.querySelector(selector),points);
}

RunoverTarget.points2path = function (points)
{
  return points.map(p => p.join(':')).join('/');
}

RunoverTarget.path2points = function (path)
{
  return path
  .replace(/^\s*body\s*>\s*/,'')
  .split('/')
  .map(p => p.split(':'));
}

RunoverTarget.points2selector = function (points)
{
  if (!points || !points.length) return false;
  return 'body > ' + points.map(p => p[0]+':nth-child('+p[1]+')')
  .join(' > ');
}

RunoverTarget.element2points = function (element)
{
  if (!element) return [];
  
  var curr = element;
  var points = [];
  
  while (curr.parentNode) {
    var parent = curr.parentNode;
    var index  = false;
    for (var i=0,c=0; i<parent.childNodes.length; i++) {
      var child = parent.childNodes[i];
      if (child === curr) { index = i-c+1; break; }
      if (child.nodeType !== Node.ELEMENT_NODE) { c++; continue; }
    }
    if (index === false) return [];
    points.unshift([curr.tagName.toLowerCase(),index]);
    if (curr.parentNode.tagName === 'BODY') break;
    curr = parent;
  }
  
  return points;
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
  return this._element
  ? this._element.getBoundingClientRect()
  : helpers.getDefaultRect();
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