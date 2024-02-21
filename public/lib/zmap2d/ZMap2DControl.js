// JScript 文件

/**==========================================ZoomCtl==========================================
 * @classdesc
 * A control with 2 buttons, one for zoom in and one for zoom out.
 * This control is one of the default controls of a map. To style this control
 * use css selectors `.zmap-zoom-in` and `.zmap-zoom-out`.
 *
 * @constructor
 * @extends {ol.control.Control}
 * @param {olx.control.ZoomOptions=} opt_options Zoom options.
 * @api stable
 */
ol.control.ZoomCtl = function(opt_options) {

  var options = goog.isDef(opt_options) ? opt_options : {};

  var className = goog.isDef(options.className) ? options.className : 'zmap-zoom';

  var delta = goog.isDef(options.delta) ? options.delta : 1;

  var zoomInLabel = goog.isDef(options.zoomInLabel) ?
      options.zoomInLabel : '+';
  var zoomOutLabel = goog.isDef(options.zoomOutLabel) ?
      options.zoomOutLabel : '\u2212';

  var zoomInTipLabel = goog.isDef(options.zoomInTipLabel) ?
      options.zoomInTipLabel : '放大';
  var zoomOutTipLabel = goog.isDef(options.zoomOutTipLabel) ?
      options.zoomOutTipLabel : '缩小';
  
  var inElement = document.createElement('button');
  inElement.className = className + '-in';
  inElement.setAttribute('type', 'button');
  inElement.title = zoomInTipLabel;
  inElement.appendChild(
    typeof zoomInLabel === 'string' ? document.createTextNode(zoomInLabel) : zoomInLabel
  );  
  inElement.style.width = '26px';
  inElement.style.height= '26px';

  ol.events.listen(inElement, ol.events.EventType.CLICK,
      ol.control.Zoom.prototype.handleClick_.bind(this, delta));
 
  var outElement = document.createElement('button');
  outElement.className = className + '-out';
  outElement.setAttribute('type', 'button');
  outElement.title = zoomOutTipLabel;
  outElement.appendChild(
    typeof zoomOutLabel === 'string' ? document.createTextNode(zoomOutLabel) : zoomOutLabel
  );   
  outElement.style.width = '26px';
  outElement.style.height= '26px';

  /**
   * @type {number}
   * @private
   */
  /* this.duration_ = goog.isDef(options.duration) ? options.duration : 250;   */
  
  ol.events.listen(outElement, ol.events.EventType.CLICK,
      ol.control.Zoom.prototype.handleClick_.bind(this, -delta));

  var cssClasses = className + ' ' + ol.css.CLASS_UNSELECTABLE + ' ' +
      ol.css.CLASS_CONTROL;
  var element = document.createElement('div');
  element.className = cssClasses;
  element.appendChild(inElement);
  element.appendChild(outElement);

  ol.control.Control.call(this, {
    element: element,
    target: options.target
  });

  /**
   * @type {number}
   * @private
   */
  this.duration_ = options.duration !== undefined ? options.duration : 250;
};
goog.inherits(ol.control.ZoomCtl, ol.control.Control);


/**
 * @param {number} delta Zoom delta.
 * @param {goog.events.BrowserEvent} event The event to handle
 * @private
 */
ol.control.ZoomCtl.prototype.handleClick_ = function(delta, event) {
  event.preventDefault();
  this.zoomByDelta_(delta);
};


/**
 * @param {number} delta Zoom delta.
 * @private
 */
ol.control.ZoomCtl.prototype.zoomByDelta_ = function(delta) {
  var map = this.getMap();
  var view = map.getView();
  if (goog.isNull(view)) {
    // the map does not have a view, so we can't act
    // upon it
    return;
  }
  var currentResolution = view.getResolution();
  if (goog.isDef(currentResolution)) {
    if (this.duration_ > 0) {
      map.beforeRender(ol.animation.zoom({
        resolution: currentResolution,
        duration: this.duration_,
        easing: ol.easing.easeOut
      }));
    }
    var newResolution = view.constrainResolution(currentResolution, delta);
    view.setResolution(newResolution);
  }
};

//==================================================ZoomToExtent============================================
/**
 * @classdesc
 * A button control which, when pressed, changes the map view to a specific
 * extent. To style this control use the css selector `.zmap-zoom-extent`.
 *
 * @constructor
 * @extends {ol.control.Control}
 * @param {olx.control.ZoomToExtentOptions=} opt_options Options.
 * @api stable
 */
ol.control.ZoomToExtentCtl = function(opt_options) {
  var options = goog.isDef(opt_options) ? opt_options : {};

  /**
   * @type {ol.Extent}
   * @private
   */
  this.extent_ = options.extent ? options.extent : null;

  var className = options.className !== undefined ? options.className :
      'zmap-zoom-extent';

  var label = options.label !== undefined ? options.label : 'E';
  var tipLabel = options.tipLabel !== undefined ?
      options.tipLabel : 'Fit to extent';
  var button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.title = tipLabel;
  button.appendChild(
    typeof label === 'string' ? document.createTextNode(label) : label
  );

  ol.events.listen(button, ol.events.EventType.CLICK,
      this.handleClick_, this);

  var cssClasses = className + ' ' + ol.css.CLASS_UNSELECTABLE + ' ' +
      ol.css.CLASS_CONTROL;
  var element = document.createElement('div');
  element.className = cssClasses;
  element.appendChild(button);

  ol.control.Control.call(this, {
    element: element,
    target: options.target
  });
};
goog.inherits(ol.control.ZoomToExtentCtl, ol.control.Control);


/**
 * @param {goog.events.BrowserEvent} event The event to handle
 * @private
 */
ol.control.ZoomToExtentCtl.prototype.handleClick_ = function(event) {
  event.preventDefault();
  this.handleZoomToExtent_();
};


/**
 * @private
 */
ol.control.ZoomToExtentCtl.prototype.handleZoomToExtent_ = function() {
  var map = this.getMap();
  var view = map.getView();
  var extent = !this.extent_ ? view.getProjection().getExtent() : this.extent_;
  var size = /** @type {ol.Size} */ (map.getSize());
  view.fit(extent, size);
};



//=================================================ZoomSliderCtrl===========================================
ol.control.ZoomSliderCtl = function(opt_options) {

  var options = opt_options ? opt_options : {};

  /**
   * Will hold the current resolution of the view.
   *
   * @type {number|undefined}
   * @private
   */
  this.currentResolution_ = undefined;

  /**
   * The direction of the slider. Will be determined from actual display of the
   * container and defaults to ol.control.ZoomSlider.direction.VERTICAL.
   *
   * @type {ol.control.ZoomSlider.direction}
   * @private
   */
  this.direction_ = ol.control.ZoomSlider.direction.VERTICAL;

  /**
   * @type {boolean}
   * @private
   */
  this.dragging_;

  /**
   * @type {!Array.<ol.EventsKey>}
   * @private
   */
  this.dragListenerKeys_ = [];

  /**
   * @type {number}
   * @private
   */
  this.heightLimit_ = 0;

  /**
   * @type {number}
   * @private
   */
  this.widthLimit_ = 0;
  
  //178高度
  this.heightOffset=[10, 22];
  
  /**
   * @type {number|undefined}
   * @private
   */
  this.previousX_;

  /**
   * @type {number|undefined}
   * @private
   */
  this.previousY_;

  /**
   * The calculated thumb size (border box plus margins).  Set when initSlider_
   * is called.
   * @type {ol.Size}
   * @private
   */
  this.thumbSize_ = null;

  /**
   * Whether the slider is initialized.
   * @type {boolean}
   * @private
   */
  this.sliderInitialized_ = false;

  /**
   * @type {number}
   * @private
   */
  this.duration_ = options.duration !== undefined ? options.duration : 200;

  var className = options.className !== undefined ? options.className : 'zmap-zoomslider';
  var thumbElement = document.createElement('div');
  thumbElement.setAttribute('type', 'div');
  thumbElement.className = className + '-thumb ' + ol.css.CLASS_UNSELECTABLE;
  var containerElement = document.createElement('div');
  containerElement.className = className + ' ' + ol.css.CLASS_UNSELECTABLE + ' ' + ol.css.CLASS_CONTROL;
  containerElement.appendChild(thumbElement);
  /**
   * @type {ol.pointer.PointerEventHandler}
   * @private
   */
  this.dragger_ = new ol.pointer.PointerEventHandler(containerElement);

  ol.events.listen(this.dragger_, ol.pointer.EventType.POINTERDOWN,
      this.handleDraggerStart_, this);
  ol.events.listen(this.dragger_, ol.pointer.EventType.POINTERMOVE,
      this.handleDraggerDrag_, this);
  ol.events.listen(this.dragger_, ol.pointer.EventType.POINTERUP,
      this.handleDraggerEnd_, this);

  ol.events.listen(containerElement, ol.events.EventType.CLICK,
      this.handleContainerClick_, this);
  ol.events.listen(thumbElement, ol.events.EventType.CLICK,
      ol.events.Event.stopPropagation);

  var render = options.render ? options.render : ol.control.ZoomSlider.render;

  ol.control.Control.call(this, {
    element: containerElement,
    render: render
  });
  
  
};
goog.inherits(ol.control.ZoomSliderCtl, ol.control.Control);


/**
 * The enum for available directions.
 *
 * @enum {number}
 */
ol.control.ZoomSliderCtl.direction = {
  VERTICAL: 0,
  HORIZONTAL: 1
};


/**
 * @inheritDoc
 */
ol.control.ZoomSliderCtl.prototype.setMap = function(map) {
  goog.base(this, 'setMap', map);
  if (!goog.isNull(map)) {
    map.render();
  }
};


/**
 * Initializes the slider element. This will determine and set this controls
 * direction_ and also constrain the dragging of the thumb to always be within
 * the bounds of the container.
 *
 * @private
 */
ol.control.ZoomSliderCtl.prototype.initSlider_ = function() {
  var container = this.element;
  var containerSize = {
    width: container.offsetWidth, height: container.offsetHeight
  };

  var thumb = container.firstElementChild;
  var computedStyle = ol.global.getComputedStyle(thumb);
  var thumbWidth = thumb.offsetWidth +
      parseFloat(computedStyle['marginRight']) +
      parseFloat(computedStyle['marginLeft']);
  var thumbHeight = thumb.offsetHeight +
      parseFloat(computedStyle['marginTop']) +
      parseFloat(computedStyle['marginBottom']);
  this.thumbSize_ = [thumbWidth, thumbHeight];

  if (containerSize.width > containerSize.height) {
    this.direction_ = ol.control.ZoomSlider.direction.HORIZONTAL;
    this.widthLimit_ = containerSize.width - thumbWidth;
  } else {
    this.direction_ = ol.control.ZoomSlider.direction.VERTICAL;
    this.heightLimit_ = containerSize.height - this.heightOffset[1];//thumbHeight
  }
  this.sliderInitialized_ = true;
};


/**
 * Update the zoomslider element.
 * @param {ol.MapEvent} mapEvent Map event.
 * @this {ol.control.ZoomSliderCtl}
 * @api
 */
ol.control.ZoomSliderCtl.render = function(mapEvent) {
  if (goog.isNull(mapEvent.frameState)) {
    return;
  }
  goog.asserts.assert(goog.isDefAndNotNull(mapEvent.frameState.viewState),
      'viewState should be defined');
  if (!this.sliderInitialized_) {
    this.initSlider_();
  }
  var res = mapEvent.frameState.viewState.resolution;
  if (res !== this.currentResolution_) {
    this.currentResolution_ = res;
    this.setThumbPosition_(res);
  }
};


/**
 * @param {goog.events.BrowserEvent} browserEvent The browser event to handle.
 * @private
 */
ol.control.ZoomSliderCtl.prototype.handleContainerClick_ = function(browserEvent) {
  var map = this.getMap();
  var view = map.getView();
  var currentResolution = view.getResolution();
  goog.asserts.assert(goog.isDef(currentResolution),
      'currentResolution should be defined');
  map.beforeRender(ol.animation.zoom({
    resolution: currentResolution,
    duration: this.duration_,
    easing: ol.easing.easeOut
  }));
  var relativePosition = this.getRelativePosition_(
      browserEvent.offsetX - this.thumbSize_[0] / 2,
      browserEvent.offsetY - this.thumbSize_[1] / 2);
  var resolution = this.getResolutionForPosition_(relativePosition);
  view.setResolution(view.constrainResolution(resolution));
};


/**
 * Handle dragger start events.
 * @param {goog.fx.DragEvent} event The drag event.
 * @private
 */
ol.control.ZoomSliderCtl.prototype.handleDraggerStart_ = function(event) {
    if (!this.dragging_ &&
      event.originalEvent.target === this.element.firstElementChild) {
    this.getMap().getView().setHint(ol.View.Hint.INTERACTING, 1);
    this.previousX_ = event.clientX;
    this.previousY_ = event.clientY;
    this.dragging_  = true;

    if (this.dragListenerKeys_.length === 0) {
      var drag = this.handleDraggerDrag_;
      var end = this.handleDraggerEnd_;
      this.dragListenerKeys_.push(
        ol.events.listen(document, ol.events.EventType.MOUSEMOVE, drag, this),
        ol.events.listen(document, ol.events.EventType.TOUCHMOVE, drag, this),
        ol.events.listen(document, ol.pointer.EventType.POINTERMOVE, drag, this),
        ol.events.listen(document, ol.events.EventType.MOUSEUP, end, this),
        ol.events.listen(document, ol.events.EventType.TOUCHEND, end, this),
        ol.events.listen(document, ol.pointer.EventType.POINTERUP, end, this)
      );
    }
  }
};


/**
 * Handle dragger drag events.
 *
 * @param {goog.fx.DragEvent} event The drag event.
 * @private
 */
ol.control.ZoomSliderCtl.prototype.handleDraggerDrag_ = function(event) {
  if (this.dragging_) {
    var element = this.element.firstElementChild;
    var deltaX = event.clientX - this.previousX_ + parseInt(element.style.left, 10);
    var deltaY = event.clientY - this.heightOffset[0] - this.previousY_ + parseInt(element.style.top, 10);
    var relativePosition = this.getRelativePosition_(deltaX, deltaY);
    this.currentResolution_ = this.getResolutionForPosition_(relativePosition);
    this.getMap().getView().setResolution(this.currentResolution_);
    this.setThumbPosition_(this.currentResolution_);
    this.previousX_ = event.clientX;
    this.previousY_ = event.clientY;
  }
};


/**
 * Handle dragger end events.
 * @param {goog.fx.DragEvent} event The drag event.
 * @private
 */
ol.control.ZoomSliderCtl.prototype.handleDraggerEnd_ = function(event) {
   if (this.dragging_) {
    var map = this.getMap();
    var view = map.getView();
    view.setHint(ol.View.Hint.INTERACTING, -1);
    map.beforeRender(ol.animation.zoom({
      resolution: /** @type {number} */ (this.currentResolution_),
      duration: this.duration_,
      easing: ol.easing.easeOut
    }));
    var resolution = view.constrainResolution(this.currentResolution_);
    view.setResolution(resolution);
    this.dragging_ = false;
    this.previousX_ = undefined;
    this.previousY_ = undefined;
    this.dragListenerKeys_.forEach(ol.events.unlistenByKey);
    this.dragListenerKeys_.length = 0;
  }
};


/**
 * Positions the thumb inside its container according to the given resolution.
 *
 * @param {number} res The res.
 * @private
 */
ol.control.ZoomSliderCtl.prototype.setThumbPosition_ = function(res) {
  var position = this.getPositionForResolution_(res);
  var thumb = this.element.firstElementChild;

  if (this.direction_ == ol.control.ZoomSlider.direction.HORIZONTAL) {
    thumb.style.left = this.widthLimit_ * position + 'px';
  } else {
    thumb.style.top = (this.heightLimit_ * position + this.heightOffset[0]) + 'px';
  }
};


/**
 * Calculates the relative position of the thumb given x and y offsets.  The
 * relative position scales from 0 to 1.  The x and y offsets are assumed to be
 * in pixel units within the dragger limits.
 *
 * @param {number} x Pixel position relative to the left of the slider.
 * @param {number} y Pixel position relative to the top of the slider.
 * @return {number} The relative position of the thumb.
 * @private
 */
ol.control.ZoomSliderCtl.prototype.getRelativePosition_ = function(x, y) {
  var amount;
  if (this.direction_ === ol.control.ZoomSlider.direction.HORIZONTAL) {
    amount = x / this.widthLimit_;
  } else {
    amount = y / this.heightLimit_;
  }
  return ol.math.clamp(amount, 0, 1);
};


/**
 * Calculates the corresponding resolution of the thumb given its relative
 * position (where 0 is the minimum and 1 is the maximum).
 *
 * @param {number} position The relative position of the thumb.
 * @return {number} The corresponding resolution.
 * @private
 */
ol.control.ZoomSliderCtl.prototype.getResolutionForPosition_ = function(position) {
  var fn = this.getMap().getView().getResolutionForValueFunction();
  return fn(1 - position);
};


/**
 * Determines the relative position of the slider for the given resolution.  A
 * relative position of 0 corresponds to the minimum view resolution.  A
 * relative position of 1 corresponds to the maximum view resolution.
 *
 * @param {number} res The resolution.
 * @return {number} The relative position value (between 0 and 1).
 * @private
 */
ol.control.ZoomSliderCtl.prototype.getPositionForResolution_ = function(res) {
  var fn = this.getMap().getView().getValueForResolutionFunction();
  return 1 - fn(res);
};


/**=======================================ol.control.MousePositionCtl==========================================
 * @classdesc
 * A control to show the 2D coordinates of the mouse cursor. By default, these
 * are in the view projection, but can be in any supported projection.
 * By default the control is shown in the top right corner of the map, but this
 * can be changed by using the css selector `.zmap-mouse-position`.
 *
 * @constructor
 * @extends {ol.control.Control}
 * @param {olx.control.MousePositionOptions=} opt_options Mouse position
 *     options.
 * @api stable
 */
ol.control.MousePositionCtl = function(opt_options) {

  var options = opt_options ? opt_options : {};

  var element = document.createElement('DIV');
  element.className = options.className !== undefined ? options.className : 'zmap-mouse-position';

  var render = options.render ?
      options.render : ol.control.MousePosition.render;

  ol.control.Control.call(this, {
    element: element,
    render: render,
    target: options.target
  });

  ol.events.listen(this,
      ol.Object.getChangeEventType(ol.control.MousePositionProperty.PROJECTION),
      this.handleProjectionChanged_, this);

  if (options.coordinateFormat) {
    this.setCoordinateFormat(options.coordinateFormat);
  }
  if (options.projection) {
    this.setProjection(ol.proj.get(options.projection));
  }

  /**
   * @private
   * @type {string}
   */
  this.undefinedHTML_ = options.undefinedHTML !== undefined ? options.undefinedHTML : '';

  /**
   * @private
   * @type {string}
   */
  this.renderedHTML_ = element.innerHTML;

  /**
   * @private
   * @type {ol.proj.Projection}
   */
  this.mapProjection_ = null;

  /**
   * @private
   * @type {?ol.TransformFunction}
   */
  this.transform_ = null;

  /**
   * @private
   * @type {ol.Pixel}
   */
  this.lastMouseMovePixel_ = null;

};
goog.inherits(ol.control.MousePositionCtl, ol.control.Control);


/**
 * Update the mouseposition element.
 * @param {ol.MapEvent} mapEvent Map event.
 * @this {ol.control.MousePositionCtl}
 * @api
 */
ol.control.MousePositionCtl.render = function(mapEvent) {
  var frameState = mapEvent.frameState;
  if (!frameState) {
    this.mapProjection_ = null;
  } else {
    if (this.mapProjection_ != frameState.viewState.projection) {
      this.mapProjection_ = frameState.viewState.projection;
      this.transform_ = null;
    }
  }
  this.updateHTML_(this.lastMouseMovePixel_);
};


/**
 * @private
 */
ol.control.MousePositionCtl.prototype.handleProjectionChanged_ = function() {
  this.transform_ = null;
};


/**
 * Return the coordinate format type used to render the current position or
 * undefined.
 * @return {ol.CoordinateFormatType|undefined} The format to render the current
 *     position in.
 * @observable
 * @api stable
 */
ol.control.MousePositionCtl.prototype.getCoordinateFormat = function() {
  return /** @type {ol.CoordinateFormatType|undefined} */ (
      this.get(ol.control.MousePositionProperty.COORDINATE_FORMAT));
};


/**
 * Return the projection that is used to report the mouse position.
 * @return {ol.proj.Projection|undefined} The projection to report mouse
 *     position in.
 * @observable
 * @api stable
 */
ol.control.MousePositionCtl.prototype.getProjection = function() {
  return /** @type {ol.proj.Projection|undefined} */ (
      this.get(ol.control.MousePositionProperty.PROJECTION));
};


/**
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 * @protected
 */
ol.control.MousePositionCtl.prototype.handleMouseMove = function(browserEvent) {
  var map = this.getMap();
  this.lastMouseMovePixel_ = map.getEventPixel(event);
  this.updateHTML_(this.lastMouseMovePixel_);
};


/**
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 * @protected
 */
ol.control.MousePositionCtl.prototype.handleMouseOut = function(browserEvent) {
  this.updateHTML_(null);
  this.lastMouseMovePixel_ = null;
};


/**
 * @inheritDoc
 * @api stable
 */
ol.control.MousePositionCtl.prototype.setMap = function(map) {
  ol.control.Control.prototype.setMap.call(this, map);
  if (map) {
    var viewport = map.getViewport();
    this.listenerKeys.push(
        ol.events.listen(viewport, ol.events.EventType.MOUSEMOVE,
            this.handleMouseMove, this),
        ol.events.listen(viewport, ol.events.EventType.MOUSEOUT,
            this.handleMouseOut, this)
    );
  }
};


/**
 * Set the coordinate format type used to render the current position.
 * @param {ol.CoordinateFormatType} format The format to render the current
 *     position in.
 * @observable
 * @api stable
 */
ol.control.MousePositionCtl.prototype.setCoordinateFormat = function(format) {
   this.set(ol.control.MousePositionProperty.COORDINATE_FORMAT, format);
};


/**
 * Set the projection that is used to report the mouse position.
 * @param {ol.proj.Projection} projection The projection to report mouse
 *     position in.
 * @observable
 * @api stable
 */
ol.control.MousePositionCtl.prototype.setProjection = function(projection) {
  this.set(ol.control.MousePositionProperty.PROJECTION, projection);
};


/**
 * @param {?ol.Pixel} pixel Pixel.
 * @private
 */
ol.control.MousePositionCtl.prototype.updateHTML_ = function(pixel) {
  var html = this.undefinedHTML_;
  if (!goog.isNull(pixel) && !goog.isNull(this.mapProjection_)) {
    if (goog.isNull(this.transform_)) {
      var projection = this.getProjection();
      if (goog.isDef(projection)) {
        this.transform_ = ol.proj.getTransformFromProjections(
            this.mapProjection_, projection);
      } else {
        this.transform_ = ol.proj.identityTransform;
      }
    }
    var map = this.getMap();
    var coordinate = map.getCoordinateFromPixel(pixel);
    if (!goog.isNull(coordinate)) {
      this.transform_(coordinate, coordinate);
      var coordinateFormat = this.getCoordinateFormat();
      if (goog.isDef(coordinateFormat)) {
        html = coordinateFormat(coordinate);
      } else {
//        html = coordinate.toString();
          var code = map.getView().getProjection().getCode();
          if (code == "EPSG:4326")
          {
              html = "经度:" + coordinate[0].toFixed(4) + " " + "纬度:" + coordinate[1].toFixed(4);             
          }
          else if(code =="EPSG:900913"||code =="EPSG:3857")
          {
              var JW = ol.proj.transform(coordinate, "EPSG:900913", "EPSG:4326");
              html = "经度:" + JW[0].toFixed(4) + " " + "纬度:" + JW[1].toFixed(4);         
          }
          else{
             html = "X:" + coordinate[0].toFixed(4) + " " + "Y:" + coordinate[1].toFixed(4);
          }
      }
    }
  }
  if (!goog.isDef(this.renderedHTML_) || html != this.renderedHTML_) {
    this.element.innerHTML = html;
    this.renderedHTML_ = html;
  }
};



/**=================================================OverviewMapCtl======================================
 * Create a new control with a map acting as an overview map for an other
 * defined map.
 * @constructor
 * @extends {ol.control.Control}
 * @param {olx.control.OverviewMapOptions=} opt_options OverviewMap options.
 * @api
 */
 ol.control.OverviewMapCtl = function(opt_options) {

  var options = opt_options ? opt_options : {};

  /**
   * @type {boolean}
   * @private
   */
  this.collapsed_ = options.collapsed !== undefined ? options.collapsed : true;

  /**
   * @private
   * @type {boolean}
   */
  this.collapsible_ = options.collapsible !== undefined ?
      options.collapsible : true;

  if (!this.collapsible_) {
    this.collapsed_ = false;
  }

  var className = options.className !== undefined ? options.className : 'ol-overviewmap';

  var tipLabel = options.tipLabel !== undefined ? options.tipLabel : 'Overview map';

  var collapseLabel = options.collapseLabel !== undefined ? options.collapseLabel : '\u00AB';

  if (typeof collapseLabel === 'string') {
    /**
     * @private
     * @type {Node}
     */
    this.collapseLabel_ = document.createElement('span');
    this.collapseLabel_.textContent = collapseLabel;
  } else {
    this.collapseLabel_ = collapseLabel;
  }

  var label = options.label !== undefined ? options.label : '\u00BB';


  if (typeof label === 'string') {
    /**
     * @private
     * @type {Node}
     */
    this.label_ = document.createElement('span');
    this.label_.textContent = label;
  } else {
    this.label_ = label;
  }

  var activeLabel = (this.collapsible_ && !this.collapsed_) ?
      this.collapseLabel_ : this.label_;
  var button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.title = tipLabel;
  button.appendChild(activeLabel);

  ol.events.listen(button, ol.events.EventType.CLICK,
      this.handleClick_, this);

  var ovmapDiv = document.createElement('DIV');
  ovmapDiv.className = 'ol-overviewmap-map';

  /**
   * @type {ol.Map}
   * @private
   */
  this.ovmap_ = new ol.Map({
    controls: new ol.Collection(),
    interactions: new ol.Collection(),
    target: ovmapDiv,
    view: options.view
  });
  var ovmap = this.ovmap_;

  if (options.layers) {
    options.layers.forEach(
        /**
       * @param {ol.layer.Layer} layer Layer.
       */
        function(layer) {
          ovmap.addLayer(layer);
        }, this);
  }

  var box = document.createElement('DIV');
  box.className = 'ol-overviewmap-box';
  box.style.boxSizing = 'border-box';

  /**
   * @type {ol.Overlay}
   * @private
   */
  this.boxOverlay_ = new ol.Overlay({
    position: [0, 0],
    positioning: ol.OverlayPositioning.BOTTOM_LEFT,
    element: box
  });
  this.ovmap_.addOverlay(this.boxOverlay_);

  var cssClasses = className + ' ' + ol.css.CLASS_UNSELECTABLE + ' ' +
      ol.css.CLASS_CONTROL +
      (this.collapsed_ && this.collapsible_ ? ' ol-collapsed' : '') +
      (this.collapsible_ ? '' : ' ol-uncollapsible');
  var element = document.createElement('div');
  element.className = cssClasses;
  element.appendChild(ovmapDiv);
  element.appendChild(button);

  var render = options.render ? options.render : ol.control.OverviewMapCtl.render;

  ol.control.Control.call(this, {
    element: element,
    render: render,
    target: options.target
  });
};
ol.inherits(ol.control.OverviewMapCtl, ol.control.Control);


/**
 * @inheritDoc
 * @api
 */
ol.control.OverviewMapCtl.prototype.setMap = function(map) {
  var oldMap = this.getMap();
  if (map === oldMap) {
    return;
  }
  if (oldMap) {
    var oldView = oldMap.getView();
    if (oldView) {
      this.unbindView_(oldView);
    }
  }
  ol.control.Control.prototype.setMap.call(this, map);

  if (map) {
    this.listenerKeys.push(ol.events.listen(
        map, ol.ObjectEventType.PROPERTYCHANGE,
        this.handleMapPropertyChange_, this));

    // TODO: to really support map switching, this would need to be reworked
    if (this.ovmap_.getLayers().getLength() === 0) {
      this.ovmap_.setLayerGroup(map.getLayerGroup());
    }

    var view = map.getView();
    if (view) {
      this.bindView_(view);
      if (view.isDef()) {
        this.ovmap_.updateSize();
        this.resetExtent_();
      }
    }
  }
};


/**
 * Handle map property changes.  This only deals with changes to the map's view.
 * @param {ol.ObjectEvent} event The propertychange event.
 * @private
 */
ol.control.OverviewMapCtl.prototype.handleMapPropertyChange_ = function(event) {
  if (event.key === ol.MapProperty.VIEW) {
    var oldView = /** @type {ol.View} */ (event.oldValue);
    if (oldView) {
      this.unbindView_(oldView);
    }
    var newView = this.getMap().getView();
    this.bindView_(newView);
  }
};


/**
 * Register listeners for view property changes.
 * @param {ol.View} view The view.
 * @private
 */
ol.control.OverviewMapCtl.prototype.bindView_ = function(view) {
  ol.events.listen(view,
      ol.Object.getChangeEventType(ol.View.Property.ROTATION),
      this.handleRotationChanged_, this);
};


/**
 * Unregister listeners for view property changes.
 * @param {ol.View} view The view.
 * @private
 */
ol.control.OverviewMapCtl.prototype.unbindView_ = function(view) {
  ol.events.unlisten(view,
      ol.Object.getChangeEventType(ol.View.Property.ROTATION),
      this.handleRotationChanged_, this);
};


/**
 * Handle rotation changes to the main map.
 * TODO: This should rotate the extent rectrangle instead of the
 * overview map's view.
 * @private
 */
ol.control.OverviewMapCtl.prototype.handleRotationChanged_ = function() {
  this.ovmap_.getView().setRotation(this.getMap().getView().getRotation());
};


/**
 * Update the overview map element.
 * @param {ol.MapEvent} mapEvent Map event.
 * @this {ol.control.OverviewMapCtl}
 * @api
 */
ol.control.OverviewMapCtl.render = function(mapEvent) {
  this.validateExtent_();
  this.updateBox_();
};


/**
 * Reset the overview map extent if the box size (width or
 * height) is less than the size of the overview map size times minRatio
 * or is greater than the size of the overview size times maxRatio.
 *
 * If the map extent was not reset, the box size can fits in the defined
 * ratio sizes. This method then checks if is contained inside the overview
 * map current extent. If not, recenter the overview map to the current
 * main map center location.
 * @private
 */
ol.control.OverviewMapCtl.prototype.validateExtent_ = function() {
  var map = this.getMap();
  var ovmap = this.ovmap_;

  if (!map.isRendered() || !ovmap.isRendered()) {
    return;
  }

  var mapSize = /** @type {ol.Size} */ (map.getSize());

  var view = map.getView();
  var extent = view.calculateExtent(mapSize);

  var ovmapSize = /** @type {ol.Size} */ (ovmap.getSize());

  var ovview = ovmap.getView();
  var ovextent = ovview.calculateExtent(ovmapSize);

  var topLeftPixel =
      ovmap.getPixelFromCoordinate(ol.extent.getTopLeft(extent));
  var bottomRightPixel =
      ovmap.getPixelFromCoordinate(ol.extent.getBottomRight(extent));

  var boxWidth = Math.abs(topLeftPixel[0] - bottomRightPixel[0]);
  var boxHeight = Math.abs(topLeftPixel[1] - bottomRightPixel[1]);

  var ovmapWidth = ovmapSize[0];
  var ovmapHeight = ovmapSize[1];

  if (boxWidth < ovmapWidth * ol.OVERVIEWMAP_MIN_RATIO ||
      boxHeight < ovmapHeight * ol.OVERVIEWMAP_MIN_RATIO ||
      boxWidth > ovmapWidth * ol.OVERVIEWMAP_MAX_RATIO ||
      boxHeight > ovmapHeight * ol.OVERVIEWMAP_MAX_RATIO) {
    this.resetExtent_();
  } else if (!ol.extent.containsExtent(ovextent, extent)) {
    this.recenter_();
  }
};


/**
 * Reset the overview map extent to half calculated min and max ratio times
 * the extent of the main map.
 * @private
 */
ol.control.OverviewMapCtl.prototype.resetExtent_ = function() {
  if (ol.OVERVIEWMAP_MAX_RATIO === 0 || ol.OVERVIEWMAP_MIN_RATIO === 0) {
    return;
  }

  var map = this.getMap();
  var ovmap = this.ovmap_;

  var mapSize = /** @type {ol.Size} */ (map.getSize());

  var view = map.getView();
  var extent = view.calculateExtent(mapSize);

  var ovmapSize = /** @type {ol.Size} */ (ovmap.getSize());

  var ovview = ovmap.getView();

  // get how many times the current map overview could hold different
  // box sizes using the min and max ratio, pick the step in the middle used
  // to calculate the extent from the main map to set it to the overview map,
  var steps = Math.log(
      ol.OVERVIEWMAP_MAX_RATIO / ol.OVERVIEWMAP_MIN_RATIO) / Math.LN2;
  var ratio = 1 / (Math.pow(2, steps / 2) * ol.OVERVIEWMAP_MIN_RATIO);
  ol.extent.scaleFromCenter(extent, ratio);
  ovview.fit(extent, ovmapSize);
};


/**
 * Set the center of the overview map to the map center without changing its
 * resolution.
 * @private
 */
ol.control.OverviewMapCtl.prototype.recenter_ = function() {
  var map = this.getMap();
  var ovmap = this.ovmap_;

  var view = map.getView();

  var ovview = ovmap.getView();

  ovview.setCenter(view.getCenter());
};


/**
 * Update the box using the main map extent
 * @private
 */
ol.control.OverviewMapCtl.prototype.updateBox_ = function() {
  var map = this.getMap();
  var ovmap = this.ovmap_;

  if (!map.isRendered() || !ovmap.isRendered()) {
    return;
  }

  var mapSize = /** @type {ol.Size} */ (map.getSize());

  var view = map.getView();

  var ovview = ovmap.getView();

  var rotation = view.getRotation();

  var overlay = this.boxOverlay_;
  var box = this.boxOverlay_.getElement();
  var extent = view.calculateExtent(mapSize);
  var ovresolution = ovview.getResolution();
  var bottomLeft = ol.extent.getBottomLeft(extent);
  var topRight = ol.extent.getTopRight(extent);

  // set position using bottom left coordinates
  var rotateBottomLeft = this.calculateCoordinateRotate_(rotation, bottomLeft);
  overlay.setPosition(rotateBottomLeft);

  // set box size calculated from map extent size and overview map resolution
  if (box) {
    box.style.width = Math.abs((bottomLeft[0] - topRight[0]) / ovresolution) + 'px';
    box.style.height = Math.abs((topRight[1] - bottomLeft[1]) / ovresolution) + 'px';
  }
};


/**
 * @param {number} rotation Target rotation.
 * @param {ol.Coordinate} coordinate Coordinate.
 * @return {ol.Coordinate|undefined} Coordinate for rotation and center anchor.
 * @private
 */
ol.control.OverviewMapCtl.prototype.calculateCoordinateRotate_ = function(
    rotation, coordinate) {
  var coordinateRotate;

  var map = this.getMap();
  var view = map.getView();

  var currentCenter = view.getCenter();

  if (currentCenter) {
    coordinateRotate = [
      coordinate[0] - currentCenter[0],
      coordinate[1] - currentCenter[1]
    ];
    ol.coordinate.rotate(coordinateRotate, rotation);
    ol.coordinate.add(coordinateRotate, currentCenter);
  }
  return coordinateRotate;
};


/**
 * @param {Event} event The event to handle
 * @private
 */
ol.control.OverviewMapCtl.prototype.handleClick_ = function(event) {
  event.preventDefault();
  this.handleToggle_();
};


/**
 * @private
 */
ol.control.OverviewMapCtl.prototype.handleToggle_ = function() {
  this.element.classList.toggle('ol-collapsed');
  if (this.collapsed_) {
    ol.dom.replaceNode(this.collapseLabel_, this.label_);
  } else {
    ol.dom.replaceNode(this.label_, this.collapseLabel_);
  }
  this.collapsed_ = !this.collapsed_;

  // manage overview map if it had not been rendered before and control
  // is expanded
  var ovmap = this.ovmap_;
  if (!this.collapsed_ && !ovmap.isRendered()) {
    ovmap.updateSize();
    this.resetExtent_();
    ol.events.listenOnce(ovmap, ol.MapEventType.POSTRENDER,
        function(event) {
          this.updateBox_();
        },
        this);
  }
};


/**
 * Return `true` if the overview map is collapsible, `false` otherwise.
 * @return {boolean} True if the widget is collapsible.
 * @api stable
 */
ol.control.OverviewMapCtl.prototype.getCollapsible = function() {
  return this.collapsible_;
};


/**
 * Set whether the overview map should be collapsible.
 * @param {boolean} collapsible True if the widget is collapsible.
 * @api stable
 */
ol.control.OverviewMapCtl.prototype.setCollapsible = function(collapsible) {
  if (this.collapsible_ === collapsible) {
    return;
  }
  this.collapsible_ = collapsible;
  this.element.classList.toggle('ol-uncollapsible');
  if (!collapsible && this.collapsed_) {
    this.handleToggle_();
  }
};


/**
 * Collapse or expand the overview map according to the passed parameter. Will
 * not do anything if the overview map isn't collapsible or if the current
 * collapsed state is already the one requested.
 * @param {boolean} collapsed True if the widget is collapsed.
 * @api stable
 */
ol.control.OverviewMapCtl.prototype.setCollapsed = function(collapsed) {
  if (!this.collapsible_ || this.collapsed_ === collapsed) {
    return;
  }
  this.handleToggle_();
};


/**
 * Determine if the overview map is collapsed.
 * @return {boolean} The overview map is collapsed.
 * @api stable
 */
ol.control.OverviewMapCtl.prototype.getCollapsed = function() {
  return this.collapsed_;
};


/**
 * Return the overview map.
 * @return {ol.Map} Overview map.
 * @api
 */
ol.control.OverviewMapCtl.prototype.getOverviewMap = function() {
  return this.ovmap_;
};
 
 
 


/**======================================ScaleLine=========================================
 * @classdesc
 * A control displaying rough x-axis distances, calculated for the center of the
 * viewport.
 * No scale line will be shown when the x-axis distance cannot be calculated in
 * the view projection (e.g. at or beyond the poles in EPSG:4326).
 * By default the scale line will show in the bottom left portion of the map,
 * but this can be changed by using the css selector `.zmap-scale-line`.
 *
 * @constructor
 * @extends {ol.control.Control}
 * @param {olx.control.ScaleLineOptions=} opt_options Scale line options.
 * @api stable
 */

/**
 * @classdesc
 * A control displaying rough y-axis distances, calculated for the center of the
 * viewport. For conformal projections (e.g. EPSG:3857, the default view
 * projection in OpenLayers), the scale is valid for all directions.
 * No scale line will be shown when the y-axis distance of a pixel at the
 * viewport center cannot be calculated in the view projection.
 * By default the scale line will show in the bottom left portion of the map,
 * but this can be changed by using the css selector `.ol-scale-line`.
 *
 * @constructor
 * @extends {ol.control.Control}
 * @param {olx.control.ScaleLineOptions=} opt_options Scale line options.
 * @api stable
 */
ol.control.ScaleLineCtl = function(opt_options) {

  var options = opt_options ? opt_options : {};

  var className = options.className !== undefined ? options.className : 'ol-scale-line';

  /**
   * @private
   * @type {Element}
   */
  this.innerElement_ = document.createElement('DIV');
  this.innerElement_.className = className + '-inner';

  /**
   * @private
   * @type {Element}
   */
  this.element_ = document.createElement('DIV');
  this.element_.className = className + ' ' + ol.css.CLASS_UNSELECTABLE;
  this.element_.appendChild(this.innerElement_);

  /**
   * @private
   * @type {?olx.ViewState}
   */
  this.viewState_ = null;

  /**
   * @private
   * @type {number}
   */
  this.minWidth_ = options.minWidth !== undefined ? options.minWidth : 64;

  /**
   * @private
   * @type {boolean}
   */
  this.renderedVisible_ = false;

  /**
   * @private
   * @type {number|undefined}
   */
  this.renderedWidth_ = undefined;

  /**
   * @private
   * @type {string}
   */
  this.renderedHTML_ = '';

  var render = options.render ? options.render : ol.control.ScaleLineCtl.render;

  ol.control.Control.call(this, {
    element: this.element_,
    render: render,
    target: options.target
  });

  ol.events.listen(
      this, ol.Object.getChangeEventType(ol.control.ScaleLineCtl.Property.UNITS),
      this.handleUnitsChanged_, this);

  this.setUnits(/** @type {ol.control.ScaleLineCtl.Units} */ (options.units) ||
      ol.control.ScaleLineCtl.Units.METRIC);

};
ol.inherits(ol.control.ScaleLineCtl, ol.control.Control);


/**
 * @const
 * @type {Array.<number>}
 */
ol.control.ScaleLineCtl.LEADING_DIGITS = [1, 2, 5];


/**
 * Return the units to use in the scale line.
 * @return {ol.control.ScaleLineCtl.Units|undefined} The units to use in the scale
 *     line.
 * @observable
 * @api stable
 */
ol.control.ScaleLineCtl.prototype.getUnits = function() {
  return /** @type {ol.control.ScaleLineCtl.Units|undefined} */ (
      this.get(ol.control.ScaleLineCtl.Property.UNITS));
};


/**
 * Update the scale line element.
 * @param {ol.MapEvent} mapEvent Map event.
 * @this {ol.control.ScaleLineCtl}
 * @api
 */
ol.control.ScaleLineCtl.render = function(mapEvent) {
  var frameState = mapEvent.frameState;
  if (!frameState) {
    this.viewState_ = null;
  } else {
    this.viewState_ = frameState.viewState;
  }
  this.updateElement_();
};


/**
 * @private
 */
ol.control.ScaleLineCtl.prototype.handleUnitsChanged_ = function() {
  this.updateElement_();
};


/**
 * Set the units to use in the scale line.
 * @param {ol.control.ScaleLineCtl.Units} units The units to use in the scale line.
 * @observable
 * @api stable
 */
ol.control.ScaleLineCtl.prototype.setUnits = function(units) {
  this.set(ol.control.ScaleLineCtl.Property.UNITS, units);
};


/**
 * @private
 */
ol.control.ScaleLineCtl.prototype.updateElement_ = function() {
  var viewState = this.viewState_;

  if (!viewState) {
    if (this.renderedVisible_) {
      this.element_.style.display = 'none';
      this.renderedVisible_ = false;
    }
    return;
  }

  var center = viewState.center;
  var projection = viewState.projection;
  var metersPerUnit = projection.getMetersPerUnit();
  var pointResolution =
      projection.getPointResolution(viewState.resolution, center) *
      metersPerUnit;

  var nominalCount = this.minWidth_ * pointResolution;
  var suffix = '';
  var units = this.getUnits();
  if (units == ol.control.ScaleLineCtl.Units.DEGREES) {
    var metersPerDegree = ol.proj.METERS_PER_UNIT[ol.proj.Units.DEGREES];
    pointResolution /= metersPerDegree;
    if (nominalCount < metersPerDegree / 60) {
      suffix = '\u2033'; // seconds
      pointResolution *= 3600;
    } else if (nominalCount < metersPerDegree) {
      suffix = '\u2032'; // minutes
      pointResolution *= 60;
    } else {
      suffix = '\u00b0'; // degrees
    }
  } else if (units == ol.control.ScaleLineCtl.Units.IMPERIAL) {
    if (nominalCount < 0.9144) {
      suffix = 'in';
      pointResolution /= 0.0254;
    } else if (nominalCount < 1609.344) {
      suffix = 'ft';
      pointResolution /= 0.3048;
    } else {
      suffix = 'mi';
      pointResolution /= 1609.344;
    }
  } else if (units == ol.control.ScaleLineCtl.Units.NAUTICAL) {
    pointResolution /= 1852;
    suffix = 'nm';
  } else if (units == ol.control.ScaleLineCtl.Units.METRIC) {
    if (nominalCount < 1) {
      suffix = 'mm';
      pointResolution *= 1000;
    } else if (nominalCount < 1000) {
      suffix = 'm';
    } else {
      suffix = 'km';
      pointResolution /= 1000;
    }
  } else if (units == ol.control.ScaleLineCtl.Units.US) {
    if (nominalCount < 0.9144) {
      suffix = 'in';
      pointResolution *= 39.37;
    } else if (nominalCount < 1609.344) {
      suffix = 'ft';
      pointResolution /= 0.30480061;
    } else {
      suffix = 'mi';
      pointResolution /= 1609.3472;
    }
  } else {
    ol.asserts.assert(false, 33); // Invalid units
  }

  var i = 3 * Math.floor(
      Math.log(this.minWidth_ * pointResolution) / Math.log(10));
  var count, width;
  while (true) {
    count = ol.control.ScaleLineCtl.LEADING_DIGITS[((i % 3) + 3) % 3] *
        Math.pow(10, Math.floor(i / 3));
    width = Math.round(count / pointResolution);
    if (isNaN(width)) {
      this.element_.style.display = 'none';
      this.renderedVisible_ = false;
      return;
    } else if (width >= this.minWidth_) {
      break;
    }
    ++i;
  }

  var html = count + ' ' + suffix;
  if (this.renderedHTML_ != html) {
    this.innerElement_.innerHTML = html;
    this.renderedHTML_ = html;
  }

  if (this.renderedWidth_ != width) {
    this.innerElement_.style.width = width + 'px';
    this.renderedWidth_ = width;
  }

  if (!this.renderedVisible_) {
    this.element_.style.display = '';
    this.renderedVisible_ = true;
  }

};


/**
 * @enum {string}
 * @api
 */
ol.control.ScaleLineCtl.Property = {
  UNITS: 'units'
};


/**
 * Units for the scale line. Supported values are `'degrees'`, `'imperial'`,
 * `'nautical'`, `'metric'`, `'us'`.
 * @enum {string}
 */
ol.control.ScaleLineCtl.Units = {
  DEGREES: 'degrees',
  IMPERIAL: 'imperial',
  NAUTICAL: 'nautical',
  METRIC: 'metric',
  US: 'us'
};

