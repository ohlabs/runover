var Browser  = require('./lib/utils/browser');
var RunOver  = require('./lib/runover');

if (!global.__RUNOVER__) {
  if (document.readyState === 'complete') {
    global.__RUNOVER__ = new RunOver ();
  } else {
    window.addEventListener('load',() => global.runover = new RunOver ());
  }
}