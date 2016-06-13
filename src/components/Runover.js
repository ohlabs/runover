var React = require('react');
var ReactDOM = require('react-dom');
var MouseTrap = require('mousetrap');
var Point = require('./RunoverPoint');
var Selector = require('./RunoverSelector');
var PointsStore = require('../stores/Points');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var EventEmitter = require('events').EventEmitter;
var Shutter = global.shutter = require('../utils/shutter').start();

var SelectorTransitionGroup = React.createClass({
  
  render: function () {
    return React.Children.toArray(this.props.children)[0] || null;
  }
  
});

var Runover = React.createClass({
  
  getInitialState: function ()
  {
    this.boundUpdate = () => this.forceUpdate();
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
    this.timers = {};
  },
  
  handleMotionStop: function ()
  {
    this.state.motion = false;
//     Shutter.once(this.boundUpdate);
  },
  
  handleCursorStop: function ()
  {
    this.state.cursor = false;
//     Shutter.once(this.boundUpdate);
  },
  
  handleRepositions: function (ev,key)
  {
    if (!this.state.power) return;
    
    switch (ev.type) {
      
      case 'mousemove':
        this.state.mouseX = ev.clientX;
        this.state.mouseY = ev.clientY;
/*
        if (this.state.mod && this.state.editing) this.state.editing = 0;
        clearTimeout(this.timers.cursor);
        this.state.cursor = true;
        this.timers.cursor = setTimeout(this.handleCursorStop,60);
*/
        break;
      case 'resize':
      case 'scroll':
/*
        clearTimeout(this.timers.motion);
        this.state.motion = true;
        this.timers.motion = setTimeout(this.handleMotionStop,60);
*/
        break;
      default:
        return;
        
    }
    
//     this.events.emit('recalculate',this.state)
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
    
    Shutter.once(this.boundUpdate);
  },
  
  handleSelect: function (target)
  {
    PointsStore.addPoint(target);
  },
  
  componentDidMount: function ()
  {
    this.pointStoreToken = PointsStore.subscribe(() => this.forceUpdate());
    window.addEventListener('mousemove',this.handleRepositions);
//     window.addEventListener('scroll',   this.handleRepositions);
//     window.addEventListener('resize',   this.handleRepositions);
    MouseTrap.bind('mod',this.handleTasters,'keydown');
    MouseTrap.bind('mod',this.handleTasters,'keyup');
    MouseTrap.bind('alt',this.handleTasters,'keydown');
    MouseTrap.bind('alt',this.handleTasters,'keyup');
  },
  
  componentWillUnmount: function ()
  {
    PointsStore.unsubscribe(this.pointStoreToken);
  },
  
  renderPoints: function ()
  {
    console.log('render points');
    var points = PointsStore.getPoints();
    return Object.keys(points).map((id) => <Point
      key={id}
      point={points[id]}
    />);
  },
  
  render: function ()
  {
    console.log('render');
    return <div className="runover-content">
      <ReactCSSTransitionGroup
        className="runover-points"
        component="div"
        transitionName="runover-selector"
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}
      >{this.renderPoints()}</ReactCSSTransitionGroup>
      <ReactCSSTransitionGroup
        component={SelectorTransitionGroup}
        transitionName="runover-selector"
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}
      >{this.state.mod && !this.state.motion && !this.state.editing
      ? <Selector
          key={1}
          events={this.events}
          state={this.state}
          onSelect={this.handleSelect}
        />
      : null}</ReactCSSTransitionGroup>
    </div>
  }
  
});

module.exports = Runover;