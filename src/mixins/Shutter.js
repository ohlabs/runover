var shutter = require('../utils/shutter');

module.exports = {
  
  componentDidMount: function ()
  {
    if (!this.handleShutterFrame) return;
    this._shutter_id = shutter.push((s) => this.handleShutterFrame(s));
  },
  
  componentWillUnmount: function ()
  {
    if (!this._shutter_id) return;
    shutter.pop(this._shutter_id);
  }
  
};