var css = require('raw!./styles/style.styl');
var Point     = require('./point');
var Selector  = require('./selector');
var Shutter   = require('./utils/shutter');
var Mousetrap = require('mousetrap');

/**
 * RunOver
 *
 * Toplevel class of the RunOver system.
 * Handles macro user interactions and manipulates points.
 *
 * @constructor
 * @since 0.1.0
 */
function RunOver ()
{
  /**
   * Stores class internal state
   * @var {object} state
   */
  this.state = {
    power:   true,
    mouse:   { x:0,y:0 },
    cursor:  false,
    motion:  false,
    altdown: false,
    moddown: false,
    editing: 0
  }
  
  /**
   * Stores created / queried toplevel dom nodes
   * @var {object} dom
   */
  this.dom = { doc:document.documentElement };
  
  /**
   * Stores session points
   * @var {array} points
   */
  this.points = [];
  
  /**
   * Global mousetrap instance
   * @var {Mousetrap} mousetrap
   */
  this.mousetrap = new Mousetrap(window);

  // Flush initial state into the
  // dom (data-attributes)
  
  this.dom.doc.setAttribute('data-runover',          this.state.power);
  this.dom.doc.setAttribute('data-runover-cursor',   this.state.cursor);
  this.dom.doc.setAttribute('data-runover-motion',   this.state.motion);
  this.dom.doc.setAttribute('data-runover-selecting',this.state.selecting);
  
  /**
   * Style tag to load stylesheets without an external request
   * @var {HTMLElement} dom.style
   */
  this.dom.style = document.createElement('style');
  this.dom.style.appendChild(document.createTextNode(css));
  (document.head||document.body||this.dom.doc).appendChild(this.dom.style);
  
  /**
   * Content wrapper for the application
   * @var {HTMLElement} dom.content
   */
  this.dom.content = document.createElement('div');
  this.dom.content.setAttribute('class','runover-content');
  (document.body||this.dom.doc).appendChild(this.dom.content);
  
  /**
   * Selector highlighter element
   * @var {HTMLElement} dom.selector
   */
  this.dom.selector = document.createElement('div');
  this.dom.selector.setAttribute('class','runover-selector');
  this.dom.content.appendChild(this.dom.selector);
  
  /**
   * Points wrapper div
   * @var {HTMLElement} dom.points
   */
  this.dom.points = document.createElement('div');
  this.dom.points.setAttribute('class','runover-points');
  this.dom.content.appendChild(this.dom.points);
  
  /**
   * Div to measure text textarea content
   * @var {HTMLElement} dom.measure
   */
  this.dom.measure = document.createElement('div');
  this.dom.measure.setAttribute('class','runover-measure');
  this.dom.content.appendChild(this.dom.measure);
  
  /**
   * The Selector instance in use
   * @var {RunoverSelector} selector
   */
  this.selector = new Selector (this.dom.selector);
  
  // Attach mouse and environment
  // interactions event handlers
  
  var timeouts = {}
  
  var cursorcb = () => {
    this.dom.doc.setAttribute('data-runover-cursor',false) }
    this.state.cursor = false;
    
  var motioncb = () => {
    this.dom.doc.setAttribute('data-runover-motion',false) }
    this.state.motion = false;
    
  var cursorrc = () => this.selector
    .recalculate(this.state.mouse.x,this.state.mouse.y);
    
  var recalccb = (ev) => {
    if (!this.state.power) return;
    if (ev.type == 'mousemove') {
      this.state.mouse.x = ev.clientX;
      this.state.mouse.y = ev.clientY;
      this.state.moddown && this.state.editing && this.startSelecting(true);
      clearTimeout(timeouts.cursor);
      this.dom.doc.setAttribute('data-runover-cursor',true);
      this.state.cursor = true;
      timeouts.cursor = setTimeout(cursorcb,50) }
    if (ev.type == 'scroll' || ev.type == 'resize') {
      this.selector.resetMaskPosition();
      clearTimeout(timeouts.motion);
      this.dom.doc.setAttribute('data-runover-motion',true);
      this.state.motion = true;
      timeouts.motion = setTimeout(motioncb,50) } }
    
  window.addEventListener('mousemove', (ev) => recalccb(ev));
  window.addEventListener('scroll',    (ev) => recalccb(ev));
  window.addEventListener('resize',    (ev) => recalccb(ev));
  
  Shutter.push(() =>
    this.state.power &&
    this.state.selecting &&
    this.selector.recalculate(this.state.mouse.x,this.state.mouse.y));
  
  Shutter.push(() =>
    this.state.power &&
    this.points.forEach((a) => a.recalculate()));
    
  Point.events.on('point-focus',(point) => this.state.editing++);
  Point.events.on('point-blur', (point) => this.state.editing--);
  
  // Attach taster handlers on shift
  // to be used as the selection mode trigger

  this.mousetrap.bind('mod',(ev) => {
    this.state.moddown = true;
    this.startSelecting();
  },'keydown');
  
  this.mousetrap.bind('mod',(ev) => {
    this.state.moddown = false;
    this.stopSelecting();
  },'keyup');
  
  this.mousetrap.bind('alt',(ev) => this.state.altdown = true,'keydown');
  this.mousetrap.bind('alt',(ev) => this.state.altdown = false,'keyup');
  
  this.selector.on('select',(t,r,x,y) => this.useSelection(t,r,x,y));
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
RunOver.prototype.powerOn = function ()
{
  this.state.power = true;
  this.dom.doc.setAttribute('data-runover',true);
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
RunOver.prototype.powerOff = function ()
{
  this.stopSelecting();
  this.state.power = false;
  this.dom.doc.setAttribute('data-runover',false);
  return this;
}

/**
 * Setup the environment so selection
 * (creating) new points is possible.
 *
 * @param  {Event}   ev - If passed, will be passed on further
 * @return {RunOver}    - Self
 *
 * @since 0.1.0
 */
RunOver.prototype.startSelecting = function (close)
{
  if (!this.state.power || this.state.selecting) return this;
  this.state.selecting = true;
  this.dom.doc.setAttribute('data-runover-selecting',true);
  this.selector.start();
  this.selector.recalculate(this.state.mouse.x,this.state.mouse.y);
  return this;
}

/**
 * Destroy (and cleanup) the environment suitable
 * for selecting (creating) new points.
 *
 * @return {RunOver} - Self
 * @since 0.1.0
 */
RunOver.prototype.stopSelecting = function ()
{
  if (!this.state.power || !this.state.selecting) return this;
  this.state.selecting = false;
  this.dom.doc.setAttribute('data-runover-selecting',false); 
  this.selector.stop();
  this.selector.resetMaskPosition();
  return this;
}

/**
 * Not implemented yet
 *
 *
 * @since 0.1.0
 */
RunOver.prototype.useSelection = function (target,rect,x,y)
{
  var point = new Point (target,rect,x,y,this.dom.measure);
  this.points.push(point);
  this.dom.points.appendChild(point.getElement());
  point.startEditing();
}

RunOver.prototype.getEditingPoint = function ()
{
  return this.points.find((point) => point.isBeingEdited());
}

/**
 * Class export
 */
module.exports = RunOver;