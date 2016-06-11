var React    = require('react');
var ReactDOM = require('react-dom');

var Store = require('../stores/Points');

var RunoverPoint = React.createClass({
  
  componentDidMount: function ()
  {
    Store.on('change',this.forceUpdate);
  },
  
  componentWillUnmount: function ()
  {
    Store.off('change',this.forceUpdate);
  },
  
  renderPoints: function ()
  {
    var points = Store.getPoints();
    return Object.keys(points).map((id) => <Point data={points[id]} />);
  },
  
  render: function ()
  {
    return <div className="runover-points">{this.renderPoints()}</div>
  }
  
});

module.exports = RunoverPoint;