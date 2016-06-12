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
    
    var c = this.__last_coords
    ? this.__last_coords
    : coords;
    
    if (c === coords) {
      var n = c
    } else {
      var n = {
        x: helpers.tween(c.x,coords.x,0.2),
        y: helpers.tween(c.y,coords.y,0.2)
      };
    }
    
    this.point.style.webkitTransform =
    this.point.style.transform = 'translate('+n.x+'px,'+n.y+'px)';
    
    this.__last_coords = n;
  },
  
  render: function ()
  { console.log('r point');
    return <div className="runover-point" ref={this.getPointRef}>
      <div className="runover-point-pin"></div>
    </div>
  }
  
});

module.exports = RunoverPoint;