var Shutter = require('../utils/shutter');

module.exports = {
  
  componentDidMount: function ()
  {
    this.shutterId = Shutter.push(() => this.easerCycle());
  },
  
  componentWillUnmount: function ()
  {
    Shutter.pop(this.shutterId);
  }
  
};