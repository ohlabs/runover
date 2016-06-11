var React    = require('react');
var ReactDOM = require('react-dom');
var helpers  = require('../utils/helpers');
var spring   = { stiffiness:240,damping:26 };

var ReactMotion = require('react-motion');
var Target      = require('../lib/target');

var RunoverSelector = React.createClass({
  
  handleClick: function (ev)
  {
    if (!this.element || this.element === this.selector) return null;
    var target = new Target(this.element);
    this.props.onSelect(target,this.rect);
  },
  
  recalculateElementRect: function ()
  {
    if (this.selector) this.selector.style.pointerEvents = 'none';
    this.element = document.elementFromPoint(this.props.x,this.props.y);
    if (this.selector) this.selector.style.pointerEvents = 'all';
    
    var rect = this.rect = this.element
    ? this.element.getBoundingClientRect()
    : helpers.getDefaultRect();
    
    return rect;
  },
  
  getDefaultStyle: function ()
  {
    var rect = this.recalculateElementRect();
    
    return {
      top: rect.top-10,
      left: rect.left-10,
      width: rect.width+20,
      height: rect.height+20
    }
  },
  
  getStyle: function (prevStyle)
  {
    var rect = this.recalculateElementRect();
    
    return {
      top: ReactMotion.spring(Math.round(rect.top),spring),
      left: ReactMotion.spring(Math.round(rect.left),spring),
      width: ReactMotion.spring(Math.round(rect.width),spring),
      height: ReactMotion.spring(Math.round(rect.height),spring)
    }
  },
  
  getSelectorRef: function (selector)
  {
    this.selector = selector;
  },
  
  renderSelector: function (style)
  {
    return <div
      className="runover-selector"
      ref={this.getSelectorRef}
      onClick={this.handleClick}
      style={style}
    ></div>
  },
  
  render: function ()
  {
    return <ReactMotion.Motion
      defaultStyle={this.getDefaultStyle()}
      style={this.getStyle()}
    >{this.renderSelector}</ReactMotion.Motion>
  }
  
});

module.exports = RunoverSelector;