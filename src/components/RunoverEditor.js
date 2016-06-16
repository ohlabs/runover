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
    
    this.refs.input.addEventListener('keypress',(ev) => {
      if ((ev.keyCode || ev.which) === 13) {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        replaceSelectionWithText ('\n');
      }
    });
    
    this.refs.input.addEventListener('paste',(ev) => {
      ev.stopImmediatePropagation();
      ev.preventDefault();
      var cdata = ev.clipboardData || window.clipboardData;
      cdata && cdata.getData &&
      replaceSelectionWithText (cdata.getData('text') || '');
    });
    
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

function replaceSelectionWithText (text)
{
	var node = document.createTextNode(text);
  var selection = window.getSelection();
  var range = selection.getRangeAt(0);
  range.deleteContents();
  range.insertNode(node);
  range.setStartAfter(node);
  range.setEndAfter(node);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

module.exports = RunoverEditor;