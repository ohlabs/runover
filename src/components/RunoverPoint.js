var React = require('react');
var ReactDOM = require('react-dom');
var ShutterMixin = require('../mixins/Shutter');
var Store = require('../stores/Points');
var Editor = require('./RunoverEditor');
var helpers = require('../utils/helpers');

var RunoverPoint = React.createClass({
  
  mixins: [ShutterMixin],
  
  shouldComponentUpdate: function (nextProps,nextState)
  {
    return nextProps.point.text !== this.props.point.text
  },
  
  handleShutterFrame: function (last)
  {
    if (!this.refs.point) return;
    
    var coords = this.props.point.target.getCurrXY();
    
    var c = last || coords;
    
    if (c === coords) {
      var n = c
    } else {
      var n = {
        x: helpers.tween(c.x,coords.x,this.props.point.target._r),
        y: helpers.tween(c.y,coords.y,this.props.point.target._r)
      };
    }
    
    this.refs.point.style.transform = 'translate3d('+n.x+'px,'+n.y+'px,0px)';
    
    return n;
  },
  
  render: function ()
  {
    return <div className="runover-point" ref="point">
      <div className="runover-point-pin"></div>
      <div className="runover-point-content">
        <div className="runover-point-arrow"></div>
        <Editor className="runover-point-editor" />
        <div className="runover-point-info"></div>
      </div>
    </div>
  }
  
});

module.exports = RunoverPoint;