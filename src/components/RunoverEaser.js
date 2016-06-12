var React = require('react');
var ReactDOM = require('react-dom');
var helpers = require('../utils/helpers');

var Easer = React.createClass({
  
  getInitialState: function ()
  {
    this.data = {};
  }
  
  render: function ()
  {
    var start = this.data.start || this.props.defaultStyle;
    var now   = 
    
    return this.props.children[0](style);
  }
  
});

module.exports = Easer;