var exp = module.exports = {};

exp.getDefaultRect = function () { return {
  left:   window.innerWidth,
  top:    window.innerHeight,
  width:  0,
  height: 0
}};

exp.tween = function (c,t,r) {
  var d = Math.abs(c-t) * r;
  return c > t ? (c - d) : (c + d);
}