var React = require('react');
var ReactDOM = require('react-dom');
var ReactMotion = require('react-motion');
var helpers = require('../utils/helpers');

var spring = { stiffiness:240,damping:26 };

var Store = require('../stores/Points');
var Point = require('./RunoverPoint');

var RunoverPoint = React.createClass({
  
  getDefaultStyle: function ()
  {
    var coords = this.props.point.target.getCurrXY();
    coords.x -= 14;
    coords.y -= 15;
    return coords;
  },
  
  getStyle: function ()
  {
    var coords = this.props.point.target.getCurrXY(); return {
      x: ReactMotion.spring(coords.x - 14,spring),
      y: ReactMotion.spring(coords.y - 15,spring)
    };
  },
  
  renderPoint: function (style)
  {
    var translate = 'translate('+style.x+'px,'+style.y+'px)';
    return <div className="runover-point" style={{
      WebkitTransform: translate,
      msTransform: translate,
      transform: translate
    }}>
      <div className="runover-point-pin"></div>
    </div>
  },
  
  render: function ()
  {
    return <ReactMotion.Motion
      defaultStyle={this.getDefaultStyle()}
      style={this.getStyle()}
    >{this.renderPoint}</ReactMotion.Motion>
  }
  
});

module.exports = RunoverPoint;