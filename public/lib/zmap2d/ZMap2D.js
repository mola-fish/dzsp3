// JScript 文件
//********************************************************************************************
//                 ZMap2D 2.0  本版本的接口都为经纬度坐标
//*********************************************************************************************//

var globeMap = {};
var ZMap2D = ZMap2D || {};
(function () {
	/** 
	* @exports map2d as ZMap2D.Map 
	*/

	var map2d =
		ZMap2D.Map = function Init2DView(divID, tileOptions, viewOptions) {
			ol.DEFAULT_TILE_CACHE_HIGH_WATER_MARK = 100;

			var tileGrid = null;
			var extent;
			if (viewOptions && viewOptions.extent) {
				extent = viewOptions.extent;
			}
			else if (tileOptions && tileOptions.extent) {
				extent = tileOptions.extent;
			}
			else {
				extent = [-180, -90, 180, 90];
			}

			//
			if (tileOptions) {
				tileGrid = new ol.tilegrid.TileZMap(
					{
						minZoom: tileOptions.minZoom ? tileOptions.minZoom : 2,
						maxZoom: tileOptions.maxZoom ? tileOptions.maxZoom : 18,
						topGrid: tileOptions.topGrid ? tileOptions.topGrid : [1, 1],
						tileSize: tileOptions.tileSize ? tileOptions.tileSize : 256,
						extent: extent ? extent : ol.proj.get("EPSG:4326").getExtent()
					});
			}
			else {
				tileGrid = new ol.tilegrid.TileZMap(
					{
						minZoom: 2,
						maxZoom: 18,
						topGrid: [1, 1],
						tileSize: 256,
						extent: extent ? extent : ol.proj.get("EPSG:4326").getExtent()
					});
			}

			//----------------------------
			var view = null;
			if (viewOptions) {
				view = new ol.View({
					center: viewOptions.center ? viewOptions.center : new ZMap2D.Convert( 'EPSG:4326', viewOptions.projection || 'EPSG:4326',[121.50, 31.22]),
					zoom: viewOptions.zoom ? viewOptions.zoom : 4,
					minZoom: viewOptions.minZoom ? viewOptions.minZoom : 2,
					maxZoom: viewOptions.maxZoom ? viewOptions.maxZoom : 18,
					extent: extent ? extent : [-180, -90, 180, 90],
					projection: viewOptions.projection ? viewOptions.projection : 'EPSG:4326'
				});
			}
			else {
				view = new ol.View({
					center: [113.23333, 23.16667],
					zoom: 2,
					extent: extent ? extent : [-180, -90, 180, 90],
					minZoom: 2,
					maxZoom: 21,
					projection: 'EPSG:4326'
				});
			}

			///
			var map = new ol.Map({
				logo: false,
				target: divID,
				controls: ol.control.defaults({
					zoom: false,
					attributionOptions: /** @type {olx.control.AttributionOptions} */({
						collapsible: false
					})
				}),
				//图层4
				view: view
			});

			this.olMap = map;
			this.olTileGrid = tileGrid;
			this.olDiv = divID;
			this.rClickArray = [];
			this.zoomListenerArray = [];
			this.zoomListenerFun = [];
			globeMap[divID] = this;
            this.checkpower();              
	}
		
		
	map2d.prototype.checkpower = function()
	{
	    var map = this.olMap;
		var authorizer = decodeURIComponent('%E5%BD%93%E5%89%8D%E7%B3%BB%E7%BB%9F%E4%B8%BA%E8%AF%95%E7%94%A8%E7%89%88%EF%BC%8C%E6%9C%AA%E6%AD%A3%E5%BC%8F%E6%8E%88%E6%9D%83');
		$.ajax({
			url: window.location.protocol + "//" + window.location.host + "/" + 'zs/cms/lic/q',
			dataType: 'json',
			success: function (data) {
				if (data.lic) {
					if (data.lic.authorizer && data.lic.authorizer != "") {
						authorizer = data.lic.authorizer;
						//var html='<span style="font-size:12px;padding:2px 10px;background:rgba(255,255,255,.4);cursor:pointer">'+data.lic.authorizer+'</span>';
						//globeMap[divID].AddCommonControl('logo', html, '5', '', '', '2', 160, 20); 

					}
				}
			}
		})
		var Str = randomString(32);
		var param = CodeString(Str);
		var status = decodeURIComponent('%E6%97%A0%E6%B3%95%E8%8E%B7%E5%8F%96%E8%AF%81%E4%B9%A6%E4%BF%A1%E6%81%AF%E6%88%96%E8%80%85%E8%AF%81%E4%B9%A6%E5%B7%B2%E8%BF%87%E6%9C%9F');
		$.ajax({
			url: window.location.protocol + "//" + window.location.host + '/zs/cms/lic/check',
			type: 'GET',
			data: { 'param': param, 'version': 6.0 },
			async: true,
			success: function (data) {
				var sign = data.sign;
				if (Str == sign) {
					if (data.lic.status == "OK") {
						status = '';
					}
				}
			}
		});

		map.on('postcompose', function (event) {

			var px1 = [10, event.target.getSize()[1] - 10];
			var coord1 = event.target.getCoordinateFromPixel(px1);
			var textstyle1 = new ol.style.Text({
				font: "normal 12px Arial",
				text: authorizer,
				textAlign: 'left',
				fill: new ol.style.Fill({ color: "#000" }),
				stroke: new ol.style.Stroke({ color: "#ffffff", width: 0 }),
			});
			var imageStyle1 = new ol.style.Style({
				text: textstyle1
			});
			event.vectorContext.setStyle(imageStyle1);
			event.vectorContext.drawGeometry(new ol.geom.Point(coord1));

			var px2 = [event.target.getSize()[0] - 10, event.target.getSize()[1] - 10];
			var coord2 = event.target.getCoordinateFromPixel(px2);
			var textstyle2 = new ol.style.Text({
				font: "normal 12px Arial",
				text: status,
				textAlign: 'right',
				fill: new ol.style.Fill({ color: "#000" }),
				stroke: new ol.style.Stroke({ color: "#ffffff", width: 0 })
			});
			var imageStyle2 = new ol.style.Style({
				text: textstyle2
			});
			event.vectorContext.setStyle(imageStyle2);
			event.vectorContext.drawGeometry(new ol.geom.Point(coord2));

			map.render();

		});
		map.render();		
	}
		

	map2d.prototype.getScale = function (value) {
		var n = parseInt(this.GetZoom() == null ? 15 : this.GetZoom()) - 15;
		return Math.pow(value || 1, n);
	}

	map2d.prototype.GetMap = function () {
		return this.olMap;
	}

	map2d.prototype.GetView = function () {
		return this.olMap.getView();
	}

	map2d.prototype.GetProjectCode = function () {
		var proj = this.olMap.getView().getProjection().getCode();
		return proj;
	}

	map2d.prototype.JW2MapCoord = function (srccoord) {
		if (srccoord == undefined) {
			return undefined;
		}
		var JW;
		var code = this.GetProjectCode();
		if (code == 'EPSG:900913') {
			JW = ZMap2D.Convert('EPSG:4326', 'EPSG:900913', srccoord);
		}
		else {
			//JW = ZMap2D.Convert('EPSG:4326', code, srccoord);
			JW = srccoord;
		}
		return JW;
	}

	map2d.prototype.MapCoord2JW = function (srccoord) {
		if (srccoord == undefined) {
			return undefined;
		}
		var JW;
		var code = this.GetProjectCode();
		if (code == 'EPSG:900913') {
			JW = ZMap2D.Convert('EPSG:900913', 'EPSG:4326', srccoord);
		}
		else {
			JW = ZMap2D.Convert(code, 'EPSG:4326', srccoord);
			//JW = srccoord;           
		}
		return JW;
	}


	map2d.prototype.Mkt2MapCoord = function (srccoord) {
		if (srccoord == undefined) {
			return undefined;
		}
		var JW;
		var code = this.GetProjectCode();
		if (code == 'EPSG:900913') {
			JW = srccoord;
		}
		else {
			JW = ZMap2D.Convert('EPSG:900913', 'EPSG:4326', srccoord);
		}
		return JW;
	}

	map2d.prototype.MapCoord2Mkt = function (srccoord) {
		if (srccoord == undefined) {
			return undefined;
		}
		var JW;
		var code = this.GetProjectCode();
		if (code == 'EPSG:900913') {
			JW = srccoord;
		}
		else {
			JW = ZMap2D.Convert('EPSG:4326', 'EPSG:900913', srccoord);
		}
		return JW;
	}


	map2d.prototype.JW2MapExtent = function (srcExtent) {
		var JWExtent = srcExtent;
		var code = this.GetProjectCode();
		//if (code == 'EPSG:900913')
		//{
		var min = ZMap2D.Convert('EPSG:4326', code, [srcExtent[0], srcExtent[1]]);
		var max = ZMap2D.Convert('EPSG:4326', code, [srcExtent[2], srcExtent[3]]);
		JWExtent = [min[0], min[1], max[0], max[1]];
		//}
		return JWExtent;
	}
	map2d.prototype.Map2JWExtent = function (srcExtent) {
		var JWExtent = srcExtent;
		var code = this.GetProjectCode();
		//if (code == 'EPSG:900913')
		//{
		var min = ZMap2D.Convert(code, 'EPSG:4326', [srcExtent[0], srcExtent[1]]);
		var max = ZMap2D.Convert(code, 'EPSG:4326', [srcExtent[2], srcExtent[3]]);
		JWExtent = [min[0], min[1], max[0], max[1]];
		//}
		return JWExtent;
	}

	map2d.prototype.CenterAndZoom = function (cen, zoom) {
		//var JW = this.JW2MapCoord(cen);
		this.SetViewCenter(cen[0], cen[1]);
		this.SetZoom(zoom);
	}

	map2d.prototype.AddTileLayer = function (tileLayer) {
		this.olMap.addLayer(tileLayer);
	}

	map2d.prototype.RemoveTileLayer = function (tileLayer) {
		this.olMap.removeLayer(tileLayer);
	}

	map2d.prototype.AddLayer = function (layer) {
		this.olMap.addLayer(layer);
	}

	map2d.prototype.AddOverlay = function (ovlay) {
		var name = ovlay.get("name");
		this.olMap.addOverlay(ovlay);
		//      var mapcoord = ovlay.values_['position'];
		//       var cd       = this.JW2MapCoord(mapcoord);

		//多级菜单实现    
        /*            
        var children = $("#" + name); 
        children.hover(
            function () {
                var mapcoord = ovlay.values_['position'];
                if (mapcoord != undefined)
                {                    
                   ovlay.setPosition(mapcoord); 
                }
            },
            function (){
                 ovlay.setPosition(undefined);
            } 
        );  */
	}

	map2d.prototype.SetOverlayPostion = function (ovlay, pos) {
		var coord = [];
		if (this.GetProjectCode() == 'EPSG:900913') {
			coord = ZMap2D.Convert('EPSG:4326', 'EPSG:900913', pos);
		}
		else {
			coord = ZMap2D.Convert('EPSG:4326', this.GetProjectCode(), pos);
			//coord  = pos;
		}
		ovlay.setPosition(coord);
		return;
	}


	map2d.prototype.RemoveOverlay = function (ovlay) {
		var lay;
		if (typeof (ovlay) == 'string') {
			var olays = this.olMap.getOverlays();
			for (var i = 0; i < olays.getLength(); i++) {
				var olay = olays.array_[i];
				var name = olay.get('name');
				if (name == ovlay) {
					lay = olay;
					break;
				}
			}
		}
		else {
			lay = ovlay;
		}

		if (lay != undefined) {
			this.olMap.removeOverlay(lay);

			//div       
			var div = document.getElementById(name);
			if (div != undefined) {
				div.parentNode.removeChild(div);
			}
		}
		return true;
	}

	//删除图层
	map2d.prototype.RemoveLayer = function (layer) {
		if (typeof layer != 'string') {
			this.olMap.removeLayer(layer);
		}
		else {
			var unkLayer = this.GetUnkLayer(layer);
			var vecSource;
			if (unkLayer != undefined) {
				this.olMap.removeLayer(unkLayer);
			}
		}
	}

	//刷新图层
	map2d.prototype.RefreshLayer = function (layer) {
		var tLay, i;
		var layers = this.olMap.getLayers();
		var bStr = typeof (layer) == 'string' ? true : false;
		for (i = 0; i < layers.getLength(); i++) {
			var tepLayer = layers.array_[i];
			if (bStr) {
				var name = tepLayer.values_['name'];
				if (name == layer) {
					tLay = tepLayer;
					break;
				}
			}
			else {
				if (tepLayer == layer) {
					tLay = tepLayer;
					break;
				}
			}
		}

		//
		if (tLay) {
			tLay.getSource().tileCache.clear();
			tLay.getSource().updateTimeMask();
			layer.changed();
		}
	}

	map2d.prototype.InsertLayer = function (pos, layer) {
		var layers = this.olMap.getLayers();
		if (pos < 0 && pos > layer.getLength()) {
			return -1;
		}
		layers.insertAt(pos, layer);
	}

	map2d.prototype.GetAtLayer = function (pos) {
		var layers = this.olMap.getLayers();
		if (pos < 0 && pos > layer.getLength()) {
			return null;
		}
		return layers.item(pos);
	}

	map2d.prototype.RemoveAtLayer = function (pos) {
		var layers = this.olMap.getLayers();
		if (pos < 0 && pos > layer.getLength()) {
			return -1;
		}
		layers.removeAt(pos);
	}


	map2d.prototype.RemoveAllLayer = function () {
		var layers = this.olMap.getLayers();
		for (; layers.array_.length > 0;) {
			var layer = layers.array_[0];
			this.olMap.removeLayer(layer);
			layers = this.olMap.getLayers();
		}
	}

	//获取图层对象
	map2d.prototype.GetUnkLayer = function (unkLayerName) {
		var layer;
		var layers = this.olMap.getLayers();
		for (var i = 0; i < layers.getLength(); i++) {
			var tepLayer = layers.array_[i];
			var name = tepLayer.values_['name'];
			if (name == unkLayerName) {
				layer = tepLayer;
				break;
			}
		}
		return layer;
	}

	map2d.prototype.GetIndexLayer = function (index) {
		var layer;
		var layers = this.olMap.getLayers();
		for (var i = 0; i < layers.getLength(); i++) {
			var tepLayer = layers.array_[i];
			if (i == index) {
				layer = tepLayer;
				break;
			}
		}
		return layer;
	}

	//获取最外层图层 --wei

	map2d.prototype.GetOutLayer = function () {
		var layer = null;
		var layers = this.olMap.getLayers();
		var i = layers.getLength();
		if (i > 0)
			layer = layers.array_[i - 1];

		return layer;
	}

	map2d.prototype.SetVisible = function (unkLayerName, visible) {
		var layer = this.GetUnkLayer(unkLayerName);
		if (layer == undefined) {
			return;
		}
		layer.setVisible(visible);
	}

	map2d.prototype.IsVisible = function (unkLayerName) {
		var layer = this.GetUnkLayer(unkLayerName);
		if (layer == undefined) {
			return;
		}
		return layer.getVisible();
	}

	//添加瓦片图层
	map2d.prototype.AddTileMapLayer = function (catalogName) {
		if (catalogName == undefined) return;
		var layer = this.GetUnkLayer(catalogName);
		if (layer != undefined) {
			return;
		}

		var proj = this.olMap.getView().getProjection().getCode();
		var maplayer = new ol.layer.Tile(
			{
				name: catalogName,
				source: new ol.source.TileZMap({
					projection: proj,
					url: GetGISServerAddress() + 'zs/catalogws/data' + catalogName + '/tile/map',
					catalog: catalogName,
					tileGrid: this.olTileGrid,
					attributions: []
				})
			});
		maplayer.set('name', catalogName);
		maplayer.setVisible(false);
		this.olMap.addLayer(maplayer);
	}

	//添加矢量图层
	map2d.prototype.AddVecLayer = function (unklayName) {
		if (catalogName == undefined) return;
		var layer = this.GetUnkLayer(unklayName);
		if (layer != undefined) {
			return;
		}

		var proj = this.olMap.getView().getProjection().getCode();
		var maplayer = new ol.layer.Tile(
			{
				name: unklayName,
				source: new ol.source.TileZMap({
					projection: proj,
					url: GetGISServerAddress() + 'zs/catalogws/data' + unklayName + '/tile/map',
					catalog: unklayName,
					tileGrid: this.olTileGrid,
					topGrid: [8, 4]
				})
			});
		maplayer.set('name', unklayName);
		maplayer.setVisible(false);
		this.olMap.addLayer(maplayer);

		//extent vec layer         
	}

	//point、multipoint、line、multiline、polygon、circle
	map2d.prototype.AddGeometrys = function (unklayName, geoms, style, bClear, exparam) {
		//查找图层名称
		var vecSource;
		var unkLayer = this.GetUnkLayer(unklayName);
		if (unkLayer == undefined) {
			//添加矢量图层
			vecSource = new ol.source.Vector();
			unkLayer = new ol.layer.Vector({
				name: unklayName,
				source: vecSource
			})
			// source: new ol.source.ImageVector( {source: vecSource } )
			// //maxResolution: 0.05,
			// });
			this.olMap.addLayer(unkLayer);
		}
		else {
			//获取
			vecSource = unkLayer.getSource();
		}

		if (bClear) {
			vecSource.clear();
		}

		var feature = new ol.Feature(
			{
				geometry: geoms,
				name: unklayName + '_feature'
			});

		var myStyle = style ? style : ZMap2D.DefaultStyle;
		feature.setStyle(myStyle);
		vecSource.addFeature(feature);
		return unklayName;
	}

	map2d.prototype.RemoveGeometrys = function (unklayName) {
		var layer = this.GetUnkLayer(unklayName);
		if (layer != undefined) {
			this.olMap.removeLayer(layer);
		}
	}

	//point、multipoint、line、multiline、polygon、circle
	map2d.prototype.AddBatchTextLayer = function (options) {
		//text style
		function createTextStyle(feature, resolution) {
			return new ol.style.Text({
				font: options.font ? options.font : "normal 12px Arial",
				text: feature.get('text'),

				fill: new ol.style.Fill({ color: options.fillColor ? options.fillColor : "#aa3300" }),
				stroke: new ol.style.Stroke({
					color: options.outlineColor ? options.outlineColor : "#ffffff",
					width: options.outlineWidth ? options.outlineWidth : 3
				}),
				offsetX: options.offsetX ? options.offsetX : 0,
				offsetY: options.offsetY ? options.offsetY : 0,
				rotation: options.rotation ? options.rotation : 0
			});
		};

		//point style
		function pointStyleFunction(feature, resolution) {
			if (options.styleFunction && typeof options.styleFunction == 'function') {
				return options.styleFunction(feature);
			}
			var imageStyle = null;
			if (options.showGeometry) {
				var poiColor = options.pointColor ? options.pointColor : 'rgba(255, 0, 0, 1)';
				if (options.icons.length > 0)
					poiColor = feature.get('icon');
				if (options.imageStyle) {
					if (typeof options.imageStyle === "string")
						imageStyle = new ol.style.Icon(({
							anchor: [0.5, 0.5],
							scale: ([options.width || (feature.get('size') || [10, 10])[0], options.height || (feature.get('size') || [10, 10])[1]])[0] / (options.width || 10) * (options.scale || 1) * globeMap[did].getScale(options.scaleBase),
							anchorXUnits: 'fraction',
							anchorYUnits: 'fraction',
							src: options.imageStyle,
							offset: options.offset || [0,0],
							imgSize: [options.width || 10, options.height || 10],//[options.width||(feature.get('size')||[30,30])[0],options.height||(feature.get('size')||[30,30])[1]],
							rotation: Math.PI / 180 * (options.rotation || feature.get('rotation') || 0)
						}));
					else
						imageStyle = options.imageStyle;
				}
				else if (options.iconpoints > 2) {
					imageStyle = new ol.style.RegularShape({
						points: options.iconpoints,//点的个数，
						radius1: options.radius1,//外半径，星型使用
						radius2: options.radius2,// 内半径，星型使用
						fill: new ol.style.Fill({ color: poiColor }),
						stroke: new ol.style.Stroke({
							color: poiColor,
							width: 1
						}),
						rotation: Math.PI / 180 * (options.rotation || feature.get('rotation') || 0)
					});
				}
				else {
					imageStyle = new ol.style.Circle({
						radius: options.radius ? options.radius : 10,
						fill: new ol.style.Fill({ color: poiColor }),
						stroke: new ol.style.Stroke({
							color: poiColor,
							width: 1
						})
					});
				}

			}
			else {
				imageStyle = new ol.style.Icon(({
					anchor: [0.5, 0.5],
					scale: ([options.width || (feature.get('size') || [10, 10])[0], options.height || (feature.get('size') || [10, 10])[1]])[0] / (options.width || 10) * (options.scale || 1) * globeMap[did].getScale(options.scaleBase),
					anchorXUnits: 'fraction',
					anchorYUnits: 'fraction',
					src: feature.get('icon'),
					offset: options.offset || [0,0],
					imgSize: [options.width || 10, options.height || 10],//[options.width||(feature.get('size')||[30,30])[0],options.height||(feature.get('size')||[30,30])[1]],
					rotation: Math.PI / 180 * (options.rotation || feature.get('rotation') || 0)
				}));
			}
			return new ol.style.Style({
				image: imageStyle,
				text: createTextStyle(feature, resolution)
			});
		}

		//查找图层名称
		var vecSource;
		var did = this.olDiv;
		var unkLayer = this.GetUnkLayer(options.name);
		if (unkLayer == undefined) {
			//添加矢量图层
			vecSource = new ol.source.Vector();
			// unkLayer  = new ol.layer.Image({
			//                     name: options.name,
			//                     source: new ol.source.ImageVector( {source: vecSource,
			//                                                         style: pointStyleFunction }),

			//                     });

			unkLayer = new ol.layer.Vector(
				{
					name: options.name,
					source: vecSource,
					style: pointStyleFunction
				});
			this.olMap.addLayer(unkLayer);
		}
		else {
			//获取
			vecSource = unkLayer.getSource();
		}

		if (options.bClear) {
			vecSource.clear();
		}
		var isArray = function (o) {
			return Object.prototype.toString.call(o) === '[object Array]';
		}
		var features = [];
		var pnts = options.points || [];
		var texts = options.texts || [];
		var icons = options.icons || [];
		var attrs = options.attrs || [];
		var rotations = options.rotations || [];
		var sizes = options.sizes || [];
		var colors = options.colors || []
		for (var i = 0; i < pnts.length; i++) {
			//var point   = new ol.geom.Point(pnts[i], 'XY');
			var point = this.Point(pnts[i]);
			var feature = new ol.Feature({
				name: options.name || 'default',
				geometry: point,
				point: pnts[i],
				text: texts[i],
				icon: icons[i],
				color: colors[i],
				attr: attrs[i],
				rotation: rotations[i],
				size: sizes[i]
			}
			);
			features.push(feature);
		}
		vecSource.addFeatures(features);
		return unkLayer;
	}

	//point、multipoint、line、multiline、polygon、circle
	map2d.prototype.AddAnimatedclusterLayer = function (options) {
		//聚合文本
		function createAnimatedTextStyle(feature, resolution) {
			var textNum = feature.values_.features.length > 1 ? feature.values_.features.length : ''
			if (options.showNum != true)
				textNum = '';
			return new ol.style.Text({
				font: options.font ? options.font : "normal 12px Arial",
				text: textNum + '',

				fill: new ol.style.Fill({ color: options.fillColor ? options.fillColor : "#aa3300" }),
				stroke: new ol.style.Stroke({
					color: options.outlineColor ? options.outlineColor : "#ffffff",
					width: options.outlineWidth ? options.outlineWidth : 3
				}),
				offsetX: options.offsetX ? options.offsetX : 0,
				offsetY: options.offsetY ? options.offsetY : 0,
				rotation: options.rotation ? options.rotation : 0
			});
		};

		var styleCache = {};
		function getStyle(feature, resolution) {
			if (options.styleFunction && typeof options.styleFunction == 'function') {
				return options.styleFunction(feature);
			}
			var style = new ol.style.Style({
				image: new ol.style.Icon(({
					anchor: [0.5, 0.5],
					src: options.url,
					imgSize: [options.width || 10, options.height || 10],
					rotation: Math.PI / 180 * (options.rotation || 0)
				})),
				text: createAnimatedTextStyle(feature, resolution)
			});
			return style;
		}
		var view = this.olMap.getView();

		var clusterSource = new ol.source.Cluster({
			distance: options.distance || 40,
			source: new ol.source.Vector()
		});

		clusterSource.setView_(view);
		clusterSource.setZoomList_(options.zoomlist);
		if (options.onlyClusterByClass) {
			clusterSource.setClusterByClass_();
		}

		var clusterLayer = new ol.layer.Vector(
			{
				name: options.name,
				source: clusterSource,
				style: getStyle
			});

		this.olMap.addLayer(clusterLayer);
		var isArray = function (o) {
			return Object.prototype.toString.call(o) === '[object Array]';
		}
		var features = [];
		var pnts = options.points;
		var texts = options.texts || [];
		var attrs = options.attrs || [];
		var type = options.types || [];
		for (var i = 0; i < pnts.length; i++) {
			//var point   = new ol.geom.Point(pnts[i], 'XY');
			var point = this.Point(pnts[i]);
			var feature = new ol.Feature({
				name: options.name || 'default',
				type: type[i] || [],
				point: pnts[i],
				geometry: point,
				text: texts[i],
				attr: attrs[i]
			});
			features.push(feature);
		}
		clusterSource.getSource().addFeatures(features);
	}


	//添加文字注记
	map2d.prototype.AddTextLabel = function (labelName, x, y, text) {
		var JW = this.JW2MapCoord([x, y]);
		var div = document.getElementById(labelName);
		if (div == undefined) {
			div = document.createElement('div');
		}
		if (div == undefined) {
			return;
		}
		div.className = 'zmap-tooltip zmap-text-static';
		//div.id        = labelName;
		div.innerHTML = text;
		var tipOlay = new ol.Overlay({
			element: div,
			offset: [0, 0]
		});
		tipOlay.set('name', labelName);
		tipOlay.setPosition(JW);
		this.olMap.addOverlay(tipOlay);
		
		// this.olMap.on('pointermove', pointerMoveHandler);
	}

	//添加图片注记
    map2d.prototype.AddImageLabel  = function (labelName, x, y, icondiv, aligned, convert)
    {
        var JW;  
        if (convert == false){
            JW = [x, y];
        } else {
            JW = this.JW2MapCoord([x, y]);
        }   
        var div = document.getElementById(labelName);    
        if (div == undefined) {
            div = document.createElement('div');
        }  
        if (div == undefined){
            return ;         
		}
		var oldlay = this.olMap.getOverlayById(labelName);
		if (oldlay)
		{
			this.olMap.removeOverlay(oldlay);
		}
        div.innerHTML = icondiv;
        div.id        = labelName;
        div.className = 'gmap-image-static';
        var tipOlay   = new ol.Overlay({
			id: labelName,
            element: div,
            stopEvent: false,       
            offset: [0, 0],
            autoPan: false,
            autoPanAnimation: {
              duration: 250
            },
            positioning: aligned ? aligned : 'bottom-center' //center-center; bottom-center; bottom-left; bottom-right; center-left; center-right; top-center;  top-left; top-right;
        });
        tipOlay.set('name', labelName);
        tipOlay.set('type', 'label-image');
        this.olMap.addOverlay(tipOlay);
        tipOlay.setPosition(JW);
        
        setTimeout(function(){
            tipOlay.render();    
        }, 50);       
        return tipOlay;
    }

	//删除注记
	map2d.prototype.RemoveLabel = function (labelName) {
		var olays = null;
		if (typeof (labelName) == "object") {
			olays = labelName;
		}
		else {
			olays = this.olMap.getOverlays();
			for (var i = 0; i < olays.getLength(); i++) {
				var olay = olays.array_[i];
				var name = olay.get('name');
				if (name == labelName) {
					olays = olay;
					break;
				}
			}
		}

		//删除
		var name = olays.get('name');
		this.olMap.removeOverlay(olays);
		var div = document.getElementById(name);
		if (div != undefined) {
			div.parentNode.removeChild(div);
		}
	}

	map2d.prototype.RemoveAllOverlay = function () {
		var ovlays = this.olMap.getOverlays();
		for (var i = 0; i < ovlays.getLength(); i++) {
			var ovlay = ovlays.array_[i];
			this.olMap.removeControl(ovlay);
		}
	}


	//信息提示窗口
	map2d.prototype.OpenInfoWindow = function (infoWindow) {
		this.olMap.addOverlay(infoWindow);
	}

	map2d.prototype.UpdatePosition = function (infoWindow, position) {
		if (infoWindow) {
			infoWindow.setPosition(position);
		}
	}

	map2d.prototype.CloseInfoWindow = function (infoWindow) {
		this.olMap.removeOverlay(infoWindow);
	}

	//获取地图视图中心[lon, lat]
	map2d.prototype.GetViewCenter = function () {
		var view = this.olMap.getView();
		if (view == undefined) {
			return null;
		}

		var cen;
		if (this.GetProjectCode() == "EPSG:900913") {
			cen = ZMap2D.Convert("EPSG:900913", "EPSG:4326", view.getCenter());
		}
		else {
			cen = ZMap2D.Convert(this.GetProjectCode(), "EPSG:4326", view.getCenter());
			//cen  = view.getCenter(); 
		}
		return cen;
	}

	//设置视图中心
	map2d.prototype.SetViewCenter = function (x, y) {
		var JW = this.JW2MapCoord([x, y]);
		var view = this.olMap.getView();
		if (view == undefined) {
			return null;
		}
		view.setCenter(JW);
	}

	//地图复位
	map2d.prototype.MapFitView = function () {
		var map = this.GetMap();
		if (map == undefined) {
			return;
		}
		var view = map.getView();
		if (view == undefined) {
			return;
		}
		var extent = view.getProjection().getExtent();
		var size = map.getSize();
		view.fit(extent, size);
	}

	//获取视图地理区域[xmin, ymin, xmax, ymax]
	map2d.prototype.GetViewRect = function () {
		var map = this.GetMap();
		if (map == undefined) {
			return;
		}
		var view = map.getView();
		if (view == undefined) {
			return;
		}
		var size = map.getSize();
		var range = view.calculateExtent(size);
		if (this.GetProjectCode() != "EPSG:4326") {
			var r1 = this.MapCoord2JW([range[0], range[1]]);
			var r2 = this.MapCoord2JW([range[2], range[3]]);
			range = r1.concat(r2);
		}
		return range;
	}


	//[xmin, ymin, xmax, ymax]
	map2d.prototype.SetViewRect = function (xmin, ymin, xmax, ymax) {
		var map = this.GetMap();
		if (map == undefined) {
			return;
		}
		var view = map.getView();
		if (view == undefined) {
			return;
		}

		//----------------------------------------------
		var extent = [xmin, ymin, xmax, ymax];
		//extent= view.calculateExtent(extent);
		var size = map.getSize();
		view.fit(extent, size);
		return;
	}

	//显示坐标转化屏幕坐标
	map2d.prototype.GetPixelFromCoordinate = function (x, y) {
		var map = this.GetMap();
		if (map == undefined) {
			return;
		}
		var JW = this.JW2MapCoord([x, y]);
		return map.getPixelFromCoordinate(JW);
	}

	//地图尺寸
	map2d.prototype.GetMapSize = function () {
		var map = this.GetMap();
		if (map == undefined) {
			return;
		}
		return map.getSize();
	}

	//设置缩放
	map2d.prototype.SetZoom = function (zoom) {
		var view = this.olMap.getView();
		if (view == undefined) {
			return null;
		}
		view.setZoom(zoom);
	}

	//设置缩放
	map2d.prototype.GetZoom = function () {
		var view = this.olMap.getView();
		if (view == undefined) {
			return null;
		}
		return view.getZoom();
	}

	//设置精度
	map2d.prototype.GetResolution = function () {
		var view = this.olMap.getView();
		if (view == undefined) {
			return null;
		}
		var r = view.getResolution();
		return r;
	}


	map2d.prototype.GetScaleText = function () {
		var S = "1km";
		var view = this.olMap.getView();
		if (view == undefined) {
			return null;
		}
		var proj = view.getProjection();
		if (proj == undefined) {
			return null;
		}
		var res = this.GetResolution();
		var cen = this.GetViewCen();
		var pointResolution = proj.getPointResolution(res, cen);

		cosLatitude = Math.cos(cen[1] * Math.PI / 180.0);
		pointResolution *= Math.PI * cosLatitude * ol.sphere.NORMAL.radius / 180;

		var permeter = 64;
		var nominalCount = permeter * pointResolution;
		var suffix = "";
		if (nominalCount < 1) {
			suffix = 'mm';
			pointResolution *= 1000;
		}
		else if (nominalCount < 1000) {
			suffix = 'm';
		}
		else {
			suffix = 'km';
			pointResolution /= 1000;
		}

		var i = 3 * Math.floor(
			Math.log(permeter * pointResolution) / Math.log(10));
		var count, width;
		var LEADING_DIGITS = [1, 2, 5];
		while (true) {
			count = LEADING_DIGITS[i % 3] * Math.pow(10, Math.floor(i / 3));
			width = Math.round(count / pointResolution);
			if (isNaN(width)) {
				return S;
			}
			else if (width >= permeter) {
				break;
			}
			++i;
		}
		S = count + ' ' + suffix;
		return S;
	}

	map2d.prototype.GetScale = function () {
		var S = 1;
		var view = this.olMap.getView();
		if (view == undefined) {
			return null;
		}
		var proj = view.getProjection();
		if (proj == undefined) {
			return null;
		}
		var res = this.GetResolution();
		var scale = this.GetResolution() * 420263251.3;
		return scale;
	}

	map2d.prototype.AddControl = function (control) {
		this.olMap.addControl(control);
	}

	map2d.prototype.RemoveControl = function (control) {
		if (control) {
			this.olMap.removeControl(control);
		}
	}

	map2d.prototype.RemoveAllControl = function () {
		var ctls = this.olMap.getControls();
		for (var i = 0; i < ctls.getLength(); i++) {
			var ctl = ctls.array_[i];
			this.olMap.removeControl(ctl);
		}
	}

	map2d.prototype.AddCustomControl = function (uqkName, title, bkCol, divLeft, divTop, divRight, divBottom, divWidth, divHeigth, divContent, func) {
		var myControl = null;
		var button = document.getElementById(uqkName);
		if (button == null) {
			button = document.createElement('button');
		}
		button.id = uqkName;
		button.innerHTML = divContent;
		button.title = title;
		button.addEventListener('click', func, false);
		button.addEventListener('touchstart', func, false);
		if (bkCol) {
			button.style.backgroundColor = bkCol;
		}
		button.style.width = 'calc(100% - 0.1em)';
		button.style.height = 'calc(100% - 0.1em)';
		var myElement = document.createElement('div');
		if (myElement) {
			myElement.className = 'zmap-custom-control';
			if (divLeft != "")
				myElement.style.left = divLeft + 'px';
			if (divTop != "")
				myElement.style.top = divTop + 'px';
			if (divRight != "")
				myElement.style.right = divRight + 'px';
			if (divBottom != "")
				myElement.style.bottom = divBottom + 'px';
			myElement.style.width = divWidth + 'px';
			myElement.style.height = divHeigth + 'px';
			myElement.appendChild(button);
			myControl = new ol.control.Control({ element: myElement });
			myControl.set('name', uqkName);
			this.olMap.addControl(myControl);
		}
		return myControl;
	}


	map2d.prototype.AddCommonControl = function (uqkName, html, divLeft, divTop, divRight, divBottom, divWidth, divHeigth, zIndex) {
		var myControl = null;
		var inHtml = html;
		// var div = document.getElementById(uqkName);
		// if (div == null)
		// {
		//     div = document.createElement('div');
		// }
		//  div.id        = uqkName;
		// div.innerHTML = html;

		// div.style.width = 'calc(100% - 0.1em)';
		// div.style.height= 'calc(100% - 0.1em)';

		var myElement = document.createElement('div');
		if (myElement) {
			myElement.className = 'zmap-custom-control';
			if (divLeft != "")
				myElement.style.left = divLeft + 'px';
			if (divTop != "")
				myElement.style.top = divTop + 'px';
			if (divRight != "")
				myElement.style.right = divRight + 'px';
			if (divBottom != "")
				myElement.style.bottom = divBottom + 'px';
			//if(boxredius!=""&&boxredius!=undefined)
			//myElement.style.border-radius = boxredius + 'px'; 
			myElement.style.width = divWidth == undefined ? 'auto' : (divWidth + 'px');
			myElement.style.height = divHeigth == undefined ? 'auto' : (divHeigth + 'px');
			myElement.style.zIndex = zIndex;
			myElement.innerHTML = html
			// myElement.appendChild(div);                    
			myControl = new ol.control.Control({ element: myElement });
			myControl.set('name', uqkName);
			this.olMap.addControl(myControl);
		}
		return myControl;
	}

	map2d.prototype.RemoveCustomControl = function (ctlName) {
		var bFind = false;
		var ctls = this.olMap.getControls();
		for (var i = 0; i < ctls.getLength(); i++) {
			var ctl = ctls.array_[i];
			var key = ctl.get('name');
			if (key == ctlName) {
				this.olMap.removeControl(ctl);
				bFind = true;
				break;
			}
		}
		return bFind;
	}

	//===============================注册事件============================================  
	//click /  dblclick / mouseup / mousedown / pointermove
	map2d.prototype.AddEventListener = function (eName, eFun) {
		//right click
		if (eName == 'rclick') {
			$(this.olMap.getViewport()).on("contextmenu", eFun);
			this.rClickArray.push(eFun);
		}
		//注意需要在ol-debug中添加监听        
		else if (eName == 'zoom') {
			this.zoomListenerArray.push(eFun);
			/*
			this.olMap.getView().on('propertychange', function(e) 
			{
				switch (e.key) 
				{
				   case 'resolution':                    
					 for (var i = 0; i < this.zoomListenerArray.length; i++)
					 {
						 this.zoomListenerArray[i]();
					 }                 
					 break;
				}
			 }, this);   */
			// this.olMap.getView().on(['change:resolution'], eFun, this)
			var currentZoomLevel;

			var checknewzoom = function (evt) {
				var newZoomLevel = this.olMap.getView().getZoom();
				if (newZoomLevel != currentZoomLevel) {
					currentZoomLevel = newZoomLevel;
					// for (var i = 0; i < this.zoomListenerArray.length; i++)
					// {
					//    this.zoomListenerArray[i]();
					// } 
					eFun();
				}
			}
			this.zoomListenerFun.push(checknewzoom);
			this.olMap.on('moveend', this.zoomListenerFun[this.zoomListenerFun.length - 1], this);
		}
		else {
			this.olMap.on(eName, eFun, this);
		}
	}

	map2d.prototype.RemoveEventListener = function (eName, eFun) {
		if (eName == 'rclick') {
			for (var i = 0; i < this.rClickArray.length; i++) {
				if (eFun === this.rClickArray[i]) {
					$(this.olMap.getViewport()).off("contextmenu", eFun);
					this.rClickArray.splice(i, 1);
					break;
				}
			}
		}
		else if (eName == 'zoom') {
			var i = this.zoomListenerArray.indexOf(eFun);
			if (i >= 0 && i < this.zoomListenerArray.length) {
				this.zoomListenerArray.splice(i, 1);
				this.olMap.un('moveend', this.zoomListenerFun[i], this);
				this.zoomListenerFun.splice(i, 1);
			}


		}
		else {
			this.olMap.un(eName, eFun, this);
		}
	}

	//=================================地图交互禁用启用=================================
	map2d.prototype.IsEnableDragging = function () {
		var insects = this.olMap.getInteractions();
		goog.asserts.assert(goog.isDef(insects), 'interactions should be defined');
		var insectsArray = insects.getArray();
		for (var i = 0; i < insectsArray.length; i++) {
			var name = insectsArray[i].get('name');
			if (name == 'InputDragStamp') {
				return false;
			}
		}
		return true;
	}

	map2d.prototype.EnableDragging = function (enable) {
		if (!enable) {
			function HandleEvent(e) {
				if (e.dragging) {
					return false;
				}
				return true;
			}
			var stamp = new ol.interaction.Interaction({ handleEvent: HandleEvent });
			stamp.set('name', 'InputDragStamp');

			this.olMap.addInteraction(stamp);
		}
		else {
			var insects = this.olMap.getInteractions();
			goog.asserts.assert(goog.isDef(insects), 'interactions should be defined');
			var insectsArray = insects.getArray();
			for (var i = 0; i < insectsArray.length; i++) {
				var name = insectsArray[i].get('name');
				if (name == 'InputDragStamp') {
					this.olMap.removeInteraction(insectsArray[i]);
					break;
				}
			}
		}
	}

	map2d.prototype.IsEnableWheel = function () {
		var insects = this.olMap.getInteractions();
		goog.asserts.assert(goog.isDef(insects), 'interactions should be defined');
		var insectsArray = insects.getArray();
		for (var i = 0; i < insectsArray.length; i++) {
			var name = insectsArray[i].get('name');
			if (name == 'InputWheelStamp') {
				return false;
			}
		}
		return true;
	}

	map2d.prototype.EnableWheel = function (enable) {
		if (!enable) {
			function HandleEvent(e) {
				if (e.browserEvent['type'] != 'mousewheel') {
					return true;
				}
				return false;
			}
			var stamp = new ol.interaction.Interaction({ handleEvent: HandleEvent });
			stamp.set('name', 'InputWheelStamp');

			this.olMap.addInteraction(stamp);
		}
		else {
			var insects = this.olMap.getInteractions();
			goog.asserts.assert(goog.isDef(insects), 'interactions should be defined');
			var insectsArray = insects.getArray();
			for (var i = 0; i < insectsArray.length; i++) {
				var name = insectsArray[i].get('name');
				if (name == 'InputWheelStamp') {
					this.olMap.removeInteraction(insectsArray[i]);
					break;
				}
			}
		}
	}

	map2d.prototype.IsEnableInput = function () {
		var insects = this.olMap.getInteractions();
		goog.asserts.assert(goog.isDef(insects), 'interactions should be defined');
		var insectsArray = insects.getArray();
		for (var i = 0; i < insectsArray.length; i++) {
			var name = insectsArray[i].get('name');
			if (name == 'InputStamp') {
				return false;
			}
		}
		return true;
	}

	map2d.prototype.EnableInput = function (enable) {
		if (!enable) {
			function HandleEvent(e) {
				return false;
			}
			var stamp = new ol.interaction.Interaction({ handleEvent: HandleEvent });
			stamp.set('name', 'InputStamp');

			this.olMap.addInteraction(stamp);
		}
		else {
			var insects = this.olMap.getInteractions();
			goog.asserts.assert(goog.isDef(insects), 'interactions should be defined');
			var insectsArray = insects.getArray();
			for (var i = 0; i < insectsArray.length; i++) {
				var name = insectsArray[i].get('name');
				if (name == 'InputStamp') {
					this.olMap.removeInteraction(insectsArray[i]);
					break;
				}
			}
		}
	}

	//===============================ZMap默认参数定义============================================
	ZMap2D.LayerDefaultParam = function () {
		var params =
		{
			minZoom: 2,
			maxZoom: 18,
			texWidth: 256,
			texHeight: 256,
			maxResolution: 360.0 / (256 * Math.pow(2, 0)),
			minResolution: 360.0 / (256 * Math.pow(2, 18)),
		}
		return params;
	}();

	ZMap2D.CalcResolution = function (extent, lvl) {
		return extent / (256 * Math.pow(2, lvl));
	}


	//==============================投影转换============================================
	map2d.prototype.Convert2Map = function (srcCoord, srcProj) {
		var desProj = this.olMap.getView().getProjection();
		if(desProj!='EPSG:4326'&&desProj!='EPSG:900913'&&desProj!='EPSG:3857')
		{
			return srcCoord
		}
		var coord = ol.proj.transform(srcCoord, srcProj, desProj);
		return coord;
	}

	map2d.prototype.Convert = function (srcProj, descProj, srcCoord) {
		if(this.GetProjectCode()!='EPSG:4326'&&this.GetProjectCode()!='EPSG:900913'&&this.GetProjectCode()!='EPSG:3857')
		{
			return srcCoord
		}
		var coord = ol.proj.transform(srcCoord, srcProj, descProj);
		return coord;
	}

	//==============================MapView屏幕坐标转换============================================
	map2d.prototype.Screen2MapCoord = function (screen) {
		var coord = this.olMap.getCoordinateFromPixel(screen);

		if(this.GetProjectCode()!='EPSG:4326'&&this.GetProjectCode()!='EPSG:900913'&&this.GetProjectCode()!='EPSG:3857')
		{
			return coord
		}

		if (this.GetProjectCode() == "EPSG:900913") {
			coord = ol.proj.transform(coord, "EPSG:900913", "EPSG:4326");
		}
		else {
			coord = ol.proj.transform(coord, this.GetProjectCode(), "EPSG:4326");
			//coord =  coord;
		}
		return coord;
	}

	map2d.prototype.MapCoord2Screen = function (mapcoord) {

		if(this.GetProjectCode()!='EPSG:4326'&&this.GetProjectCode()!='EPSG:900913'&&this.GetProjectCode()!='EPSG:3857')
		{
			return mapcoord
		}

		return this.olMap.getPixelFromCoordinate(this.JW2MapCoord(mapcoord));
	}

	//==============================设置地图光标类型(pointer、move、crosshair、wait、help、 no-drop、text、not-allowed、progress、default)============================================
	map2d.prototype.SetCursorStyle = function (style) {
		$("#zmap").css("cursor", style);
	}

	//===============================定义图层类============================================
	//瓦片图层 
	ZMap2D.TileLayer = function (opt_options) {
		var tileLayer = new ol.layer.Tile(
			{
				name: opt_options.name,
				source: new ol.source.TileZMap({
					projection: opt_options.projection ? opt_options.projection : 'EPSG:4326',
					url: opt_options.url/*GetGISServerAddress() + 'zs/data/tile/map'*/,
					catalog: opt_options.name,
					topGrid: opt_options.topGrid ? opt_options.topGrid : [1, 1],
					extent: opt_options.extent ? opt_options.extent : [-180, -90, 180, 90],
					attributions: [],
					minResolution:opt_options.minResolution,
					maxResolution:opt_options.maxResolution*2
				}),
				extent: opt_options.repeat ? opt_options.extent : undefined
			});

		// try{
		//     GetServerInfo(opt_options.url); 
		// }
		// catch(e){

		// }
		tileLayer.set('name', opt_options.name);

		//设置方法
		tileLayer.SetVisible = function (visible) {
			this.setVisible(visible);
		}
		tileLayer.IsVisible = function () {
			return this.getVisible();
		}
		return tileLayer;
	}

	ZMap2D.CustomTileLayer = function (opt_options) {
		var tileLayer = new ol.layer.Tile(
			{
				name: opt_options.name,
				source: opt_options.source,
				minResolution:opt_options.minResolution,
				maxResolution:opt_options.maxResolution*2
			});

		// try{
		//     GetServerInfo(opt_options.url); 
		// }
		// catch(e){

		// }
		tileLayer.set('name', opt_options.name);

		//设置方法
		tileLayer.SetVisible = function (visible) {
			this.setVisible(visible);
		}
		tileLayer.IsVisible = function () {
			return this.getVisible();
		}
		return tileLayer;
	}


	//自定义图层
	ZMap2D.CustomLayer = function (opt_options) {
		if (opt_options == undefined) return;

		var maplayer = new ol.layer.Image({
			extent: opt_options.extent,
			source: new ol.source.ImageWMSZMap({
				url: opt_options.url,
				callback: opt_options.callback,
				params: opt_options.params,
				serverType: 'ZMapServer'
			})
		})
		maplayer.set('name', opt_options.name);
		return maplayer;
	}

	//图片图层        
	ZMap2D.Image = function (opt_options) {
		//{name: 'test', source: new ol.source.ImageVector({ source: vectorSource }), maxResolution: 0.05}
		var layer = new ol.layer.Image(opt_options);
		layer.set('name', opt_options.name);
		return layer;
	}

	//定义静态图片图层:注意单图片图层仅支持叠加正方形区域
	ZMap2D.SingleImageLayer = function (opt_options) {
		var tileLayer = new ol.layer.Image({
			source: new ol.source.ImageStatic({
				url: opt_options.url,
				projection: opt_options.projection ? opt_options.projection : ol.proj.get('EPSG:4326'),
				imageExtent: opt_options.extent ? opt_options.extent : [-180, -90, 180, 90]
			}),
			opacity: opt_options.opacity ? opt_options.opacity : 1
		});
		tileLayer.set('name', opt_options.name);

		//设置方法
		tileLayer.SetVisible = function (visible) {
			this.setVisible(visible);
		}
		tileLayer.IsVisible = function () {
			return this.getVisible();
		}
		return tileLayer;
	}

	//热力图
	ZMap2D.HeatMapLayer = function (opt_options) {
		var vectorLayer = new ol.layer.Heatmap({
			source: opt_options.source,
			blur: parseInt(opt_options.blur, 10),
			radius: parseInt(opt_options.radius, 10)
		});
		return vectorLayer;
	}


	//聚合图
	ZMap2D.ClusterLayer = function (opt_options) {
		/*
		var vsource = new ol.source.Vector({
			 features: features
		   });   */

		console.log(parseFloat(opt_options.distance, 1));
		var clusterSource = new ol.source.Cluster({
			distance: parseFloat(opt_options.distance, 1),
			source: opt_options.source
		});

		var styleCache = {};
		var clusters = new ol.layer.Vector({
			source: clusterSource,
			style: function (feature) {
				var size = feature.get('features').length;
				var style = styleCache[size];
				if (!style) {
					style = new ol.style.Style({
						image: new ol.style.Circle({
							radius: parseFloat(opt_options.radius, 10),
							stroke: new ol.style.Stroke({
								color: '#fff'
							}),
							fill: new ol.style.Fill({
								color: '#3399CC'
							})
						}),
						text: new ol.style.Text({
							text: size.toString(),
							fill: new ol.style.Fill({
								color: '#fff'
							})
						})
					});
					styleCache[size] = style;
				}
				return style;
			}
		});
		return clusters;
	}

	//===============================定义OGC图层类============================================
	ZMap2D.WMSLayer = function (opt_options) {
		if (opt_options == undefined) return;

		var maplayer = new ol.layer.Tile({
			extent: opt_options.extent,
			source: new ol.source.TileWMS({
				url: opt_options.url,
				params: opt_options.params,
				serverType: 'ZMapServer'
			})
		})

		// try{
		//     GetServerInfo(opt_options.url); 
		// }
		// catch(e){

		// }

		maplayer.set('name', opt_options.name);
		//
		maplayer.SetVisible = function (visible) {
			this.setVisible(visible);
		}
		maplayer.IsVisible = function () {
			return this.getVisible();
		}
		return maplayer;
	}

	ZMap2D.WMTSLayer = function (opt_options) {
		if (opt_options == undefined) return;

		var projection = opt_options.projection;
		var projectionExtent = projection.getExtent();
		var topGrid = opt_options.topGrid;

		var grid = topGrid ? topGrid[0] : 1;
		if (!grid) grid = 1;
		//     var delta       = ol.extent.getWidth(projectionExtent) / 8 / 256;
		var delta = ol.extent.getWidth(projectionExtent) / grid / 256;
		var stlevl = opt_options.minZoom ? opt_options.minZoom : 0;
		var edlevel = opt_options.maxZoom ? opt_options.maxZoom : 18;
		var resolutions = new Array(edlevel);
		var matrixIds = new Array(edlevel);
		for (var z = stlevl; z <= edlevel; ++z) {
			resolutions[z] = delta / Math.pow(2, z);
			matrixIds[z] = z;
		}

		//====================================================   
		var maplayer = new ol.layer.Tile({
			opacity: 1,
			maxResolution: delta / Math.pow(2, stlevl),
			minResolution: delta / Math.pow(2, edlevel+1),
			source: new ol.source.WMTS({
				url: opt_options.url,
				layer: '0',
				matrixSet: 'default028mm',
				format: 'image/png',
				projection: projection,
				center: [0, 0],
				tileGrid: new ol.tilegrid.WMTS({
					origin: ol.extent.getTopLeft(projectionExtent),
					extent: opt_options.extent,
					resolutions: resolutions,
					matrixIds: matrixIds,
					size: [256, 256]
				}),
				style: 'default',
				wrapX: true
			})
		})
		// try{
		//     GetServerInfo(opt_options.url); 
		// }
		// catch(e){

		// }

		maplayer.set('name', opt_options.name);

		//
		maplayer.SetVisible = function (visible) {
			this.setVisible(visible);
		}
		maplayer.IsVisible = function () {
			return this.getVisible();
		}
		return maplayer;
	}

	ZMap2D.WFSLayer = function (opt_options) {
		var vectorSource = new ol.source.Vector(
			{
				loader: function (extent, resolution, projection) {
					$.ajax({ url: opt_options.url, dataType: 'jsonp', jsonp: false });
				},
				strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ(
					{
						minZoom: opt_options.minZoom,
						maxZoom: opt_options.maxZoom
					}))
			});

		var vectorLayer = new ol.layer.Vector({
			source: vectorSource,
			style: new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'rgba(0, 0, 255, 1.0)',
					width: 2
				})
			})
		});
		vectorLayer.set('name', opt_options.name);
		return vectorLayer;
	}


	//===============================定义几何样式类============================================
	ZMap2D.DefaultStyle = function () {
		var fillCol = 'rgba(255, 255, 128, 0.25)';
		var blCol = 'rgba(0, 255, 0, 0.75)';
		var lWidth = 1;
		var defStyle = new ol.style.Style({
			fill: new ol.style.Fill({
				color: fillCol
			}),
			stroke: new ol.style.Stroke({
				color: blCol,
				width: lWidth,
				lineDash: [0]
			}),
			//          image:  new ol.style.Icon({src: imgsrc/*'./ZMap2D/image/caculicon.png'*/}),
			image: new ol.style.Circle({
				radius: 5,
				fill: new ol.style.Fill({ color: fillCol }),
				stroke: new ol.style.Stroke({ color: blCol, width: lWidth })
			}),
			text: new ol.style.Text({
				font: '12px Calibri,sans-serif',
				fill: new ol.style.Fill({
					color: '#000'
				}),
				stroke: new ol.style.Stroke({
					color: '#fff',
					width: 3
				})
			})
		});
		return defStyle;
	}()


	//geoms style
	ZMap2D.Style = function (opt_options) {
		var cusStyle = new ol.style.Style({
			fill: new ol.style.Fill({
				color: opt_options && opt_options.fill ? opt_options.fill : ZMap2D.DefaultStyle.fill_.color_
			}),
			stroke: new ol.style.Stroke({
				color: opt_options && opt_options.stroke ? opt_options.stroke : ZMap2D.DefaultStyle.stroke_.color_,
				width: opt_options && opt_options.width ? opt_options.width : ZMap2D.DefaultStyle.stroke_.width_,
				lineDash: opt_options && opt_options.lineDash ? opt_options.lineDash : ZMap2D.DefaultStyle.stroke_.lineDash
			}),
			image: new ol.style.Circle({
				radius: 5,
				fill: new ol.style.Fill({ color: opt_options && opt_options.fill ? opt_options.fill : ZMap2D.DefaultStyle.fill_.color_ }),
				stroke: new ol.style.Stroke(
					{
						color: opt_options && opt_options.stroke ? opt_options.stroke : ZMap2D.DefaultStyle.stroke_.color_,
						width: ZMap2D.DefaultStyle.stroke_.width_
					})
			}),
			text: new ol.style.Text({
				font: '12px Calibri, sans-serif',
				fill: new ol.style.Fill({
					color: '#000'
				}),
				stroke: new ol.style.Stroke({
					color: '#fff',
					width: 3
				})
			})
		});
		return cusStyle;
	}

	//image style  {  icon: new ol.style.Icon({src: imgsrc/*'./ZMap2D/image/caculicon.png'*/}) }
	//支持图标类型和几何类型
	ZMap2D.IconStyle = function (opt_options) {
		var cusStyle = new ol.style.Style({
			image: opt_options.image ? opt_options.image : new ol.style.Circle({
				radius: 5,
				fill: new ol.style.Fill({ color: opt_options && opt_options.fill ? opt_options.fill : ZMap2D.DefaultStyle.fill_.color_ }),
				stroke: new ol.style.Stroke(
					{
						color: opt_options && opt_options.stroke ? opt_options.stroke : ZMap2D.DefaultStyle.stroke_.color_,
						width: ZMap2D.DefaultStyle.stroke_.width_
					})
			})
		});
		return cusStyle;
	}

	ZMap2D.GeomStyle = function (opt_options) {
		var cusStyle = new ol.style.Style(
			{
				fill: new ol.style.Fill({ color: opt_options.color ? opt_options.color : ZMap2D.DefaultStyle.fill_.color_ }),
				stroke: new ol.style.Stroke({
					color: opt_options.bordercolor ? opt_options.bordercolor : ZMap2D.DefaultStyle.stroke_.color_,
					width: opt_options.width ? opt_options.width : ZMap2D.DefaultStyle.stroke_.width_
				}),
				image: new ol.style.Circle({
					radius: opt_options.radius ? opt_options.radius : 5,
					fill: new ol.style.Fill({ color: opt_options.color ? opt_options.color : ZMap2D.DefaultStyle.fill_.color_ }),
					stroke: new ol.style.Stroke(
						{
							color: opt_options.bordercolor ? opt_options.bordercolor : ZMap2D.DefaultStyle.stroke_.color_,
							width: opt_options.width ? opt_options.width : ZMap2D.DefaultStyle.stroke_.width_
						})
				})
			});
		return cusStyle;
	}

	ZMap2D.TextStyle = function (opt_options) {
		var cusStyle = new ol.style.Style({
			text: new ol.style.Text({
				font: '12px Calibri, sans-serif',
				fill: new ol.style.Fill({
					color: '#000'
				}),
				stroke: new ol.style.Stroke({
					color: '#fff',
					width: 3
				})
			})
		});
		return cusStyle;
	}

	ZMap2D.Icon = function (opt_options) {
		//({  anchor: [0.5, 46],  anchorXUnits: 'fraction', anchorYUnits: 'pixels',  opacity: 0.75,  src: iconurl  })
		return new ol.style.Icon(opt_options);
	}

	function GetActiveMap() {
		var map = null;
		for (var key in globeMap) {
			map = globeMap[key];
			break;
		}
		return map;
	}


	//===============================定义基础几何类============================================
	ZMap2D.Point = function (x, y) {
		var JW;
		var map = GetActiveMap();
		if (map) {
			if (x instanceof Array)
				JW = map.JW2MapCoord(x);
			else
				JW = map.JW2MapCoord([x, y]);
		}
		else {
			if (x instanceof Array)
				JW = x;
			else
				JW = [x, y];
		}
		return new ol.geom.Point(JW, 'XY');
	}
	map2d.prototype.Point = function (x, y) {
		var JW;
		var map = this;
		if (map) {
			if (x instanceof Array)
				JW = map.JW2MapCoord(x);
			else
				JW = map.JW2MapCoord([x, y]);
		}
		else {
			if (x instanceof Array)
				JW = x;
			else
				JW = [x, y];
		}
		return new ol.geom.Point(JW, 'XY');
	}


	ZMap2D.MultiPoint = function (coords) {
		var JWArray;
		var map = GetActiveMap();
		if (map) {
			JWArray = [];
			for (var i = 0; i < coords.length; i++) {
				JWArray.push(map.JW2MapCoord(coords[i]));
			}
		}
		else {
			JWArray = coords;
		}
		return new ol.geom.MultiPoint(JWArray, 'XY');
	}
	map2d.prototype.MultiPoint = function (coords) {
		var JWArray;
		var map = this;
		if (map) {
			JWArray = [];
			for (var i = 0; i < coords.length; i++) {
				JWArray.push(map.JW2MapCoord(coords[i]));
			}
		}
		else {
			JWArray = coords;
		}
		return new ol.geom.MultiPoint(JWArray, 'XY');
	}

	ZMap2D.Line = function (coordArray) {
		var JWArray;
		var map = GetActiveMap();
		if (map) {
			JWArray = [];
			for (var i = 0; i < coordArray.length; i++) {
				JWArray.push(map.JW2MapCoord(coordArray[i]));
			}
		}
		else {
			JWArray = coordArray;
		}
		return new ol.geom.LineString(JWArray, 'XY');
	}
	map2d.prototype.Line = function (coordArray) {
		var JWArray;
		var map = this;
		if (map) {
			JWArray = [];
			for (var i = 0; i < coordArray.length; i++) {
				JWArray.push(map.JW2MapCoord(coordArray[i]));
			}
		}
		else {
			JWArray = coordArray;
		}
		return new ol.geom.LineString(JWArray, 'XY');
	}


	ZMap2D.MultiLine = function (lineArray) {
		var JWlinArray;
		var map = GetActiveMap();
		if (map) {
			JWlinArray = [];
			for (var i = 0; i < lineArray.length; i++) {
				var line = [];
				for (var j = 0; j < lineArray[i].length; j++) {
					line.push(map.JW2MapCoord(lineArray[i][j]));
				}
				JWlinArray.push(line);
			}
		}
		else {
			JWlinArray = lineArray;
		}

		return new ol.geom.MultiLineString(JWlinArray, 'XY');
	}
	map2d.prototype.MultiLine = function (lineArray) {
		var JWlinArray;
		var map = this;
		if (map) {
			JWlinArray = [];
			for (var i = 0; i < lineArray.length; i++) {
				var line = [];
				for (var j = 0; j < lineArray[i].length; j++) {
					line.push(map.JW2MapCoord(lineArray[i][j]));
				}
				JWlinArray.push(line);
			}
		}
		else {
			JWlinArray = lineArray;
		}

		return new ol.geom.MultiLineString(JWlinArray, 'XY');
	}

	ZMap2D.Polygon = function (poly) {
		var jwpoly;
		var map = GetActiveMap();
		if (map) {
			jwpoly = [];
			for (var i = 0; i < poly.length; i++) {
				var ring = [];
				for (var j = 0; j < poly[i].length; j++) {
					ring.push(map.JW2MapCoord(poly[i][j]));
				}
				jwpoly.push(ring);
			}
		}
		else {
			jwpoly = poly;
		}
		return new ol.geom.Polygon(jwpoly, 'XY');
	}
	map2d.prototype.Polygon = function (poly) {
		var jwpoly;
		var map = this;
		if (map) {
			jwpoly = [];
			for (var i = 0; i < poly.length; i++) {
				var ring = [];
				for (var j = 0; j < poly[i].length; j++) {
					ring.push(map.JW2MapCoord(poly[i][j]));
				}
				jwpoly.push(ring);
			}
		}
		else {
			jwpoly = poly;
		}
		return new ol.geom.Polygon(jwpoly, 'XY');
	}


	ZMap2D.MultiPolygon = function (polys) {
		var jwpolyS;
		var map = GetActiveMap();
		if (map) {
			jwpolyS = [];
			for (var i = 0; i < polys.length; i++) {
				var poly = [];
				for (var j = 0; j < polys[i].length; j++) {
					var ring = [];
					for (var k = 0; k < polys[i][j].length; k++) {
						ring.push(map.JW2MapCoord(polys[i][j][k]));
					}
					poly.push(ring);
				}
				jwpolyS.push(poly);
			}
		}
		else {
			jwpolyS = polys;
		}
		return new ol.geom.MultiPolygon(jwpolyS, 'XY');
	}
	map2d.prototype.MultiPolygon = function (polys) {
		var jwpolyS;
		var map = this;
		if (map) {
			jwpolyS = [];
			for (var i = 0; i < polys.length; i++) {
				var poly = [];
				for (var j = 0; j < polys[i].length; j++) {
					var ring = [];
					for (var k = 0; k < polys[i][j].length; k++) {
						ring.push(map.JW2MapCoord(polys[i][j][k]));
					}
					poly.push(ring);
				}
				jwpolyS.push(poly);
			}
		}
		else {
			jwpolyS = polys;
		}
		return new ol.geom.MultiPolygon(jwpolyS, 'XY');
	}

	ZMap2D.Circle = function (cen, radius) {
		var JW, c;
		var map = GetActiveMap();
		if (map) {
			JW = map.JW2MapCoord(cen);
			R = map.JW2MapCoord([radius, 0])[0];//6378137 * radius / 180 * Math.PI;
		}
		else {
			JW = cen;
			R = radius;
		}
		return new ol.geom.Circle(JW, R, 'XY');
		return new ol.geom.Circle(JW, radius, 'XY');
	}
	map2d.prototype.Circle = function (cen, radius) {
		var JW, c;
		var map = this;
		if (map) {
			JW = map.JW2MapCoord(cen);
			R = map.JW2MapCoord([radius, 0])[0];//6378137 * radius / 180 * Math.PI;
		}
		else {
			JW = cen;
			R = radius;
		}
		return new ol.geom.Circle(JW, R, 'XY');
		return new ol.geom.Circle(JW, radius, 'XY');
	}

	ZMap2D.Feature = function (option) {
		return new ol.Feature({
			name: option.name,
			geometry: option.geometry,
			population: option.population,
			rainfall: option.rainfall,
			weight: option.weight
		});
	}


	//===============================定义数据源类============================================
	ZMap2D.SourceVector = function (opt_options) {
		// {  features: [iconFeature] }
		return new ol.source.Vector(opt_options);
	}

	ZMap2D.SourceImageVector = function (opt_options) {
		// {  source : ol.source.ImageVector }
		return new ol.source.ImageVector(opt_options);
	}

	ZMap2D.SourceTile = function (opt_options) {
		return new ol.source.TileZMap(opt_options);
	}


	//===============================定义overlay窗口============================================ 
	ZMap2D.Overlay = function (param) {
		var name = param.name;
		var div = document.createElement('div');
		if (div == undefined) {
			return;
		}

		var JW;
		var map = GetActiveMap();
		if (map) {
			JW = map.JW2MapCoord(param.position);
		}
		else {
			JW = param.position;
		}

		div.className = 'zmap-overlay';
		div.id = param.name;
		if (typeof (param.divContent) == "string") {
			div.innerHTML = param ? param.divContent : "";
		}
		else {
			div.addElement(param.divElement);
		}
		var tipOlay = new ol.Overlay({
			element: div,
			positioning: param.positioning ? param.positioning : 'bottom-center'
		});
		tipOlay.set('name', name);
		tipOlay.setPosition(JW);
		return tipOlay;
	}
	map2d.prototype.Overlay = function (param) {
		var name = param.name;
		var div = document.createElement('div');
		if (div == undefined) {
			return;
		}

		var JW;
		var map = this;
		if (map) {
			JW = map.JW2MapCoord(param.position);
		}
		else {
			JW = param.position;
		}

		div.className = 'zmap-overlay';
		div.id = param.name;
		if (typeof (param.divContent) == "string") {
			div.innerHTML = param ? param.divContent : "";
		}
		else {
			div.addElement(param.divElement);
		}
		var tipOlay = new ol.Overlay({
			element: div,
			positioning: param.positioning ? param.positioning : 'bottom-center'
		});
		tipOlay.set('name', name);
		tipOlay.setPosition(JW);
		return tipOlay;
	}

	//===============================定义信息提示窗口============================================
	ZMap2D.InfoWindow = function (pos, sContent) {
		var JW;
		var map = GetActiveMap();
		if (map) {
			JW = map.JW2MapCoord(pos);
		}
		else {
			JW = pos;
		}

		ZMap2D.CloseCallBack = function (div) {
			$(div).parent().css("display", "none");
		}

		var div = document.createElement('div');
		div.className = 'zmap-infowindow';
		var closer = '<a class="zmap-infowindow-closer" onclick="ZMap2D.CloseCallBack(this)" ></a>';
		if (typeof (sContent) == 'string') {
			div.innerHTML = closer + sContent;
		}
		else {
			$(div).append(closer);
			$(div).append(div);
		}

		var tipOlay = new ol.Overlay({
			element: div,
			offset: [0, -10],
			positioning: 'bottom-center'
		});
		tipOlay.setPosition(JW);
		return tipOlay;
	}
	map2d.prototype.InfoWindow = function (pos, sContent) {
		var JW;
		var map = this;
		if (map) {
			JW = map.JW2MapCoord(pos);
		}
		else {
			JW = pos;
		}

		ZMap2D.CloseCallBack = function (div) {
			$(div).parent().css("display", "none");
		}

		var div = document.createElement('div');
		div.className = 'zmap-infowindow';
		var closer = '<a class="zmap-infowindow-closer" onclick="ZMap2D.CloseCallBack(this)" ></a>';
		if (typeof (sContent) == 'string') {
			div.innerHTML = closer + sContent;
		}
		else {
			$(div).append(closer);
			$(div).append(div);
		}

		var tipOlay = new ol.Overlay({
			element: div,
			offset: [0, -10],
			positioning: 'bottom-center'
		});
		tipOlay.setPosition(JW);
		return tipOlay;
	}

	//===============================定义投影类============================================
	ZMap2D.Convert = function (srcProj, desProj, srcCoord) {

		if((srcProj!='EPSG:4326'&&srcProj!='EPSG:900913'&&srcProj!='EPSG:3857')||(desProj!='EPSG:4326'&&desProj!='EPSG:900913'&&desProj!='EPSG:3857'))
		{
			return srcCoord
		}

		var coord = ol.proj.transform(srcCoord, srcProj, desProj);
		return coord;
	}

	//===============================定义控件导航控件类============================================
	ZMap2D.NavigationControl = function () {
		return null;
	}

	//缩放控件
	ZMap2D.RuleControl = function (opt_options) {
		return this.RuleControl ? this.RuleControl : new ol.control.ScaleLineCtl(opt_options);
	}

	//Zoom控件
	ZMap2D.ZoomControl = function (opt_options) {
		return this.ZoomControl ? this.ZoomControl : new ol.control.ZoomCtl(opt_options);
	}

	//ZoomSlider控件
	ZMap2D.ZoomSliderControl = function (opt_options) {
		return this.ZoomSliderControl ? this.ZoomSliderControl : new ol.control.ZoomSliderCtl(opt_options);
	}

	//MousePosition
	ZMap2D.MousePositionControl = function (opt_options) {
		return this.MousePositionControl ? this.MousePositionControl : new ol.control.MousePositionCtl(opt_options);
	}

	//鹰眼
	ZMap2D.OverviewMapControl = function (opt_options) {
		var map = opt_options.map;
		var view = new ol.View({
			extent: [-180, -90, 180, 90],
			projection: 'EPSG:4326'
		});
		return this.OverviewMapControl ? this.OverviewMapControl : new ol.control.OverviewMapCtl({
			collapsed: opt_options.collapsed,
			view: view
		});
	}

	//zoom
	ZMap2D.ZoomToExtent = function (cen, zoom) {
		return this.ZoomToExtent ? this.ZoomToExtent :
			new ol.control.ZoomToExtentCtl({
				label: 'R',
				handleClick: function (event) {
					event.preventDefault();
					var map = this.getMap();
					map.getView().setCenter(cen ? cen : [113.23333, 23.16667]);
					map.getView().setZoom(zoom ? zoom : 4);
				}
			});
	}

	ZMap2D.Map = map2d;


})()

// window.onload = function () {
//        var zMapServerAddressJM = window.location.protocol + "//"
//            + window.location.host;
//    zMapServerAddressJM += "/";
//             GetServerInfo(zMapServerAddressJM);

//        };


function GetServerInfo() {
	var zMapServerAddressJM = url.substring(0, url.indexOf('zs/data'));
	if (zMapServerAddressJM[zMapServerAddressJM.length - 1] != '/') {
		zMapServerAddressJM = window.location.protocol + "//"
			+ window.location.host;
		zMapServerAddressJM += "/";

	}
	var Str = randomString(32);
	var param = CodeString(Str);
	updateMsg(zMapServerAddressJM, Str, param);
	//setTimeout(function(){GetServerInfo(zMapServerAddressJM)}, 10000);    //10秒更新
}

function updateMsg(zMapServerAddressJM, Str, param) {


	$.ajax({
		url: zMapServerAddressJM + 'zs/cms/lic/check',
		type: 'GET',
		data: { 'param': param, 'version': 1.0 },
		async: true,
		success: function (data) {
			//var res = eval("("+data+")");
			//             var res = $.parsejson(data);
			var sign = data.sign;
			if (Str == sign) {
				if (data.lic.status == "OK") {
					hideLogo();
				}
				else
					showLogo(zMapServerAddressJM);
			}
			else
				showLogo(zMapServerAddressJM);
		},
		error: function (e) {
			showLogo(zMapServerAddressJM);
		}
	});
}

//随机获取字符串
function randomString(len) {
	len = len || 32;
	var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
	var maxPos = $chars.length;
	var pwd = '';
	for (i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}

//加密
var desTable = "WlNs4mMr7cPEh3FnGi0C5OAgId8JL6KkDuSaUb9Ty1Hfz2BjVoqXtZvYpwQxRe";
function CodeString(str) {
	var out = '';
	var charts = str.split("");
	var desCharts = desTable.split("");
	var outChart = new Array(charts.length);
	for (var i = 0; i < charts.length; i++) {
		var ch = charts[i];
		var az = /^[a-z]+$/;
		var AZ = /^[A-Z]+$/;
		var num = /^[0-9]+$/;
		var chCode = str.charCodeAt(i);
		var index;

		//判断字符是否在a~z
		if (az.test(ch)) {
			index = parseInt(chCode) - 97 + 26;
		}
		//判断字符是否在A~Z
		else if (AZ.test(ch)) {
			index = parseInt(chCode) - 65;
		}
		//判断在0-9之间
		else if (num.test(ch)) {
			index = parseInt(ch) + 52;
		}
		ch = desTable[index];
		outChart[i] = ch;
	}

	out = outChart.join().replace(/,/g, "");
	return out;
}

function showLogo(url) {
	var div;
	div = document.getElementById("zmapservertip");
	if (div == null || div == 'undefined') {
		div = document.createElement('div');
		div.className = 'zmapservertip';
		div.id = "zmapservertip";
		div.style.cssText = 'display:block !important;border:1px solid red; background:#ddd; opacity:0.6;text-align:center; font-size:24px;font-weight:bold;font-style:italic;color: #FF6600;width:450px; z-index:100; height:50px;;position:absolute; bottom:5px; right:10px; ';
		var info = "%E6%97%A0%E6%B3%95%E8%8E%B7%E5%8F%96%E8%AF%81%E4%B9%A6%E4%BF%A1%E6%81%AF%E6%88%96%E8%80%85%E8%AF%81%E4%B9%A6%E5%B7%B2%E8%BF%87%E6%9C%9F";
		div.innerHTML = decodeURI(info) + '<br>服务地址' + url + '';
		document.body.appendChild(div);
	}
	else {
		div.style.display = 'block !important';
	}
	setTimeout(function () { GetServerInfo() }, 10000);
	// $('body').append('<div id="zmapservertip" class="zmapservertip" style="border:1px solid red; width:200px; z-index:100; height:20px;">请购买正版武汉兆图科技有限公司许可</div>')
}

function hideLogo() {
	var div;
	div = document.getElementById("zmapservertip");
	if (div == null || div == 'undefined') { }
	else {
		div.style.display = 'none !important';
	}
}


