var React = require('react');
var ReactDOM = require('react-dom');
var ShutterMixin = require('../mixins/Shutter');
var Store = require('../stores/Points');
var Editor = require('./RunoverEditor');
var helpers = require('../utils/helpers');

var RunoverPoint = React.createClass({
  
  mixins: [ShutterMixin],
  
  getInitialState: function ()
  {
    return { focus:false };
  },
  
  shouldComponentUpdate: function (nextProps,nextState)
  {
    return nextProps.point.text !== this.props.point.text
  },
  
  handleChange: function (text)
  {
    //
  },
  
  handleFocus: function ()
  {
    this.state.focus = true;
    this.props.onFocus &&
    this.props.onFocus ();
    this.forceUpdate();
  },
  
  handleBlur: function ()
  {
    this.state.focus = false;
    this.props.onBlur &&
    this.props.onBlur ();
    this.forceUpdate();
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
    return <div
      ref="point"
      className="runover-point"
      data-runover-focus={this.state.focus}
    >
      <div className="runover-point-pin"></div>
      <div className="runover-point-content">
        <div className="runover-point-arrow"></div>
        <Editor
          text={this.props.point.text}
          onChange={this.handleUpdate}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        />
        <div className="runover-point-info"></div>
      </div>
    </div>
  }
  
});

module.exports = RunoverPoint;