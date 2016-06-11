var React    = require('react');
var ReactDOM = require('react-dom');
var Runover  = require('./components/Runover');
var rawcss   = require('raw!./styles/style.styl');

if (!global.RUNNING_OVER) {

  var style = document.createElement('style');
  style.appendChild(document.createTextNode(rawcss));
  (document.head||document.documentElement).appendChild(style);
  
  var entry = document.createElement('div');
  entry.setAttribute('class','runover');
  (document.body||document.documentElement).appendChild(entry);
  
  global.RUNNING_OVER = true;
  
  if (document.readyState === 'complete')
    ReactDOM.render(<Runover/>,entry);
    
  else
    window.addEventListener('load',() => ReactDOM.render(<Runover/>,entry));
    
}