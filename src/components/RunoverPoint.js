var React = require('react');
var ReactDOM = require('react-dom');
var ReactMotion = require('react-motion');
var helpers = require('../utils/helpers');

var spring = { stiffiness:240,damping:26 };

var Store = require('../stores/Points');
var Point = require('./RunoverPoint');

var RunoverPoint = React.createClass({
  
  shouldComponentUpdate: function (nextProps,nextState)
  {
    return nextProps.point.text !== this.props.point.text
  },
  
  componentDidMount: function ()
  {
    this.shutterId = shutter.push(this.recalculateCycle);
  },
  
  componentWillUnmount: function ()
  {
    shutter.pop(this.shutterId);
  },
  
  getPointRef: function (point)
  {
    this.point = point;
  },
  
  recalculateCycle: function ()
  {
    if (!this.point) return;
    
    var coords = this.props.point.target.getCurrXY();
    
    var c = this.lastCoords
    ? this.lastCoords
    : coords;
    
    if (c === coords) {
      var n = c
    } else {
      var n = {
        x: helpers.tween(c.x,coords.x,this.props.point.target._r),
        y: helpers.tween(c.y,coords.y,this.props.point.target._r)
      };
    }
    
    this.point.style.transform = 'translate3d('+n.x+'px,'+n.y+'px,0px)';
    
    this.lastCoords = n;
  },
  
  render: function ()
  {
    return <div className="runover-point" ref={this.getPointRef}>
      <div className="runover-point-pin"></div>
    </div>
  }
  
});

module.exports = RunoverPoint;