var React    = require('react');
var ReactDOM = require('react-dom');

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
    return Object.keys(points).map((id) => <Point data={points[id]} />);
  },
  
  render: function ()
  {
    return <div className="runover-points">{this.renderPoints()}</div>
  }
  
});

module.exports = RunoverPoints;