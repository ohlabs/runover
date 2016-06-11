var EventEmitter = require('events').EventEmitter;

var store  = new EventEmitter();
var points = {};
var idc    = 0;

store.addPoint = function ()
{
  var id = (idc++).toString();
  var point = points[id] = { id:id,text:'' };
  store.emit('change');
}

store.removePoint = function (id)
{
  if (points[id]) {
    delete points[id];
    store.emit('change');
  }
}

store.getPoints = function ()
{
  return points;
}

module.exports = store;