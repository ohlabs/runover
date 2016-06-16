var React = require('react');
var ReactDOM = require('react-dom');

var RunoverEditor = React.createClass({
  
  shouldComponentUpdate: function (nextProps)
  {
    return false;
  },
  
  componentDidMount: function ()
  {
    this.refs.input  = document.createElement('div');
    this.refs.input.setAttribute('class','runover-editor-input');
    this.refs.input.setAttribute('tabindex','-1');
    this.refs.input.contentEditable = true;
    
    this.refs.output = document.createElement('div');
    this.refs.output.setAttribute('class','runover-editor-output');
    
    this.refs.editor.appendChild(this.refs.input);
    this.refs.editor.appendChild(this.refs.output);
  },
  
  componentWillUnmount: function ()
  {
    this.refs.input = this.refs.output = null;
  },
  
  render: function ()
  {
    return <div
      className={['runover-editor',this.props.className].join(' ')}
      ref="editor"
    ></div>
  }
  
});

module.exports = RunoverEditor;