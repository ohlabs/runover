var Browser  = require('./lib/utils/browser');
var RunOver  = require('./lib/runover');

if (!global.RUNOVER) {
  if (document.readyState === 'complete') {
    global.RUNOVER = new RunOver ();
  } else {
    window.addEventListener('load',() => global.runover = new RunOver ());
  }
}