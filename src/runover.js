require('./lib/js/polyfill');

var Browser = require('./lib/js/browser');
var RunOver = require('./lib/js/runover');

window.addEventListener('load',() => global.runover = new RunOver ());