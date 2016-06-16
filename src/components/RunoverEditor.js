var React = require('react');
var ReactDOM = require('react-dom');
var ShowDown = require('showdown');
var showdown = new ShowDown.Converter({
  noHeaderId: true,
  parseImgDimensions: true,
  simplifiedAutoLink: true,
  omitExtraWLInCodeBlocks: true,
  literalMidWordUnderscores: true,
  strikethrough: true,
  tasklists: true
});

var RunoverEditor = React.createClass({
  
  getInitialState: function ()
  {
    var state = {};
    state.text  = this.props.text || '';
    state.empty = state.text.length === 0;
    return state;
  },
  
  shouldComponentUpdate: function (nextProps)
  {
    if (nextProps.text && nextProps.text !== this.state.text)
    this.handleExternalUpdate(nextProps.text);
    return false;
  },
  
  componentDidMount: function ()
  {
    this.text = this.props.text || '';
    this.refs.input.appendChild(document.createTextNode('\n'));
    this.refs.input.focus ();
  },
  
  handleClick: function (ev)
  {
    this.refs.input.focus();
  },
  
  handleFocus: function (ev)
  {
    this.props.onFocus &&
    this.props.onFocus ();
  },
  
  handleBlur: function (ev)
  {
    this.props.onBlur &&
    this.props.onBlur ();
  },
  
  handleExternalUpdate: function (textContent)
  {
    this.state.text  = textContent || '';
    this.state.empty = this.state.text.length === 0;
    this.refs.input.textContent = this.state.text;
    this.refs.input.appendChild(document.createTextNode('\n'));
    this.renderOutput();
  },
  
  handleChangeAttempt: function ()
  {
    var textContent = this.refs.input.textContent;
    
    if (!/\n$/.test(textContent))
      this.refs.input.appendChild(document.createTextNode('\n'));
    else
      textContent = textContent.replace(/\n$/,'');
    
    if (textContent === this.state.text) return;
    
    this.state.text = textContent;
    
    if (this.state.empty !== (this.state.text.length === 0)) {
      this.state.empty = !this.state.empty;
      this.refs.editor.setAttribute('data-runover-empty',this.state.empty);
    }
    
    this.handleChange();
  },
  
  handleChange: function ()
  {
    console.log('content:',this.state.empty
    ? null
    : this.state.text);
    this.renderOutput();
    this.props.onChange &&
    this.props.onChange(this.state.text,this.state.empty);
  },
  
  handleKeyPress: function (ev)
  {
    if ((ev.keyCode || ev.which) === 13) {
      ev.stopPropagation();
      ev.preventDefault();
      replaceSelectionWithText ('\n');
      this.handleChangeAttempt();
    }
  },
  
  handleKeyUp: function (ev)
  {
    for (var i=0; i<this.refs.input.childNodes.length;i++) {
      this.refs.input.childNodes[i].nodeType !== Node.TEXT_NODE &&
      this.refs.input.removeChild(this.refs.input.childNodes[i]);
    } this.handleChangeAttempt();
  },
  
  handlePaste: function (ev)
  {
    ev.stopPropagation();
    ev.preventDefault();
    var cdata = ev.clipboardData || window.clipboardData;
    cdata && cdata.getData &&
    replaceSelectionWithText (cdata.getData('text') || '');
    this.handleChangeAttempt();
  },
  
  renderOutput: function ()
  {
    this.refs.output.innerHTML = showdown.makeHtml(this.state.text);
  },
  
  render: function ()
  {
    return <div className="runover-editor"
      ref="editor"
      onClick={this.handleClick}
      data-runover-empty={this.state.empty}
    >
      <div className="runover-editor-input"
        ref="input"
        contentEditable="true"
        data-runover-placeholder="Thoughts...?"
        tabIndex="-1"
        onBlur     = {this.handleBlur}
        onFocus    = {this.handleFocus}
        onInput    = {this.handleChangeAttempt}
        onMouseUp  = {this.handleChangeAttempt}
        onKeyPress = {this.handleKeyPress}
        onKeyUp    = {this.handleKeyUp}
        onPaste    = {this.handlePaste}
      ></div>
      <div className="runover-editor-output"
        ref="output"
      ></div>
    </div>
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