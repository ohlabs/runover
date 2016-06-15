var shutter = module.exports = {};
var uidc = 0;
var size = 0;
var once = [];
var loop = {};
var ison = true;
var keyd = '__SHUTTER_DATA__';

var schedule =
window      .requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window   .mozRequestAnimationFrame ||
window    .msRequestAnimationFrame ||
window     .oRequestAnimationFrame ||
function () { setTimeout(cb,20) }

var cycle = function ()
{
  for (var id in loop) {
    var cb = loop[id];
    var data = cb[keyd];
    if (data.paused || (data.wait && data.wait--)) continue;
    data.last = cb(data.last);
    if (data.once) shutter.pop(id);
  } ison && schedule(cycle);
}

shutter.start = function ()
{
  if (!ison) { ison = true; cycle (); }
  return shutter;
}

shutter.stop = function ()
{
  ison = false;
  return shutter;
}

shutter.add =
shutter.push = function (cb)
{
  var id = (uidc++).toString();
  loop[id] || size++;
  cb[keyd] = {};
  loop[id] = cb;
  return id;
}

shutter.pop =
shutter.pull = function (id)
{
  loop[id] && size--;
  delete loop[id][keyd];
  delete loop[id];
  return shutter;
}

shutter.has
shutter.contains = function (id)
{
  return loop[id]
  ? true
  : false;
}

shutter.run =
shutter.render =
shutter.once = function (cb)
{
/*
  if (once.indexOf(cb) > -1)
  return shutter;
  once.push(cb);
  return shutter;
*/
  shutter.push(cb);
  cb[keyd].once = 1;
}

shutter.size
shutter.length = function ()
{
  return size;
}

cycle ();