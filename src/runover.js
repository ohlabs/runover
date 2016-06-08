var Browser  = require('./lib/utils/browser');
var RunOver  = require('./lib/runover');

if (document.readyState === 'complete')
  global.runover = new RunOver ();
else
  window.addEventListener('load',() => global.runover = new RunOver ());