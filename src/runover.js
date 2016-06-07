require('./lib/js/polyfill');

var Browser = require('./lib/js/browser');
var RunOver = require('./lib/js/runover');

if (document.readyState === 'complete')
  global.runover = new RunOver ();
else
  window.addEventListener('load',() => global.runover = new RunOver ());