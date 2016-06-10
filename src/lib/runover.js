var css = require('raw!./styles/style.styl');
var Point    = require('./point');
var Selector = require('./selector');
var Shutter  = require('./utils/shutter');

/**
 * RunOver
 *
 * Toplevel class of the RunOver system.
 * Handles macro user interactions and manipulates points.
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
    power:  true,
    mouse:  { x:0,y:0 },
    cursor: false,
    motion: false,
    selecting: false
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

  // Flush initial state into the
  // dom (data-attributes)
  
  this.dom.doc.setAttribute('data-runover',          this.state.power);
  this.dom.doc.setAttribute('data-runover-cursor',   this.state.cursor);
  this.dom.doc.setAttribute('data-runover-motion',   this.state.motion);
  this.dom.doc.setAttribute('data-runover-selecting',this.state.selecting);
  
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
   * Anotations wrapper div
   * @var {HTMLElement} dom.points
   */
  this.dom.points = document.createElement('div');
  this.dom.points.setAttribute('class','runover-points');
  this.dom.content.appendChild(this.dom.points);
  
  /**
   * Style tag to load stylesheets without an external request
   * @var {HTMLElement} dom.style
   */
  this.dom.style = document.createElement('style');
  this.dom.style.appendChild(document.createTextNode(css));
  (document.head||document.body||this.dom.doc).appendChild(this.dom.style);
  
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
    this.state.cursor &&
    this.selector.recalculate(this.state.mouse.x,this.state.mouse.y));
  
  Shutter.push(() =>
    this.state.power &&
    this.points.forEach((a) => a.recalculate()));
  
  // Attach taster handlers on shift
  // to be used as the selection mode trigger
  
  window.addEventListener('keyup',  (ev) => this.stopSelecting()
  && this.selector.resetMaskPosition());
  window.addEventListener('keydown',(ev) =>
  (ev.keyCode || ev.which) == 16 && this.startSelecting());
  
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
RunOver.prototype.startSelecting = function (ev)
{
  if (!this.state.power || this.state.selecting) return this;
  this.state.selecting = true;
  this.dom.doc.setAttribute('data-runover-selecting',true);
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
  var point = new Point (target,rect,x,y);
  this.points.push(point);
  this.dom.points.appendChild(point.getElement());
  point.select();
}

/**
 * Class export
 */
module.exports = RunOver;