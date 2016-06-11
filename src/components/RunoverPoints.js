var React    = require('react');
var ReactDOM = require('react-dom');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var PointsStore = require('../stores/Points');
var Point = require('./RunoverPoint');

var RunoverPoints = React.createClass({
  
  componentDidMount: function ()
  {
    this.token = PointsStore.subscribe(() => this.forceUpdate());
  },
  
  componentWillUnmount: function ()
  {
    PointsStore.unsubscribe(this.token);
  },
  
  renderPoints: function ()
  {
    var points = PointsStore.getPoints();
    return Object.keys(points).map((id) => <Point
      key={id}
      point={points[id]}
    />);
  },
  
  render: function ()
  {
    return <div className="runover-points">
      <ReactCSSTransitionGroup
        className="runover-points"
        component="div"
        transitionName="runover-selector"
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}
      >{this.renderPoints()}</ReactCSSTransitionGroup>
    </div>
  }
  
});

module.exports = RunoverPoints;