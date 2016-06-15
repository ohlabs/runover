var React = require('react');
var ReactDOM = require('react-dom');

var RunoverEditor = React.createClass({
  
  shouldComponentUpdate: function (nextProps)
  {
    return nextProps.text !== this.props.text;
  },
  
  render: function ()
  {
    return <div className={['runover-editor',this.props.className].join(' ')}>
      <div className="runover-editor-input"  ref="input"
        contentEditable
        tabIndex="-1"></div>
      <div className="runover-editor-output" ref="output"></div>
    </div>
  }
  
});

module.exports = RunoverEditor;