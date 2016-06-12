var modx = module.exports = {};
var uidc = 0;
var size = 0;
var once = [];
var loop = {};
var ison = false;

var schedule = 
window.requestAnimationFrame       ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame    ||
window.msRequestAnimationFrame     ||
window.oRequestAnimationFrame      ||
function () { setTimeout(cb,20) }

var cycle = function ()
{
  if (once.length) for (var i=0;i<once.length;i++) { once[i](); once.shift() }
  for (var id in loop) loop[id]();
  ison && schedule(cycle);
}

modx.start = function ()
{
  if (!ison) { ison = true; cycle (); }
  return modx;
}

modx.stop = function ()
{
  ison = false;
  return modx;
}

modx.add =
modx.push = function (cb)
{
  var id = (uidc++).toString();
  loop[id] || size++;
  loop[id] = cb;
  return id;
}

modx.pop =
modx.pull = function (id)
{
  loop[id] && size--;
  delete loop[id];
  return modx;
}

modx.has
modx.contains = function (id)
{
  return loop[id]
  ? true
  : false;
}

modx.run =
modx.render =
modx.once = function (cb)
{
  if (once.indexOf(cb) > -1)
  return modx;
  once.push(cb);
  return modx;
}

modx.size
modx.length = function ()
{
  return size;
}

modx.start ();