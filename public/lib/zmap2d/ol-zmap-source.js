goog.provide('ol.tilegrid.TileZMap');

goog.require('goog.math');
goog.require('ol');
//goog.require('ol.TileCoord');
goog.require('ol.TileRange');
goog.require('ol.extent');
goog.require('ol.extent.Corner');
goog.require('ol.proj');
goog.require('ol.proj.EPSG3857');
goog.require('ol.tilecoord');
goog.require('ol.tilegrid.TileGrid');



/**
* @classdesc
* Set the grid pattern for sources accessing TileZMap tiled-image servers.
*
* @constructor
* @extends {ol.tilegrid.TileGrid}
* @param {ol.tilegrid.TileZMapOptions} options TileZMap options.
* @struct
* @api
*/
ol.tilegrid.TileZMap = function (options)
{
    //
    this.extent = goog.isDef(options.extent) ?
        options.extent : ol.proj.EPSG4326.EXTENT;

    //
    this.topGrid = goog.isDef(options.topGrid) ?  
        options.topGrid : [10, 5];
        
    var origin = goog.isDef(options.origin) ? 
        options.origin : ol.extent.getCorner(this.extent, ol.extent.Corner.BOTTOM_LEFT);
    ///
    var resolutions = this.resolutionsFromExtent(
        this.extent, this.topGrid, options.maxZoom, options.tileSize);

    goog.base(this, {
        minZoom: options.minZoom,
        origin: origin,
        resolutions: resolutions,
        tileSize: options.tileSize
    });

};
goog.inherits(ol.tilegrid.TileZMap, ol.tilegrid.TileGrid);

//
ol.tilegrid.TileZMap.prototype.resolutionsFromExtent = 
    function (extent, topGrid, opt_maxZoom, opt_tileSize)
    {
        var maxZoom = goog.isDef(opt_maxZoom) ?
            opt_maxZoom : ol.DEFAULT_MAX_ZOOM;

        var height = ol.extent.getHeight(extent);
        var width = ol.extent.getWidth(extent);

        var tileSize = goog.isDef(opt_tileSize) ?
            opt_tileSize : ol.DEFAULT_TILE_SIZE;
        var maxResolution = Math.max(
            width / (tileSize * topGrid[0]), height / (tileSize * topGrid[1]));

        var length = maxZoom + 1;
        var resolutions = new Array(length);
        for (var z = 0; z < length; ++z)
        {
            resolutions[z] = maxResolution / Math.pow(2, z);
        }
        return resolutions;
    };


/**
* @inheritDoc
*/
ol.tilegrid.TileZMap.prototype.createTileCoordTransform = function (opt_options)
{
    var options = goog.isDef(opt_options) ? opt_options : {};
    var minZ = this.minZoom;
    var maxZ = this.maxZoom;
    /** @type {Array.<ol.TileRange>} */
    var tileRangeByZ = null;
    if (goog.isDef(options.extent))
    {
        tileRangeByZ = new Array(maxZ + 1);
        var z;
        for (z = 0; z <= maxZ; ++z)
        {
            if (z < minZ)
            {
                tileRangeByZ[z] = null;
            } else
            {
                tileRangeByZ[z] = this.getTileRangeForExtentAndZ(options.extent, z);
            }
        }
    }
    return (
    /**
    * @param {ol.TileCoord} tileCoord Tile coordinate.
    * @param {ol.proj.Projection} projection Projection.
    * @param {ol.TileCoord=} opt_tileCoord Destination tile coordinate.
    * @return {ol.TileCoord} Tile coordinate.
    */
    function (tileCoord, projection, opt_tileCoord)
    {
        var z = tileCoord[0];
        if (z < minZ || maxZ < z)
        {
            return null;
        }
        var n = Math.pow(2, z);
        var x = tileCoord[1];
        var y;
       
       /* 
        if (projection.code_ == "EPSG:900913")
        {
            y = (n - 1) - tileCoord[2];                    
        }
        else
        {
            y = tileCoord[2]; 
        }  */
        y = tileCoord[2];
        
        if (!goog.isNull(tileRangeByZ))
        {
            var extent = tileRangeByZ[z];
            var height = extent.getHeight(extent);
            var width = extent.getWidth(extent);

            if (!this.wrapX_)
            {
                x = x % width;
                while (x < extent.minX)
                {
                    x += width;
                }
                while (x > extent.maxX)
                {
                    x -= width;
                }
            }
            else if (x < extent.minX || x > extent.maxX)
            {
                return null;
            }

            if (y < extent.minY || y > extent.maxY)
            {
                return null;
            }
        }

        ///
        return ol.tilecoord.createOrUpdate(z, x, y, opt_tileCoord);
    });
};


/**
* @inheritDoc
*/
ol.tilegrid.TileZMap.prototype.getTileCoordChildTileRange =
    function (tileCoord, opt_tileRange)
    {
        if (tileCoord[0] < this.maxZoom)
        {
            var doubleX = 2 * tileCoord[1];
            var doubleY = 2 * tileCoord[2];
            return ol.TileRange.createOrUpdate(
                doubleX, doubleX + 1,
                doubleY, doubleY + 1,
                opt_tileRange);
        } 
        else
        {
            return null;
        }
    };


/**
* @inheritDoc
*/
ol.tilegrid.TileZMap.prototype.forEachTileCoordParentTileRange =
    function (tileCoord, callback, opt_this, opt_tileRange)
    {
        var tileRange = ol.TileRange.createOrUpdate(
            0, tileCoord[1], 0, tileCoord[2], opt_tileRange);
        
        var z;
        for (z = tileCoord[0] - 1; z >= this.minZoom; --z)
        {
            tileRange.minX = tileRange.maxX >>= 1;
            tileRange.minY = tileRange.maxY >>= 1;
            if (callback.call(opt_this, z, tileRange))
            {
                return true;
            }
        }
        return false;
    };


goog.provide('ol.source.TileZMap');

goog.require('goog.array');
//goog.require('goog.asserts');
goog.require('goog.math');
goog.require('goog.object');
goog.require('goog.string');
//goog.require('goog.uri.utils');
goog.require('ol');
//goog.require('ol.TileCoord');
goog.require('ol.TileUrlFunction');
goog.require('ol.extent');
goog.require('ol.proj');
goog.require('ol.source.TileImage');
goog.require('ol.source.wms');
goog.require('ol.source.wms.ServerType');
goog.require('ol.tilecoord');



/**
* @classdesc
* Layer source for tile data from zMap servers.
*
* @constructor
* @extends {ol.source.TileImage}
* @param {olx.source.TileZMapOptions=} opt_options Tile zMap options.
* @api stable
*/
ol.source.TileZMap = function (opt_options)
{
    /// 
    var options = goog.isDef(opt_options) ? opt_options : {};

    /// 
    var params = goog.isDef(options.params) ? options.params : {};

    /// 
    var transparent = goog.object.get(params, 'TRANSPARENT', true);

    /// 
    var projection = goog.isDef(options.projection) ? options.projection : 'EPSG:4326';

    ///
    var topGrid = goog.isDef(options.topGrid) ? options.topGrid : [10, 5];
    var extent = goog.isDef(options.extent) ?
        options.extent : ol.tilegrid.extentFromProjection(projection);

    /// 
    var tileGrid = goog.isDef(options.tileGrid) ?
        options.tileGrid : new ol.tilegrid.TileZMap({
            extent: extent,
            maxZoom: options.maxZoom,
            tileSize: options.tileSize,
            topGrid: topGrid,
            wrapX: goog.isDef(options.wrapX) ? options.wrapX : true
        });

    var attributions;
    if (goog.isDef(options.attributions))
    {
        attributions = options.attributions;
    }
    else
    {
        attributions = [ol.source.TileZMap.ATTRIBUTION];
    }

    goog.base(this, {
        attributions: attributions,
        crossOrigin: options.crossOrigin,
        //logo: "",
        opaque: !transparent,
        projection: projection,
        tileGrid: tileGrid,
        tileLoadFunction: options.tileLoadFunction,
        tileUrlFunction: goog.bind(this.tileUrlFunction_, this),
        wrapX: goog.isDef(options.wrapX) ? options.wrapX : true
    });

    ///
    this.tileCoordTransform_ = tileGrid.createTileCoordTransform({ extent: extent });

    ///
    var urls = options.urls;
    if (!goog.isDef(urls) && goog.isDef(options.url))
    {
        urls = ol.TileUrlFunction.expandUrl(options.url);
    }

    /**
    * @private
    * @type {!Array.<string>}
    */
    this.urls_ = goog.isDefAndNotNull(urls) ? urls : [];

    ///
    this.catalog_ = goog.isDef(options.catalog) ? options.catalog : "";

    /**
    * @private
    * @type {Object}
    */
    this.params_ = params;

    /**
    * @private
    * @type {string}
    */
    this.coordKeyPrefix_ = '';
    this.resetCoordKeyPrefix_();

    /**
    * @private
    * @type {ol.Extent}
    */
    this.tmpExtent_ = ol.extent.createEmpty();
};

///
goog.inherits(ol.source.TileZMap, ol.source.TileImage);

///
ol.source.TileZMap.ATTRIBUTION = new ol.Attribution({
    html: '&copy; ' +
      '<a href="http://www.zmap-tech.com">兆图科技</a> '
});

ol.source.TileZMap.prototype.getCatalog = function ()
{
    return this.catalog_;
}

/**
* @inheritDoc
*/
ol.source.TileZMap.prototype.getKeyZXY = function (z, x, y)
{
    return this.coordKeyPrefix_ + goog.base(this, 'getKeyZXY', z, x, y);
};


/**
* Get the user-provided params, i.e. those passed to the constructor through
* the "params" option, and possibly updated using the updateParams method.
* @return {Object} Params.
* @api stable
*/
ol.source.TileZMap.prototype.getParams = function ()
{
    return this.params_;
};

/**
* Return the URLs used for this WMS source.
* @return {!Array.<string>} URLs.
* @api stable
*/
ol.source.TileZMap.prototype.getUrls = function ()
{
    return this.urls_;
};


/**
* @private
*/
ol.source.TileZMap.prototype.resetCoordKeyPrefix_ = function ()
{
    var i = 0;
    var res = [];

    var j, jj;
    for (j = 0, jj = this.urls_.length; j < jj; ++j)
    {
        res[i++] = this.urls_[j];
    }

    var key;
    for (key in this.params_)
    {
        res[i++] = key + '-' + this.params_[key];
    }

    this.coordKeyPrefix_ = res.join('#');
};


/**
* @param {string|undefined} url URL.
* @api stable
*/
ol.source.TileZMap.prototype.setUrl = function (url)
{
    var urls = goog.isDef(url) ? ol.TileUrlFunction.expandUrl(url) : null;
    this.setUrls(urls);
};


/**
* @param {Array.<string>|undefined} urls URLs.
* @api stable
*/
ol.source.TileZMap.prototype.setUrls = function (urls)
{
    this.urls_ = goog.isDefAndNotNull(urls) ? urls : [];
    this.resetCoordKeyPrefix_();
    this.changed();
};


/**
* @param {ol.TileCoord} tileCoord Tile coordinate.
* @param {number} pixelRatio Pixel ratio.
* @param {ol.proj.Projection} projection Projection.
* @return {string|undefined} Tile URL.
* @private
*/
ol.source.TileZMap.prototype.tileUrlFunction_ = function (tileCoord, pixelRatio, projection)
{
    var tileGrid = this.getTileGrid();
    if (goog.isNull(tileGrid))
    {
        tileGrid = this.getTileGridForProjection(projection);
    }
    var tileExtent = tileGrid.getTileCoordExtent(tileCoord, this.tmpExtent_);

    var tmpTileCoord = [0, 0, 0];
    tileCoord = this.tileCoordTransform_(tileCoord, projection, tmpTileCoord);
    if (goog.isNull(tileCoord))
    {
        return undefined;
    }



    if (tileGrid.getResolutions().length <= tileCoord[0])
    {
        return undefined;
    }

    var tileResolution = tileGrid.getResolution(tileCoord[0]);
    var tileSize = tileGrid.getTileSize(tileCoord[0]);

    if (pixelRatio != 1)
    {
//      tileSize = (tileSize * pixelRatio + 0.5) | 0;
    }
    tileSize = 256;

    var params = {};

    var urls = this.urls_;
    if (goog.array.isEmpty(urls))
    {
        return undefined;
    }

    params['name']  = this.catalog_;
    if (projection.code_ == "EPSG:900913")
    {   
       params['id']    = tileCoord[0] + ';' + tileCoord[2] + ';' + tileCoord[1];        
    }
    else
    {
       params['id']    = tileCoord[0] + ';' + tileCoord[2] + ';' + tileCoord[1];            
    }
    params['range'] = tileExtent.join(';');
    params['size']  = tileSize + ';' + tileSize;
    params['uei']   = true;
    if (pixelRatio != 1)
    {
        
    }

    var url;
    if (urls.length == 1)
    {
        url = urls[0];
    }
    else
    {
        var index = goog.math.modulo(ol.tilecoord.hash(tileCoord), urls.length);
        url = urls[index];
    }
    
    var zparam = "";
    for (var key in params)
    {
        zparam += key + "=" + params[key];
        zparam += "&";
    }
    var zurl;
    if(url.indexOf('?') == -1)
    {
        zurl = url + '?' + zparam;
    }

    else if(url[url.length-1] == "&")
    {
        zurl = url + zparam;
    }
    else
    {
        zurl = url + "&" + zparam;
    }

    ///
    return zurl;
   // return goog.uri.utils.appendParamsFromMap(url, params);
};


/**
* Update the user-provided params.
* @param {Object} params Params.
* @api stable
*/
ol.source.TileZMap.prototype.updateParams = function (params)
{
    goog.object.extend(this.params_, params);
    this.resetCoordKeyPrefix_();
    this.changed();
};



/*联网高德地图服务*/
ol.source.AMap = function(options){
    var options = options ? options : {};

      var attributions;
      if(options.attributions !== undefined){
          attributions = option.attributions;
      }else{
          attributions = [ol.source.AMap.ATTRIBUTION];
      }

      var url;
      if(options.mapType == "sat"){
          url ="http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}";
      }else{
          url = "http://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}";
      }

    ol.source.XYZ.call(this, {
          crossOrigin: 'anonymous',   //跨域
        cacheSize: options.cacheSize,
        projection: ol.proj.get('EPSG:3857'),
        // urls:urls,
        url:url,
        wrapX: options.wrapX !== undefined ? options.wrapX : true
      });

}

ol.inherits(ol.source.AMap,ol.source.XYZ);


ol.source.AMap.ATTRIBUTION = new ol.Attribution({
      html: '&copy; <a class="ol-attribution-amap" ' +
      'href="http://ditu.amap.com/">' +
      '高德地图</a>'
});
/*天地图在线*/
ol.source.TianMap = function(options){
    var options = options ? options : {};
      var attributions;
      if(options.attributions !== undefined){
          attributions = option.attributions;
      }else{
          attributions = [ol.source.TianMap.ATTRIBUTION];
      }

    var url;
    if(options.mapType == "sat"){
        url = "http://t{0-4}.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}";
    }else if(options.mapType == "satLabel"){
        url = "http://t{0-4}.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}";
    }else if(options.mapType == "label"){
        url = "http://t{0-4}.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}";
    }else{
        url = "http://t{0-4}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}";
    }

      ol.source.XYZ.call(this, {
        attributions: attributions,
      projection: ol.proj.get('EPSG:3857'),
        cacheSize: options.cacheSize,
        crossOrigin: 'anonymous',
        opaque: options.opaque !== undefined ? options.opaque : true,
        maxZoom: options.maxZoom !== undefined ? options.maxZoom : 19,
        reprojectionErrorThreshold: options.reprojectionErrorThreshold,
        tileLoadFunction: options.tileLoadFunction,
        url: url,
        wrapX: goog.isDef(options.wrapX) ? options.wrapX : true
      });
}
ol.inherits(ol.source.TianMap, ol.source.XYZ);

ol.source.TianMap.ATTRIBUTION = new ol.Attribution({
      html: '&copy; <a class="ol-attribution-tianmap" ' +
      'href="http://www.tianditu.cn/">' +
      '天地图</a>'
});


/*重写聚合cluster_方法，添加view和zoomlist*/
ol.source.Cluster.prototype.setView_ = function(view){
    this.view_ = view;
}
ol.source.Cluster.prototype.getView_ = function(){
    return this.view_;
}
ol.source.Cluster.prototype.setClusterByClass_ = function(){
    this.ClusterByClass = true;
}

ol.source.Cluster.prototype.setNewSource = function(){
    this.newSource = new ol.source.Vector();
}
ol.source.Cluster.prototype.getNewSource = function(){
    return this.newSource;
}


ol.source.Cluster.prototype.setZoomList_ = function(zoomList){
    this.zoomlist_ = zoomList;
}
ol.source.Cluster.prototype.getZoomList_ = function(){
    return this.zoomlist_;
}

ol.source.Cluster.prototype.cluster_ = function() {
    
    if (this.resolution_ === undefined) {
        return;
    }
    this.features_.length = 0;
    var extent = ol.extent.createEmpty();
    this.resolution_=this.getView_().values_.resolution<this.resolution_?this.getView_().values_.resolution:this.resolution_;
    

    var features = this.source_.getFeatures();
    if(!features||!Array.isArray(features)||features.length==0)
    {
        return;
    }
    var zIndex = 0;
    if(this.getView_()&&this.getZoomList_() && Array.isArray(this.getZoomList_()))
    {
        var zoom = this.getView_().getZoom()?this.getView_().getZoom():0;
        for(var z = 0;z<this.getZoomList_().length;z++)
        {
            if(zoom<=this.getZoomList_()[z])
            {
                zIndex = z+1;
                break;
            } 
        }
        if(zoom>this.getZoomList_()[this.getZoomList_().length-1])
        {
            zIndex = this.getZoomList_().length;
        }
    }
    if(typeof this.distance_ =='number')
    {
        var mapDistance = this.distance_ * this.resolution_;
    }
   
    else if(Array.isArray(this.distance_))
    {
        if(zIndex<=this.distance_.length)
        {
            var dis = isNaN(parseInt(this.distance_[zIndex-1]))?40:(parseInt(this.distance_[zIndex-1])>0?parseInt(this.distance_[zIndex-1]):1);
            var mapDistance = dis * this.resolution_;
        }
        else{
            var mapDistance = 40 * this.resolution_;
        }
    }
    else{
        var mapDistance = 40 * this.resolution_;
    }
  /**
   * @type {!Object.<string, boolean>}
   */
    var clustered = {};
    var sourceList  = {};//feature 分类数据对象
    this.sourceList = this.sourceList||{};
    this.sourceList[zIndex] = this.sourceList[zIndex] ||{};
    if(Object.keys(this.sourceList[zIndex]).length==0||features.length!=this.endFeaturesLength)
    {
        if(features[0].values_.type && Array.isArray(features[0].values_.type)&&features[0].values_.type.length>0)
        {
            for (var i = 0, ii = features.length; i < ii; i++)
            {
                var feature = features[i];
                if(feature.values_.type && Array.isArray(feature.values_.type)&&feature.values_.type.length>0)
                {
                    zIndex = feature.values_.type.length>zIndex?zIndex:feature.values_.type.length;
                    var zname = '';
                    for(var x=0;x<zIndex;x++)
                    {
                        zname+=feature.values_.type[x];
                    }
                    sourceList[zname] = sourceList[zname]||[];
                    sourceList[zname].push(feature);
                }
            }      
        }
        else
        {
            sourceList['notype'] = features;
        }
        this.sourceList[zIndex] = sourceList;
    }
    else
    {
        sourceList = this.sourceList[zIndex];
    }
    this.endFeaturesLength = features.length;
    var source;

    var sourceKeyArr = Object.keys(sourceList);
    
    for(var kk=0;kk<sourceKeyArr.length;kk++)
    {
        var k = sourceKeyArr[kk];
        var sfeature = sourceList[k];
        if(this.ClusterByClass)
        {
            this.features_.push(this.createCluster_(sfeature));
        }
        else
        {
            if(k=='notype')
            {
                source = this.source_
            }
            else if(sfeature.length>1)
            {
                source = new ol.source.Vector({features:sfeature});//feature数量多时构建source。用内部查询
            }
            for(var i = 0; i< sfeature.length; i++)
            {
                var feature = sfeature[i];
                if (!(ol.getUid(feature).toString() in clustered)) {
                    var geometry = this.geometryFunction_(feature);
                    if (geometry) {

                        var coordinates = geometry.getCoordinates();
                        ol.extent.createOrUpdateFromCoordinate(coordinates, extent);
                        ol.extent.buffer(extent, mapDistance, extent);

                        if(sfeature.length>1)
                        {
                            var neighbors = source.getFeaturesInExtent(extent);//根据范围再source中筛选
                        }
                        else{
                            var neighbors = sfeature;
                        }
                        if(neighbors.length == 0)
                        {
                            neighbors = [sfeature[i]];
                        }
                        goog.DEBUG && console.assert(neighbors.length >= 1, 'at least one neighbor found');
                        neighbors = neighbors.filter(function(neighbor) {
                        var uid = ol.getUid(neighbor).toString();
                        if (!(uid in clustered)) {
                            clustered[uid] = true;
                            return true;
                        } else {
                            return false;
                        }
                        });

                        this.features_.push(this.createCluster_(neighbors));
                    }
                } 
            }
        }
    }
};
