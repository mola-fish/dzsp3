// JScript 文件

var ZMap2DLib = ZMap2DLib || {};

(function() {
     /** 
    * @exports InputTool as ZMap2DLib.InputTool
    */
    var InputTool       =
    ZMap2DLib.InputTool = function(map)
    {
        this.PointTool = null;
        this.LineTool  = null;
        this.RectTool  = null;
        this.PolygonTool=null;
        this.CircleTool = null;
        this.AnyPolygonTool = null;
        this.bEnable    = false;
        this.olMap      = map.GetMap();
        
        var vecSource   = new ol.source.Vector();    
        this.vecLayer   = new ol.layer.Vector({
             source: vecSource,
             style: new ol.style.Style({
                fill: new ol.style.Fill({
                  color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                  color: '#ffcc33',
                  width: 2
                }),
                image: new ol.style.Circle({
                  radius: 7,
                  fill: new ol.style.Fill({
                    color: '#ffcc33'
                  })
                })
              })
         });
        this.olMap.addLayer(this.vecLayer);
    }

    InputTool.prototype.GetMap = function()
    {
        return this.olMap;   
    }

    InputTool.prototype.IsEnable = function()
    {
        return this.bEnable;   
    }

    //点工具
    InputTool.prototype.StartPointTool  = function(StartCallBack, EndCallBack) 
    {
        this.ClearAll();   
        this.olMap.addLayer(this.vecLayer);     
        var pointTool = new ol.interaction.Draw(
        {
            source: this.vecLayer.getSource(),
            type: /** @type {ol.geom.GeometryType} */('Point'),
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 0, 0, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 255, 0, 0.5)',
                    lineDash: [10, 10],
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color: 'rgba(255, 0, 0, 0.2)'
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    })
                })
            })
        });
        
        this.PointTool  = pointTool;
        if (StartCallBack) pointTool.on("drawstart", StartCallBack);  
        if (EndCallBack)   pointTool.on("drawend",   EndCallBack);   
        this.olMap.addInteraction(pointTool);
        this.bEnable = true;
    }

    //线工具
    InputTool.prototype.StartLineTool  = function(StartCallBack, EndCallBack) 
    {
        this.ClearAll();
        this.olMap.addLayer(this.vecLayer);
        var lineTool = new ol.interaction.Draw(
        {
            source: this.vecLayer.getSource(),
            type: /** @type {ol.geom.GeometryType} */('LineString'),
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 0, 0, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 255, 0.5)',
                    lineDash: [10, 10],
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color: 'rgba(255, 0, 0, 0.2)'
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    })
                })
            })
        });
        
        this.LineTool  = lineTool;
        
        //--------------------------------------    
        if (StartCallBack) lineTool.on("drawstart", StartCallBack, this);   
        if (EndCallBack)   lineTool.on("drawend", EndCallBack, this);

        this.olMap.addInteraction(lineTool);
        this.bEnable = true;
    }

    //矩形区工具
    InputTool.prototype.StartRectTool  = function(StartCallBack, EndCallBack) 
    {
        this.ClearAll();
        this.olMap.addLayer(this.vecLayer);
        var  dragBox = new ol.interaction.DragBox(
        {
            source: this.vecLayer.getSource(),
    //         condition: ol.events.condition.always,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 255, 0.5)',
                    lineDash: [10, 10],
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color: 'rgba(255, 255, 255, 0.7)'
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    })
                })
           })
        });
        this.RectTool = dragBox;
        dragBox.on("boxstart", StartCallBack, this);
        dragBox.on("boxend",   EndCallBack,   this);
        this.olMap.addInteraction(dragBox);    
        this.bEnable = true;
    }

    //圆形
    InputTool.prototype.StartCircleTool  = function(StartCallBack, EndCallBack) 
    {
        this.ClearAll();
        this.olMap.addLayer(this.vecLayer);
        var drawCircle = new ol.interaction.Draw(
        {
            source: this.vecLayer.getSource(),
            type: /** @type {ol.geom.GeometryType} */('Circle'),
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 255, 0.5)',
                    lineDash: [10, 10],
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color: 'rgba(255, 255, 255, 0.7)'
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    })
                })
            })
        });
               
        this.CircleTool = drawCircle;
        drawCircle.on("drawstart", StartCallBack, this);
        drawCircle.on("drawend",   EndCallBack,   this);
        this.olMap.addInteraction(drawCircle);   
        this.bEnable = true;
    }


    //多边形工具
    InputTool.prototype.StartPolygonTool  = function(StartCallBack, EndCallBack)
    {
        this.ClearAll();
        this.olMap.addLayer(this.vecLayer);
        var drawPolygon = new ol.interaction.Draw(
        {
            source: this.vecLayer.getSource(),
            type: /** @type {ol.geom.GeometryType} */('Polygon'),
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 255, 0.5)',
                    lineDash: [10, 10],
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color: 'rgba(255, 255, 255, 0.7)'
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    })
                })
            })
        });
               
        this.PolygonTool = drawPolygon;
        if (StartCallBack) drawPolygon.on("drawstart", StartCallBack, this);
        if (EndCallBack)   drawPolygon.on("drawend",   EndCallBack,   this);
        this.olMap.addInteraction(drawPolygon); 
        this.bEnable = true;  
    }
            
    InputTool.prototype.StartAnyPolygonTool  = function(StartCallBack, EndCallBack)
    {
        this.ClearAll();
        this.olMap.addLayer(this.vecLayer);        
        var  drawAnyPolygon = new ol.interaction.DrawMouseTrack({
          map: this.olMap,
          source: this.vecLayer.getSource(),
          onPolyBegin:StartCallBack,
          onPolyEnd:EndCallBack
        });   
        this.AnyPolygonTool = drawAnyPolygon;
        this.olMap.addInteraction(drawAnyPolygon); 
        this.bEnable = true;
    }
        
    //结束工具
    InputTool.prototype.ClearAll  = function()
    {
        this.olMap.removeInteraction(this.PointTool);
        this.olMap.removeInteraction(this.LineTool);
        this.olMap.removeInteraction(this.PolygonTool); 
        this.olMap.removeInteraction(this.RectTool);
        this.olMap.removeInteraction(this.CircleTool);
        this.olMap.removeInteraction(this.AnyPolygonTool);
       
        this.PointTool  = null;
        this.LineTool   = null;
        this.RectTool   = null;
        this.PolygonTool= null;
        this.CircleTool = null;
        
        
        if (this.AnyPolygonTool)
        {
            this.AnyPolygonTool.clearAll();
        }
        this.AnyPolygonTool = null;
        
        this.vecLayer.getSource().clear();       
        this.olMap.removeLayer(this.vecLayer);    
        this.bEnable = false;
    }

    InputTool.prototype.RemoveInteraction  = function()
    {
        this.olMap.removeInteraction(this.PointTool);
        this.olMap.removeInteraction(this.LineTool);
        this.olMap.removeInteraction(this.PolygonTool); 
        this.olMap.removeInteraction(this.RectTool);
        this.olMap.removeInteraction(this.CircleTool);
        this.bEnable = false; 
    }

    InputTool.prototype.ClearGeometry  = function()
    {
        this.vecLayer.getSource().clear();
    }

    InputTool.prototype.Debug = function () 
    {
        var source = new ol.source.Vector();
        var vector = new ol.layer.Vector({
          source: source,
          style: new ol.style.Style({
            fill: new ol.style.Fill({
              color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
              color: '#ffcc33',
              width: 2
            }),
            image: new ol.style.Circle({
              radius: 7,
              fill: new ol.style.Fill({
                color: '#ffcc33'
              })
            })
          })
        });
        this.olMap.addLayer(vector);

        var draw = new ol.interaction.Draw({
        source: source,
        type: /** @type {ol.geom.GeometryType} */ ('LineString'),
        style: new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          }),
          stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 0, 0.5)',
            lineDash: [10, 10],
            width: 2
          }),
          image: new ol.style.Circle({
            radius: 5,
            stroke: new ol.style.Stroke({
              color: 'rgba(0, 0, 0, 0.7)'
            }),
            fill: new ol.style.Fill({
              color: 'rgba(255, 255, 255, 0.2)'
            })
          })
        })
      });
      this.olMap.addInteraction(draw);
    }
    ZMap2DLib.InputTool = InputTool;
    
    
    /** 
    * @exports Math as ZMap2DLib.Math
    */
    ZMap2DLib.Math = function()
    {
    }
    
    var EARTH_RADIUS = 6378137.0;    //单位M
    ZMap2DLib.Math.Degree2Rad = function(d)
    {
        var PI = Math.PI;
        return d * PI / 180.0;
    }
   
    ZMap2DLib.Math.CalcFlatDistance = function (lng1, lat1, lng2, lat2)
    {
        var f = ZMap2DLib.Math.Degree2Rad((lat1 + lat2) / 2);
        var g = ZMap2DLib.Math.Degree2Rad((lat1 - lat2) / 2);
        var l = ZMap2DLib.Math.Degree2Rad((lng1 - lng2) / 2);
        var sg = Math.sin(g);
        var sl = Math.sin(l);
        var sf = Math.sin(f);
        var s, c, w, r, d, h1, h2;
        var a = EARTH_RADIUS;
        var fl = 1 / 298.257;
        sg = sg * sg;
        sl = sl * sl;
        sf = sf * sf;
        s = sg * (1 - sl) + (1 - sf) * sl;
        c = (1 - sg) * (1 - sl) + sf * sl;
        w = Math.atan(Math.sqrt(s / c));
        r = Math.sqrt(s * c) / w;
        d = 2 * w * a;
        h1 = (3 * r - 1) / 2 / c;
        h2 = (3 * r + 1) / 2 / s;
        return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
    }
    
    //球面三角形面积
    ZMap2DLib.Math.CalcTriAngleArea = function (lon1, lat1, lon2, lat2, lon3, lat3)
    {
        var a = ZMap2DLib.Math.CalcFlatDistance(lon1, lat1, lon2, lat2);
        var b = ZMap2DLib.Math.CalcFlatDistance(lon2, lat2, lon3, lat3);
        var c = ZMap2DLib.Math.CalcFlatDistance(lon1, lat1, lon3, lat3);

        var p = (a + b + c) / 2;
        var S = Math.sqrt(p * (p - a) * (p - b) * (p - c));

        return S;
    }

    //计算多边形面积
    ZMap2DLib.Math.CalcAnyPolyArea = function (polys)
    {
        var area = 0;
        for (var i = 1; i <= polys.length / 2 - 3; i++)
        {
            area += ZMap2DLib.Math.CalcTriAngleArea(polys[2 * i - 2], polys[2 * i - 1],
                                    polys[2 * i], polys[2 * i + 1],
                                    polys[2 * i + 2], polys[2 * i + 3]);
        }
        return area;
    }
   
    
    /** 
    * @==========================================距离量算工具=======================================================
    */
    var toolMap            = {};
    function ClearTool()
    {
        for (var tool in toolMap)
        {
            toolMap[tool].End();
        }   
    }    
    
    var distanceTool       = 
    ZMap2DLib.DistanceTool = function(divMap)
    {
        this.divMap    = divMap;
        this.inputTool = new ZMap2DLib.InputTool(map);

        toolMap["dist"]= this;
    }
    
    distanceTool.prototype.GetMap = function()
    {
        return this.divMap;
    }
    
    distanceTool.prototype.ClearGeometry = function()
    {
        this.inputTool.ClearGeometry();
    }
        
    //添加提示
    var onlyTip = null;
    distanceTool.prototype.AddFlashTip = function(text, miniSeconds)
    {
        this.CloseFlashTip();
        if (onlyTip == null)
        {
            if (miniSeconds == null) miniSeconds = 3000;
            var cen = this.GetMap().GetViewCenter();
            if (cen == null)
            {
                this.CloseFlashTip();
                return ;
            }        
            toolMap["dist"].GetMap().AddTextLabel('only-tip', cen[0], cen[1], text);
            onlyTip = window.setInterval(this.CloseFlashTip, miniSeconds);
        }
    }

    distanceTool.prototype.CloseFlashTip  = function()
    {
        if (onlyTip != null)
        {   
            toolMap["dist"].GetMap().RemoveLabel('only-tip');
            window.clearInterval(onlyTip);
            onlyTip = null;        
        }
    }
    
            
    //距离量算
    function LineStartCallBack(e) 
    {
        toolMap["dist"].ClearGeometry();
        toolMap["dist"].GetMap().RemoveLabel('distance-tip-start');
        toolMap["dist"].GetMap().RemoveLabel('distance-tip');
        
        if (e)
        {
            var st_ed = e.currentTarget.finishCoordinate_;
            toolMap["dist"].GetMap().AddTextLabel('distance-tip-start', st_ed[0], st_ed[1], "起点");            
        }
    }
    
     function LineEndCallBack(e)
     {
        
        var st_ed = e.feature.values_.geometry.extent_;
        var polys = e.feature.values_.geometry.flatCoordinates;
        var len   = polys.length;
        var length = 0.0;
        for (var i = 1; i < polys.length / 2; i++)
        {
          length += ZMap2DLib.Math.CalcFlatDistance(polys[2 * i - 2], polys[2 * i - 1], polys[2 * i], polys[2 * i + 1])
        }
        length /= 1000.0;
        toolMap["dist"].GetMap().AddTextLabel('distance-tip', polys[len - 2], polys[len - 1], "总长:" + length.toFixed(2) + "公里");   
    }
    
    distanceTool.prototype.Start = function()
    {
        LineStartCallBack();
        this.AddFlashTip("距离提示：左击开始，双击左键结束!", 2000);
        this.inputTool.StartLineTool(LineStartCallBack, LineEndCallBack);
    }
    
     distanceTool.prototype.End = function()
     {
        this.inputTool.ClearAll();
        this.GetMap().RemoveLabel('distance-tip-start');
        this.GetMap().RemoveLabel('distance-tip');
     }
     ZMap2DLib.DistanceTool = distanceTool;
     
     
    /** 
    * @==========================================面积量算工具=======================================================
    */
    var areaTool       = 
    ZMap2DLib.AreaTool = function(divMap)
    {
        this.divMap    = divMap;
        this.inputTool = new ZMap2DLib.InputTool(divMap);     
        toolMap["area"]= this;
    }
    
    
    areaTool.prototype.GetMap = function()
    {
        return this.divMap;
    }
    
    areaTool.prototype.ClearGeometry = function()
    {
        this.inputTool.ClearGeometry();
    }
        
    //添加提示
    var onlyTip = null;
    areaTool.prototype.AddFlashTip = function(text, miniSeconds)
    {
        this.CloseFlashTip();
        if (onlyTip == null)
        {
            if (miniSeconds == null) miniSeconds = 3000;
            var cen = this.GetMap().GetViewCenter();
            if (cen == null)
            {
                this.CloseFlashTip();
                return ;
            }        
            toolMap["area"].GetMap().AddTextLabel('only-tip', cen[0], cen[1], text);
            onlyTip = window.setInterval(this.CloseFlashTip, miniSeconds);
        }
    }

    areaTool.prototype.CloseFlashTip  = function()
    {
        if (onlyTip != null)
        {   
            toolMap["area"].GetMap().RemoveLabel('only-tip');
            window.clearInterval(onlyTip);
            onlyTip = null;        
        }
    }
    
    function PolyStartCallBack(e) 
    {
        toolMap["area"].ClearGeometry();
        toolMap["area"].GetMap().RemoveLabel('area-tip-start');
        toolMap["area"].GetMap().RemoveLabel('area-tip');
    }

    function PolyEndCallBack(e) 
    {
        var polys = e.feature.values_.geometry.flatCoordinates;
        var tooltipCoord = e.feature.values_.geometry.getInteriorPoint().getCoordinates();

        var len = polys.length - 2;
        var area = 0.0;
        for (var i = 1; i <= polys.length / 2 - 3; i++)
        {
            area += ZMap2DLib.Math.CalcTriAngleArea(polys[2 * i - 2], polys[2 * i - 1],
                                     polys[2 * i], polys[2 * i + 1],
                                     polys[2 * i + 2], polys[2 * i + 3]);
        }
        var tip = "";
        if (area > 1000000)
        {
            area /= 1000000;
            tip = "总面积:" + area.toFixed(2) + "平方公里";
        }
        else
        {
            tip = "总面积:" + area.toFixed(2) + "平方米";
        }    
        toolMap["area"].GetMap().AddTextLabel('area-tip', tooltipCoord[0], tooltipCoord[1], tip);    
    }
    
    areaTool.prototype.Start = function()
    {
        PolyStartCallBack();
        this.AddFlashTip("距离提示：左击开始，双击左键结束!", 2000);
        this.inputTool.StartPolygonTool(PolyStartCallBack, PolyEndCallBack);
    }
    
    areaTool.prototype.End = function()
    {
       this.inputTool.ClearAll();
       this.GetMap().RemoveLabel('area-tip-start');
       this.GetMap().RemoveLabel('area-tip');
    }
    ZMap2DLib.AreaTool = areaTool;   
    
})();



//===========================================================================================
//                                  
//                                路径点漫游工具
//
//===========================================================================================//
function JSPathFlyTool(map, mapOverlay) 
{
	this.config = 
	{
		Length : 0,
		PlayTime : 100,
		CurPlayTime: 0,
		PlayDelay : 50,
		Step : 0,
		Segments : 0,
		Points : [],
		Distances : [],
		CurPos : 0,
		CurJW  : [0, 0],
		CurDir : 0,
		CurSegment : 0,
		IntervalID : 0,
		Pause:false,
		Loop:false,
		IsFinish:false,
		DesObj:{},
		Speed:10,
		IsWndShow: false        		
	};

    //对象名称
    this._map        = map;
	this._overlay    = mapOverlay;
	this._infoWindow = null;
	this._frameCallBack = null;
	this._endCallBack   = null;
};

/**
  * 初始化行走
 * @param pointArr 
 *      行走的路径，格式[ [x1,y1],[x2,y2]...[xn,yn]]
 * @return 
 */ 
var lastData = null;
JSPathFlyTool.prototype.InitPlay = function(pointArr, Loop, playspeed, infoWindow, frameCallBack, expParam)
{
    //this.config.DesObj = obj;
    if (typeof(Loop) != 'undefined') {
      this.config.Loop = Loop;
    }
    if (typeof(playspeed) != 'undefined') {
      this.config.Speed = playspeed;
    }
    
    for (var i = 0; i < pointArr.length; ++i)
    {
        var pnode = pointArr[i];
        this.config.Points.push({x: pnode[0], y: pnode[1]});
    }
    this.config.Segments = this.config.Points.length - 1;
    
    for (var i = 0; i < this.config.Segments; ++i)
    {
        this.config.Distances[i] = this.CalcDistance(this.config.Points[i], this.config.Points[i + 1]);
        this.config.Length += this.config.Distances[i];
    }
    
    this.config.CurPlayTime = 0;
    this.config.PlayTime    = this.config.Length /  this.config.Speed; 
    this.config.Step        = this.config.Speed /   this.config.PlayDelay;   
    this._infoWindow        = infoWindow;
    this._frameCallBack     = frameCallBack;
    this._endCallBack       = (expParam && expParam.endCallBack) ? expParam.endCallBack : null;
}

//
JSPathFlyTool.prototype.InitPlayEx = function(options)
{
    
}


JSPathFlyTool.prototype.CalcDistance = function(p1, p2) 
{
    var x = (p1.x - p2.x);
    var y = (p1.y - p2.y);
    return Math.sqrt(x * x + y * y) / Math.PI * 6378137;
}


/**
  * 开始行走
 * @param
 *      
 * @return 
 */
JSPathFlyTool.prototype.Play = function()
{
    this.config.Pause = false;
    this.config.CurPos = 0;
    this.config.CurSegment = 0;
    var jsdiv = this;
    function inv()
    {
        jsdiv.MoveNext();
    }
    lastData = new Date();    
    this.IntervalID = window.setInterval(inv, this.config.PlayDelay);
}


JSPathFlyTool.prototype.ShowInfoWindow = function(visible)
{
    if (!this._infoWindow)
    {
        return ;
    }
    this.config.IsWndShow = visible;
    if (this.config.IsWndShow)
    {
        this._infoWindow.setPosition(this.config.CurJW);        
        var div = this._infoWindow.element_;
        $(div).children().css("display", "block");    
    }
    else
    {
        this._infoWindow.setPosition(undefined);          
    }
}

/**
  * 暂停行走
 * @param
 *      
 * @return 
 */
JSPathFlyTool.prototype.Pause = function()
{
    this.config.Pause = true;
}

/**
  * 继续行走
 * @param
 *      
 * @return 
 */     
JSPathFlyTool.prototype.Resume = function()
{
    this.config.Pause = false;
}
 
 /**
  * 停止行走
 * @param
 *      
 * @return 
 */    
JSPathFlyTool.prototype.Stop = function ()
{
    window.clearInterval(this.IntervalID);
    
    if (this.config.Points.length > 0)
    {
        var beginPos = this.config.Points[0];
        beginPos = this._map.JW2MapCoord(beginPos);
        this._updatePosition(beginPos, 0);        
    }
    this.ShowInfoWindow(false);
}

JSPathFlyTool.prototype.Destroy = function()
{
   window.clearInterval(this.IntervalID);   
   var ovlay = this._infoWindow;
   if (ovlay && ovlay.getMap())
   {
       ovlay.getMap().removeOverlay(ovlay);  
   }   
   this._infoWindow = null;
   
   var flyObj = this._overlay;
   if (flyObj && flyObj.getMap())
   {
       flyObj.getMap().removeOverlay(flyObj);  
   }
}
            
JSPathFlyTool.prototype.IsFinish = function()
{
   return this.config.IsFinish;
}

JSPathFlyTool.prototype.MoveNext = function()
{
   if (this.config.Pause || this.config.IsFinish) return;
   
   var now = new Date();
   var seconds = 3600 * (now.getHours()   - lastData.getHours()) +
                   60 * (now.getMinutes() - lastData.getMinutes()) +
                     1* (now.getSeconds() - lastData.getSeconds());  
   this.config.CurPlayTime  += seconds;
   lastData = now;
   
   //this.config.CurSegment = parseInt(this.config.CurPlayTime / this.config.PlayTime * this.config.Segments);
   if (this.config.CurPos >= this.config.Length)
   {
       var cbP = {
           'position' : this.config.CurJW,
           'direction': this.config.CurDir,
           'time': this.config.CurSegment                      
       };
        if (this.config.Loop == true) 
        {
            this.config.CurPos      = 0;
            this.config.CurSegment  = 0;
            this.config.CurPlayTime = 0;
            if (this._endCallBack) this._endCallBack(cbP);
        }
        else
        {
            if (this._endCallBack) this._endCallBack(cbP);
            this.config.IsFinish = true;
            this.Stop();
            return;        
        }
   }
       
   var nextPos = this.config.CurPos + this.config.Step;  
   
   //查找段
   this.config.CurSegment = this.config.Distances.length-1;    
   var dis = 0;
   for (var i = 0; i < this.config.Distances.length; i++)
   {
      dis += this.config.Distances[i];
      if (nextPos - dis < 0)
      {      
          this.config.CurSegment = i;
          break ;
      }  
   } 
    
   this.config.CurPos = nextPos;   
   var curPos = this.config.CurPos;
   for (var i = 0; i < this.config.CurSegment; i++)
   {
       curPos -= this.config.Distances[i];
   }
   var amount = curPos / this.config.Distances[this.config.CurSegment];
   var p1 = this.config.Points[this.config.CurSegment];
   var p2 = this.config.Points[this.config.CurSegment + 1];
   var pos = this.Interpolate(amount, p1 , p2);
   var dir = this.InterpolateDir(amount, p1 , p2);     
   this.config.CurJW = [pos.x, pos.y];   
   this.config.CurDir= dir;
   this._updatePosition(pos, dir);
   
   //callback
   if (this._frameCallBack)
   {
       var cbP = {
           "position": [pos.x, pos.y],
           "direction": dir
       };           
       this._frameCallBack(cbP);
   }
}

JSPathFlyTool.prototype._updatePosition = function(pos, dir)
{
   var mapCoord = [pos.x, pos.y];
   mapCoord = this._map.JW2MapCoord(mapCoord);
   if (this._overlay)
   {   
      this._overlay.setPosition(mapCoord);  
      var name = this._overlay.get("name")
      dir = -dir;
      var rotate = "rotate("+ dir +"deg)";
      $("#" + name + " img").css("transform", rotate);
   } 
   
   //更新信息窗口位置
   if (this._infoWindow && this.config.IsWndShow)
   {
       this._infoWindow.setPosition(mapCoord);
   }
}

JSPathFlyTool.prototype.getPosition = function()
{
    return this.config.CurJW;
}

JSPathFlyTool.prototype.getDir = function () 
{
    return this.config.CurDir;
}

JSPathFlyTool.prototype.Interpolate = function(amount, p1, p2)
{
    var p = {x:0, y:0};
    if (amount > 1) 
    {  
        p.x = p2.x;
        p.y = p2.y;
    }
    else if (amount < 0)
    {
        p.x = p1.x;
        p.y = p1.y;
    }
    else
    {
	    p.x = parseFloat(p1.x) + parseFloat(((p2.x - p1.x) * amount));
	    p.y = parseFloat(p1.y) + parseFloat(((p2.y - p1.y) * amount));
    }
    
    return p;
}

JSPathFlyTool.prototype.InterpolateDir = function(amount, p1, p2)
{
    var d = 0;
    //屏蔽x\y方向    
    var x = p2.x - p1.x;
    var y = p2.y - p1.y;
    var d = Math.atan(y / x) / Math.PI * 180;
    if (x >= 0)
    {
        d = d;
    }
    else
    {
       // d = 180 + Math.abs(d);
        d = 180 + d;
    }
    return d;
}




/*********************************************************************************
                                任意区绘制
**********************************************************************************/
goog.provide('ol.interaction.DrawMouseTrack');
goog.require('goog.asserts');
goog.require('ol.Kinetic');
goog.require('ol.coordinate');
goog.require('ol.events.condition');
goog.require('ol.interaction.Pointer');

/**
 * @classdesc
 * Allows the user to pan the map by dragging the map.
 *
 * @constructor
 * @extends {ol.interaction.Pointer}
 * @param {olx.interaction.DragPanOptions=} opt_options Options.
 * @api stable
 */
ol.interaction.DrawMouseTrack = function(opt_options) {

  ol.interaction.Pointer.call(this, {
    handleDownEvent: ol.interaction.DrawMouseTrack.handleDownEvent_,
    handleDragEvent: ol.interaction.DrawMouseTrack.handleDragEvent_,
    handleUpEvent: ol.interaction.DrawMouseTrack.handleUpEvent_
  });

  var options = opt_options ? opt_options : {};


  this.onPolyBegin = opt_options.onPolyBegin;
  this.onPolyEnd   = opt_options.onPolyEnd;
  this.map           = opt_options.map;
  this.featureLayer_ = opt_options.featureLayer;

  /**
   * @private
   * @type {ol.style.Style}
   */
  var style = goog.isDef(options.style) ? options.style : new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 255, 0.5)',
                    lineDash: [10, 10],
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color: 'rgba(255, 255, 255, 0.7)'
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    })
                })
           });


  /**
   * @type {ol.render.Box}
   * @private
   */
  this.box_ = new ol.render.Box(options.className || 'ol-dragbox');

  /**
   * @type {ol.Pixel}
   * @private
   */
  this.startPixel_ = null;

  /**
   * @private
   * @type {ol.EventsConditionType}
   */
  this.condition_ = options.condition ?
      options.condition : ol.events.condition.always;

  /**
   * @private
   * @type {ol.DragBoxEndConditionType}
   */
  this.boxEndCondition_ = options.boxEndCondition ?
      options.boxEndCondition : ol.interaction.DrawMouseTrack.defaultBoxEndCondition;
      
  /**
   * @private
   * @type {ol.events.ConditionType}
   */
      this.condition_ = goog.isDef(options.condition) ?
      options.condition : ol.events.condition.always;
     
   //从鼠标按下开始记录
   this.MapCoords_     = []; 
   this.source         = options.source;    
   this.sketchFeature_ = new ol.Feature();
   if (goog.isDef(this.geometryName_)) {
     this.sketchFeature_.setGeometryName(this.geometryName_);
   }
   this.source.addFeature(this.sketchFeature_);
  
};
ol.inherits(ol.interaction.DrawMouseTrack, ol.interaction.Pointer);


/**
 * The default condition for determining whether the boxend event
 * should fire.
 * @param  {ol.MapBrowserEvent} mapBrowserEvent The originating MapBrowserEvent
 *  leading to the box end.
 * @param  {ol.Pixel} startPixel      The starting pixel of the box.
 * @param  {ol.Pixel} endPixel        The end pixel of the box.
 * @return {boolean} Whether or not the boxend condition should be fired.
 */
ol.interaction.DrawMouseTrack.defaultBoxEndCondition = function(mapBrowserEvent,
    startPixel, endPixel) {
  var width = endPixel[0] - startPixel[0];
  var height = endPixel[1] - startPixel[1];
  return width * width + height * height >=
      ol.DRAG_BOX_HYSTERESIS_PIXELS_SQUARED;
};


/**
 * @param {ol.MapBrowserPointerEvent} mapBrowserEvent Event.
 * @this {ol.interaction.DrawMouseTrack}
 * @private
 */
ol.interaction.DrawMouseTrack.handleDragEvent_ = function(mapBrowserEvent) {
  if (!ol.events.condition.mouseOnly(mapBrowserEvent)) {
    return;
  }

   this.MapCoords_.push(mapBrowserEvent.coordinate);
   if (this.MapCoords_.length > 3)
      {
          var poly  = [];
          for (var i = 0; i < this.MapCoords_.length; i++)
          {
             poly.push(this.MapCoords_[i]);
          }
          
          var geomPoly = new ol.geom.Polygon([poly], 'XY');       
          this.sketchFeature_.setGeometry(geomPoly);        
          this.updateSketchFeatures_();  
      }

    this.dispatchEvent(new ol.DragBoxEvent(ol.DragBoxEventType.BOXDRAG,
                    mapBrowserEvent.coordinate, mapBrowserEvent));
};

ol.interaction.DrawMouseTrack.prototype.updateSketchFeatures_ = function() {
  var sketchFeatures = [];
  if (!goog.isNull(this.sketchFeature_)) {
    sketchFeatures.push(this.sketchFeature_);
  }
  this.source.clear(true);
  this.source.addFeatures(sketchFeatures);
};

/**
 * Returns geometry of last drawn box.
 * @return {ol.geom.Polygon} Geometry.
 * @api stable
 */
ol.interaction.DrawMouseTrack.prototype.getGeometry = function() {
  return this.box_.getGeometry();
};

ol.interaction.DrawMouseTrack.prototype.getPoints = function(){
  return this.MapCoords_;
}

ol.interaction.DrawMouseTrack.prototype.clearAll   = function(){
   this.source.clear(true);
}


/**
 * To be overriden by child classes.
 * FIXME: use constructor option instead of relying on overridding.
 * @param {ol.MapBrowserEvent} mapBrowserEvent Map browser event.
 * @protected
 */
ol.interaction.DrawMouseTrack.prototype.onBoxEnd = ol.nullFunction;

/**
 * To be overriden by child classes.
 * FIXME: use constructor option instead of relying on overridding.
 * @param {ol.MapBrowserEvent} mapBrowserEvent Map browser event.
 * @protected
 */
ol.interaction.DrawMouseTrack.prototype.onPolyEnd   = goog.nullFunction;
ol.interaction.DrawMouseTrack.prototype.onPolyBegin = goog.nullFunction;


/**
 * @param {ol.MapBrowserPointerEvent} mapBrowserEvent Event.
 * @return {boolean} Stop drag sequence?
 * @this {ol.interaction.DrawMouseTrack}
 * @private
 */
ol.interaction.DrawMouseTrack.handleUpEvent_ = function(mapBrowserEvent) {
  if (!ol.events.condition.mouseOnly(mapBrowserEvent)) {
    return true;
  }

  this.box_.setMap(null);
  
  mapBrowserEvent.feature = this.sketchFeature_;
  if (this.onPolyEnd) 
  {
     this.onPolyEnd(mapBrowserEvent);
  }

  if (this.boxEndCondition_(mapBrowserEvent,
      this.startPixel_, mapBrowserEvent.pixel)) {
    this.onBoxEnd(mapBrowserEvent);
    this.dispatchEvent(new ol.DragBoxEvent(ol.DragBoxEventType.BOXEND,
        mapBrowserEvent.coordinate, mapBrowserEvent));
  }
  return false;
};


/**
 * @param {ol.MapBrowserPointerEvent} mapBrowserEvent Event.
 * @return {boolean} Start drag sequence?
 * @this {ol.interaction.DrawMouseTrack}
 * @private
 */
ol.interaction.DrawMouseTrack.handleDownEvent_ = function(mapBrowserEvent) {
  if (!ol.events.condition.mouseOnly(mapBrowserEvent)) {
    return false;
  }

  if (ol.events.condition.mouseActionButton(mapBrowserEvent) &&
      this.condition_(mapBrowserEvent)) {
    this.startPixel_ = mapBrowserEvent.pixel;
    this.box_.setMap(mapBrowserEvent.map);
    this.box_.setPixels(this.startPixel_, this.startPixel_);
    this.dispatchEvent(new ol.DragBoxEvent(ol.DragBoxEventType.BOXSTART,
        mapBrowserEvent.coordinate, mapBrowserEvent));
        
    this.source.clear(true);
    mapBrowserEvent.feature = this.sketchFeature_;
    if (this.onPolyBegin) 
    {
      this.onPolyBegin(mapBrowserEvent);
    }
    return true;
  } else {
    return false;
  }
};


