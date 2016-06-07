var defaultrect = { height:0,width:0,top:0,bottom:0 };

var RunoverAnnotation = function (target,rect)
{
  this.target = target;
  
  this.dom = {};
  this.stats = {};
  
  this.content = '';
  this._selected = false;
  
  this.dom.annotation = document.createElement('div');
  this.dom.annotation.setAttribute('class','runover-annotation');
  
  this.dom.pin = document.createElement('div');
  this.dom.pin.setAttribute('class','runover-annotation-pin');
  this.dom.annotation.appendChild(this.dom.pin);
  
  this.dom.message = document.createElement('div');
  this.dom.message.setAttribute('class','runover-annotation-message');
  this.dom.annotation.appendChild(this.dom.message);
  
  this.dom.arrow = document.createElement('div');
  this.dom.arrow.setAttribute('class','runover-annotation-arrow');
  this.dom.message.appendChild(this.dom.arrow);
  
  this.dom.info = document.createElement('div');
  this.dom.info.setAttribute('class','runover-annotation-info');
  this.dom.message.appendChild(this.dom.info);
  
  this.dom.text = document.createElement('textarea');
  this.dom.text.disabled = true;
  this.dom.text.setAttribute('class','runover-annotation-text');
  this.dom.message.appendChild(this.dom.text);
  
  this.dom.text.addEventListener('blur',(ev) => {
    ev.preventDefault();
    this.deselect();
  });
  
  this.recalculate();
}

RunoverAnnotation.prototype.getElement = function ()
{
  return this.dom.annotation;
}

RunoverAnnotation.prototype.select = function ()
{
  if (this._selected) return this;
  this._selected = true;
  this.dom.text.disabled = false;
  this.dom.annotation.setAttribute('data-runover-selected',true);
  this.dom.text.focus();
}

RunoverAnnotation.prototype.deselect = function ()
{
  if (!this._selected) return this;
  this._selected = false;
  this.dom.annotation.setAttribute('data-runover-selected',false);
  this.dom.text.blur();
  this.dom.text.disabled = true;
}

RunoverAnnotation.prototype.recalculate = function ()
{
  var rect = this.target.getRect();
  
  var x = rect.left + rect.width  - 40;
  var y = rect.top  + rect.height - 40;
  
  this.dom.annotation.setAttribute('style','transform: translate('+x+'px,'+y+'px)');
}

module.exports = RunoverAnnotation;