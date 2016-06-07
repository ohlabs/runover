var Animator = function ()
{
  this._uid     = 0;
  this._running = false;
  this._stack   = {};
}

Animator.prototype.start = function ()
{
  this._running = true;
  this._cycle ();
}

Animation.prototype.stop = function ()
{
  this._running = false;
}

Animation.prototype.push = function (cb)
{
  var uid = ':' + (this._uid++);
  this._stack[uid] = cb;
  return uid;
}

Animation.prototype.pop = function (uid)
{
  delete this._stack[uid];
}

Animation.prototype._cycle = function ()
{
  
}