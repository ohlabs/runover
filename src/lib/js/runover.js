var css = require('raw!../css/style.styl');
var RunoverAnnotation  = require('./annotation');
var RunoverSelector    = require('./selector');

/**
 * RunOver
 *
 * Toplevel class of the RunOver system.
 * Handles macro user interactions and manipulates annotations.
 *
 * @constructor
 * @since 0.1.0
 */
var RunOver = function ()
{
  /**
   * Stores class internal state
   * @var {object} state
   */
  this.state = {
    mouse: { x:0,y:0 },
    power: true,
    selecting: false
  }
  
  /**
   * Stores cached bound methods that should be reused
   * @var {object} bound
   */
  this.bound = {
    _selector:    this._selector.bind(this),
    _annotations: this._annotations.bind(this),
    useSelection: this.useSelection.bind(this)
  }
  
  /**
   * Stores miscelanious data
   * @var {object} misc
   */
  this.misc = { af:{},tm:{} }
  
  /**
   * Stores created / queried toplevel dom nodes
   * @var {object} dom
   */
  this.dom = {};
  
  /**
   * Stores session annotations
   * @var {object} annotations
   */
  this.annotations = {};
  
  /**
   * Content wrapper for the application
   * @var {HTMLElement} dom.content
   */
  this.dom.content = document.createElement('div');
  this.dom.content.setAttribute('class','runover-content');
  document.querySelector('body').appendChild(this.dom.content);
  
  // Attach a click handler
  // to the selector (handled once it starts recieving pointer events)
  
  this.selector = new RunoverSelector (this.dom.content,this.bound.useSelection);
  
  /**
   * Anotations wrapper div
   * @var {HTMLElement} dom.annotations
   */
  this.dom.annotations = document.createElement('div');
  this.dom.annotations.setAttribute('class','runover-annotations');
  this.dom.content.appendChild(this.dom.annotations);
  
  /**
   * Style tag nececery to bring the app css without an extra request
   * @var {HTMLElement} dom.style
   */
  this.dom.style = document.createElement('style');
  this.dom.style.appendChild(document.createTextNode(css));
  document.querySelector('head').appendChild(this.dom.style);
  
  /**
   * Queried HTML cache
   * @var {HTMLElement} dom.html
   */
  var html = this.dom.html = document.querySelector('html');
  
  // Flush initial state into the
  // dom (data-attributes)

  html.setAttribute('data-runover',          this.state.power);
  html.setAttribute('data-runover-selecting',this.state.selecting);
  html.setAttribute('data-runover-mousemove',false);
  html.setAttribute('data-runover-scrolling',false);
  
  // Attach mouse and environment
  // interactions event handlers
  
  window.addEventListener('mousemove',this._recalculate.bind(this));
  window.addEventListener('scroll',   this._recalculate.bind(this));
  window.addEventListener('resize',   this._recalculate.bind(this));
  
  // Attach taster handlers on shift
  // to be used as the selection mode trigger
  
  window.addEventListener('keyup',  this.stopSelecting.bind(this));
  window.addEventListener('keydown',(ev) =>
  (ev.keyCode || ev.which) == 16 && this.startSelecting());
}

/**
 * Utility method used by the child annotations to
 * check if the system is active without digging too much into it.
 *
 * @return {boolean} - True if active, false otherwise
 * @since 0.1.0
 */
RunOver.prototype.ison = function ()
{
  return this.state.power === true;
}

/**
 * Turn the system on
 * Should be attached to the button
 * used for activation, located in the bottom right corner
 * of the interface.
 *
 * @return {RunOver} - Self
 * @since 0.1.0
 */
RunOver.prototype.poweron = function ()
{
  this.state.power = true;
  this.dom.html.setAttribute('data-runover',true);
  return this;
}

/**
 * Turn the system off
 * Should be attached to the button
 * used for activation, located in the bottom right corner
 * of the interface.
 *
 * @return {RunOver} - Self
 * @since 0.1.0
 */
RunOver.prototype.poweroff = function ()
{
  this.stopSelecting();
  this.state.power = false;
  this.dom.html.setAttribute('data-runover',false);
  return this;
}

/**
 * Setup the environment so selection
 * (creating) new annotations is possible.
 *
 * @param  {Event}   ev - If passed, will be passed on further
 * @return {RunOver}    - Self
 *
 * @since 0.1.0
 */
RunOver.prototype.startSelecting = function (ev)
{
  if (!this.state.power || this.state.selecting) return this;
  this.state.selecting = true;
  this._selector();
  this.dom.html.setAttribute('data-runover-selecting',true);
  return this;
}

/**
 * Destroy (and cleanup) the environment suitable
 * for selecting (creating) new annotations.
 *
 * @return {RunOver} - Self
 * @since 0.1.0
 */
RunOver.prototype.stopSelecting = function ()
{
  if (!this.state.power || !this.state.selecting) return this;
  this.state.selecting = false;
  this.dom.html.setAttribute('data-runover-selecting',false); 
  return this;
}

/**
 * Not implemented yet
 *
 *
 * @since 0.1.0
 */
RunOver.prototype.useSelection = function (target,rect)
{
  if (
    !this.state.power ||
    !this.state.selecting
  ) return this;
  
  var path = target.getPath();
  
  if (this.annotations[path]) {
    this.annotations[path].select();
  } else {
    this.annotations[path] = new RunoverAnnotation (target,rect);
    this.dom.annotations.appendChild(this.annotations[path].getElement());
    this.annotations[path].select();
  }
}

/**
 * Request an animation frame for any of the
 * internal functions. Simplifies things.
 *
 * @param {Event}  ev    - Event that caused the oparation
 * @param {string} which - Function name (without the "_") to enqueue
 *
 * @since 0.1.0
 */
RunOver.prototype._callWithAF = function (id,cb)
{
  window.cancelAnimationFrame  (this.misc.af[id]); this.misc.af[id] =
  window.requestAnimationFrame (cb);
}

/**
 * Recalculate the position of the selector overlay
 * div using targets bounding client rect.
 *
 * @param {Event} ev - Event to be passed on
 * @since 0.1.0
 */
RunOver.prototype._selector = function (ev)
{
  this.selector.recalculate(this.state.mouse.x,this.state.mouse.y);
}

/**
 * Recalculate the positions of the annotations
 * currently drawn. MUST be attached to some kind
 * of execution regulator like requestAnimationFrame system
 *
 * @param {Event} ev - Event to be passed on
 * @since 0.1.0
 */
RunOver.prototype._annotations = function (ev)
{ 
  Object.keys(this.annotations).forEach((a) =>
  this.annotations[a].recalculate.apply(this.annotations[a]));
}

/**
 * The major recalculate call which
 * calls other recalculation methods based
 * on the event type.
 * Therefore - event is a must.
 *
 * @param {Event} ev - Event to extract the type from, and to be passed on
 * @since 0.1.0
 */
RunOver.prototype._recalculate = function (ev)
{
  if (!this.state.power) return this;
  
  switch (ev.type) {
  
    // Capture mouse movement and reset its
    // timeout if in deed mouse moving
    
    case 'mousemove':
    
    // Bank the mouse position
    
    this.state.mouse.x = ev.clientX;
    this.state.mouse.y = ev.clientY;
    
    // Reset the timeout for mouse
    // movement if selecting
    
    if (this.state.selecting) {
      clearTimeout(this.misc.tm.mousemove);
      this.dom.html.setAttribute('data-runover-mousemove',true);
      this.misc.tm.mousemove = setTimeout(() =>
      this.dom.html.setAttribute('data-runover-mousemove',false),20);
    }
    
    break;
  
    // Reset the timeout for window scroll/resize
    // if we're in a proper event
    
    case 'scroll':
    case 'resize':
    
    clearTimeout(this.misc.tm.scroll);
    this.dom.html.setAttribute('data-runover-scrolling',true);
    this.misc.tm.scroll = setTimeout(() =>
    this.dom.html.setAttribute('data-runover-scrolling',false),50);
    this._callWithAF ('anotations',this.bound._annotations);
    
  }
    
  // Recalculate selector
  // target if we're in a selecting mode
  
  this.state.selecting &&
  this._callWithAF ('selector',this.bound._selector);
}

/**
 * Class export
 */
module.exports = RunOver;