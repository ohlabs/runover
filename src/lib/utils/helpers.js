var exp = module.exports = {};

exp.getDefaultRect = function () { return {
  top:    window.innerHeight,
  left:   window.innerWidth,
  width:  0,
  height: 0
}};

exp.tween = function (c,t,r) {
  var d = Math.abs(c-t) * r;
  return c > t ? (c - d) : (c + d);
}