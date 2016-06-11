var React = require('react');
var ReactDOM = require('react-dom');
var ReactMotion = require('react-motion');

var Store = require('../stores/Points');
var Point = require('./RunoverPoint');

var RunoverPoint = React.createClass({
  
  render: function ()
  {
    return <ReactMotion.Motion>
      <div className="runover-point">
        <div className="runover-point-pin"></div>
        <div className="runover-point-message">
          <div className="runover-point-arrow"></div>
          <div className="runover-point-info"></div>
          <textarea className="runover-point-text"></textarea>
        </div>
      </div>
    </ReactMotion.Motion>
  }
  
});

module.exports = RunoverPoint;