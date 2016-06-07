var Shutter = function ()
{
  this._uid     = 0;
  this._running = false;
  this._stack   = {};
  this._once    = [];
  this._cycle   = this.cycle.bind(this);
}

Shutter.prototype.start = function ()
{
  this._running = true;
  this._cycle ();
  return this;
}

Shutter.prototype.stop = function ()
{
  this._running = false;
  return this;
}

Shutter.prototype.push = function (cb)
{
  var uid = ':' + (this._uid++);
  this._stack[uid] = cb;
  return uid;
}

Shutter.prototype.once = function (cb)
{
  if (this._once.indexOf(cb)) this._once.push(cb)
  return this;
}

Shutter.prototype.pop = function (uid)
{
  delete this._stack[uid];
  return this;
}

Shutter.prototype.cycle = function ()
{
  for (var uid in this._stack)
  this._stack[uid]();
  if (this._once.length) for (var i=0;i<this._once.length;i++)
  this._once[i]();
  window.requestAnimationFrame(this._cycle);
  return this;
}

module.exports = Shutter;