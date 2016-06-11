var React    = require('react');
var ReactDOM = require('react-dom');

var MouseTrap = require('mousetrap');
var EventEmitter = require('events').EventEmitter;
var Points = require('./RunoverPoints');
var Selector = require('./RunoverSelector');
var PointsStore = require('../stores/Points');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var SelectorTransitionGroup = React.createClass({
  
  render: function () {
    return React.Children.toArray(this.props.children)[0] || null;
  }
  
});

var Runover = React.createClass({
  
  getInitialState: function ()
  {
    return {
      power: true,
      motion: false,
      cursor: false,
      mouseX: window.innerWidth,
      mouseY: window.innerHeight,
      mod: false,
      alt: false
    }
  },
  
  componentWillMount: function ()
  {
    this.events = new EventEmitter();
    this.mousetrap = new MouseTrap(window);
    this.timers = {};
  },
  
  handleMotionStop: function ()
  {
    this.state.motion = false;
    this.forceUpdate();
  },
  
  handleCursorStop: function ()
  {
    this.state.cursor = false;
    this.forceUpdate();
  },
  
  handleRepositions: function (ev,key)
  {
    if (!this.state.power) return;
    
    switch (ev.type) {
      
      case 'mousemove':
        this.state.mouseX = ev.clientX;
        this.state.mouseY = ev.clientY;
        if (this.state.mod && this.state.editing) this.state.editing = 0;
        clearTimeout(this.timers.cursor);
        this.state.cursor = true;
        this.timers.cursor = setTimeout(this.handleCursorStop,60);
        break;
      case 'resize':
      case 'scroll':
        clearTimeout(this.timers.motion);
        this.state.motion = true;
        this.timers.motion = setTimeout(this.handleMotionStop,60);
        break;
      default:
        return;
        
    }
    
    this.forceUpdate();
  },
  
  handleTasters: function (ev,key)
  {
    switch (ev.type) {
      case 'keydown':
        this.state[key] = true;
        break;
      case 'keyup':
        this.state[key] = false;
        break;
      default:
        return;
    }
    
    this.forceUpdate();
  },
  
  handleSelect: function (target,rect)
  {
    PointsStore.addPoint();
  },
  
  componentDidMount: function ()
  {
    window.addEventListener('mousemove',this.handleRepositions);
    window.addEventListener('scroll',   this.handleRepositions);
    window.addEventListener('resize',   this.handleRepositions);
    this.mousetrap.bind('mod',this.handleTasters,'keydown');
    this.mousetrap.bind('mod',this.handleTasters,'keyup');
    this.mousetrap.bind('alt',this.handleTasters,'keydown');
    this.mousetrap.bind('alt',this.handleTasters,'keyup');
  },
  
  render: function ()
  {
    return <div
      className="runover-content"
      data-runover-motion={this.state.motion}
      data-runover-cursor={this.state.cursor}
    >
      <Points />
      <ReactCSSTransitionGroup
        component={SelectorTransitionGroup}
        transitionName="runover-selector"
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}
      >{this.state.mod && !this.state.motion && !this.state.editing
      ? <Selector
          key={1}
          x={this.state.mouseX}
          y={this.state.mouseY}
          onSelect={this.handleSelect}
        />
      : null}</ReactCSSTransitionGroup>
    </div>
  }
  
});

module.exports = Runover;