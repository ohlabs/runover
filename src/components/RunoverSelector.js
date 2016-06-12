var React = require('react');
var ReactDOM = require('react-dom');
var Target = require('../lib/target');
var shutter = require('../utils/shutter');
var helpers = require('../utils/helpers');

var spring = { stiffiness:240,damping:26 };

var RunoverSelector = React.createClass({
  
  handleClick: function (ev)
  {
    if (!this.element || this.element === this.selector) return null;
    var x = (ev.clientX - this.rect.left) / this.rect.width;
    var y = (ev.clientY - this.rect.top)  / this.rect.height;
    var target = new Target(this.element,x,y);
    this.props.onSelect(target);
  },
  
  getSelectorRef: function (selector)
  {
    this.selector = selector;
  },
  
  recalculateCycle: function ()
  {
    if (!this.selector) return;
    
    var state = this.props.state;
    
    if (this.selector) this.selector.style.pointerEvents = 'none';
    this.element = document.elementFromPoint(state.mouseX,state.mouseY);
    if (this.selector) this.selector.style.pointerEvents = 'all';
    
    var rect = this.rect = this.element
    ? this.element.getBoundingClientRect()
    : helpers.getDefaultRect();
    
    var c = this.__last_rect
    ? this.__last_rect
    : rect;
    
    if (c === rect) {
      var n = c
    } else {
      var n = {
        top:    helpers.tween(c.top,   rect.top,   0.2),
        left:   helpers.tween(c.left,  rect.left,  0.2),
        width:  helpers.tween(c.width, rect.width, 0.2),
        height: helpers.tween(c.height,rect.height,0.2)
      }
    }
    
    this.selector.style.top    = n.top    + 'px';
    this.selector.style.left   = n.left   + 'px';
    this.selector.style.width  = n.width  + 'px';
    this.selector.style.height = n.height + 'px';
    
    this.__last_rect = n;
  },
  
  componentDidMount: function ()
  {
    this.shutterId = shutter.push(this.recalculateCycle);
  },
  
  componentWillUnmount: function ()
  {
    shutter.pop(this.shutterId);
  },
  
  render: function ()
  {
    return <div
      className="runover-selector"
      ref={this.getSelectorRef}
      onClick={this.handleClick}
    ></div>
  }
  
});

module.exports = RunoverSelector;