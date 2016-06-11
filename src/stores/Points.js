var EventEmitter = require('events').EventEmitter;
var assign = require('lodash/assign');

var store = module.exports = {};
var points   = {};
var hc       = 0;
var idc      = 0;
var handlers = {};

store.subscribe = function (cb)
{
  var h = (hc++).toString();
  handlers[h] = cb;
  return h;
}

store.unsubscribe = function (cb)
{
  delete handlers[h];
}

store.addPoint = function (target)
{
  var id = (idc++).toString();
  var point = points[id] = assign((point||{}),{ id:id,text:'',target:target });
  emit();
}

store.removePoint = function (id)
{
  if (points[id]) {
    delete points[id];
    emit();
  }
}

store.getPoints = function ()
{
  return points;
}

function emit ()
{
  Object.keys(handlers).forEach((h) => handlers[h]());
}

module.exports = store;