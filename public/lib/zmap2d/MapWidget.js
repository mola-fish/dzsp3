window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 30);
          };
})();


var ZMap = ZMap || {};
ZMap.MapWidget = ZMap.MapWidget || {};
//var ZmapFun=ZmapFun||{};
(function() {
    //地图方法
    ZMap.MapWidget.init = function init(mapcode,viewoption,tileoption) {
        var self = this;

		var viewopt = viewoption||{},
        tileopt = tileoption||{};
		//viewopt.center = ZMap2D.Convert("EPSG:4326", "EPSG:900913", [110, 25]);
		viewopt.zoom = viewopt.zoom||4;
		viewopt.minZoom = viewopt.minZoom||2;
		viewopt.maxZoom = viewopt.maxZoom||18;
        viewopt.projection = viewopt.projection||"EPSG:4326";
        tileopt.projection = tileopt.projection||"EPSG:4326";
		tileopt.topGrid = tileopt.topGrid||[1, 1];
		tileopt.tileSize = tileopt.tileSize||256;
        tileopt.extent = tileopt.extent||ol.proj.get(tileopt.projection).getExtent();
        viewopt.extent = viewopt.extent||ol.proj.get(viewopt.projection).getExtent();
		this.projection=viewopt.projection||"EPSG:4326";
        this.zmap2dview = new ZMap2D.Map(mapcode,tileopt,viewopt); // 地图对象
        this.zmap2dtool = new ZMap2DLib.InputTool(this.zmap2dview); // 地图工具对象
        this.LA = {}; // 存储等值线等值面参数
        this.LA['draw'] = getLA(); // 等值线等值面中绘制方法的参数
        this.fw = [105, 35]; // 复位原始的坐标点
        this.paramdata = {} // 存储上图图层数据，
        this.onlyTip = null; //测量提示参数
        this.LayerName = {}; //存储图层数据的图层或图层名
        this.GISserverAddress = null; // 地图服务地址，为null时默认获取本地地址
        this.Maplayer = {}; // 存储地图图层数据
        this.mapcode = mapcode; // 放地图的div的id
        this.maplevel = null; // 地图显示级别工具对象
		this.rule = null;
        this.mapzoom = null; // 地图显示缩放工具对象
        this.mapcoords = null; // 地图显示坐标栏工具对象
        this.zoom = 5; // 地图级别
        this.Listener = {}; //监听事件
        this.infoWindow = {}; //存放小气泡窗口对象
        this.hoverInfoWindow = {}; //存放小气泡窗口对象
        this.yypathflyTool = {}; //存放漫游工具对象
        this.overlay = {}; //存放overlay的数据
        this.toolSettingData = {};
        this.colorDatasource = {}; //存放色表的数据
        this.enumMapData;
		this.mapDynamic={};
		this.zmapinfowindow=null;
		this.interval=100;
        this.svg={};
        this.tooltipHtmlFun = {};
		self.ZMapOverLay = new ZMap.MapWidget.overlay(self.zmap2dview)

		/*获取openlayers map对象*/
		this.getolMap = function()
		{
			return self.zmap2dview.olMap;
		}

        /*设置地图服务地址 */
        this.setGISserverAddress = function(serverAddress) {
            self.GISserverAddress = serverAddress;
        }

        this.pointHoverFun = function(info,pos)
        {
            var val = info.value;
            if(!val.attr)
            {
                val = info.subs[0].value;
            }
            if(self.hoverInfoWindow[val.attr['ATTRNAME']]!=null)
            {
                self.zmap2dview.CloseInfoWindow(self.hoverInfoWindow[val.attr['ATTRNAME']]);
                self.hoverInfoWindow[val.attr['ATTRNAME']]=null
            }
            var row = val.attr||info.subs[0].value.attr;
            var sContent = "<h4>"+row['ATTRNAME']+"</h4><ul>";
            for(var key in row){
                if(key =='ATTRNAME')
                {
                    continue;
                }
                    sContent += '<li><span>'+key+':</span><b>' + row[key] + '</b></li>';
                }
            sContent += '</ul>'

            if(!pos)
            {
                var position = info.subs[0].value.point;
                if(Array.isArray(position[0]))
                {
                    position = position[0]
                }
            }
            else{
                var position =pos;
            }
            self.hoverInfoWindow[val.attr['ATTRNAME']] = self.zmap2dview.InfoWindow(position, sContent);
            self.zmap2dview.OpenInfoWindow(self.hoverInfoWindow[val.attr['ATTRNAME']]);
        }
        this.pointClickFun = function(info,pos)
        {
            var val = info.value;
            if(!val.attr)
            {
                val = info.subs[0].value;
            }
            if(self.infoWindow[val.attr['ATTRNAME']]!=null)
            {
                self.zmap2dview.CloseInfoWindow(self.infoWindow[val.attr['ATTRNAME']]);
                self.infoWindow[val.attr['ATTRNAME']]=null
            }
            var row = val.attr||info.subs[0].value.attr;
            var sContent = "<h4>"+row['ATTRNAME']+"</h4><ul>";
            for(var key in row){
                if(key =="ATTRNAME")
                {
                    continue;
                }
                    sContent += '<li><span>'+key+':</span><b>' + row[key] + '</b></li>';
                }
            sContent += '</ul>'
            if(!pos)
            {
                var position = info.subs[0].value.point;
                if(Array.isArray(position[0]))
                {
                    position = position[0]
                }
            }
            else{
                var position =pos;
            }
            self.infoWindow[val.attr['ATTRNAME']] = self.zmap2dview.InfoWindow(position, sContent);
            self.zmap2dview.OpenInfoWindow(self.infoWindow[val.attr['ATTRNAME']]);
        }


        this.polygonHoverFun = function(info,pos)
        {
            var issame =false;
            var val = info.value;
            if(!val.attr)
            {
                val = info.subs[0].value;
            }
            if(self.zmap2dview.GetUnkLayer(val.attr.ATTRNAME+'HOVER'))
            {
                var name = self.zmap2dview.GetUnkLayer(val.attr.ATTRNAME+'HOVER').getSource().getSource().getFeatures()[0].getProperties().name;
                if(name == val.name)
                {
                    issame = true;
                }
            }

            if(!issame)
            {
                self.zmap2dview.RemoveGeometrys(val.attr.ATTRNAME+'HOVER');

                var vecSource = new ol.source.Vector();
                var unkLayer  = new ol.layer.Image({
                                    name: val.attr.ATTRNAME+'HOVER',
                                    source: new ol.source.ImageVector( {source: vecSource } )
                                    //maxResolution: 0.05,
                                    });
                self.zmap2dview.olMap.addLayer(unkLayer);
                var geomPoly = new ol.geom.MultiPolygon(info.pos, 'XY');
                var feature = new ol.Feature(
                    {
                        geometry: geomPoly,
                        name:  val.name,
                        attr: val.attr
                    });

                var highstyle = new ZMap2D.Style({});
                feature.setStyle(highstyle);
                vecSource.addFeature(feature);
            }


            if(self.hoverInfoWindow[val.attr['ATTRNAME']]!=null)
            {
                self.zmap2dview.CloseInfoWindow(self.hoverInfoWindow[val.attr['ATTRNAME']]);
                self.hoverInfoWindow[val.attr['ATTRNAME']]=null
            }
            var row = val.attr.properties;
            var sContent = "<h4>"+val.attr['ATTRNAME']+"</h4><ul>";
            for(var key in row){
                    if(key =="ATTRNAME")
                    {
                        continue;
                    }
                    sContent += '<li><span>'+key+':</span><b>' + row[key] + '</b></li>';
                }
            sContent += '</ul>'

            if(!pos)
            {
                var position = info.subs[0].value.point;
                if(Array.isArray(position[0]))
                {
                    position = position[0]
                }
            }
            else{
                var position =pos;
            }
            self.hoverInfoWindow[val.attr['ATTRNAME']] = self.zmap2dview.InfoWindow(position, sContent);
            self.zmap2dview.OpenInfoWindow(self.hoverInfoWindow[val.attr['ATTRNAME']]);
        }
        this.polygonClickFun = function(info,pos)
        {
            var issame =false;
            var val = info.value;
            if(!val.attr)
            {
                val = info.subs[0].value;
            }
            if(self.zmap2dview.GetUnkLayer(val.attr.ATTRNAME+'HOVER'))
            {
                var name = self.zmap2dview.GetUnkLayer(val.attr.ATTRNAME+'HOVER').getSource().getSource().getFeatures()[0].getProperties().name;
                if(name == val.name)
                {
                    issame = true;
                }
            }

            if(!issame)
            {
                self.zmap2dview.RemoveGeometrys(val.attr.ATTRNAME+'HOVER');

                var vecSource = new ol.source.Vector();
                var unkLayer  = new ol.layer.Image({
                                    name: val.attr.ATTRNAME+'HOVER',
                                    source: new ol.source.ImageVector( {source: vecSource } )
                                    //maxResolution: 0.05,
                                    });
                self.zmap2dview.olMap.addLayer(unkLayer);
                var geomPoly = new ol.geom.MultiPolygon(info.pos, 'XY');
                var feature = new ol.Feature(
                    {
                        geometry: geomPoly,
                        name:  val.name,
                        attr: val.attr
                    });

                var highstyle = new ZMap2D.Style({});
                feature.setStyle(highstyle);
                vecSource.addFeature(feature);
            }

            if(self.infoWindow[val.attr['ATTRNAME']]!=null)
            {
                self.zmap2dview.CloseInfoWindow(self.infoWindow[val.attr['ATTRNAME']]);
                self.infoWindow[val.attr['ATTRNAME']]=null
            }
            var row = val.attr.properties;
            var sContent = "<h4>"+val.attr['ATTRNAME']+"</h4><ul>";
            for(var key in row){
                    if(key =='ATTRNAME')
                    {
                        continue;
                    }
                    sContent += '<li><span>'+key+':</span><b>' + row[key] + '</b></li>';
                }
            sContent += '</ul>'
            if(!pos)
            {
                var position = info.subs[0].value.point;
                if(Array.isArray(position[0]))
                {
                    position = position[0]
                }
            }
            else{
                var position =pos;
            }
            self.infoWindow[val.attr['ATTRNAME']] = self.zmap2dview.InfoWindow(position, sContent);
            self.zmap2dview.OpenInfoWindow(self.infoWindow[val.attr['ATTRNAME']]);
        }

        this.lineClickFun = function(info,pos){
            var issame =false;
            var val = info.value;
            if(!val.attr)
            {
                val = info.subs[0].value;
            }
            if(self.zmap2dview.GetUnkLayer(val.attr.ATTRNAME+'HOVER'))
            {
                var name = self.zmap2dview.GetUnkLayer(val.attr.ATTRNAME+'HOVER').getSource().getSource().getFeatures()[0].getProperties().name;
                if(name == val.name)
                {
                    issame = true;
                }
            }

            if(!issame)
            {
                self.zmap2dview.RemoveGeometrys(val.attr.ATTRNAME+'HOVER');

                var vecSource = new ol.source.Vector();
                var unkLayer  = new ol.layer.Image({
                                    name: val.attr.ATTRNAME+'HOVER',
                                    source: new ol.source.ImageVector( {source: vecSource } )
                                    //maxResolution: 0.05,
                                    });
                self.zmap2dview.olMap.addLayer(unkLayer);
                var geomPoly = new ol.geom.MultiLineString(info.pos, 'XY');
                var feature = new ol.Feature(
                    {
                        geometry: geomPoly,
                        name:  val.name,
                        attr: val.attr
                    });

                var highstyle = new ZMap2D.Style({});
                feature.setStyle(highstyle);
                vecSource.addFeature(feature);
            }

            if(self.infoWindow[val.attr['ATTRNAME']]!=null)
            {
                self.zmap2dview.CloseInfoWindow(self.infoWindow[val.attr['ATTRNAME']]);
                self.infoWindow[val.attr['ATTRNAME']]=null
            }
            var row = val.attr;
            var sContent = "<h4>"+val.attr['ATTRNAME']+"</h4><ul>";
            for(var key in row){
                    if(key =='ATTRNAME')
                    {
                        continue;
                    }
                    sContent += '<li><span>'+key+':</span><b>' + row[key] + '</b></li>';
                }
            sContent += '</ul>'
            if(!pos)
            {
                var position = info.subs[0].value.point;
                if(Array.isArray(position[0]))
                {
                    position = position[0]
                }
            }
            else{
                var position =pos;
            }
            self.infoWindow[val.attr['ATTRNAME']] = self.zmap2dview.InfoWindow(position, sContent);
            self.zmap2dview.OpenInfoWindow(self.infoWindow[val.attr['ATTRNAME']]);
        }

        this.lineHoverFun = function(info,pos){
            var issame =false;
            var val = info.value;
            if(!val.attr)
            {
                val = info.subs[0].value;
            }
            if(self.zmap2dview.GetUnkLayer(val.attr.ATTRNAME+'HOVER'))
            {
                var name = self.zmap2dview.GetUnkLayer(val.attr.ATTRNAME+'HOVER').getSource().getSource().getFeatures()[0].getProperties().name;
                if(name == val.name)
                {
                    issame = true;
                }
            }

            if(!issame)
            {
                self.zmap2dview.RemoveGeometrys(val.attr.ATTRNAME+'HOVER');

                var vecSource = new ol.source.Vector();
                var unkLayer  = new ol.layer.Image({
                                    name: val.attr.ATTRNAME+'HOVER',
                                    source: new ol.source.ImageVector( {source: vecSource } )
                                    //maxResolution: 0.05,
                                    });
                self.zmap2dview.olMap.addLayer(unkLayer);
                var geomPoly = new ol.geom.MultiLineString(info.pos, 'XY');
                var feature = new ol.Feature(
                    {
                        geometry: geomPoly,
                        name:  val.name,
                        attr: val.attr
                    });

                var highstyle = new ZMap2D.Style({});
                feature.setStyle(highstyle);
                vecSource.addFeature(feature);
            }


            if(self.hoverInfoWindow[val.attr['ATTRNAME']]!=null)
            {
                self.zmap2dview.CloseInfoWindow(self.hoverInfoWindow[val.attr['ATTRNAME']]);
                self.hoverInfoWindow[val.attr['ATTRNAME']]=null
            }
            var row = val.attr;
            var sContent = "<h4>"+val.attr['ATTRNAME']+"</h4><ul>";
            for(var key in row){
                    if(key =="ATTRNAME")
                    {
                        continue;
                    }
                    sContent += '<li><span>'+key+':</span><b>' + row[key] + '</b></li>';
                }
            sContent += '</ul>'

            if(!pos)
            {
                var position = info.subs[0].value.point;
                if(Array.isArray(position[0]))
                {
                    position = position[0]
                }
            }
            else{
                var position =pos;
            }
            self.hoverInfoWindow[val.attr['ATTRNAME']] = self.zmap2dview.InfoWindow(position, sContent);
            self.zmap2dview.OpenInfoWindow(self.hoverInfoWindow[val.attr['ATTRNAME']]);
        }


        /*获取地图服务地址 */
        //   var GISserverAddress;
        // this.GetGISServerAddress=function () {
        //     return self.getGISServerAddress();
        // }
        this.getGISServerAddress = function() {
            var GISserverAddress = self.GISserverAddress;
            if (!GISserverAddress) {
                GISserverAddress = window.location.protocol + "//" + window.location.host + "/";
            }
            return GISserverAddress; //"http://192.168.8.97:9093/";
        }


        /*
        function addZmapLogo(){
            var url = self.getGISServerAddress();
            $.ajax({
                url: url+'zs/cms/lic/q',
                dataType: 'json',
                success: function(data) {
                    if(data.lic){
                        if(data.lic.authorizer&&data.lic.authorizer!=""){
                            var html='<span style="font-size:12px;padding:2px 10px;background:rgba(255,255,255,.4);cursor:pointer">'+data.lic.authorizer+'</span>';
                            self.zmap2dview.AddCommonControl('logo', html, '5', '', '', '2', 160, 20);

                        }
                    }


                }
            })
        }*/
        //addZmapLogo();


        /*----overlay---*/
        self.zmap2dview.olMap.on('postrender', function(event) {
            self.ZMapOverLay.draw(event.map);
        });




        /*----图标动画-----*/
		$('#'+self.mapcode+'').children('div').children('canvas').css("position","absolute");
		$('#'+self.mapcode+'').children('div').children('canvas').after($('<canvas id="'+self.mapcode+'myCanvas" style="position: absolute;top: 0.4px;left: 0.4px;" width="'+self.zmap2dview.GetMapSize()[0]+'" height="'+self.zmap2dview.GetMapSize()[1]+'"></canvas>'));


		this.ctx=document.getElementById(self.mapcode+"myCanvas").getContext("2d");

		this.manager=new VectorEffect.Manager();
		self.manager.maplayer=self.zmap2dview;
		self.manager.ctx=self.ctx;
		this.first=true;
		this.timeoutrun = {
           timer: null, //全局变量,暂停用。
          MyAutoRun: function () {

				clearInterval(self.timeoutrun.timer);
				self.timeoutrun.timer = setInterval(function () {
					self.manager.draw();
				},self.interval-((self.manager.getPointNum()/2)>80?80:(self.manager.getPointNum()/2)));
           }, MyAutoRunSuspend: function () { //暂停方法
               clearInterval(self.timeoutrun.timer);
			   self.timeoutrun.timer=null;
			   clearCanvas();
           }

		}

		self.zmap2dview.olMap.on('moveend', function(event) {

		      self.timeoutrun.MyAutoRun();
              setTimeout(function(){self.millionMovend()},0);
		});
		function clearCanvas(){
			self.ctx.clearRect(0,0,self.zmap2dview.GetMapSize()[0],self.zmap2dview.GetMapSize()[1]);
			$('#'+self.mapcode+'myCanvas').width(self.zmap2dview.GetMapSize()[0]);
			$('#'+self.mapcode+'myCanvas').height(self.zmap2dview.GetMapSize()[1]);
			$('#'+self.mapcode+'myCanvas').attr('width',self.zmap2dview.GetMapSize()[0]);
			$('#'+self.mapcode+'myCanvas').attr('height',self.zmap2dview.GetMapSize()[1]);
			self.manager.resetPoint();
		}

		self.zmap2dview.olMap.getView().on(['change:center', 'change:resolution'], self.timeoutrun.MyAutoRunSuspend, self);
		self.zmap2dview.olMap.on(['change:size'], self.timeoutrun.MyAutoRunSuspend, self);
		this.highLighted=function(event){
			var pixel = event.pixel;
            if (pixel == null) {
                return;
            }
            var eX = pixel[0];
            var eY = pixel[1];
            var info = self.QueryFeature(eX, eY, {torence:15,type:''});
            if (info == null||info.length==0)
            {
				self.manager.removeLayer(self.mapDynamic['pointHighShow']);
                delete self.mapDynamic['pointHighShow'];
                for(var h in self.hoverInfoWindow)
                {
                    self.zmap2dview.CloseInfoWindow(self.hoverInfoWindow[h])
                }
                return ;
            }
            else if(self.mapDynamic['pointHighShow']==undefined){
				var data={};
				var point = []
                var color=[];//info.value.color||'rgb(255,0,0)';
                var size = [];
                for(var i=0;i<info.length;i++)
                {
                    var val = info[i].value;
                    if(val.attr!=undefined&&val.attr['ATTRNAME']&&self.mapDynamic[val.attr['ATTRNAME']]&&info[i].type.indexOf('Point')>-1)
                    {
                        if(Array.isArray(val.point)&&typeof val.point[0] =='number'&&typeof val.point[1] =='number')
                        {
                            point.push(val.point);
                            color.push(val.color||'rgb(255,0,0)');
                            size.push(val.size);
                        }
                    }
                    if(val.attr!=undefined&&self.tooltipHtmlFun[val.attr['ATTRNAME']]&&self.tooltipHtmlFun[val.attr['ATTRNAME']].hoverFun!=0)
                    {
                        if(info[i].type.indexOf('Polygon')>-1||info[i].type.indexOf('LineString')>-1)
                        {
                            self.tooltipHtmlFun[val.attr['ATTRNAME']].hoverFun(info[i],self.zmap2dview.Screen2MapCoord(pixel));
                        }
                        else{
                            self.tooltipHtmlFun[val.attr['ATTRNAME']].hoverFun(info[i]);
                        }

                    }
                    else if(info[i].subs[0].value.attr!=undefined&&self.tooltipHtmlFun[info[i].subs[0].value.attr['ATTRNAME']]&&self.tooltipHtmlFun[info[i].subs[0].value.attr['ATTRNAME']].hoverFun!=0)
                    {
                        self.tooltipHtmlFun[info[i].subs[0].value.attr['ATTRNAME']].hoverFun(info[i],self.zmap2dview.Screen2MapCoord(pixel));
                    }
                }
                if(point.length==0)
                {
                    return;
                }
                data['data']={points:point,color:color,size:size};
				data['effect']='high';
				data['symbol']=self.mapDynamic[val.attr['ATTRNAME']]['_symbol'];

				self.mapDynamic['pointHighShow']=self.manager.addLayer(data);
			}

		}
		self.zmap2dview.AddEventListener('pointermove', self.highLighted);
		self.clickLighted = function(event){
			var pixel = event.pixel;
            if (pixel == null) {
                return;
            }
            var eX = pixel[0];
            var eY = pixel[1];
            var info = self.QueryFeature(eX, eY, {torence:15,type:''});

            self.manager.removeLayer(self.mapDynamic['pointClickShow']);
			delete self.mapDynamic['pointClickShow'];
            if (info == null||info.length==0)
            {

                return ;
            }
            else if(self.mapDynamic['pointClickShow']==undefined){
				var data={};
				var point = []
                var color=[];//info.value.color||'rgb(255,0,0)';
                var size = [];
                for(var i=0;i<info.length;i++)
                {
                    var val = info[i].value;
                    if(val.attr!=undefined&&val.attr['ATTRNAME']&&self.mapDynamic[val.attr['ATTRNAME']]&&info[i].type.indexOf('Point')>-1)
                    {
                        if(Array.isArray(val.point)&&typeof val.point[0] =='number'&&typeof val.point[1] =='number')
                        {
                            point.push(val.point);
                            color.push(val.color||'rgb(255,0,0)');
                            size.push(val.size);
                        }
                    }
                    if(val.attr!=undefined&&self.tooltipHtmlFun[val.attr['ATTRNAME']]&&self.tooltipHtmlFun[val.attr['ATTRNAME']].clickFun!=0)
                    {
                        if(info[i].type.indexOf('Polygon')>-1||info[i].type.indexOf('LineString')>-1)
                        {
                            self.tooltipHtmlFun[val.attr['ATTRNAME']].clickFun(info[i], self.zmap2dview.Screen2MapCoord(pixel));
                        }
                        else{
                            // 参数位置调换了，实际上第二个参数一直没有被用到，所以直接修改了参数位置
                            self.tooltipHtmlFun[val.attr['ATTRNAME']].clickFun(info[i], self.zmap2dview.Screen2MapCoord(pixel), {index:i,size:info.length});
                        }
                    }
                    else if(info[i].subs[0].value.attr!=undefined&&self.tooltipHtmlFun[info[i].subs[0].value.attr['ATTRNAME']]&&self.tooltipHtmlFun[info[i].subs[0].value.attr['ATTRNAME']].clickFun!=0)
                    {
                        self.tooltipHtmlFun[info[i].subs[0].value.attr['ATTRNAME']].clickFun(info[i],self.zmap2dview.Screen2MapCoord(pixel), {index:i,size:info.length, isCluster: true});
                    }
                }
                if(point.length==0)
                {
                    return;
                }
                else{
                    data['data']={points:point,color:color,size:size};
                    data['effect']='click';
                    data['symbol']=self.mapDynamic[val.attr['ATTRNAME']]['_symbol'];
                    self.mapDynamic['pointClickShow']=self.manager.addLayer(data);
                }
			}

		}

		self.zmap2dview.AddEventListener('click', self.clickLighted);

        getLinecolor();
        /*默认从本地json文件中获取颜色参数 */
        function getLinecolor() {
            $.ajax({
                url: 'json/linecolor.json',
                dataType: 'json',
                async: false,
                success: function(_data) {

                    self.colorDatasource = _data; //存储等值线色值
                }
            })
        }
        this.enumMap = function(callback, url) {
            //http://localhost:9081/zs/data/catalog/enumall?f=json
            var surl = self.getGISServerAddress();
            if (url != undefined && url != "" && url.indexOf("http") > -1 && url.substring(url.length - 1) == "/") surl = url;
            $.ajax({
                url: surl + 'zs/data/catalog/enumall?f=json',
                dataType: 'json',
                success: function(_data) {
                    for (var i = 0; i < _data.children.length; i++) {
                        for (var ii = 0; ii < _data.children[i].children.length; ii++) {
                            if (_data.children[i].children[ii].type != "Map") {
                                _data.children[i].children.splice(ii, 1);
                                ii--;
                            }
                        }
                        if (_data.children[i].children.length == 0) {
                            _data.children.splice(i, 1);
                            i--;
                        }
                    }
                    self.enumMapData = _data; //
                    if (typeof callback === "function") callback(_data);

                }
            })
        }
        this.zoomIn = function() {
            var zoom = self.zmap2dview.GetZoom() + 1;
            self.zmap2dview.SetZoom(zoom);
        }
        this.zoomOut = function() {
            var zoom = self.zmap2dview.GetZoom() - 1;
            self.zmap2dview.SetZoom(zoom);
        }

        this.resize = function() {
            var w = $('#' + self.mapcode).width();
            var h = $('#' + self.mapcode).height();
            self.zmap2dview.olMap.setSize([w, h]);
        }
        //注册点击事件返回图标点信息,name为存放注册事件的名称，callback为该注册事件的回调方法
        this.addClickListener = function(name, callback,options) {
            self.Listener[name] = self.Listener[name] || {};
            self.Listener[name]['type'] = 'click';
            self.Listener[name]['fun'] = function(event) {
                var pixel = event.pixel;
                if (pixel == null) {
                    return;
                }
                var eX = pixel[0];
                var eY = pixel[1];
                var info = self.QueryFeature(eX, eY, options);
                // if (info == null)
                // {
                //     return ;
                // }
                //console.log(info);
                if (typeof callback === "function") callback(info,self.zmap2dview.Screen2MapCoord(pixel));
            }
            this.zmap2dview.AddEventListener('click', self.Listener[name]['fun']);
        }
        //根据名称移除点击事件
        this.removeClickListener = function(name) {
            if (self.Listener[name]) {
                this.zmap2dview.RemoveEventListener('click', self.Listener[name]['fun']);
                delete self.Listener[name];
            }
        }
        //注册鼠标事件返回图标点信息,name为存放注册事件的名称，callback为该注册事件的回调方法
        this.addPointMoveListener = function(name, callback,options) {
            self.Listener[name] = self.Listener[name] || {};
            self.Listener[name]['type'] = 'pointermove';
            self.Listener[name]['fun'] = function(event) {
                var pixel = event.pixel;
                if (pixel == null) {
                    return;
                }
                var eX = pixel[0];
                var eY = pixel[1];
                var info = self.QueryFeature(eX, eY, options);
                // if (info == null)
                // {
                //     return ;
                // }
                //console.log(info);
                if (typeof callback === "function") callback(info,self.zmap2dview.Screen2MapCoord(pixel));
            }
            this.zmap2dview.AddEventListener('pointermove', self.Listener[name]['fun']);
        }
        //根据名称移除鼠标移动事件
        this.removePointMoveListener = function(name) {
            if (self.Listener[name]) {
                this.zmap2dview.RemoveEventListener('pointermove', self.Listener[name]['fun']);
                delete self.Listener[name];
            }
        }

        /*获取色表数据，用于等值线等值面上图 */
        this.getMapColorLib = function(url){
            if(url.indexOf('MapServlet')==-1)
                return;
            $.ajax({
                    url:url,
                    type:"post",
                    dataType: 'json',
                    data:{method:'getColorPlanAll'},
                    async: false,
                    success:function(data){
                        var colordata={};
                        if(data.success){
                            var row=data.data;
                            for(var i=0;i<row.length;i++){
                                colordata[row[i]['id']+'']={type:'color',color:[],name:row[i]['name']};
                                for(var j=0;j<row[i]['colors'].length;j++){
                                    var co={
                                        min:row[i]['colors'][j]['value']||JSON.parse(row[i]['colors'][j]['range'])[0],
                                        max:row[i]['colors'][j]['value']||JSON.parse(row[i]['colors'][j]['range'])[1],
                                        color:row[i]['colors'][j]['color']
                                    };
                                    colordata[row[i]['id']+'']['color'].push(co);
                                }
                            }
                        self.addColorDatasource(colordata);
                        }
                    }
            })
        }

        this.getDatasource = function() {
            return self.getColorDatasource();
        }

        this.getColorDatasource = function() {
            try {
                if (freeboard != undefined) {
                    self.colorDatasource = freeboard.getDatasource();
                    return freeboard.getDatasource();
                } else {
                    return self.colorDatasource;
                }
            } catch(e) {
                return self.colorDatasource;
            }
        }
        this.addColorDatasource = function(colordata) {
            for (var key in colordata) {
                self.colorDatasource[key] = colordata[key];
            }
        }
        this.removeColorDatasource = function(colorname) {
            delete self.colorDatasource[colorname];
        }
        this.removeAllColorDatasource = function() {
            self.colorDatasource = {};
        }
        /*绘制等值线等值面所需数据参数 */
        function getLA() {
            var lineArea = {};
            lineArea['anyTool'] = null; //划面对象
            lineArea['m_MaxGridWidth'] = 1200; //等值面图片最大宽度
            lineArea['m_MaxGridHeight'] = 1200; //等值面图片最大高度
            lineArea['m_MinGridWidth'] = 400; //等值面图片最小宽度
            lineArea['m_MinGridHeight'] = 400; //等值面图片最大宽度
            lineArea['m_StepWH'] = 120; //每次放大，追踪等值线的栅格值的差值
            lineArea['m_ContourGridWidth'] = 400;
            lineArea['m_ContourGridHeight'] = 400;
            lineArea['coords'] = []; //画图工具返回点
            lineArea['singleLayer'] = null; //本次生成的图片
            lineArea['singleLayerBK'] = null; //上次生成的图片
            //lineArea['lineColor']=[];
            lineArea['sitData'];
            lineArea['lineAreaType'] = '';
            lineArea['zoomLast'] = '';
            lineArea['textName'] = ''; //存储追加的等值线的值
            lineArea['isDreaw'] = false;
            lineArea['searchExtent'] = null;
            return lineArea;
        }



        /* 设置不同图标的个数缓存大小 默认值为32*/
        this.setIconImageCache = function(num)
        {
        	ol.style.iconImageCache.maxCacheSize_=0;
        	ol.style.iconImageCache.cache_={};
        	ol.style.iconImageCache.cacheSize_=0;
            var number=isNaN(parseInt(num))?1000:parseInt(num)
            ol.style.iconImageCache.maxCacheSize_=number;
        }


        /*设置项修改，包括工具图标显示设置及服务地址设置 */
        this.settingchange = function(ob) {
           self.toolSettingChange(ob);
        }
        this.toolSettingChange = function(ob) {

            self.setIconImageCache(ob.iconImageCache);

            for (var key in ob) {
                self.toolSettingData[key] = ob[key];
            }

            if (self.zmap2dview == undefined) return;
            self.removeHtmlico();
            self.removerect();
            self.removemaplevel();
            self.removemapcoords();
            self.removezoom();
			self.removeRuleControl();
            //地图上清除，测量，绘制，等值线等值面工具的显示与否
            if (ob.allDrowTool) {
                self.getHtmlico(ob);
            }
            //更具传的json的x,y坐标来确定地图中心点
            var x = ob['x'] == "" ? self.fw[0] : parseFloat(ob['x'] == undefined ? self.fw[0]  : ob['x']);
            var y = ob['y'] == "" ? self.fw[1]  : parseFloat(ob['y'] == undefined ? self.fw[1]  : ob['y']);
            self.fw = [x, y];

            if (ob.mousePosition) {
                self.addmapcoords();
            }
            if (ob.zoomTool) {
                self.addzoom();
            }
            if (ob.levelTool) {
                self.addmaplevel();
            }
            if (ob.resetTool) {
                self.addrect();
            }
			if(ob.ruleControl&&(this.projection=='EPSG:4326'||this.projection=='EPSG:900913'||this.projection=='EPSG:3857')){
				self.addRuleControl();
			}
            var zoom = ob['z'] == "" ? self.zoom: parseFloat(ob['z'] == undefined ? self.zoom: ob['z']);
            self.zoom = zoom;
			self.zmap2dview.CenterAndZoom([x, y], self.zoom);
            //设置中地图服务地址，有的话就设置该地址为地图服务的地址
            if (ob.gisserverurl != undefined && ob.gisserverurl != "") self.setGISserverAddress(ob.gisserverurl);
            self.zmap2dview.RemoveControl(self.ovmap);
            if (ob.ovmap) {
                self.ovmap = self.ovmap || new ol.control.OverviewMapCtl({
                        collapsed : false,
                        view : new ol.View({
                            center: viewopt.center ? viewopt.center : [113.23333, 23.16667],
                            zoom: viewopt.zoom ? viewopt.zoom : 4,
                            minZoom: viewopt.minZoom ? viewopt.minZoom : 2,
                            maxZoom: viewopt.maxZoom ? viewopt.maxZoom : 21,
                            extent:  viewopt.extent||ol.proj.get(viewopt.projection).getExtent() || [-180, -90, 180, 90],
                            minZoom: viewopt.minZoom ? viewopt.minZoom : 2,
                            maxZoom: viewopt.maxZoom ? viewopt.maxZoom : 21,
                            projection:  viewopt.projection ?  viewopt.projection : 'EPSG:4326'
                        })
                    });

                self.zmap2dview.AddControl(self.ovmap);
            }
        }
        /*设置地图级别 */
        // this.setzoom=function(zoomnum){
        //   var a=parseFloat(zoomnum);
        //   if(a>0&&a<25)
        //     {self.zoom=a;
        //       self.zmap2dview.SetZoom(self.zoom);
        //     }
        //   }
        this.setZoom = function(zoomnum) {
            var a = parseFloat(zoomnum);
            if (a > 0 && a < 25) {
                self.zmap2dview.SetZoom(a);
            }
        }
        /*设置复位点 */
        this.setResetCoordsZoom = function(x, y, z) {
            self.setrestcoords(x, y);
            var a = parseFloat(z);
            if (a > 0 && a < 25) {
                self.zoom = a;
                self.zmap2dview.SetZoom(self.zoom);
            }
        }
        this.setrestcoords = function(x, y) {
            if (!parseFloat(x).isNaN() && !parseFloat(y).isNaN()) this.fw = [parseFloat(x), parseFloat(y)];
        }
        /*设置工具按钮 */
        this.getHtmlico = function(h) {

            var w = 66;
            /*设置清除 */
            var html0 = '<div title="清除" id="' + self.mapcode + 'qcall" class="toolqc"></div>';
            if (h.toolstyle == undefined) self.zmap2dview.AddCommonControl('clear', html0, w, 10, '', '', 26, 26);
            $('#' + self.mapcode + 'qcall').click(function() {
                self.MenuClick(1)
            })

            /*设置测量 */
            if (h.measureTool) {
                var htmlx1 = '<div class="space_wrap" id="' + self.mapcode + 'cl"><ul><li  ><i class="cj"></i>测距</li><li ><i class="cm"></i>测面</li></ul></div>';

                var html4 = '<div title="测量" id="' + self.mapcode + 'clcj" class="toolcl" ></div>';
                w += 50;
                if (h.toolstyle == undefined) {
                    self.zmap2dview.AddCommonControl('e', htmlx1, w, 42, '', '', 80, 56);
                    self.zmap2dview.AddCommonControl('f', html4, w, 10, '', '', 26, 26);
                } else if (h.toolstyle == "1") {
                    self.zmap2dview.AddCommonControl('e', htmlx1, w+44, 42, '', '', 80, 56,11);
                } else if (h.toolstyle == "2") {
                    self.zmap2dview.AddCommonControl('e', htmlx1, 95, 60, '', '', 80, 56,11);
                }
                self.showareaBox();
                $('#' + self.mapcode + 'clcj').click(function() {
                    self.showareaBox()
                });
                $('#' + self.mapcode + 'cl').children('ul').children('li').eq(0).click(function() {
                    self.MenuClick(5)
                });
                $('#' + self.mapcode + 'cl').children('ul').children('li').eq(1).click(function() {
                    self.MenuClick(6)
                });
            }
            /*设置绘制 */
            if (h.geometryTool) {
                var htmlx = '<div class="space_wrap" id="' + self.mapcode + 'kjcx"><ul><li  ><i class="huayuan"></i>画圆</li><li><i class="huamian"></i>画面</li><li ><i class="lakuang"></i>拉框</li></ul></div>';

                var html3 = '<div title="绘制" id="' + self.mapcode + 'hmhy" class="toolhz" ></div>';
                w += 50;
                if (h.toolstyle == undefined) {
                    self.zmap2dview.AddCommonControl('c', htmlx, w, 42, '', '', 80, 76);
                    self.zmap2dview.AddCommonControl('d', html3, w, 10, '', '', 26, 26);
                } else if (h.toolstyle == "1") {
                    self.zmap2dview.AddCommonControl('c', htmlx, w + 70, 42, '', '', 80, 76,11);
                } else if (h.toolstyle == "2") {
                    self.zmap2dview.AddCommonControl('c', htmlx, 95, 85, '', '', 80, 76,11);
                }

                self.showkjBox();
                $('#' + self.mapcode + 'hmhy').click(function() {
                    self.showkjBox()
                });
                $('#' + self.mapcode + 'kjcx').children('ul').children('li').eq(0).click(function() {
                    self.MenuClick(2)
                });
                $('#' + self.mapcode + 'kjcx').children('ul').children('li').eq(1).click(function() {
                    self.MenuClick(4)
                });
                $('#' + self.mapcode + 'kjcx').children('ul').children('li').eq(2).click(function() {
                    self.MenuClick(3)
                });
            }
            /*设置等值线等值面 */
            if (h.isolineTool) {
                var html11 = '<div title="等值线等值面操作" id="' + self.mapcode + 'dzxdzm" class="toolhz"></div>';
                w += 50;

                var htmldz = '  <div class="toolbar_center" id="' + self.mapcode + 'dinweijq" >'
                + '<table >'
                + '<tr height=30px><th>数据图层:</th><td><select id="' + self.mapcode + 'type1" style="width:90px;height:25px"></select></td></tr><tr>'
                + '<th>值字段:</th><td><select id="' + self.mapcode + 'type2" style="width:90px;height:25px"></select></td></tr>'
                + '<th>色表类型:</th><td><select  id="' + self.mapcode + 'type3" style="width:90px;height:25px"></select></td></tr><tr>'
                + '<tr><td colspan="2" text-align="center" height=30px><a id="' + self.mapcode + 'type4" class="a-botton">开始绘制</a></td></tr>' //<td text-align="center">选择等值面(线)数据</td>
                + '</table>'
                + '</div>';
                if (h.toolstyle == undefined) {
                    self.zmap2dview.AddCommonControl('dzm', htmldz, 100, 42, '', '', 172, 135);
                    self.zmap2dview.AddCommonControl('dz', html11, w, 10, '', '', 26, 26);
                } else if (h.toolstyle == "1") {
                    self.zmap2dview.AddCommonControl('dzm', htmldz, 270, 42, '', '', 172, 135,11);
                } else if (h.toolstyle == "2") {
                    self.zmap2dview.AddCommonControl('dzm', htmldz, 95, 105, '', '', 172, 135,11);
                }
                $('#' + self.mapcode + 'dzxdzm').click(function() {
                    self.showdzBox()
                });
                self.showdzBox();
                $('#' + self.mapcode + 'type4').click(function() {
                    self.getDz()
                });
            }
            if (h.toolstyle == "1" || h.toolstyle == "2") {

                var thtml = '<div id="tool' + self.mapcode + '" class="toolbar">' + '<ul style="margin:0;padding:0"><li id="' + self.mapcode + 'qcall"><div class="img toolqc2"></div>清除<span style="width:8px;float:right"></span></li>';
                if (h.measureTool) thtml += '<span class="toolbar_split'+h.toolstyle+'"></span><li id="' + self.mapcode + 'clcj"><div class="img toolcl2" ></div>测量<span style="margin:7px 0px 7px 5px; border-bottom:1px solid #000;border-right:1px solid #000;transform: rotate(45deg);width:5px;height:5px;float: right;"></span></li>';
                if (h.geometryTool) thtml += '<span class="toolbar_split'+h.toolstyle+'"></span><li id="' + self.mapcode + 'hmhy"><div class="img toolhz2"></div>绘制<span style="margin:7px 0px 7px 5px; border-bottom:1px solid #000;border-right:1px solid #000;transform: rotate(45deg);width:5px;height:5px;float: right;"></span></li>';
                if (h.isolineTool) thtml += '<span class="toolbar_split'+h.toolstyle+'""></span> <li id="' + self.mapcode + 'dzxdzm"><div class="img toolhm2" ></div>等值面<span style="margin:7px 0px 7px 5px; border-bottom:1px solid #000;border-right:1px solid #000;transform: rotate(45deg);width:5px;height:5px;float: right;"></span></li> ';
                thtml += '</ul></div>';
                if (h.toolstyle == "1") self.zmap2dview.AddCommonControl('clear', thtml, 10, 10, '', '', 'auto', 40);
                else self.zmap2dview.AddCommonControl('clear', thtml, 10, 10, '', '', 80, 200);
                $('#' + self.mapcode + 'dzxdzm').click(function() {
                    self.showdzBox()
                });
                $('#' + self.mapcode + 'hmhy').click(function() {
                    self.showkjBox()
                });
                $('#' + self.mapcode + 'qcall').click(function() {
                    self.MenuClick(1)
                });
                $('#' + self.mapcode + 'clcj').click(function() {
                    self.showareaBox()
                })
            }
            if (h.layercontrol) {
                var html = '<div title="显示图层控制面板" class="tooltc" id="' + self.mapcode + 'tckzmb"></div>';
                self.zmap2dview.RemoveCustomControl('tckz');
                if (self.toolSettingData.toolstyle == undefined) self.zmap2dview.AddCommonControl('tckz', html, '16', '10', '', '', 26, 26);
                if ((self.toolSettingData.toolstyle == "1" || self.toolSettingData.toolstyle == "2")) {
                    $('#tool' + self.mapcode).children('ul').prepend('<li id="' + self.mapcode + 'tckzmb"><div class="img tooltc2"></div>图层<span style="margin:7px 0px 7px 5px; border-bottom:1px solid #000;border-right:1px solid #000;transform: rotate(45deg);width:5px;height:5px;float: right;"></span></li><span class="toolbar_split'+h.toolstyle+'"></span>  ')
                }
                $('#' + self.mapcode + 'tckzmb').click(function() {
                    self.showTc();
                });
            }
        }
        /*移除所有工具栏 */
        this.removeHtmlico = function() {
            self.zmap2dview.RemoveCustomControl('clear');
            self.zmap2dview.RemoveCustomControl('b');
            self.zmap2dview.RemoveCustomControl('c');
            self.zmap2dview.RemoveCustomControl('d');
            self.zmap2dview.RemoveCustomControl('dz');
            self.zmap2dview.RemoveCustomControl('dzm');
            self.zmap2dview.RemoveCustomControl('e');
            self.zmap2dview.RemoveCustomControl('f');
            self.zmap2dview.RemoveCustomControl('tckz');
            self.zmap2dview.RemoveCustomControl('tc');
        }
        /*设置工具栏-清除，测量，绘制，等值线等值面 */
        this.setHtmlico = function(h) {
            self.removeHtmlico();
            self.getHtmlico(h);
        }
        /*设置复位 */
        this.addrect = function() {

            self.zmap2dview.AddCommonControl('fw', '<div id="fw' + self.mapcode+'" class="toolfw"></div>', '', 10, 7, '', 26,26);

			$('#fw' + self.mapcode).click(function(){
				self.resetContrl()
			})
        }
        /*移除复位按钮 */
        this.removerect = function() {
            self.zmap2dview.RemoveCustomControl('fw');
        }
        /*添加地图级别工具条 */
        this.addmaplevel = function() {
            self.maplevel = new ZMap2D.ZoomSliderControl();
            self.zmap2dview.AddControl(self.maplevel);
        }
        /*移除地图级别工具条 */
        this.removemaplevel = function() {
            self.zmap2dview.RemoveControl(self.maplevel);
        }
		 /*移除地图比列尺工具条 */
		this.addRuleControl = function(){
			self.rule = new ZMap2D.RuleControl();
            self.zmap2dview.AddControl(self.rule);
		}
		this.removeRuleControl = function() {
            self.zmap2dview.RemoveControl(self.rule);
        }
        /*添加级别缩放工具按钮 */
        this.addzoom = function() {
            self.mapzoom = new ZMap2D.ZoomControl();
            self.zmap2dview.AddControl(self.mapzoom);
        }
        /*移除级别缩放工具 */
        this.removezoom = function() {
            self.zmap2dview.RemoveControl(self.mapzoom);
        }
        /*添加鼠标位置对应坐标位置显示栏 */
        this.addmapcoords = function() {
            self.mapcoords = new ZMap2D.MousePositionControl();
            self.zmap2dview.AddControl(self.mapcoords);
        }
        /*移除鼠标位置对应坐标位置显示栏 */
        this.removemapcoords = function() {
            self.zmap2dview.RemoveControl(self.mapcoords);
        }
        this.removeonelayer = function() {

		}
        this.addonelayer = function() {

		}
        this.addmap = function() {

		}
        this.removemap = function() {

		}
        this.setViewCenter = function(x, y) {
            if(isNaN(parseFloat(x))||isNaN(parseFloat(y))){
                return;
            }
            self.zmap2dview.SetViewCenter(parseFloat(x), parseFloat(y));
        }

        this.CenterAndZoom = function(x,y,z)
        {
            self.setViewCenter(x,y);
            self.setZoom(z);
        }

        /*添加地图-wms。wmts。 */
        this.addJWlayer = function(name, murl, flag, maptype,minZoom,maxZoom) {
            if (maptype == "wms") {
                var wmsLayer = null;
                $.ajax({
                    url: murl + '?service=wms&request=GetCapabilities',
                    dataType: "xml",
                    ansync: false,
                    success: function(xml) {
                        //GetProxy() +
                        //初始化视图
                        var mode = 0;
                        var srs = xml.getElementsByTagName("ows:SupportedCRS");
                        if (srs.length > 0) {
                            var text = srs[0].textContent;
                            if (text) {
                                mode = AnlyzeSRS(text);
                            } else {
                                mode = 0;
                            }
                        } else {
                            mode = 0;
                        }
                        //InitMap(mode);
                        //初始化图层
                        var layers = xml.getElementsByTagName("Layer");
                        var layerparams, styleparams;
                        if (layers.length < 1) {
                            layerparams = '0';
                            styleparams = 'default';
                        } else {
                            layerparams = "0";
                            styleparams = 'default';
                            for (var i = 1; i < layers.length - 1; i++) {
                                layerparams += "," + i.toString();
                                styleparams += ',default';
                            }
                        }
                        var opt_options = {
                            name: name,
                            url: murl,
							topGrid: [1, 1],
                            extent: [ - 180, -90, 180, 90],
                            params: {
                                'LAYERS': layerparams,
                                'STYLES': styleparams
                            }
                        };
                        wmsLayer = new ZMap2D.WMSLayer(opt_options);
                        // map.AddTileLayer(wmsLayer);
                        self.zmap2dview.InsertLayer(0, wmsLayer);
                        wmsLayer.SetVisible(flag);
                        return wmsLayer;
                    },
                    error: function() {}
                })
            } else if (maptype == "wmts") {
                var wmtsLayer = null;
                var opt_options = {
                    url: murl,
                    //GetServerAddress() + '/zs/catalogws/data' + name + '/wmts',
                   // extent: [ - 180, -90, 180, 90],
				    topGrid: [1, 1],
                    name: name,
                    minZoom: minZoom,
                    maxZoom: maxZoom,
                    projection: ol.proj.get(self.projection)
                };
                if (wmtsLayer == null) {
                    wmtsLayer = new ZMap2D.WMTSLayer(opt_options);
                    self.zmap2dview.AddTileLayer(wmtsLayer);
                    //self.zmap2dview.InsertLayer(0, wmtsLayer);
                    wmtsLayer.SetVisible(flag);
                } else {
                    self.zmap2dview.RemoveTileLayer(wmtsLayer);
                    wmtsLayer = null;
                }

                return wmtsLayer;
            }
            else if(maptype == "osm"){
                var osmLayer= null;
                if (osmLayer == null) {
                    var opt = {
                        name:name,
                        source:new ol.source.OSM(),
                        minResolution:self.zmap2dview.olMap.getView().constrainResolution(self.zmap2dview.olMap.getView().getMaxResolution(),maxZoom-self.zmap2dview.olMap.getView().minZoom_,0),
                        maxResolution:self.zmap2dview.olMap.getView().constrainResolution(self.zmap2dview.olMap.getView().getMaxResolution(),minZoom-self.zmap2dview.olMap.getView().minZoom_,0)
                    }
                    if(!ZMap2D.CustomTileLayer){
                        osmLayer = new ol.layer.Tile(
                            {
                                name: opt.name,
                                source: opt.source,
                                minResolution:opt.minResolution,
                                maxResolution:opt.maxResolution*2
                            });

                        osmLayer.set('name', opt.name);

                        //设置方法
                        osmLayer.SetVisible = function (visible) {
                            this.setVisible(visible);
                        }
                        osmLayer.IsVisible = function () {
                            return this.getVisible();
                        }
                    } else {
                        osmLayer = new ZMap2D.CustomTileLayer(opt)
                    }
                    self.zmap2dview.AddTileLayer(osmLayer);
                    //self.zmap2dview.InsertLayer(0, wmtsLayer);
                    osmLayer.SetVisible(flag);
                } else {
                    self.zmap2dview.RemoveTileLayer(osmLayer);
                    osmLayer = null;
                }

                return osmLayer;
            }
            else if(maptype == "amap"){
                var amapLayer= null;
                if (amapLayer == null) {
                    amapLayer = new ZMap2D.CustomTileLayer(
                        {
                            name:name,
                            source:new ol.source.AMap(),
                            minResolution:self.zmap2dview.olMap.getView().constrainResolution(self.zmap2dview.olMap.getView().getMaxResolution(),maxZoom-self.zmap2dview.olMap.getView().minZoom_,0),
                            maxResolution:self.zmap2dview.olMap.getView().constrainResolution(self.zmap2dview.olMap.getView().getMaxResolution(),minZoom-self.zmap2dview.olMap.getView().minZoom_,0)
                        }
                    )
                    self.zmap2dview.AddTileLayer(amapLayer);
                    //self.zmap2dview.InsertLayer(0, wmtsLayer);
                    amapLayer.SetVisible(flag);
                } else {
                    self.zmap2dview.RemoveTileLayer(amapLayer);
                    amapLayer = null;
                }

                return amapLayer;
            }
            else if(maptype == "amapImage"){
                var amapImageLayer= null;
                if (amapImageLayer == null) {
                    amapImageLayer = new ZMap2D.CustomTileLayer(
                        {
                            name:name,
                            source:new ol.source.AMap({mapType:"sat"}),
                            minResolution:self.zmap2dview.olMap.getView().constrainResolution(self.zmap2dview.olMap.getView().getMaxResolution(),maxZoom-self.zmap2dview.olMap.getView().minZoom_,0),
                            maxResolution:self.zmap2dview.olMap.getView().constrainResolution(self.zmap2dview.olMap.getView().getMaxResolution(),minZoom-self.zmap2dview.olMap.getView().minZoom_,0)
                        }
                    )
                    self.zmap2dview.AddTileLayer(amapImageLayer);
                    //self.zmap2dview.InsertLayer(0, wmtsLayer);
                    amapImageLayer.SetVisible(flag);
                } else {
                    self.zmap2dview.RemoveTileLayer(amapImageLayer);
                    amapImageLayer = null;
                }

                return amapImageLayer;
            }
            else if(maptype == "tdt"){
                var tdtLayer= null;
                if (tdtLayer == null) {
                    tdtLayer = new ZMap2D.CustomTileLayer(
                        {
                            name:name,
                            source:new ol.source.TianMap({}),
                            minResolution:self.zmap2dview.olMap.getView().constrainResolution(self.zmap2dview.olMap.getView().getMaxResolution(),maxZoom-self.zmap2dview.olMap.getView().minZoom_,0),
                            maxResolution:self.zmap2dview.olMap.getView().constrainResolution(self.zmap2dview.olMap.getView().getMaxResolution(),minZoom-self.zmap2dview.olMap.getView().minZoom_,0)
                        }
                    )
                    self.zmap2dview.AddTileLayer(tdtLayer);
                    //self.zmap2dview.InsertLayer(0, wmtsLayer);
                    tdtLayer.SetVisible(flag);
                } else {
                    self.zmap2dview.RemoveTileLayer(tdtLayer);
                    tdtLayer = null;
                }

                return tdtLayer;
            }
            else if(maptype == "tdtImage"){
                var tdtImageLayer= null;
                if (tdtImageLayer == null) {
                    tdtImageLayer = new ZMap2D.CustomTileLayer(
                        {
                            name:name,
                            source:new ol.source.TianMap({mapType:"sat"}),
                            minResolution:self.zmap2dview.olMap.getView().constrainResolution(self.zmap2dview.olMap.getView().getMaxResolution(),maxZoom-self.zmap2dview.olMap.getView().minZoom_,0),
                            maxResolution:self.zmap2dview.olMap.getView().constrainResolution(self.zmap2dview.olMap.getView().getMaxResolution(),minZoom-self.zmap2dview.olMap.getView().minZoom_,0)
                        }
                    )
                    self.zmap2dview.AddTileLayer(tdtImageLayer);
                    //self.zmap2dview.InsertLayer(0, wmtsLayer);
                    tdtImageLayer.SetVisible(flag);
                } else {
                    self.zmap2dview.RemoveTileLayer(tdtImageLayer);
                    tdtImageLayer = null;
                }

                return tdtImageLayer;
            }
            else if(maptype == "xyz"){
                var xyzLayer = null;
                if (xyzLayer == null) {
                    xyzLayer = new ZMap2D.CustomTileLayer(
                        {
                            name:name,
                            source:new ol.source.XYZ({
                                url: murl,
                                crossOrigin: 'anonymous'
                            }),
                            minResolution:self.zmap2dview.olMap.getView().constrainResolution(self.zmap2dview.olMap.getView().getMaxResolution(),maxZoom-self.zmap2dview.olMap.getView().minZoom_,0),
                            maxResolution:self.zmap2dview.olMap.getView().constrainResolution(self.zmap2dview.olMap.getView().getMaxResolution(),minZoom-self.zmap2dview.olMap.getView().minZoom_,0)
                        }
                    )
                    self.zmap2dview.AddTileLayer(xyzLayer);
                    //self.zmap2dview.InsertLayer(0, wmtsLayer);
                    xyzLayer.SetVisible(flag);
                } else {
                    self.zmap2dview.RemoveTileLayer(xyzLayer);
                    xyzLayer = null;
                }
                return xyzLayer;
            }
            else if(maptype == "cad"){
                var tileLayer = new ZMap2D.TileLayer({
                    url: murl ,
                    //d.url + 'zs/data' + servName + '/tile/map',
                    name: name,
                    topGrid: [1, 1],
					projection: self.projection,
                    extent: ol.proj.get(self.projection).getExtent(),
                    minResolution:self.zmap2dview.olMap.getView().constrainResolution(self.zmap2dview.olMap.getView().getMaxResolution(),maxZoom-self.zmap2dview.olMap.getView().minZoom_,0),
                    maxResolution:self.zmap2dview.olMap.getView().constrainResolution(self.zmap2dview.olMap.getView().getMaxResolution(),minZoom-self.zmap2dview.olMap.getView().minZoom_,0)
                });
                self.zmap2dview.AddTileLayer(tileLayer);
                //self.zmap2dview.InsertLayer(0, tileLayer);
                tileLayer.SetVisible(flag);
                return tileLayer;
            }
             else {
                var tileLayer = new ZMap2D.TileLayer({
                    url: murl + '/tile/map',
                    //d.url + 'zs/data' + servName + '/tile/map',
                    name: name,
                    topGrid: [1, 1],
					projection: self.projection,
                    extent: ol.proj.get(self.projection).getExtent(),
                    minResolution:self.zmap2dview.olMap.getView().constrainResolution(self.zmap2dview.olMap.getView().getMaxResolution(),maxZoom-self.zmap2dview.olMap.getView().minZoom_,0),
                    maxResolution:self.zmap2dview.olMap.getView().constrainResolution(self.zmap2dview.olMap.getView().getMaxResolution(),minZoom-self.zmap2dview.olMap.getView().minZoom_,0)
                });
                self.zmap2dview.AddTileLayer(tileLayer);
                //self.zmap2dview.InsertLayer(0, tileLayer);
                tileLayer.SetVisible(flag);
                return tileLayer;
            }
        }
        /*移除所有数据图层 */
        this.clearMultiLayer = function() {
            for (keys in self.paramdata) {
                var key = keys.replace(self.mapcode, "");
                if (self.LA[key] != undefined)
                    self.clearLineArea(key);
                if (self.overlay[key] != undefined) {
                    for (var i = 0; i < self.overlay[key]; i++) {
                        self.zmap2dview.RemoveLabel(self.mapcode + key + i);
                    }
                    delete self.overlay[key];
                }
                self.zmap2dview.RemoveLayer(self.LayerName[key]);
				self.manager.removeLayer(self.mapDynamic[key]);
            }
            self.paramdata = {};
        }
        /*添加多个图层数据上图 */
        this.addMultiLayer = function(datas) {
            self.addlayer(datas);
        }

        /*添加单个图层数据上图 */
        this.addLayer = function(data) {
            self.addlayers(data);
        }
        this.removeLayer = function(name) {
            self.hideLayer(name);
        }
        /*添加图层数据上图 */
        this.addlayer = function(datas) {
            console.log(datas);
            //self.clearMultiLayer();
            for (var i = 0; i < datas.length; i++) {
                self.removeLayer(datas[i]['name']);
                if (datas[i].data == undefined) continue;
                var poin = [];
                self.paramdata[self.mapcode + datas[i]['name']] = datas[i];

                if(datas[i].data['geometryType'] == "MultiPoint"){
                    self.tooltipHtmlFun[datas[i].name] ={
                        clickFun:0,
                        hoverFun:0
                    }
                    if(datas[i].hoverFun)
                    {
                        if(typeof datas[i].hoverFun =='function')
                            self.tooltipHtmlFun[datas[i].name].hoverFun = datas[i].hoverFun;
                        else
                            self.tooltipHtmlFun[datas[i].name].hoverFun = self.pointHoverFun;
                    }
                    if(datas[i].clickFun)
                    {
                        if(typeof datas[i].clickFun =='function')
                            self.tooltipHtmlFun[datas[i].name].clickFun = datas[i].clickFun;
                        else
                            self.tooltipHtmlFun[datas[i].name].clickFun = self.pointClickFun;
                    }
                }


                if (datas[i].uptype == undefined) {

                }
                else if (datas[i].uptype == "矢量图层" && datas[i].data.maptype != undefined) {
                    self.zmap2dview.RemoveLayer(self.LayerName[datas[i]['name']]);
                    self.LayerName[datas[i]['name']] = self.addJWlayer(datas[i]['name'], datas[i].data['url'], true, datas[i].data.maptype);
                }
                else if (datas[i].data['geometryType'] == "MultiPoint" && datas[i].uptype == "图标法") {

                    var ul = datas[i].icon == undefined ? datas[i].data.imgurl: datas[i].icon;
                    var hz = ul.substring(ul.lastIndexOf("."));
                    var nosvg=true;
                    if (hz == ".gif") {
                        var xx = 0;
                        for (var x = 0; x < datas[i].data['features'].length; x++) {
                            var poi = datas[i].data['features'][x]['geometry']['coordinates'];
                            var htm = '<img src="' + ul + '">';
                            if (datas[i].data['features'][x]['geometry']['type'] == "MultiPoint") {
                                for (var p = 0; p < poi.length; p++) {
                                    self.zmap2dview.AddImageLabel(self.mapcode + datas[i]['name'] + xx, poi[p][0], poi[p][1], htm, "center-center");
                                    xx++;
                                }
                            } else {
                                self.zmap2dview.AddImageLabel(self.mapcode + datas[i]['name'] + xx, poi[0], poi[1], htm, "center-center");
                                xx++;
                            }
                        }
                        self.overlay[datas[i]['name']] = xx;
                    } else {
                        var attrs = [];
                        var types = [];
                        for (var x = 0; x < datas[i].data['features'].length; x++) {
                            if (datas[i].data['features'][x]['geometry']['type'] == "MultiPoint") {
                                for (var p = 0; p < datas[i].data['features'][x]['geometry']['coordinates'].length; p++) {
                                    poin.push(datas[i].data['features'][x]['geometry']['coordinates'][p]);
                                    var attr = datas[i].data['features'][x]['properties'];
                                    attr['ATTRNAME'] = datas[i]['name'];
                                    attrs.push(attr);
                                    var type = datas[i].data['features'][x]['properties'][datas[i].typefield]||[];
                                    types.push(type)
                                }
                            } else {
                                poin.push(datas[i].data['features'][x]['geometry']['coordinates']);
                                var attr = datas[i].data['features'][x]['properties'];
                                attr['ATTRNAME'] = datas[i]['name'];
                                attrs.push(attr);
                                var type = datas[i].data['features'][x]['properties'][datas[i].typefield]||[];
                                types.push(type)
                            }

                        }

                        var imgtype=ul;
                        if(imgtype.indexOf('.svg')>-1||imgtype.indexOf('MapServlet?method=outSvg&id=')>-1)
                        {
                            nosvg=false;
                            if(self.svg[imgtype]==undefined)
                            {
                                $.ajax({
                                    url:imgtype,
                                    dataType: 'xml',
                                    async: false,
                                    success:function(data){
                                        if(data==null||data==undefined){
                                            data=$('<svg xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200" width="100" height="100" version="1.1" ><svg xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200" width="200" height="200" version="1.1" ><circle cx="100" cy="100" r="100"  fill="red" /></svg></svg>')[0];
                                        }
                                        excuteSvg(data);
                                    }
                                })
                            }
                            else
                            {
                                excuteSvg(self.svg[imgtype]);
                            }

                            function excuteSvg(data)
                            {
                                self.svg[imgtype]=data;
                                $(data).children('svg').eq(0).attr('width',datas[i].width||10);
                                $(data).children('svg').eq(0).attr('height',datas[i].height||10);
                                //if(datas[i]['color']!=undefined)
                                //{
                                //    $(data).children('svg').eq(0).attr('fill',datas[i].fill||'red');
                                //    $(data).children('svg').eq(0).attr('stroke',datas[i].stroke||'red');
                               // }
                                $(data).children('svg').eq(0).attr('stroke-width',datas[i].lineWidth||'none');

                                setChild($(data).children('svg').eq(0));
                                function setChild(obj){
                                    if(obj.children()!=undefined&&obj.children().length!=0)
                                        {for(var ij=0;ij<obj.children().length;ij++){
                                            var c1=obj.children()[ij];
                                            if(c1.nodeName=="svg"){
                                                setChild($(c1));
                                            }
                                            else{
                                                if($(c1).parent('svg').attr('fun')!="1")
                                                {
                                                    if(datas[i].fill!=undefined)
                                                    {
                                                        $(c1).attr('fill',datas[i].fill||'red');
                                                    }
                                                    if(datas[i].stroke!=undefined)
                                                    {
                                                        $(c1).attr('stroke',datas[i].stroke||'red');
                                                    }
                                                    $(c1).attr('stroke-width',datas[i].lineWidth||'none');
                                                    $(c1).attr('stroke-dasharray',datas[i].lineDash||'none');
                                                }
                                                else{
                                                }
                                            }
                                        }
                                    }
                                }



                                if (datas[i].polymerized == "是"||datas[i].polymerized ==true) {
                                    //self.addAnimatedPoint('data:image/svg+xml;base64,'+Base64.encode((new XMLSerializer()).serializeToString(data)), datas[i]['name'], poin, [], attrs,datas[i].showNum)
                                    var data1={
                                            name: datas[i]['name'],
                                            points: poin,
                                            texts: [],
                                            url: 'data:image/svg+xml;base64,'+Base64.encode((new XMLSerializer()).serializeToString(data)),
                                            attrs: attrs,
                                            types:types,
                                            showNum:datas[i].showNum||false,
                                            width:datas[i].width,
                                            height:datas[i].height,
                                            zoomlist:datas[i].zoomlist||[],
                                            styleFunction:datas[i].styleFunction,
                                            distance:datas[i].distance
                                    }
                                    self.addAnimatedPoint(data1);

                                } else {
                                    var data1 = datas[i];
                                    data1['name'] = datas[i]['name'];
                                    data1['imageStyle'] = 'data:image/svg+xml;base64,'+Base64.encode((new XMLSerializer()).serializeToString(data));
                                    data1['texts'] = [];
                                    data1['icons'] = [];
                                    data1['points'] = poin;
                                    data1['showGeometry'] = true;
                                    data1['attrs'] = attrs;
                                    self.addPoint(data1);
                                }
                            }
                            continue;
                        }

                        if (datas[i].polymerized == "是"||datas[i].polymerized ==true)
                        {
                            var data1={
                                            name: datas[i]['name'],
                                            points: poin,
                                            texts: [],
                                            url: ul,
                                            attrs: attrs,
                                            types:types,
                                            showNum:datas[i].showNum||false,
                                            width:datas[i].width,
                                            height:datas[i].height,
                                            zoomlist:datas[i].zoomlist||[],
                                            styleFunction:datas[i].styleFunction,
                                            distance:datas[i].distance
                                    }
                                    self.addAnimatedPoint(data1);
                           // self.addAnimatedPoint(ul, datas[i]['name'], poin, [], attrs, datas[i].showNum)
                        }
                        else
                        {
                            var data = datas[i];
                            data['name'] = datas[i]['name'];
                            data['imageStyle'] = ul;
                            data['texts'] = [];
                            data['icons'] = [];
                            data['points'] = poin;
                            data['showGeometry'] = true;
                            data['attrs'] = attrs;
                            if(nosvg)
                            self.addPoint(data);

                        }
                    }
                }
                else if (datas[i].data['geometryType'] == "MultiPoint" && datas[i].uptype == "热力图") {
                    var points = [];
                    var attrs = [];
                    var weights = [];
                    for (var x = 0; x < datas[i].data['features'].length; x++) {
                        var attr = datas[i].data['features'][x]['properties'];
                        attr['ATTRNAME'] = datas[i]['name'];
                        var weight =  datas[i].data['features'][x]['properties'][datas[i].hotlayer_weight_properties]||datas[i].hotlayer_weight_default||0.5;
                        weight =isNaN(parseFloat(weight))?0.3:parseFloat(weight);
                        if (datas[i].data['features'][x]['geometry']['type'] == "MultiPoint"||Array.isArray(datas[i].data['features'][x]['geometry']['coordinates'][0])) {
                            for (var p = 0; p < datas[i].data['features'][x]['geometry']['coordinates'].length; p++) {
                                points.push(datas[i].data['features'][x]['geometry']['coordinates'][p]);
                                attrs.push(attr);
                                weights.push(weight);
                            }
                        }
                        else{
                            points.push(datas[i].data['features'][x]['geometry']['coordinates']);
                            attrs.push(attr);
                            weights.push(weight);
                        }
                    }
                    var data = datas[i];
                    data['points']=points;
                    data['attrs'] = attrs;
                    data['weights'] = weights
                    self.addHotLayer(datas[i]['name'], data)
                }
                else if (datas[i].data['geometryType'] == "MultiPoint" && datas[i].uptype == "气泡图") {


                    var sizes=[];
                    var points =[];
                    var texts =[];
                    var attrs = [];
                    var icons = [];
                    var sizevalue = [];
                    var colors=(self.getDatasource()[datas[i].colorMapID]||{color:[]}).color||[];
                    for (var x = 0; x < datas[i].data['features'].length; x++)
                    {
                        var text = datas[i].data['features'][x]['properties'][datas[i].effectScatter_text_properties]||datas[i].effectScatter_text_default||'';
                        var attr = datas[i].data['features'][x]['properties'];
                        attr['ATTRNAME'] = datas[i]['name'];
                        var color = datas[i].effectScatter_color_default||'rgba(255,255,0,1)';
                        if(datas[i].effectScatter_color_properties==''&&datas[i].colorMap_properties!=''&&datas[i].data['features'][x]['properties'][datas[i].colorMap_properties] != undefined)
                        {
                            var lcolor = datas[i].data['features'][x]['properties'][datas[i].colorMap_properties];
                            for(var s=0;s<colors.length;s++)
                            {
                                if(lcolor>=colors[s].min&&lcolor<=colors[s].max)
                                {
                                    var co = colors[s].color;
                                    var tm = 1;
                                    if (co.indexOf("rgb(") > -1)
                                        color = co.replace(")", "," + tm + ")").replace("rgb(", "rgba(")
                                    else
                                        color = co;
                                    break;
                                }
                            }
                        }
                        else if(datas[i].effectScatter_color_properties!=''&&datas[i].data['features'][x]['properties'][datas[i].effectScatter_color_properties] != undefined)
                        {
                            color=datas[i].data['features'][x]['properties'][datas[i].effectScatter_color_properties];
                        }

                        var size = 1;
                        if(datas[i].effectScatter_size_properties!=''&&!isNaN(datas[i].effectScatter_size_default))
                        {
                            size = datas[i].data['features'][x]['properties'][datas[i].effectScatter_size_properties]||datas[i].effectScatter_size_default||1;
                        }
                        else if(datas[i].effectScatter_sizevalue_properties!=''&&Array.isArray(datas[i].effectScatter_sizevalue_extent))
                        {
                            size = datas[i].effectScatter_sizevalue_extent[0];
                            size = datas[i].data['features'][x]['properties'][datas[i].effectScatter_sizevalue_properties]||size;
                        }
                        else
                        {
                           size= datas[i].effectScatter_size_default||datas[i].effectScatter_sizevalue_extent[0]||1;
                        }

                        if (datas[i].data['features'][x]['geometry']['type'] == "MultiPoint"||Array.isArray(datas[i].data['features'][x]['geometry']['coordinates'][0])) {
                            for (var p = 0; p < datas[i].data['features'][x]['geometry']['coordinates'].length; p++) {
                                points.push(datas[i].data['features'][x]['geometry']['coordinates'][p]);
                                texts.push(text);
                                attrs.push(attr);
                                icons.push(color);
                                sizes.push(size);
                                sizevalue.push(size)
                            }
                        }
                        else{
                            points.push(datas[i].data['features'][x]['geometry']['coordinates']);
                            texts.push(text);
                            attrs.push(attr);
                            icons.push(color);
                            sizes.push(size);
                            sizevalue.push(size)
                        }

                    }
                    if(datas[i].effectScatter_size_properties==''&&datas[i].effectScatter_sizevalue_properties!=''&&Array.isArray(datas[i].effectScatter_sizevalue_extent))
                    {
                        var sizevalue = sizevalue.sort((function(a,b){return a-b}));
                        var sl =  sizevalue[sizevalue.length-1]-sizevalue[0];
                        var se = datas[i].effectScatter_sizevalue_extent[1]-datas[i].effectScatter_sizevalue_extent[0];
                        for (var y = 0; y <sizes.length; y++) {
                            sizes[y]= datas[i].effectScatter_sizevalue_extent[0]+ (sizes[y]-sizevalue[0])*se/sl;
                        }
                    }

                    var effectScatterData = datas[i];
                    effectScatterData['points'] = points;
                    effectScatterData['texts'] = texts;
                    effectScatterData['attrs'] = attrs;
                    effectScatterData['sizes'] = sizes;
                    effectScatterData['icons'] = icons;
                    effectScatterData['colors'] = icons;
                    effectScatterData['styleFunction'] =effectScatterData['styleFunction']|| function(feature) {
                            var style = new ol.style.Style({
                              image: new ol.style.Circle({
                                radius: parseFloat(feature.get('size'), 10),
                                stroke: new ol.style.Stroke({
                                  color: '#3399CC'
                                }),
                                fill: new ol.style.Fill({
                                  color: '#3399CC'
                                })
                              }),
                              text: new ol.style.Text({
                                text: feature.get('text'),
                                fill: new ol.style.Fill({
                                  color: '#fff'
                                })
                              })
                            });
                            return style;
                        }


                    self.addPoint(effectScatterData)
                }

                else if (datas[i].data['geometryType'] == "MultiPoint" && datas[i].uptype == "数值法") {

                    var labelText = [];
                    var attrs = [];
                    var icons = [];
                    var color = self.getColorDatasource()[datas[i].colorname] || {};
                    if (color['color'] == undefined) color['color'] = [];
                    for (var x = 0; x < datas[i].data['features'].length; x++) {
                        var ltext = datas[i].data['features'][x]['properties'][datas[i].valuefield] == undefined ? '0': datas[i].data['features'][x]['properties'][datas[i].valuefield];

                        var fill = datas[i].pointColor ? datas[i].pointColor: 'rgba(255, 0, 0, 1)';
                        var num = parseFloat(ltext);
                        if (!isNaN(num)) {
                            for (var xi = 0; xi < color.color.length; xi++) {
                                if (num >= color.color[xi].min && num <= color.color[xi].max) {
                                    var co = color.color[xi].color;
                                    var tm = 1;
                                    if (co.indexOf("rgb(") > -1) fill = co.replace(")", "," + tm + ")").replace("rgb(", "rgba(")
                                    else fill = co;
                                    break;
                                }
                            }
                        }

                        if (datas[i].data['features'][x]['geometry']['type'] == "MultiPoint") {
                            for (var p = 0; p < datas[i].data['features'][x]['geometry']['coordinates'].length; p++) {
                                labelText.push(ltext + "");
                                icons.push(fill);
                                poin.push(datas[i].data['features'][x]['geometry']['coordinates'][p]);
                                var attr = datas[i].data['features'][x]['properties'];
                                attr['ATTRNAME'] = datas[i]['name'];
                                attrs.push(attr);
                            }
                        } else {
                            labelText.push(ltext + "");
                            icons.push(fill);
                            poin.push(datas[i].data['features'][x]['geometry']['coordinates']);
                            var attr = datas[i].data['features'][x]['properties'];
                            attr['ATTRNAME'] = datas[i]['name'];
                            attrs.push(attr);
                        }

                    }
                    var iShowp = true;
                    var iStyle = undefined;
                    var nosvg=true;
                    if (datas[i].pointstyle == "1") {
                        iShowp = true;
                    } else if (datas[i].pointstyle == "2" && (datas[i].data.imgurl != undefined||datas[i].imgurl != undefined)) {
                        var imgtype=datas[i].imgurl == undefined ? datas[i].data.imgurl: datas[i].imgurl;
                    if(imgtype.indexOf('.svg')>-1||imgtype.indexOf('MapServlet?method=outSvg&id=')>-1){
                        nosvg=false;
                        if(self.svg[imgtype]==undefined){
                            $.ajax({
                                url:imgtype,
                                dataType: 'xml',
                                async: false,
                                success:function(data){
                                    if(data==null||data==undefined){
                                            data=$('<svg xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200" width="100" height="100" version="1.1" ><svg xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200" width="200" height="200" version="1.1" ><circle cx="100" cy="100" r="100"  fill="red" /></svg></svg>')[0];
                                        }
                                    excuteSvg(data);
                                }
                            })
                        }
                        else{
                            excuteSvg(self.svg[imgtype]);
                        }

                        function excuteSvg(svg){
                            self.svg[imgtype]=svg;
                            var svgicon=[];
                            for(var c=0;c<icons.length;c++){
                                $(svg).children('svg').eq(0).attr('width',10);
                                $(svg).children('svg').eq(0).attr('height',10);
                                if(color['color'].length!=0)
                                {
                                    // $(svg).children('svg').eq(0).attr('fill',icons[c]||'red');
                                    // $(svg).children('svg').eq(0).attr('stroke',datas[i].stroke||icons[c]||'red');
                                }
                                $(svg).children('svg').eq(0).attr('stroke-width',datas[i].lineWidth||'none');
                                setChild($(svg).children('svg').eq(0));
                                function setChild(obj){
                                    if(obj.children()!=undefined&&obj.children().length!=0)
                                        {for(var ij=0;ij<obj.children().length;ij++){
                                            var c1=obj.children()[ij];
                                            if(c1.nodeName=="svg"){
                                                setChild($(c1));
                                            }
                                            else{
                                                if($(c1).parent('svg').attr('fun')!="1")
                                                {
                                                    if(color['color'].length!=0)
                                                    {
                                                        $(c1).attr('fill',icons[c]||'red');
                                                        $(c1).attr('stroke',datas[i].stroke||icons[c]||'red');
                                                    }
                                                    $(c1).attr('stroke-width',datas[i].lineWidth||'none');
                                                    $(c1).attr('stroke-dasharray',datas[i].lineDash||'none');
                                                }
                                                else{
                                                }
                                                $(c1).css('transform','rotate('+datas[i].angle+'deg)');
                                                $(c1).css('transform-origin','center');
                                            }
                                        }
                                    }
                                }


                                svgicon.push('data:image/svg+xml;base64,'+Base64.encode((new XMLSerializer()).serializeToString(svg)));
                            }
                            var data = datas[i];
                            data['name'] = datas[i]['name'];
                            data['imageStyle'] = iStyle;
                            data['texts'] = labelText;
                            if(data['showtext']==false)
                                data['texts']=[];
                            data['icons'] = svgicon;
                            data['colors'] = icons;
                            data['points'] = poin;
                            data['showGeometry'] = false;
                            data['attrs'] = attrs;
                            self.addPoint(data);




                        }
                        continue;
                    }
                    else{
                        iStyle =  datas[i].imgurl == undefined ? datas[i].data.imgurl: datas[i].imgurl ;

                    }
                    } else if (datas[i].pointstyle == "3") {
                        iShowp = true;
                    }
                    //self.addPoint(iStyle,datas[i]['name'],labelText,poin,[],iShowp,attrs,datas[i]['textcolor'],datas[i]['pointcolor']);
                    var data = datas[i];
                    data['name'] = datas[i]['name'];
                    data['imageStyle'] = iStyle;
                    data['texts'] = labelText;
					if(data['showtext']==false)
						data['texts']=[];
                    data['icons'] = icons;
                    data['colors'] = icons;
                    data['points'] = poin;
                    data['showGeometry'] = iShowp;
                    data['attrs'] = attrs;
                    if(nosvg)
                    self.addPoint(data);

                }

                else if(datas[i].data['geometryType'] == "MultiPoint" && datas[i].uptype == "散点图"){
                    var poins=[];
                    var sizes=[];
                    var symbolsizes=[];
                    var icons=[];
                    var symbolicons=[];
                    var symbolcolors=[];
                    var attrs=[];
                    var rotations=[];
                    var texts=[];
                    var symbols=(self.getDatasource()[datas[i].symbolMapID]||{symbol:[]}).symbol||[];
                    var colors=(self.getDatasource()[datas[i].colorMapID]||{color:[]}).color||[];
                    for (var x = 0; x < datas[i].data['features'].length; x++)
                    {
                        var icon=datas[i].Symbol_ID_default||'';
                        var size=[datas[i].symbol_width_default,datas[i].symbol_height_default];
                        var color=datas[i].symbol_color_default||'rgb(255,0,0)';
                        if(datas[i].symbol_ID_properties==''&&datas[i].symbolMap_properties!=''&&datas[i].data['features'][x]['properties'][datas[i].symbolMap_properties] != undefined)
                        {
                            var ltext = datas[i].data['features'][x]['properties'][datas[i].symbolMap_properties];
                            for(var s=0;s<symbols.length;s++)
                            {
                                if(ltext>=symbols[s].min&&ltext<=symbols[s].max)
                                {
                                   icon=symbols[s].url||datas[i].Symbol_ID_default;
                                   size=[symbols[s].width,symbols[s].height];
                                   break;
                                }
                            }
                        }
                        else if(datas[i].symbol_ID_properties!=''&&datas[i].data['features'][x]['properties'][datas[i].symbol_ID_properties] != undefined)
                        {
                            icon=datas[i].data['features'][x]['properties'][datas[i].symbol_ID_properties];
                        }
                        var symbolUrl=datas[i].symbolURL+ "&id=";
                        icon=icon+'';
                        if(icon.indexOf('.')>-1||icon.indexOf('MapServlet?method=outSvg&id=')>-1)
                        {
                            symbolUrl='';
                        }
                        symbolicons.push(symbolUrl+icon);

                        if(datas[i].data['features'][x]['properties'][datas[i].symbol_width_properties] != undefined&&!isNaN(parseInt(datas[i].data['features'][x]['properties'][datas[i].symbol_width_properties])))
                        {
                            size[0]=parseInt(datas[i].data['features'][x]['properties'][datas[i].symbol_width_properties]);
                        }
                        if(datas[i].data['features'][x]['properties'][datas[i].symbol_height_properties] != undefined&&!isNaN(parseInt(datas[i].data['features'][x]['properties'][datas[i].symbol_height_properties])))
                        {
                            size[1]=parseInt(datas[i].data['features'][x]['properties'][datas[i].symbol_height_properties]);
                        }
                        symbolsizes.push(size);


                        if(datas[i].symbol_color_properties==''&&datas[i].colorMap_properties!=''&&datas[i].data['features'][x]['properties'][datas[i].colorMap_properties] != undefined)
                        {
                            var lcolor = datas[i].data['features'][x]['properties'][datas[i].colorMap_properties];
                            for(var s=0;s<colors.length;s++)
                            {
                                if(lcolor>=colors[s].min&&lcolor<=colors[s].max)
                                {
                                    var co = colors[s].color;
                                    var tm = 1;
                                    if (co.indexOf("rgb(") > -1)
                                        color = co.replace(")", "," + tm + ")").replace("rgb(", "rgba(")
                                    else
                                        color = co;
                                    break;
                                }
                            }
                        }
                        else if(datas[i].symbol_color_properties!=''&&datas[i].data['features'][x]['properties'][datas[i].symbol_color_properties] != undefined)
                        {
                            color=datas[i].data['features'][x]['properties'][datas[i].symbol_color_properties];
                        }
                        symbolcolors.push(color);
                    }

                    for(var s=0;s<symbolicons.length;s++)
                    {
                        var imgtype=symbolicons[s];
                        var w=10;//symbolsizes[s][0];
                        var h=10;//symbolsizes[s][1];
                        var fillcolor=symbolcolors[s];
                        if(imgtype.indexOf('.svg')>-1||imgtype.indexOf('MapServlet?method=outSvg&id=')>-1)
                        {
                            if(self.svg[imgtype]==undefined){
                                $.ajax({
                                    url:imgtype,
                                    dataType: 'xml',
                                    async: false,
                                    success:function(data){
                                        if(data==null||data==undefined){
                                            data=$('<svg xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200" width="100" height="100" version="1.1" ><svg xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200" width="200" height="200" version="1.1" ><circle cx="100" cy="100" r="100"  fill="red" /></svg></svg>')[0];
                                        }
                                        self.svg[imgtype]=data;
                                        excuteSvg(data)
                                    }
                                })
                            }
                            else{
                                var data=self.svg[imgtype];
                                excuteSvg(data)
                            }

                            function excuteSvg(data){
                                $(data).children('svg').eq(0).attr('width',w);
                                $(data).children('svg').eq(0).attr('height',h);
                                setChild($(data).children('svg').eq(0))
                                function setChild(obj){
                                    if(obj.children()!=undefined&&obj.children().length!=0)
                                    {
                                        for(var is=0;is<obj.children().length;is++)
                                        {
                                            var c1=obj.children()[is];
                                            if(c1.nodeName=="svg"){
                                                setChild($(c1));
                                            }
                                            else{
                                                if($(c1).parent('svg').attr('fun')!="1")
                                                {
                                                    var xx=$(c1).attr('fill');
                                                    if(datas[i].isSelfColor){

                                                    }
                                                    else{
                                                        $(c1).attr('fill',fillcolor||xx||'red');
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                symbolicons[s]='data:image/svg+xml;base64,'+Base64.encode((new XMLSerializer()).serializeToString(data));
                            }
                        }
                    }
                    var tcolors = [];
                    for (var x = 0; x < datas[i].data['features'].length; x++) {
                        //var geoms = new ZMap2D.Point(datas[i][i].data['features'][x]['geometry']['coordinates']);
                        //if (datas[i].data['features'][x]['properties'][datas[i].symbolMap_properties] == undefined && datas[i].data['features'][x]['properties'][datas[i].symbol_ID_properties] == undefined) continue;
                        var dire=isNaN(parseInt(datas[i].data['features'][x]['properties'][datas[i].symbol_direction_properties]))?datas[i].symbol_direction_default:parseInt(datas[i].data['features'][x]['properties'][datas[i].symbol_direction_properties]);
                        var dire=dire||0;
                        var imgurl=symbolicons[x];
                        var size=symbolsizes[x];
                        var tcolor = symbolcolors[x];
                        if(imgurl=='')
                            continue;

                        var text=datas[i].data['features'][x]['properties'][datas[i].text_properties]||datas[i].text_default||'';
                        if (datas[i].data['features'][x]['geometry']['type'] == "MultiPoint") {
                            for (var p = 0; p < datas[i].data['features'][x]['geometry']['coordinates'].length; p++) {
                                texts.push(text);
                                icons.push(imgurl);
                                tcolors.push(tcolor);
                                rotations.push(dire);
                                sizes.push(size);
                                poins.push(datas[i].data['features'][x]['geometry']['coordinates'][p]);
                                var attr = datas[i].data['features'][x]['properties'];
                                attr['ATTRNAME'] = datas[i]['name'];
                                attrs.push(attr);
                            }
                        } else {
                            texts.push(text);
                            icons.push(imgurl);
                            tcolors.push(tcolor);
                            rotations.push(dire);
                            sizes.push(size);
                            poins.push(datas[i].data['features'][x]['geometry']['coordinates']);
                            var attr = datas[i].data['features'][x]['properties'];
                            attr['ATTRNAME'] = datas[i]['name'];
                            attrs.push(attr);
                        }
                    }
                    var data=datas[i];
                    data['points']=poins;
                    data['texts']=texts;
                    data['icons']=icons;
                    data['colors'] = tcolors;
                    data['attrs']=attrs;
                    data['rotations']=rotations;
                    data['sizes']=sizes;
                    data['showGeometry']=false;
                    self.addPoint(data);
                }


                else if (datas[i].data['geometryType'] == "MultiPoint" && datas[i].uptype == "等值线") {

                    self.addLine(datas[i]['name'], datas[i], 'line',datas[i]['showLabel'])
                }
                else if (datas[i].data['geometryType'] == "MultiPoint" && datas[i].uptype == "等值面") {

                    self.addLine(datas[i]['name'], datas[i], 'gridline',datas[i]['showLabel'])
                }
                else if ((datas[i].data['geometryType'] == "Polygon" || datas[i].data['geometryType'] == "MultiPolygon") && datas[i].uptype == "默认区") {

                    self.addRegionalLayer(datas[i]['name'], datas[i], 1)
                }
                else if ((datas[i].data['geometryType'] == "Polygon" || datas[i].data['geometryType'] == "MultiPolygon") && datas[i].uptype == "色斑图") {

                    self.addRegionalLayer(datas[i]['name'], datas[i], 0)
                }
                else if ((datas[i].data['geometryType'] == "LineString" || datas[i].data['geometryType'] == "MultiLineString") && datas[i].uptype == "路线漫游") {

                    self.addMultiRoam(datas[i])
                }
                else if ((datas[i].data['geometryType'] == "LineString" || datas[i].data['geometryType'] == "MultiLineString") && datas[i].uptype == "线路图") {

                    self.addMultiLine(datas[i],1)
                }
                else if ((datas[i].data['geometryType'] == "LineString" || datas[i].data['geometryType'] == "MultiLineString") && datas[i].uptype == "线") {

                    self.addMultiLine(datas[i],0)
                }
                else if ((datas[i].data['geometryType'] == "LineString" || datas[i].data['geometryType'] == "MultiLineString") && datas[i].uptype == "迁徙图") {

                    self.addMultiLine(datas[i],2)
                }

            }

            if (self.toolSettingData.layercontrol) self.getLayerClick();
        }
        /*添加单个图层数据上图 */
        this.addlayers = function(datas) {
            self.removeLayer(datas['name']);
            var poin = [];
            self.paramdata[self.mapcode + datas['name']] = datas;

            if(datas.data['geometryType'] == "MultiPoint"){
                self.tooltipHtmlFun[datas.name] ={
                    clickFun:0,
                    hoverFun:0
                }
                if(datas.hoverFun)
                {
                    if(typeof datas.hoverFun =='function')
                        self.tooltipHtmlFun[datas.name].hoverFun = datas.hoverFun;
                    else
                        self.tooltipHtmlFun[datas.name].hoverFun = self.pointHoverFun;
                }
                if(datas.clickFun)
                {
                    if(typeof datas.clickFun =='function')
                        self.tooltipHtmlFun[datas.name].clickFun = datas.clickFun;
                    else
                        self.tooltipHtmlFun[datas.name].clickFun = self.pointClickFun;
                }
            }

            if (datas.uptype == undefined) {

            }
            else if (datas.uptype == "矢量图层" && datas.data.maptype != undefined) {
                self.zmap2dview.RemoveLayer(self.LayerName[datas['name']]);
                self.LayerName[datas['name']] = self.addJWlayer(datas['name'], datas.data['url'], true, datas.data.maptype);
            }
            else if (datas.data['geometryType'] == "MultiPoint" && datas.uptype == "图标法") {

                var ul = datas.icon == undefined ? datas.data.imgurl: datas.icon;
                var hz = ul.substring(ul.lastIndexOf("."));
                var nosvg=true;
                if (hz == ".gif") {
                    var xx = 0;
                    for (var x = 0; x < datas.data['features'].length; x++) {
                        var poi = datas.data['features'][x]['geometry']['coordinates'];
                        var htm = '<img src="' + ul + '">';
                        if (datas.data['features'][x]['geometry']['type'] == "MultiPoint") {
                            for (var p = 0; p < poi.length; p++) {
                                self.zmap2dview.AddImageLabel(self.mapcode + datas['name'] + xx, poi[p][0], poi[p][1], htm, "center-center");
                                xx++
                            }
                        } else {
                            self.zmap2dview.AddImageLabel(self.mapcode + datas['name'] + xx, poi[0], poi[1], htm, "center-center");
                            xx++
                        }

                    }
                    self.overlay[datas['name']] = xx;
                }
                else {
                    var attrs = [];
                    var types = [];
                    for (var x = 0; x < datas.data['features'].length; x++) {
                        if (datas.data['features'][x]['geometry']['type'] == "MultiPoint") {
                            for (var p = 0; p < datas.data['features'][x]['geometry']['coordinates'].length; p++) {
                                poin.push(datas.data['features'][x]['geometry']['coordinates'][p]);
                                var attr = datas.data['features'][x]['properties'];
                                attr['ATTRNAME'] = datas['name'];
                                attrs.push(attr);
                                var type = datas.data['features'][x]['properties'][datas.typefield]||[];
                                types.push(type)
                            }
                        } else {
                            poin.push(datas.data['features'][x]['geometry']['coordinates']);
                            var attr = datas.data['features'][x]['properties'];
                            attr['ATTRNAME'] = datas['name'];
                            attrs.push(attr);
                            var type = datas.data['features'][x]['properties'][datas.typefield]||[];
                                types.push(type)
                        }

                    }

                        //self.addPoint(self.getStyle(datas),datas['name'],[],poin,[],true,attrs);
                        var imgtype=ul;
                        if(imgtype.indexOf('.svg')>-1||imgtype.indexOf('MapServlet?method=outSvg&id=')>-1){
                        nosvg=false;
                        if(self.svg[imgtype]==undefined){
                            $.ajax({
                                url:imgtype,
                                dataType: 'xml',
                                async: false,
                                success:function(data){
                                    if(data==null||data==undefined){
                                            data=$('<svg xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200" width="100" height="100" version="1.1" ><svg xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200" width="200" height="200" version="1.1" ><circle cx="100" cy="100" r="100"  fill="red" /></svg></svg>')[0];
                                        }
                                    excuteSvg(data);
                                }
                            })
                        }
                        else{
                            excuteSvg(self.svg[imgtype]);
                        }

                        function excuteSvg(data){
                            self.svg[imgtype]=data;
                            $(data).children('svg').eq(0).attr('width',datas.width||10);
                            $(data).children('svg').eq(0).attr('height',datas.height||10);
                            // if(datas['color']!=undefined)
                            // {
                            //     $(data).children('svg').eq(0).attr('fill',datas.fill||'red');
                            //     $(data).children('svg').eq(0).attr('stroke',datas.stroke||icons[c]||'red');
                            // }
                            $(data).children('svg').eq(0).attr('stroke-width',datas.lineWidth||'none');

                            setChild($(data).children('svg').eq(0));
                                function setChild(obj){
                                    if(obj.children()!=undefined&&obj.children().length!=0)
                                        {for(var ij=0;ij<obj.children().length;ij++){
                                            var c1=obj.children()[ij];
                                            if(c1.nodeName=="svg"){
                                                setChild($(c1));
                                            }
                                            else{
                                                if($(c1).parent('svg').attr('fun')!="1")
                                                {
                                                    if(datas.fill!=undefined)
                                                    {
                                                        $(c1).attr('fill',datas.fill||'red');
                                                    }
                                                    if(datas.stroke!=undefined)
                                                    {
                                                        $(c1).attr('stroke',datas.stroke||'red');
                                                    }
                                                    $(c1).attr('stroke-width',datas.lineWidth||'none');
                                                    $(c1).attr('stroke-dasharray',datas.lineDash||'none');
                                                }
                                                else{
                                                }
                                            }
                                        }
                                    }
                                }



                            if (datas.polymerized == "是"||datas.polymerized == true) {
                                var data1={
                                            name: datas['name'],
                                            points: poin,
                                            texts: [],
                                            url: 'data:image/svg+xml;base64,'+Base64.encode((new XMLSerializer()).serializeToString(data)),
                                            attrs: attrs,
                                            types:types,
                                            showNum:datas.showNum||false,
                                            width:datas.width,
                                            height:datas.height,
                                            zoomlist:datas.zoomlist||[],
                                            styleFunction:datas.styleFunction,
                                            distance:datas.distance
                                    }
                                    self.addAnimatedPoint(data1);
                                //self.addAnimatedPoint('data:image/svg+xml;base64,'+Base64.encode((new XMLSerializer()).serializeToString(data)), datas['name'], poin, [], attrs, datas.showNum)
                            }
                            else {
                                var data1 = datas;
                                data1['name'] = datas['name'];
                                data1['imageStyle'] = 'data:image/svg+xml;base64,'+Base64.encode((new XMLSerializer()).serializeToString(data));
                                data1['texts'] = [];
                                data1['icons'] = [];
                                data1['points'] = poin;
                                data1['showGeometry'] = true;
                                data1['attrs'] = attrs;
                                self.addPoint(data1);
                            }
                        }
                        return;
                    }
                    if (datas.polymerized == "是"||datas.polymerized == true) {
                        var data1={
                                            name: datas['name'],
                                            points: poin,
                                            texts: [],
                                            url: ul,
                                            attrs: attrs,
                                            types:types,
                                            showNum:datas.showNum||false,
                                            width:datas.width,
                                            height:datas.height,
                                            zoomlist:datas.zoomlist||[],
                                            styleFunction:datas.styleFunction,
                                            distance:datas.distance
                                    }
                                    self.addAnimatedPoint(data1);
                        //self.addAnimatedPoint(ul, datas['name'], poin, [], attrs, datas.showNum)
                    }
                    else {

                        var data = datas;
                        data['name'] = datas['name'];
                        data['imageStyle'] = ul;
                        data['texts'] = [];
                        data['icons'] = [];
                        data['points'] = poin;
                        data['showGeometry'] = true;
                        data['attrs'] = attrs;
                        if(nosvg)
                        self.addPoint(data);
                    }
                }
            }
            else if (datas.data['geometryType'] == "MultiPoint" && datas.uptype == "热力图") {
                var points = [];
                var attrs = [];
                var weights = [];
                for (var x = 0; x < datas.data['features'].length; x++) {
                    var attr = datas.data['features'][x]['properties'];
                    attr['ATTRNAME'] = datas['name'];
                    var weight =  datas.data['features'][x]['properties'][datas.hotlayer_weight_properties]||datas.hotlayer_weight_default||0.5;
                    weight =isNaN(parseFloat(weight))?0.3:parseFloat(weight);
                    if (datas.data['features'][x]['geometry']['type'] == "MultiPoint"||Array.isArray(datas.data['features'][x]['geometry']['coordinates'][0])) {
                        for (var p = 0; p < datas.data['features'][x]['geometry']['coordinates'].length; p++) {
                            points.push(datas.data['features'][x]['geometry']['coordinates'][p]);
                            attrs.push(attr);
                            weights.push(weight);
                        }
                    }
                    else{
                        points.push(datas.data['features'][x]['geometry']['coordinates']);
                        attrs.push(attr);
                        weights.push(weight);
                    }
                }
                var data = datas;
                data['points']=points;
                data['attrs'] = attrs;
                data['weights'] = weights
                self.addHotLayer(datas['name'], data);
            }
            else if (datas.data['geometryType'] == "MultiPoint" && datas.uptype == "气泡图") {


                var sizes=[];
                var points =[];
                var texts =[];
                var attrs = [];
                var icons = [];
                var sizevalue = [];
                var colors=(self.getDatasource()[datas.colorMapID]||{color:[]}).color||[];
                for (var x = 0; x < datas.data['features'].length; x++)
                {
                    var text = datas.data['features'][x]['properties'][datas.effectScatter_text_properties]||datas.effectScatter_text_default||'';
                    var attr = datas.data['features'][x]['properties'];
                    attr['ATTRNAME'] = datas['name'];
                    var color = datas.effectScatter_color_default||'rgba(255,255,0,1)';
                    if(datas.effectScatter_color_properties==''&&datas.colorMap_properties!=''&&datas.data['features'][x]['properties'][datas.colorMap_properties] != undefined)
                    {
                        var lcolor = datas.data['features'][x]['properties'][datas.colorMap_properties];
                        for(var s=0;s<colors.length;s++)
                        {
                            if(lcolor>=colors[s].min&&lcolor<=colors[s].max)
                            {
                                var co = colors[s].color;
                                var tm = 1;
                                if (co.indexOf("rgb(") > -1)
                                    color = co.replace(")", "," + tm + ")").replace("rgb(", "rgba(")
                                else
                                    color = co;
                                break;
                            }
                        }
                    }
                    else if(datas.effectScatter_color_properties!=''&&datas.data['features'][x]['properties'][datas.effectScatter_color_properties] != undefined)
                    {
                        color=datas.data['features'][x]['properties'][datas.effectScatter_color_properties];
                    }
                    var size = 1;
                    if(datas.effectScatter_size_properties!=''&&!isNaN(datas.effectScatter_size_default))
                    {
                        size = datas.data['features'][x]['properties'][datas.effectScatter_size_properties]||datas.effectScatter_size_default||1;
                    }
                    else if(datas.effectScatter_sizevalue_properties!=''&&Array.isArray(datas.effectScatter_sizevalue_extent))
                    {
                        size = datas.effectScatter_sizevalue_extent[0];
                        size = datas.data['features'][x]['properties'][datas.effectScatter_sizevalue_properties]||size;
                    }
                    else
                    {
                       size= datas.effectScatter_size_default||datas.effectScatter_sizevalue_extent[0]||1;
                    }
                    if (datas.data['features'][x]['geometry']['type'] == "MultiPoint"||Array.isArray(datas.data['features'][x]['geometry']['coordinates'][0])) {
                        for (var p = 0; p < datas.data['features'][x]['geometry']['coordinates'].length; p++) {
                            points.push(datas.data['features'][x]['geometry']['coordinates'][p]);
                            texts.push(text+'');
                            attrs.push(attr);
                            icons.push(color);
                            sizes.push(size);
                            sizevalue.push(size);
                        }
                    }
                    else{
                        points.push(datas.data['features'][x]['geometry']['coordinates']);
                        texts.push(text+'');
                        attrs.push(attr);
                        icons.push(color);
                        sizes.push(size);
                        sizevalue.push(size);
                    }

                }
                if(datas.effectScatter_size_properties==''&&datas.effectScatter_sizevalue_properties!=''&&Array.isArray(datas.effectScatter_sizevalue_extent))
                {
                    var sizevalue = sizevalue.sort((function(a,b){return a-b}));
                    var sl =  sizevalue[sizevalue.length-1]-sizevalue[0];
                    var se = datas.effectScatter_sizevalue_extent[1]-datas.effectScatter_sizevalue_extent[0];
                    for (var y = 0; y <sizes.length; y++) {
                        sizes[y]= datas.effectScatter_sizevalue_extent[0]+ (sizes[y]-sizevalue[0])*se/sl;
                    }
                }

                var effectScatterData = datas;
                effectScatterData['points'] = points;
                effectScatterData['texts'] = texts;
                effectScatterData['attrs'] = attrs;
                effectScatterData['sizes'] = sizes;
                effectScatterData['icons'] = icons;
                effectScatterData['colors'] = icons;
                effectScatterData['styleFunction'] =effectScatterData['styleFunction']|| function(feature) {
                        var style = new ol.style.Style({
                          image: new ol.style.Circle({
                            radius: parseFloat(feature.get('size'), 10),
                            stroke: new ol.style.Stroke({
                              color: feature.get('icon')||'#3399CC'
                            }),
                            fill: new ol.style.Fill({
                              color: feature.get('icon')||'#3399CC'
                            })
                          }),
                          text: new ol.style.Text({
                            text: feature.get('text'),
                            fill: new ol.style.Fill({
                              color: '#fff'
                            })
                          })
                        });
                        return style;
                    }


                self.addPoint(effectScatterData)
            }
            else if (datas.data['geometryType'] == "MultiPoint" && datas.uptype == "数值法") {
                var labelText = [];
                var attrs = [];
                var icons = [];
                var color = self.getColorDatasource()[datas.colorname] || {};
                if (color['color'] == undefined) color['color'] = [];
                for (var x = 0; x < datas.data['features'].length; x++) {
                    var ltext = datas.data['features'][x]['properties'][datas.valuefield] == undefined ? '0': datas.data['features'][x]['properties'][datas.valuefield];

                    var fill = datas.pointColor ? datas.pointColor: 'rgba(255, 0, 0, 1)';
                    var num = parseFloat(ltext);
                    if (!isNaN(num)) {
                        for (var xi = 0; xi < color.color.length; xi++) {
                            if (num >= color.color[xi].min && num <= color.color[xi].max) {
                                var co = color.color[xi].color;
                                var tm = 1;
                                if (co.indexOf("rgb(") > -1) fill = co.replace(")", "," + tm + ")").replace("rgb(", "rgba(")
                                else fill = co;
                                break;
                            }
                        }
                    }

                    if (datas.data['features'][x]['geometry']['type'] == "MultiPoint") {
                        for (var p = 0; p < datas.data['features'][x]['geometry']['coordinates'].length; p++) {
                            labelText.push(ltext + "");
                            icons.push(fill);
                            poin.push(datas.data['features'][x]['geometry']['coordinates'][p]);
                            var attr = datas.data['features'][x]['properties'];
                            attr['ATTRNAME'] = datas['name'];
                            attrs.push(attr);
                        }
                    }
                    else {
                        labelText.push(ltext + "");
                        icons.push(fill);
                        poin.push(datas.data['features'][x]['geometry']['coordinates']);
                        var attr = datas.data['features'][x]['properties'];
                        attr['ATTRNAME'] = datas['name'];
                        attrs.push(attr);
                    }

                    // labelText.push(ltext+"");
                    // poin.push(datas.data['features'][x]['geometry']['coordinates']);
                }
                var iShowp = true;
                var iStyle = undefined;
                var nosvg=true;
                if (datas.pointstyle == "1") {
                    iShowp = true;
                }
                else if (datas.pointstyle == "2" && (datas.data.imgurl != undefined||datas.imgurl != undefined)) {
                    var imgtype=datas.imgurl == undefined ? datas.data.imgurl: datas.imgurl;
                    if(imgtype.indexOf('.svg')>-1||imgtype.indexOf('MapServlet?method=outSvg&id=')>-1){
                        nosvg=false;
                        if(self.svg[imgtype]==undefined){
                            $.ajax({
                                url:imgtype,
                                dataType: 'xml',
                                async: false,
                                success:function(data){
                                    if(data==null||data==undefined){
                                            data=$('<svg xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200" width="100" height="100" version="1.1" ><svg xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200" width="200" height="200" version="1.1" ><circle cx="100" cy="100" r="100"  fill="red" /></svg></svg>')[0];
                                        }
                                    excuteSvg(data);
                                }
                            })
                        }
                        else{
                            excuteSvg(self.svg[imgtype]);
                        }

                        function excuteSvg(data){
                            self.svg[imgtype]=data;
                            var svgicon=[];
                            for(var c=0;c<icons.length;c++){
                                $(data).children('svg').eq(0).attr('width',datas.width||10);
                                $(data).children('svg').eq(0).attr('height',datas.height||10);
                                if(color['color'].length!=0)
                                {
                                    // $(data).children('svg').eq(0).attr('fill',icons[c]||'red');
                                    // $(data).children('svg').eq(0).attr('stroke',datas.stroke||icons[c]||'red');
                                }
                                $(data).children('svg').eq(0).attr('stroke-width',datas.lineWidth||'none');

                                setChild($(data).children('svg').eq(0));//$(data).children('svg').eq(0).children()
                                function setChild(obj){
                                    if(obj.children()!=undefined&&obj.children().length!=0)
                                        {for(var i=0;i<obj.children().length;i++){
                                            var c1=obj.children()[i];
                                            if(c1.nodeName=="svg"){
                                                setChild($(c1));
                                            }
                                            else{
                                                if($(c1).parent('svg').attr('fun')!="1")
                                                {
                                                    if(color['color'].length!=0)
                                                    {
                                                        $(c1).attr('fill',icons[c]||'red');
                                                        $(c1).attr('stroke',datas.stroke||icons[c]||'red');
                                                    }
                                                    $(c1).attr('stroke-width',datas.lineWidth||'none');
                                                    $(c1).attr('stroke-dasharray',datas.lineDash||'none');
                                                }
                                                else{
                                                }
                                                $(c1).css('transform','rotate('+datas.angle+'deg)');
                                                $(c1).css('transform-origin','center');
                                            }
                                        }
                                    }
                                }
                                svgicon.push('data:image/svg+xml;base64,'+Base64.encode((new XMLSerializer()).serializeToString(data)));
                            }
                            var data = datas;
                            data['name'] = datas['name'];
                            data['imageStyle'] = iStyle;
                            data['texts'] = labelText;
                            if(data['showtext']==false)
                                data['texts']=[];
                            data['points'] = poin;
                            data['showGeometry'] = false;
                            data['attrs'] = attrs;
                            data['icons'] = svgicon;
                            data['colors'] = icons;
                            self.addPoint(data);
                        }
                        return;
                    }
                    else{
                        iStyle = new ol.style.Icon(({
                            anchor: [0.5, 0.5],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'fraction',
                            src: datas.imgurl == undefined ? datas.data.imgurl: datas.imgurl
                        }));
                    }
                } else if (datas.pointstyle == "3") {
                    iShowp = true;
                }
                //self.addPoint(iStyle,datas['name'],labelText,poin,[],iShowp,attrs,datas['textcolor'],datas['pointcolor']);
                var data = datas;
                data['name'] = datas['name'];
                data['imageStyle'] = iStyle;
                data['texts'] = labelText;
				if(data['showtext']==false)
					data['texts']=[];
                data['points'] = poin;
                data['showGeometry'] = iShowp;
                data['attrs'] = attrs;
                data['icons'] = icons;
                data['colors'] = icons;
                if(nosvg)
                    self.addPoint(data);
            }

            else if(datas.data['geometryType'] == "MultiPoint" && datas.uptype == "散点图"){
                var poins=[];
                var sizes=[];
                var symbolsizes=[];
                var icons=[];
                var symbolicons=[];
                var symbolcolors=[];
                var attrs=[];
                var rotations=[];
                var texts=[];
                var symbols=(self.getDatasource()[datas.symbolMapID]||{symbol:[]}).symbol||[];
                var colors=(self.getDatasource()[datas.colorMapID]||{color:[]}).color||[];
                for (var x = 0; x < datas.data['features'].length; x++)
                {
                    var icon=datas.Symbol_ID_default||'';
                    var size=[datas.symbol_width_default,datas.symbol_height_default];
                    var color=datas.symbol_color_default||'rgb(255,0,0)';
                    if(datas.symbol_ID_properties==''&&datas.symbolMap_properties!=''&&datas.data['features'][x]['properties'][datas.symbolMap_properties] != undefined)
                    {
                        var ltext = datas.data['features'][x]['properties'][datas.symbolMap_properties];
                        for(var s=0;s<symbols.length;s++)
                        {
                            if(ltext>=symbols[s].min&&ltext<=symbols[s].max)
                            {
                               icon=symbols[s].url||datas.Symbol_ID_default;
                               size=[symbols[s].width,symbols[s].height];
                               break;
                            }
                        }
                    }
                    else if(datas.symbol_ID_properties!=''&&datas.data['features'][x]['properties'][datas.symbol_ID_properties] != undefined)
                    {
                        icon=datas.data['features'][x]['properties'][datas.symbol_ID_properties];
                    }
                    var symbolUrl=datas.symbolURL+ "&id=";
                    icon=icon+'';
                    if(icon.indexOf('.')>-1||icon.indexOf('MapServlet?method=outSvg&id=')>-1)
                    {
                        symbolUrl='';
                    }
                    symbolicons.push(symbolUrl+icon);

                    if(datas.data['features'][x]['properties'][datas.symbol_width_properties] != undefined&&!isNaN(parseInt(datas.data['features'][x]['properties'][datas.symbol_width_properties])))
                    {
                        size[0]=parseInt(datas.data['features'][x]['properties'][datas.symbol_width_properties]);
                    }
                    if(datas.data['features'][x]['properties'][datas.symbol_height_properties] != undefined&&!isNaN(parseInt(datas.data['features'][x]['properties'][datas.symbol_height_properties])))
                    {
                        size[1]=parseInt(datas.data['features'][x]['properties'][datas.symbol_height_properties]);
                    }
                    symbolsizes.push(size);


                    if(datas.symbol_color_properties==''&&datas.colorMap_properties!=''&&datas.data['features'][x]['properties'][datas.colorMap_properties] != undefined)
                    {
                        var lcolor = datas.data['features'][x]['properties'][datas.colorMap_properties];
                        for(var s=0;s<colors.length;s++)
                        {
                            if(lcolor>=colors[s].min&&lcolor<=colors[s].max)
                            {
                                var co = colors[s].color;
                                var tm = 1;
                                if (co.indexOf("rgb(") > -1)
                                    color = co.replace(")", "," + tm + ")").replace("rgb(", "rgba(")
                                else
                                    color = co;
                                break;
                            }
                        }
                    }
                    else if(datas.symbol_color_properties!=''&&datas.data['features'][x]['properties'][datas.symbol_color_properties] != undefined)
                    {
                        color=datas.data['features'][x]['properties'][datas.symbol_color_properties];
                    }
                    symbolcolors.push(color);
                }

                for(var s=0;s<symbolicons.length;s++)
                {
                    var imgtype=symbolicons[s];
                    var w=10;//symbolsizes[s][0];
                    var h=10;//symbolsizes[s][1];
                    var fillcolor=symbolcolors[s];
                    if(imgtype.indexOf('.svg')>-1||imgtype.indexOf('MapServlet?method=outSvg&id=')>-1)
                    {
                        if(self.svg[imgtype]==undefined){
                            $.ajax({
                                url:imgtype,
                                dataType: 'xml',
                                async: false,
                                success:function(data){
                                    if(data==null||data==undefined){
                                            data=$('<svg xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200" width="100" height="100" version="1.1" ><svg xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200" width="200" height="200" version="1.1" ><circle cx="100" cy="100" r="100"  fill="red" /></svg></svg>')[0];
                                        }
                                    self.svg[imgtype]=data;
                                    excuteSvg(data)
                                }
                            })
                        }
                        else{
                            var data=self.svg[imgtype];
                            excuteSvg(data)
                        }

                        function excuteSvg(data){
                            $(data).children('svg').eq(0).attr('width',w);
                            $(data).children('svg').eq(0).attr('height',h);
                            setChild($(data).children('svg').eq(0))
                            function setChild(obj){
                                if(obj.children()!=undefined&&obj.children().length!=0)
                                {
                                    for(var i=0;i<obj.children().length;i++)
                                    {
                                        var c1=obj.children()[i];
                                        if(c1.nodeName=="svg"){
                                            setChild($(c1));
                                        }
                                        else{
                                            if($(c1).parent('svg').attr('fun')!="1")
                                            {
                                                var xx=$(c1).attr('fill');
                                                if(datas.isSelfColor){

                                                }
                                                else{
                                                    $(c1).attr('fill',fillcolor||xx||'red');
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            symbolicons[s]='data:image/svg+xml;base64,'+Base64.encode((new XMLSerializer()).serializeToString(data));
                        }
                    }
                }
                var tcolors = [];
                for (var x = 0; x < datas.data['features'].length; x++) {
                    //var geoms = new ZMap2D.Point(datas[i].data['features'][x]['geometry']['coordinates']);
                    //if (datas.data['features'][x]['properties'][datas.symbolMap_properties] == undefined && datas.data['features'][x]['properties'][datas.symbol_ID_properties] == undefined) continue;
                    var dire=isNaN(parseInt(datas.data['features'][x]['properties'][datas.symbol_direction_properties]))?datas.symbol_direction_default:parseInt(datas.data['features'][x]['properties'][datas.symbol_direction_properties]);
                    var dire=dire||0;
                    var imgurl=symbolicons[x];
                    var size=symbolsizes[x];
                    var tcolor = symbolcolors[x];
                    if(imgurl=='')
                        continue;

                    var text=datas.data['features'][x]['properties'][datas.text_properties]||datas.text_default||'';
                    if (datas.data['features'][x]['geometry']['type'] == "MultiPoint") {
                        for (var p = 0; p < datas.data['features'][x]['geometry']['coordinates'].length; p++) {
                            texts.push(text);
                            icons.push(imgurl);
                            tcolors.push(tcolor);
                            rotations.push(dire);
                            sizes.push(size);
                            poins.push(datas.data['features'][x]['geometry']['coordinates'][p]);
                            var attr = datas.data['features'][x]['properties'];
                            attr['ATTRNAME'] = datas['name'];
                            attrs.push(attr);
                        }
                    } else {
                        texts.push(text);
                        icons.push(imgurl);
                        tcolors.push(tcolor);
                        rotations.push(dire);
                        sizes.push(size);
                        poins.push(datas.data['features'][x]['geometry']['coordinates']);
                        var attr = datas.data['features'][x]['properties'];
                        attr['ATTRNAME'] = datas['name'];
                        attrs.push(attr);
                    }
                }
                var data=datas;
                data['points']=poins;
                data['texts']=texts;
                data['icons']=icons;
                data['colors']=tcolors;
                data['attrs']=attrs;
                data['rotations']=rotations;
                data['sizes']=sizes;
                data['showGeometry']=false;
                self.addPoint(data);
            }
            else if (datas.data['geometryType'] == "MultiPoint" && datas.uptype == "等值线") {
                //self.clearLineArea(datas['name'])
                self.addLine(datas['name'], datas, 'line',datas['showLabel'])
            }
            else if (datas.data['geometryType'] == "MultiPoint" && datas.uptype == "等值面") {
                //self.clearLineArea(datas['name'])
                self.addLine(datas['name'], datas, 'gridline',datas['showLabel'])
            }
            else if ((datas.data['geometryType'] == "Polygon" || datas.data['geometryType'] == "MultiPolygon") && datas.uptype == "默认区") {

                self.addRegionalLayer(datas['name'], datas, 1)
            }
            else if ((datas.data['geometryType'] == "Polygon" || datas.data['geometryType'] == "MultiPolygon") && datas.uptype == "色斑图") {

                self.addRegionalLayer(datas['name'], datas, 0)
            }
            else if ((datas.data['geometryType'] == "LineString" || datas.data['geometryType'] == "MultiLineString") && datas.uptype == "路线漫游") {

                self.addMultiRoam(datas)
            }
            else if ((datas.data['geometryType'] == "LineString" || datas.data['geometryType'] == "MultiLineString") && datas.uptype == "线路图") {

                self.addMultiLine(datas,1)
            }
            else if ((datas.data['geometryType'] == "LineString" || datas.data['geometryType'] == "MultiLineString") && datas.uptype == "线") {

                self.addMultiLine(datas,0)
            }
            else if ((datas.data['geometryType'] == "LineString" || datas.data['geometryType'] == "MultiLineString") && datas.uptype == "迁徙图") {

                self.addMultiLine(datas,2)
            }

            if (self.toolSettingData.layercontrol) self.getLayerClick();
        }

        /*点批量聚合图标上图 */
        this.addAnimatedPoint = function(data) {
            self.LayerName[data.name] = data.name;
            self.zmap2dview.RemoveLayer(self.LayerName[data.name]);
            self.zmap2dview.AddAnimatedclusterLayer(data);
            // self.zmap2dview.AddAnimatedclusterLayer({
            //     name: labelName,
            //     points: label,
            //     texts: labelText,
            //     url: url,
            //     attrs: attrs,
            //     showNum:showNum||false
            // });
        }
        /*点批量不聚和图标上图 */
        this.addPoint = function(data) { //imageStyle,labelName,labelText,label,des,showG,attrs,textcolor,pointColor
            self.LayerName[data.name] = data.name;
            self.zmap2dview.RemoveLayer(self.LayerName[data.name]);
            var oy = 0;
            var r = 0.1;
            if (data['showGeometry']) {
                oy = -15;
                r = 4;
            }
            data['radius'] = data['radius'] || r;
            data['offsetY'] = data['offsetY'] || oy;
            self.zmap2dview.AddBatchTextLayer(data);
			if(data.dynamic){
                if(self.mapDynamic[data.name])
                {
                    self.manager.removeLayer(self.mapDynamic[data.name]);
                }
				self.mapDynamic[data.name]=self.manager.addLayer({data:{points:data.points,color:data.icons,size:data.sizes||[]},symbol:data.symbol,effect:data.effect});
			}
			if((data['showlegend']==true||data['showlegend']=="true"||data['showlegend']=="是")&&data['colorname'])
				self.addLegend(data['colorname'],data.name);

        }
        /*点风力风向样式上图 */
        this.addflfxPoint = function(imageStyle, labelName, labelText, label, attrs,rotations,sizes) {
            self.LayerName[labelName] = labelName;
            self.zmap2dview.RemoveLayer(self.LayerName[labelName]);
            self.zmap2dview.AddBatchTextLayer({
                name: labelName,
                imageStyle: imageStyle,
                texts: [],
                icons: labelText,
                radius: 2,
                points: label,
                showGeometry: false,
                attrs: attrs,
                rotations:rotations,
                sizes:sizes
            });
        }

        //

        this.setLayerVisible = function(name,v)
        {
            var layer = self.zmap2dview.GetUnkLayer(name);
            if(layer)
            {
                layer.setVisible(v);
            }
        }


        //worker 处理百万级数据上图


        this.movendUpPoint ={};
        this.MapWidgetWorker = new Worker('./zmapworker/ZMapWorker.js');
        self.MapWidgetWorker.onmessage = function(event)
        {
            if(event.data =='addFinish')
            {
                self.millionMovend();
                return;
            }
            var data = event.data;

            for(var k in data)
            {
                var options = {
                    name:k,
                    styleFunction:self.movendUpPoint[k].styleFunction,
                    points:data[k].points,
                    attrs:data[k].attrs
                };
                self.millionUpPoint(options);

            }
        }
        this.millionUpPoint = function(options)
        {
            var unkLayer  = self.zmap2dview.GetUnkLayer(options.name);
            var vecSource;
            if (unkLayer == undefined)
            {
                return;
            }
            else
            {
                vecSource = unkLayer.getSource();
                vecSource.clear();
            }

            var pnts = options.points||[];
            var attrs = options.attrs||[];
            var features=[];
            for (var i = 0; i < pnts.length; i++)
            {
            //var point   = new ol.geom.Point(pnts[i], 'XY');
                var point = self.zmap2dview.Point(pnts[i]);
                var feature = new ol.Feature({
                        name:'default',
                        geometry: point,
                        attr: attrs[i]
                        }
                    );
                features.push(feature);
            }
            vecSource.addFeatures(features);
        }
        this.clearMillion = function()
        {
            for(var k in self.movendUpPoint)
            {
                self.zmap2dview.RemoveLayer(k);
            }
            self.movendUpPoint = {};
            self.MapWidgetWorker.postMessage({type:'clear'});
        }
        this.millionDel = function(name)
        {
            self.zmap2dview.RemoveLayer(name);
            delete self.movendUpPoint[name];
            self.MapWidgetWorker.postMessage({type:'del',name:name});

        }
        this.millionAdd = function(data)
        {
            self.movendUpPoint[data.name] = data;
            self.millionLayer(data);
            var padta = {};
            for(var k in data)
            {
                if(typeof data[k] !='function')
                {
                    padta[k] = data[k];
                }
            }
            var posData ={
                type:'add',
                data:padta
            }
            self.MapWidgetWorker.postMessage(posData);
        }

        this.millionLayer = function(options)
        {
            function pointStyleFunction(feature, resolution) {
                if(options.styleFunction&&typeof options.styleFunction =='function')
                {
                    return options.styleFunction(feature);
                }

                return  new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: parseFloat(20, 10),
                        stroke: new ol.style.Stroke({
                            color: '#fff'
                        }),
                        fill: new ol.style.Fill({
                            color: '#3399CC'
                            })
                    })
                });
            }
            var vecSource;
            var unkLayer  = self.zmap2dview.GetUnkLayer(options.name);
            if (unkLayer == undefined)
            {
                vecSource = new ol.source.Vector();
                unkLayer = new ol.layer.Vector(
                    {   name: options.name,
                        source: vecSource,
                        style: pointStyleFunction
                    });
                self.zmap2dview.olMap.addLayer(unkLayer);
            }
            else
            {
                vecSource = unkLayer.getSource();
                vecSource.clear();
            }
        }

        this.millionMovend = function()
        {
            var point ={}
            var rect = self.zmap2dview.GetViewRect();
            var zoom = self.zmap2dview.GetZoom();
            for(var k in self.movendUpPoint)
            {
                point[k] = [];
                for(var i=0;i<self.movendUpPoint[k].rows.length;i++)
                {
                    var r = self.movendUpPoint[k].rows[i];
                    var x = self.movendUpPoint[k].x;
                    var y = self.movendUpPoint[k].y
                    if(r[x]>=rect[0]&&r[x]<=rect[2]&&r[y]>=rect[1]&&r[y]<=rect[3])
                    {
                        point[k].push(i);
                    }
                }
            }
            var posData={
                type:'excute',
                data:{
                    res :180/Math.pow(2,7+zoom),//self.zmap2dview.olMap.getView().values_.resolution,
                    zoom:zoom,
                    rect:rect,
                    point:point
                }
            }
            self.MapWidgetWorker.postMessage(posData);
        }


        //var LayerName={};
        /*点热力图样式上图 */
        this.addHotLayer = function(labelName, options) {
            var source = new ZMap2D.SourceVector();
            var points = options.points||[];
            var attrs =  options.attrs||[];
            var weights = options.weights||[];
            var featrues = [];
            for(var i=0;i<points.length;i++)
            {
                var tempJWD = points[i];
                var geoms = self.zmap2dview.Point(tempJWD);
                var feature = new ol.Feature({
                    name: options.name||"heatmap",
                    point:tempJWD,
                    attr:attrs[i],
                    geometry: geoms,
                    weight: weights[i]||0.5
                });
                feature.setGeometry(geoms);
                //source.addFeature(feature);
                featrues.push(feature);
            }
            source.addFeatures(featrues);

            self.zmap2dview.RemoveLayer(self.LayerName[labelName]);
            self.LayerName[labelName] = new ZMap2D.HeatMapLayer({
                source: source,
                radius: options.radius||30,
                blur: options.blur||30
            });
            self.zmap2dview.AddLayer(self.LayerName[labelName]);
        }
        /*图层控制面板是否选中及对应图层是否显示 */
        this.ShowOrHide = function(obj, Pname) {
            if (obj.className != "ischecked") {
                $(obj).addClass('ischecked');
                self.showLayer(Pname);
            } else {
                $(obj).removeClass('ischecked');
                /*移除图层  Pname为图层数据name*/
                self.hideLayer(Pname);
            }
        }
        this.showLayer = function(Pname) {
			self.manager.removeLayer(self.mapDynamic[Pname]);
            self.zmap2dview.RemoveLayer(self.LayerName[Pname]);
            if (self.LA[Pname] != undefined) self.clearLineArea(Pname);
            if (self.overlay[Pname] != undefined) {
                for (var i = 0; i < self.overlay[Pname]; i++) {
                    self.zmap2dview.RemoveLabel(self.mapcode + Pname + i);
                }
                delete self.overlay[Pname];
            }
            self.removeMultiRoam(Pname);
            var datas = self.paramdata[self.mapcode + Pname];
            self.addlayers(datas);
        }
        this.hideLayer = function(Pname) {
			self.manager.removeLayer(self.mapDynamic[Pname]);
            self.zmap2dview.RemoveLayer(self.LayerName[Pname]);
            /*数据上图为等值线等值面时移除图层 */
            if (self.LA[Pname] != undefined) self.clearLineArea(Pname);
            if (self.overlay[Pname] != undefined) {
                for (var i = 0; i < self.overlay[Pname]; i++) {
                    self.zmap2dview.RemoveLabel(self.mapcode + Pname + i);
                }
                delete self.overlay[Pname];
            }
            self.removeMultiRoam(Pname);
            if(typeof self.LayerName[Pname] =='string')
            {
                self.animationFly.removeLineAnimationFname(self.LayerName[Pname])
            }
        }
        //切换地图图层显示
        this.showMapLayer = function(obj) {
            // var i = 0;
            // for (var ii = 0; ii < $('#' + self.mapcode + 'dtkzxs').children('div').length; ii++) {
            //     i = ii;
            //     if ($('#' + self.mapcode + 'dtkzxs').children('div').eq(ii).attr('id') == obj.id) break;
            // }
            // var lay = self.mapcode + 'imagelayer' + i;
            var lay =self.mapcode+$(obj).attr('fun');
            $('#' + self.mapcode + 'dtkzxs').children('div').children("span").removeClass("img_txt_active");
            for (key in self.Maplayer) {
                for(var i=0;i<self.Maplayer[key].length;i++)
                {
                    if (key == lay)
                    {
                        self.Maplayer[key][i].SetVisible(true);
                    }
                    else
                    {
                        self.Maplayer[key][i].SetVisible(false);
                    }
                }


                // if (key == lay) {
                //     self.Maplayer[key].SetVisible(true);
                //     $(obj).children("span").addClass("img_txt_active");
                // } else {
                //     if (key.indexOf(self.mapcode + 'imagelayer') != -1)
                //         self.Maplayer[key].SetVisible(false);
                // }
            }
            $(obj).children("span").addClass("img_txt_active");
        }

        //显示测量框
        this.showareaBox = function() {
            $("#" + self.mapcode + "cl").css("display", "block");
            var dis = $("#" + self.mapcode + "cl").parent("div").css("display");
            if (dis == "block") {
                $("#" + self.mapcode + "cl").parent("div").css("display", "none");
            } else {
                $("#" + self.mapcode + "kjcx").parent("div").css("display", "none");
                $("#" + self.mapcode + "cl").parent("div").css("display", "block");
                $("#" + self.mapcode + "dinweijq").parent("div").css("display", "none");
            }
        }

        //显示空间查询框
        this.showkjBox = function() {
            $("#" + self.mapcode + "kjcx").css("display", "block");
            var dis = $("#" + self.mapcode + "kjcx").parent("div").css("display");
            //clearlabels();
            if (dis == "block") {
                $("#" + self.mapcode + "kjcx").parent("div").css("display", "none");
            } else {

                $("#" + self.mapcode + "cl").parent("div").css("display", "none");
                $("#" + self.mapcode + "kjcx").parent("div").css("display", "block");
                $("#" + self.mapcode + "dinweijq").parent("div").css("display", "none");
            }
        }
        /*显示等值线等值面面板 */
        this.showdzBox = function() {
            self.excuteselect(self.mapcode);
            $("#" + self.mapcode + "dinweijq").css("display", "block");
            var dis = $("#" + self.mapcode + "dinweijq").parent("div").css("display");
            //clearlabels();
            if (dis == "block") {
                $("#" + self.mapcode + "dinweijq").parent("div").css("display", "none");
            } else {
                $("#" + self.mapcode + "cl").parent("div").css("display", "none");
                $("#" + self.mapcode + "dinweijq").parent("div").css("display", "block");
                $("#" + self.mapcode + "kjcx").parent("div").css("display", "none");
            }
        }
        /*生成等值线等值面对应参数选中面板 */
        this.excuteselect = function() {
            // $('#' + self.mapcode + 'type4').linkbutton({
            //     iconCls: 'zt-xiugai'
            // });
            var x = [];
            var type1html='';
            for (key in self.paramdata) {
                if (key.indexOf(self.mapcode) != -1 && self.paramdata[key]['data']['name'] != undefined && self.paramdata[key]['data']['geometryType'] == "MultiPoint")
                {
                    x.push(self.paramdata[key]);
                    type1html+='<option value="'+self.paramdata[key].name+'">'+self.paramdata[key].name+'</option>';
                }
            }


            // $('#' + self.mapcode + 'type2').combobox({
            //     valueField: 'name',
            //     textField: 'name',
            //     editable: false,
            //     panelHeight: 'auto',
            //     panelMaxHeight: '100',
            //     onLoadSuccess: function() { //加载完成后,设置选中第一项
            //         var val = $(this).combobox('getData');
            //         for (var item in val[0]) {
            //             if (item == 'name') {
            //                 $(this).combobox('select', val[0][item]);
            //             }
            //         }
            //     }
            // });
            var colortype = [];
            var colorsource = self.getDatasource();
            var colorhtml='';
            for (key in colorsource) {
                if (colorsource[key].type == "color") {
                    var xzzz = {
                        name: key
                    };
                    colortype.push(xzzz);
                    colorhtml+='<option value="'+key+'">'+key+'</option>'
                }
            }
            // if(colortype.length==0)
            //     colortype.push({name:'无色表数据'});
            // var colortype=[{name:'温度'},{name:'1H雨量'},{name:'24H雨量'},{name:'风速'},{name:'气压'},{name:'湿度'}];

            $('#' + self.mapcode + 'type3').html(colorhtml);
            // $('#' + self.mapcode + 'type3').combobox({
            //     valueField: 'name',
            //     textField: 'name',
            //     editable: false,
            //     data: colortype,
            //     panelHeight: 'auto',
            //     panelMaxHeight: '100',
            //     onLoadSuccess: function() { //加载完成后,设置选中第一项
            //         var val = $(this).combobox('getData');
            //         for (var item in val[0]) {
            //             if (item == 'name') {
            //                 $(this).combobox('select', val[0][item]);
            //             }
            //         }
            //     }
            // });

            $('#' + self.mapcode + 'type1').html(type1html);

            $('#' + self.mapcode + 'type1').change(function(event){
                    var val=x;
                    var newValue=event.target.value;
                    for (var i = 0; i < val.length; i++) {

                        if (newValue == val[i]['name']) {
                            var fields = [];
                            if (val[i]['data']['fields'] == undefined || val[i]['data']['fields'].length == 0) for (var key in val[i]['data']['features'][0]['properties']) {
                                fields.push({
                                    name: key
                                });
                            }
                            else {
                                fields = val[i]['data']['fields'];
                            }
                            var type2html='';
                            for(var k in fields){
                                type2html+='<option value="'+fields[k].name+'">'+fields[k].name+'</option>'
                            }

                            $('#' + self.mapcode + 'type2').html(type2html);
                            return;
                        }
                    }


            })

            $('#' + self.mapcode + 'type1').change();
            // $('#' + self.mapcode + 'type1').combobox({
            //     valueField: 'name',
            //     textField: 'name',
            //     editable: false,
            //     data: x,
            //     panelHeight: 'auto',
            //     panelMaxHeight: '100',
            //     onLoadSuccess: function() { //加载完成后,设置选中第一项
            //         var val = $(this).combobox('getData');
            //         for (var item in val[0]) {
            //             if (item == 'name') {
            //                 $(this).combobox('select', val[0][item]);
            //             }
            //         }
            //     },
            //     onChange: function(newValue) {
            //         var val = $(this).combobox('getData');
            //         for (var i = 0; i < val.length; i++) {
            //             if (newValue == val[i]['name']) {
            //                 var fields = [];
            //                 if (val[i]['data']['fields'] == undefined || val[i]['data']['fields'].length == 0) for (var key in val[i]['data']['features'][0]['properties']) {
            //                     fields.push({
            //                         name: key
            //                     });
            //                 } else fields = val[i]['data']['fields'];
            //                 $('#' + self.mapcode + 'type2').combobox('loadData', fields);
            //                 return;
            //             }
            //         }
            //     }
            // });
        }
        /*获取到选择的等值线等值面参数后开始画等值线等值面 */
        this.getDz = function getDz() {
            $("#" + self.mapcode + "dinweijq").parent("div").css("display", "none");
            var val1 = $("#" + self.mapcode + "type2").val()//.combobox('getValue');
            var val2 = $("#" + self.mapcode + "type3").val()//.combobox('getValue');
            var showT = true;
            self.dreawMap('gridline', 'draw', val1, val2,showT);
            self.addLegend(val2,'等值面');
        }
        /*复位功能 */
        this.resetContrl = function() {
            // var buttonid=e.path[0].id;
            // var mapcode=buttonid.substring(2);
            // var dw=zmapObj[mapcode].fw;
            self.zmap2dview.SetViewCenter(self.fw[0], self.fw[1]);
            self.zmap2dview.SetZoom(self.zoom);
        }
        /*地图上图和设置工具项 */
        this.initMap = function(obj, d) {
            self.settingchange(obj);
            self.addMapLayer(d)
        }
        /* 地图图层上图，会移除原有地图图层*/
        this.addMapLayer = function(d) {
            for (key in self.Maplayer) {
                //if (key.indexOf(self.mapcode + 'imagelayer') != -1) {
                    for(var x=0;x<self.Maplayer[key].length;x++)
                    {
                        self.zmap2dview.RemoveTileLayer(self.Maplayer[key][x]);
                    }
                //}
            }
            self.Maplayer = {};
            for (var i = 0; i < d.length; i++) {
                var z = false;
                if (d[i]['show'] == true)
                {
                    z = true;
                }
                var name = self.mapcode+d[i].defaultname;
                self.Maplayer[name] = self.Maplayer[name]||[];
                if (d[i].maptype != undefined&&!d[i].mapArray) {

                    //var name = self.mapcode + "imagelayer" + i;
                    var layername = d[i].name||(name+i);
                    self.Maplayer[name].push(self.addJWlayer(layername, d[i]['url'], z, d[i].maptype,d[i].minZoom||viewopt.minZoom,d[i].maxZoom||viewopt.maxZoom));
                } else if(d[i].mapArray&&Array.isArray(d[i].mapArray)){

                    for(var y=0;y<d[i].mapArray.length;y++)
                    {
                        var layername = d[i].name||(name+y)
                        self.Maplayer[name].push(self.addJWlayer(layername, d[i].mapArray[y]['url'], z, d[i].mapArray[y].maptype,d[i].mapArray[y].minZoom||viewopt.minZoom,d[i].mapArray[y].maxZoom||viewopt.maxZoom));
                    }
                }
            }
            var da = [];
            for(var k in self.Maplayer)
            {
                for(var z=0;z<d.length;z++)
                {
                    if(k==( self.mapcode+d[z].defaultname)){
                        da.push(d[z]);
                        break;
                    }
                }
            }
            self.addDTKZ(da);
        }
        /*添加地图图层缩略图控制地图图层显示，datas为地图数据的所有数据集合 */

        this.addDTKZ = function(datas) {
            self.zmap2dview.RemoveCustomControl('fws11');
            if (datas.length <= 1) {
                return;
            }
            var x = 0;
            var html6 = '<div id="' + self.mapcode + 'dtkzxs">';
            for (var i = 0; i < datas.length; i++) {
                // var na=currentSettings['layer'][i].replace("datasources[\"","").replace("\"]","");
                var na = datas[i].defaultname;
                var img = datas[i].img == undefined ? "img/dt.png": datas[i].img;
                html6 += '<div class="map mapDiv" id="_ditu'+self.mapcode + i + '" style="left:' + i * 70 + 'px;float:right;display:none" fun="'+na+'" ><img src="' + img + '" style="margin: 1px;"> <span class="img_txt ">' + na + '</span></div>';
                //var x=i*70+40;
                x = i * 70 + 60;
            }
            html6 = html6 + '</div>';
            self.zmap2dview.AddCommonControl('fws11', html6, '', '', '10', '20');
			$('#_ditu' + self.mapcode + '0').children('span').addClass('img_txt_active');

            for (var ii = 0; ii < $('#' + self.mapcode + 'dtkzxs').children('div').length; ii++) {
                $('#' + self.mapcode + 'dtkzxs').children('div').eq(ii).click(function() {
                    self.showMapLayer(this)
                })
            }
			$('#' + self.mapcode + 'dtkzxs').parent('div').mouseover(function(){
				$('#' + self.mapcode + 'dtkzxs').children('div').show();
			})
			$('#' + self.mapcode + 'dtkzxs').parent('div').mouseout(function(){
				$('#' + self.mapcode + 'dtkzxs').children('div').hide();
				$('.img_txt_active').parent('div').show();
			})
			$('#' + self.mapcode + 'dtkzxs').parent('div').css("border-radius","2px");
			$('#' + self.mapcode + 'dtkzxs').parent('div').css("box-shadow","0px 0px 8px 1px #e4c3c3");
			$('#' + self.mapcode + 'dtkzxs').parent('div').css("background","white");
			$('.img_txt_active').parent('div').show();
        }
        /*添加数据图层列表控制显示数据图层 ，datas为一次性上图的所有数据集合*/
        this.getLayerClick = function() {
            var datas = [];
            for (var key1 in self.paramdata) {
                datas.push(self.paramdata[key1])
            }
            var isshow = false;
            if ($('#kz' + self.mapcode).text() != "") {

                for (var i = 0; i < datas.length; i++) {
                    if (datas[i].controlicon == "否" || datas[i]['data'] == undefined) continue;
                    var na = datas[i]['name']||datas[i]['data']['name'];
                    var is = true;
                    for (var x = 0; x < $('#kz' + self.mapcode).children('dd').length; x++) {
                        var text = $('#kz' + self.mapcode).children('dd').eq(x).attr('title');
                        if (na == text) {
                            is = false;
                            break;
                        }
                    }
                    if (is) {
                        var dd = $('<dd style="cursor: pointer;margin:2px;padding:3px 5px;border-radius:2px;font-size:12px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" class="ischecked" title="' + na + '" ><span class="checkbox"></span><span>' + na + '</span></dd>');
                        dd.appendTo($('#kz' + self.mapcode));
                        dd.click(function() {
                            self.ShowOrHide(this, this.title);
                        })
                    }
                }

                return;
            }
            self.zmap2dview.RemoveCustomControl('tc');
            // if(datas.length==0){
            //     self.zmap2dview.RemoveCustomControl('tckz');
            //     return;
            // }
            var html8 = '<div id="kz' + self.mapcode + '" style="padding:2px;background:#fff;border-radius:5px;overflow:auto;max-height:200px;box-shadow:0px 0px 8px 1px #e4c3c3;" ></div> ';

            if (self.toolSettingData.toolstyle == undefined || self.toolSettingData.toolstyle == "1") {
                self.zmap2dview.AddCommonControl('tc', html8, '10', '40', '', '', 100, 210,11);
            } else if (self.toolSettingData.toolstyle == "2") {
                self.zmap2dview.AddCommonControl('tc', html8, '95', '15', '', '', 100, 210,11);
            }

            for (var i = 0; i < datas.length; i++) {
                if (datas[i].controlicon == "否" || datas[i]['data'] == undefined) continue;
                isshow = true;
                // var naa=currentSettings['data'][i].replace("{data:datasources[\"","");
                // var na=naa.substring(0,naa.indexOf("\"]"));
                var na = datas[i]['name']||datas[i]['data']['name'];
                var dd = $('<dd style="cursor: pointer;margin:2px;padding:3px 5px;border-radius:2px;font-size:12px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" class="ischecked" title="' + na + '" ><span class="checkbox"></span><span>' + na + '</span></dd>');
                dd.appendTo($('#kz' + self.mapcode));
                dd.click(function() {
                    self.ShowOrHide(this, this.title);
                })
            }

            // $('#kz'+self.mapcode).children('dd').click(function(){
            //     for(var f=0;f<this.attributes.length;f++){
            //         if(this.attributes[f].name=="fun"){
            //             var iz =this.attributes[f].value;
            //             self.ShowOrHide(this,datas[iz]['data']['name']);
            //         }
            //     }
            // })

            self.showTc();

        }
        /*显示图层控制面板 */
        this.showTc = function() {

            $('#kz' + self.mapcode).parent("div").toggle();
        }

        /*地图工具方法 */
        this.MenuClick = function(id) {
            switch (id) {
            case 1:
                self.ClearAll();
                self.enumMap(1);
                break;
            case 2:
                self.CircleQuery(0);
                break; // 空间查询-圈查询
            case 3:
                self.RectQuery(0);
                break; // 空间查询-矩形查询
            case 4:
                self.PolyQuery(0);
                break; // 空间查询-多边形查询
            case 5:
                self.CalcDistance();
                break; //测量-距离测量
            case 6:
                self.CalcArea();
                break; //测量-面积测量
            case 7:
                self.PointQuery(0);
                break; //绘制点
            case 9:
                self.LineQuery(0);
                break; //绘制线
            case 10:
                self.EllipseQuery(0);
                break; //绘制线
            default:
                break;
            }
        }

        /*测量-距离测量 */
        this.CalcDistance = function() {
            // 距离量算
            function LineStartCallBack(e) {
                self.zmap2dtool.ClearGeometry();
                // map2DView.RemoveLabel("measurdistipst");
                self.zmap2dview.RemoveLabel("endpt");

            }
            LineStartCallBack();

            function LineEndCallBack(e) {
                var st_ed = e.feature.values_.geometry.extent_;
                var polys = e.feature.values_.geometry.flatCoordinates;
                var len = polys.length;
                var length = 0.0;
                for (var i = 1; i < polys.length / 2; i++) {
                    length += self.CalcFlatDistance(polys[2 * i - 2], polys[2 * i - 1], polys[2 * i], polys[2 * i + 1]);
                }
                length /= 1000.0;
                var jd = polys[len - 2];
                var wd = polys[len - 1];
                var arr = [jd, wd];
                arr = self.mkt2jw(arr);

                self.zmap2dview.AddTextLabel("endpt", arr[0], arr[1], "总长:" + length.toFixed(2) + "公里");
            }

            self.AddFlashTip("提示:点击鼠标左键开始,双击鼠标左键结束!", 2000);
            self.zmap2dtool.StartLineTool(LineStartCallBack, LineEndCallBack);
            return;
        }

        /*测量-面积测量 */
        this.CalcArea = function() {
            function PolyStartCallBack(e) {
                self.zmap2dtool.ClearGeometry();
                self.zmap2dview.RemoveLabel('endpt');
            }
            PolyStartCallBack();

            function PolyEndCallBack(e) {
                var polys = e.feature.values_.geometry.flatCoordinates;
                var tooltipCoord = e.feature.values_.geometry.getInteriorPoint().getCoordinates();

                var len = polys.length - 2;
                var area = 0.0;
                for (var i = 1; i <= polys.length / 2 - 3; i++) {
                    area += self.CalcTriAngleArea(polys[2 * i - 2], polys[2 * i - 1], polys[2 * i], polys[2 * i + 1], polys[2 * i + 2], polys[2 * i + 3]);
                }
                var tip = "";
                if (area > 1000000) {
                    area /= 1000000;
                    tip = "总面积:" + area.toFixed(2) + "平方公里";
                } else {
                    tip = "总面积:" + area.toFixed(2) + "平方米";
                }

                var jd = tooltipCoord[0];
                var wd = tooltipCoord[1];
                var arr = [jd, wd];
                arr = self.mkt2jw(arr);
                self.zmap2dview.AddTextLabel('endpt', arr[0], arr[1], tip);
            }

            self.AddFlashTip("面积提示：左击开始，点选同一个点结束（双击鼠标左键结束）", 2000);
            self.zmap2dtool.StartPolygonTool(PolyStartCallBack, PolyEndCallBack);
            return;
        }
        //球面三角形面积
        this.CalcTriAngleArea = function(lon1, lat1, lon2, lat2, lon3, lat3) {
            var a = self.CalcFlatDistance(lon1, lat1, lon2, lat2);
            var b = self.CalcFlatDistance(lon2, lat2, lon3, lat3);
            var c = self.CalcFlatDistance(lon1, lat1, lon3, lat3);
            var p = (a + b + c) / 2;
            var S = Math.sqrt(p * (p - a) * (p - b) * (p - c));
            return S;
        }

        //MKT转JW
        this.mkt2jw = function(pt) {
            var cpt = self.zmap2dview.MapCoord2JW(pt);
            return cpt;
        }
        this.getRad = function(d) {
            var EARTH_RADIUS = 6378137.0; //单位M
            var PI = Math.PI;
            return d * PI / 180.0;
        }

        // 测距算法
        this.CalcFlatDistance = function(lng1, lat1, lng2, lat2) {
            var code = self.zmap2dview.GetMap().getView().getProjection().code_;
            if (code == "EPSG:4326" || code == "EPSG:4490") {
                var EARTH_RADIUS = 6378137.0; //单位M
                var PI = Math.PI;

                var f = self.getRad((lat1 + lat2) / 2);
                var g = self.getRad((lat1 - lat2) / 2);
                var l = self.getRad((lng1 - lng2) / 2);
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
            } else {
                return Math.sqrt(Math.pow((lng2 - lng1), 2.0) + Math.pow((lat2 - lat1), 2.0));
            }
        }
        /*画圆方法，传回调方法callquery返回对应坐标及类型参数 */
        this.CircleQuery = function(callquery) {
            self.clearlabels();
            //圆工具
            var pt = [];
            function Start(e) {}

            function End(e) {
                var geom = e.feature.getGeometry();
                if (geom) {
                    var center = geom.getCenter();
                    var radius = geom.getRadius();
                    radius = self.mkt2jw([radius,0])[0];
					center = self.mkt2jw(center);
                    var c = self.zmap2dview.Circle(center, radius);
                    self.zmap2dview.AddGeometrys("testCircle", c, "", false);
                    pt.push(center);
                    pt.push(radius);
                    var Kcoors = pt;
                    var Ktype = 'Circle';
                    if (callquery != 0 && typeof callquery === "function") callquery(Kcoors, Ktype);

                }
                self.zmap2dtool.ClearAll();
            }
            self.zmap2dtool.StartCircleTool(Start, End);

        }
        /**
         * 对象合并
         * @returns {Object|{}|ZMap.MapWidget.init|any}
         * @private
         */
        this._extend = function() {
            var length = arguments.length;
            var target = arguments[0] || {};
            if (typeof target!="object" && typeof target != "function") {
                target = {};
            }
            if (length == 1) {
                target = this;
                i--;
            }
            for (var i = 1; i < length; i++) {
                var source = arguments[i];
                for (var key in source) {
                    // 使用for in会遍历数组所有的可枚举属性，包括原型。
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        }
        this.getRandomInt = function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        /**
         * 90度--------------
         *                  |
         *                  |
         *                  |
         *                  |
         *                  |
         *                  |
         *                  |
         *                  |
         *                 起点
         *
         *
         * 画扇形方法< /br>
         * 起点为正南方向
         * @param center 扇形中心
         * @param radius 半径
         * @param angle 扇形角度
         * @param opt 配置参数，默认使用 @defaultOpt
         * @returns {{name, vector: T}}
         */
        this.addSector = function(center, radius, angle, opt) {
            var defaultOpt = {
                name:"sector-"+Date.now()+"-"+this.getRandomInt(100,999),
                sides:100,      //边数
                offsetAngle:0, //起始偏移角度
                fillColor:'rgba(255, 255, 128, 0.25)',
                lineWidth:2,
                lineColor:'rgba(0, 255, 0, 0.75)',
                update:true //同名的实体是更新还是创建，默认采用更新（会判断是都存在名称为该name的layer）
            }
            opt = this._extend(defaultOpt,opt);
            var geom = this._createRegularPolygonCurve(center, radius, angle, opt.sides, opt.offsetAngle);

            var layerName = this.zmap2dview.AddGeometrys(opt.name, geom, new ol.style.Style({
                stroke: opt.lineWidth<1 ? null : new ol.style.Stroke({
                    color: opt.lineColor,
                    lineDash: [0],
                    width: opt.lineWidth
                }),
                fill: new ol.style.Fill({
                    color: opt.fillColor
                })
            }), !!opt.update);

            return {
                name:layerName,
                vector:this.zmap2dview.GetUnkLayer(layerName),
            };
        }

        /**
         *
         * @param origin 圆心
         * @param radius 半径
         * @param r 弧度
         * @param sides 边数
         * @param offsetAngle 偏移角
         * @returns {ol.geom.Polygon}
         */
        this._createRegularPolygonCurve = function(origin, radius, r, sides, offsetAngle) {


            var rotation = 360 - r;
            var angle = Math.PI * ((1/sides) - (1/2));
            if(rotation) {
                angle += (rotation / 180) * Math.PI;
            }
            var rotatedAngle, x, y;
            var points = [];
            if(rotation!=0){
                points.push(origin);
            }
            for(var i=0; i<=sides; ++i) {
                var an = i*((360 - rotation)/360);
                rotatedAngle = angle + (an * 2 * Math.PI / sides);
                x = origin[0] + (radius * Math.cos(rotatedAngle));
                y = origin[1] + (radius * Math.sin(rotatedAngle));
                points.push([x,y]);
            }
            if(rotation!=0){
                points.push(origin);
            }
            var ring = new ol.geom.LinearRing(points);
            ring.rotate(-(offsetAngle/180*Math.PI),origin)
            var poy = new ol.geom.Polygon([points]);
            poy.flatCoordinates = ring.flatCoordinates

            return poy;
        }

        /**
         * 添加环形,两个闭环 填充中间区域
         * @param line1 [[lng,lat],[lng,lat],...]
         * @param line2 [[lng,lat],[lng,lat],...]
         * @param opt 其他配置参数
         * @see defaultOpt
         * @return {{name, vector}[]}
         */
        this.addRing = function (line1,line2,opt) {
            var begin1 = (line1.length/2)|0
            var begin2 = (line2.length/2)|0
            var lines = []
            if(opt.lineWidth){
                lines.push(this.addLine(line1,opt))
                lines.push(this.addLine(line2,opt))
            }
            opt.lineWidth = 0
            // 两个半环组合成一个环
            var half_circle1 = this.addGeometry(line1.slice(0,begin1).concat(line2.slice(0,begin2).reverse()).map(function(item){
                return opt.EPSG === "EPSG:3857" ? item : ol.proj.transform(item, 'EPSG:4326', 'EPSG:3857');//根据经纬度生成圆点
            }),opt)
            var half_circle2 = this.addGeometry(line1.slice(begin1-1).concat(line2.slice(begin2-1).reverse()).map(function(item){
                return opt.EPSG === "EPSG:3857" ? item : ol.proj.transform(item, 'EPSG:4326', 'EPSG:3857');//根据经纬度生成圆点
            }),opt)
            return [half_circle1,half_circle2].concat(lines)
        }
        /**
         * 添加几何
         * @param points [[lng,lat],[lng,lat],...]
         * @param opt 其他配置参数
         * @see defaultOpt
         * @return {{name, vector}}
         */
        this.addGeometry = function(points, opt) {
            var defaultOpt = {
                name:"geometry-"+Date.now()+"-"+this.getRandomInt(100,999),
                sides:100,      //边数
                offsetAngle:0, //起始偏移角度
                fillColor:'rgba(255, 255, 128, 0.25)',
                lineWidth:0,
                lineColor:'rgba(0, 255, 0, 0.75)',
                update:true //同名的实体是更新还是创建，默认采用更新（会判断是都存在名称为该name的layer）
            }
            opt = this._extend(defaultOpt,opt);
            var ring = new ol.geom.LinearRing(points);
            // ring.rotate(-(offsetAngle/180*Math.PI),origin)
            var geom = new ol.geom.Polygon([points]);
            geom.flatCoordinates = ring.flatCoordinates

            var layerName = this.zmap2dview.AddGeometrys(opt.name, geom, new ol.style.Style({
                stroke: opt.lineWidth<1 ? null : new ol.style.Stroke({
                    color: opt.lineColor,
                    lineDash: [0],
                    width: opt.lineWidth
                }),
                fill: new ol.style.Fill({
                    color: opt.fillColor
                })
            }), !!opt.update);

            return {
                name:layerName,
                vector:this.zmap2dview.GetUnkLayer(layerName),
            };
        }
        /**
         * 添加描线
         * @param points [[lng,lat],[lng,lat],...]
         * @param opt 其他配置参数
         * @see defaultOpt
         * @return {{name, vector}}
         */
        this.addLine = function(points, opt) {
            var defaultOpt = {
                name:"line-"+Date.now()+"-"+this.getRandomInt(100,999),
                lineWidth:0,
                lineColor:'rgba(0, 255, 0, 0.75)',
                update:true //同名的实体是更新还是创建，默认采用更新（会判断是都存在名称为该name的layer）
            }
            opt = this._extend(defaultOpt,opt);
            var ring = new ol.geom.LinearRing(points);
            // ring.rotate(-(offsetAngle/180*Math.PI),origin)
            var geom = new ol.geom.Polygon([points]);
            geom.flatCoordinates = ring.flatCoordinates

            var layerName = this.zmap2dview.AddGeometrys(opt.name, geom, new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: opt.lineColor,
                    lineDash: [0],
                    width: opt.lineWidth
                })
            }), !!opt.update);

            return {
                name:layerName,
                vector:this.zmap2dview.GetUnkLayer(layerName),
            };
        }


         /*画点方法，传回调方法callquery返回对应坐标及类型参数 */
        this.PointQuery = function(callquery) {
            self.clearlabels();
            self.zmap2dview.AddEventListener("click", DrawPoint);
            function DrawPoint(e) {
                self.zmap2dview.RemoveEventListener("click", DrawPoint);
                var point = e.coordinate;
                if (point == undefined || point == null || point.length < 2)
                    return;
                point=self.mkt2jw(point);
                 var redStyle = new ZMap2D.GeomStyle({
                        color: 'rgba(255, 0, 0, 0.8)',
                        width: 3,
                        bordercolor:'rgba(255, 0, 0,1)'
                    });
                var geomPoints = self.zmap2dview.MultiPoint([point]);
                self.zmap2dview.AddGeometrys("testPoint", geomPoints, redStyle, false);

                var Kcoors = point;
                var Ktype = 'Point';
                if (callquery != 0 && typeof callquery === "function") callquery(Kcoors, Ktype);
             }

        }



         /*画线方法，传回调方法callquery返回对应坐标及类型参数 */
        this.LineQuery = function(callquery) {
            self.clearlabels();

            var po = [];
            self.zmap2dtool.RemoveInteraction(); //禁用二维当前交互
            function Start1(e) {}
            function End1(e) {
                var geom = e.feature.getGeometry();
                if (geom) {
                    coords = geom.getCoordinates();
                    for(var i=0;i<coords.length;i++){
                        //墨卡托转经纬度
                        var  jw = self.mkt2jw(coords[i]);
                        po.push(jw);
                    }
                    var geomLine = self.zmap2dview.MultiLine([po]);
                    self.zmap2dview.AddGeometrys("testLine", geomLine, null, false);
                    self.zmap2dtool.RemoveInteraction(); //禁用二维当前交互

                    var Kcoors = po;
                    var Ktype = 'LineString';
                    if (callquery != 0 && typeof callquery === "function") callquery(Kcoors, Ktype);

                }
            }
            self.zmap2dtool.StartLineTool(Start1, End1);

        }




        //http://localhost:8080/zs/sqs/query/circle?name=anshun&table=POI_SPOTINFO&format=json&circle=106.14023619800625,26,261306988339615,0.0003939104980362831
        //拉框查询---------------------------------------
        /*画矩形拉框方法，传回调方法callquery返回对应坐标及类型参数 */
        this.RectQuery = function(callquery,beforeQuery) {
            self.clearlabels(); //清除之前画的
            var st = [];
            var en = [];
            var pt = [];
            var msg = '请单击地图按住鼠标拖动绘制'
            if(beforeQuery === undefined){
                this.AddFlashTip(msg,1500);
            }else if(typeof beforeQuery === 'number'){
                this.AddFlashTip(msg,beforeQuery);
            }else if(typeof beforeQuery === 'function'){
                var result = beforeQuery(msg)
                if(result === false){
                    return
                }
            }
            self.zmap2dtool.StartRectTool(Start, End);

            function Start(e) {
                st = e.coordinate;
            }
            function End(e) {
                en = e.coordinate;
                var poly = [];
                poly.push(st);
                poly.push([st[0], en[1]]);
                poly.push(en);
                poly.push([en[0], st[1]]);
                poly.push(st);
                for (var i = 0; i < poly.length - 1; i++) {
                    var po = self.mkt2jw(poly[i]);
					pt.push(po);
                }
                self.zmap2dtool.ClearAll(); //--可以多次拉框
                var polys = self.zmap2dview.Polygon([pt]);
                self.zmap2dview.AddGeometrys("testreact", polys, "", true);
                var Kcoors = pt;
                var Ktype = 'Rectange';
                if (callquery != 0 && typeof callquery === "function") callquery(Kcoors, Ktype);
            }

        }

        /*画矩形拉框方法，传回调方法callquery返回对应坐标及类型参数 */
        this.EllipseQuery = function(callquery,beforeQuery) {
            self.clearlabels(); //清除之前画的
            var st = [];
            var en = [];
            var pt = [];
            var msg = '请单击地图按住鼠标拖动绘制'
            if(beforeQuery === undefined){
                this.AddFlashTip(msg,1500);
            }else if(typeof beforeQuery === 'number'){
                this.AddFlashTip(msg,beforeQuery);
            }else if(typeof beforeQuery === 'function'){
                var result = beforeQuery(msg)
                if(result === false){
                    return
                }
            }
            self.zmap2dtool.StartRectTool(Start, End);

            function Start(e) {
                st = e.coordinate;
            }
            function End(e) {
                en = e.coordinate;
                st = self.mkt2jw(st);
                en = self.mkt2jw(en);

                var c = [(en[0]+st[0])/2,(en[1]+st[1])/2]
                var rx = Math.abs(en[0]-st[0])/2;
                var ry = Math.abs(en[1]-st[1])/2;
                pt = self.getEllipsePoint(c,rx,ry)

                self.zmap2dtool.ClearAll(); //--可以多次拉框
                var polys = self.zmap2dview.Polygon([pt]);
                self.zmap2dview.AddGeometrys("testreact", polys, "", true);
                var Kcoors =[c,rx,ry];
                var Ktype = 'Ellipse';
                if (callquery != 0 && typeof callquery === "function") callquery(Kcoors, Ktype);
            }

        }



        //多边形查询-------------------------------
        /*画多边形方法，传回调方法callquery返回对应坐标及类型参数 */
        this.PolyQuery = function(callquery,beforeQuery) {
            var pt = [];
            var str = '';
            self.clearlabels();

            function Start(e) {}

            function End(e) {
                var geom = e.feature.getGeometry();
                if (geom) {
                    var coords = geom.getCoordinates();
                    // alert(coords);
                    for (var i = 0; i < coords[0].length; i++) {
                        var po = self.mkt2jw(coords[0][i]);
						pt.push(po);
                    }
                    var polys = self.zmap2dview.Polygon([pt]);
                    self.zmap2dview.AddGeometrys("testpoly", polys, "", false);
                    var Kcoors = [pt];
                    var Ktype = 'Polygon';
                    if (callquery != 0 && typeof callquery === "function") callquery(Kcoors, Ktype);
                }
                self.zmap2dtool.ClearAll();
            }
            if(beforeQuery === undefined){
                this.AddFlashTip("请点击地图 双击结束",1500);
            }else if(typeof beforeQuery === 'number'){
                this.AddFlashTip("请点击地图 双击结束",beforeQuery);
            }else if(typeof beforeQuery === 'function'){
                var result = beforeQuery()
                if(result === false){
                    return
                }
            }
            self.zmap2dtool.StartPolygonTool(Start, End);
        }

        //清除所有画的标记，画圆画面及画矩形所产生的标记
        this.clearlabels = function() {
            self.zmap2dview.RemoveGeometrys('testPoint');
            self.zmap2dview.RemoveGeometrys('testLine');
            self.zmap2dview.RemoveGeometrys('testpoly');
            self.zmap2dview.RemoveGeometrys('testreact');
            self.zmap2dview.RemoveGeometrys('testCircle');
            self.zmap2dview.RemoveLabel("ptlabel"); //清除双击提示点

        }

        //    var onlyTip = null;
        /*提示栏，传内容及提示框消失时间 */
        this.AddFlashTip = function(text, miniSeconds) {
            self.CloseFlashTip();
            if (self.onlyTip == null) {
                if (miniSeconds == null) miniSeconds = 3000;
                var cen = self.zmap2dview.GetViewCenter();
                if (cen == null) {
                    self.CloseFlashTip();
                    return;
                }
                self.zmap2dview.AddTextLabel('only-tip', cen[0], cen[1], text);
                self.onlyTip = setInterval(function() {
                    self.CloseFlashTip()
                },
                miniSeconds);
            }
        }
        /*移除提示框 */
        this.CloseFlashTip = function() {
            if (self.onlyTip != null) {
                self.zmap2dview.RemoveLabel('only-tip');
                clearInterval(self.onlyTip);
                self.onlyTip = null;
            }
        }

        /*移除所有工具所产生的标记 */
        this.ClearAll = function() {
            self.zmap2dtool.ClearAll();
            self.zmap2dview.RemoveLabel("endpt");
            self.clearlabels();
            self.CloseFlashTip();
            self.clearLineArea('draw');

        }
        /*绘制等值线等值面 */
        this.dreawLine = function(polys, val1, val2, s_name,showT) {
            // Lineload=layer.load(1, {
            //   shade: [0.2,'#000']
            //  });
            var data = [];
            var values = [];
            for (var i = 0; i < self.LA[s_name]['sitData'].length; i++) {
                var value = self.LA[s_name]['sitData'][i]['properties'][val1];
                var row = [self.LA[s_name]['sitData'][i]['geometry']['coordinates'][0] + '', self.LA[s_name]['sitData'][i]['geometry']['coordinates'][1] + '', value];
                data.push(row);
            }

            var datainfos = {
                name: "data",
                data: data
            };

            var colors = [];
            var colorLine = [];
            // for(var s=0;s<self.LA['lineColor'].length;s++){
            //     if($('#'+self.mapcode+'type3').combobox('getValue') == self.LA['lineColor'][s].type){
            //         colors=self.LA['lineColor'][s].color;
            //         for(var q=0;q<colors.length;q++){
            //             values.push(parseFloat(colors[q].min));
            //             values.push(parseFloat(colors[q].max));
            //             colorLine.push(colors[q].color);
            //         }
            //     }
            // }
            if (self.getDatasource()[val2] == undefined || self.getDatasource()[val2]['color'] == undefined) {
                console.log('无色表数据');
                return;
            }
            var colordata = self.getDatasource()[val2]['color'];
            var colors = colordata;
            for (var q = 0; q < colordata.length; q++) {
                values.push(parseFloat(colordata[q].min));
                values.push(parseFloat(colordata[q].max));
                colorLine.push(colordata[q].color);
            }
            values = self.unique(values); //弃掉重复的值
            //dreawLineList(values,colorLine);//创建等值面色表
            var linecolor = "rgb(255, 255, 255)"; //等值线的颜色
            // var url = "http://192.168.8.160:9080/zs/FeatureGrapha/contourline";
            // var eurl = encodeURIComponent(url);

            //  var http = GetGISServerAddress() + '/LJZYGL/ZMapProxy?proxy=' + eurl;

            // var http =
            $.ajax({
                type: 'POST',
                url: self.getGISServerAddress() + 'zs/FeatureGrapha/contourline',
                //  url: http ,
                ansync: false,
                data: {
                    method: self.LA[s_name]['lineAreaType'],
                    datainfos: JSON.stringify(datainfos),
                    polygon: JSON.stringify(polys),
                    values: JSON.stringify(values),
                    colors: JSON.stringify(colors),
                    linecolor: JSON.stringify(linecolor),
                    width: self.LA[s_name]['m_ContourGridWidth'],
                    height: self.LA[s_name]['m_ContourGridHeight'],
                    extent: JSON.stringify(self.LA[s_name]['searchExtent']),
                    zmin: 0,
                    zmax: 40,
                    imageFormat: "base64",
                    returnLine: true
                },
                dataType: 'json',
                success: function(data) {
                    var pic = data.pic;

                    //转换base64字符显示图片
                    if (pic != null) {
                        var img = document.getElementById("m_ShowLayerName");
                        if (img == null) {
                            img = document.createElement("img");
                        }
                        img.onload = function(e) {
                            window.URL.revokeObjectURL(img.src);
                            if (self.LA[s_name]['singleLayerBK']) {
                                self.zmap2dview.RemoveLayer(self.LA[s_name]['singleLayerBK']);
                                self.LA[s_name]['singleLayerBK'] = null;
                            }
                        };
                        img.src = "data:image/png;base64," + pic;
                        var opt_options = {
                            name: "m_ShowLayerName",
                            url: img.src,
                            opacity: 0.7,
                            extent: self.zmap2dview.JW2MapExtent(self.LA[s_name]['searchExtent']),
                            projection:self.projection

                        };

                        self.LA[s_name]['singleLayerBK'] = self.LA[s_name]['singleLayer'];
                        self.zmap2dview.RemoveLayer(self.LA[s_name]['singleLayer']);
                        self.LA[s_name]['singleLayer'] = new ZMap2D.SingleImageLayer(opt_options);

                        self.zmap2dview.AddTileLayer(self.LA[s_name]['singleLayer']);
                        self.LA[s_name]['singleLayer'].SetVisible(true);
                    }
                    if(showT)
                    self.dreawLineText(data.lines, s_name); //追加等值线数值
                    //layer.close(Lineload);
                },
                error: function(e) {
                    //layer.close(Lineload);
                }
            });
        }

        //计算一个点是否在多边形里,参数:点,多边形数组
        this.PointInPoly = function(pt, poly) {
            for (var c = false,
            i = -1,
            l = poly.length,
            j = l - 1; ++i < l; j = i)((poly[i][1] <= pt[1] && pt[1] < poly[j][1]) || (poly[j][1] <= pt[1] && pt[1] < poly[i][1])) && (pt[0] < (poly[j][0] - poly[i][0]) * (pt[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0]) && (c = !c);
            return c;
        }

        //追加等值线数值
        this.dreawLineText = function(lineData, s_name) {
            if (lineData == null) return;
            var name = "";
            var labelText = [];
            var label = [];
            for (var t in lineData) {
                var line = lineData[t];
                for (var s = 0; s < line.length; s++) {
                    var geomLine = self.zmap2dview.Line(line[s]);
                    var zjNum = parseInt(line[s].length / 2);
                    var jwd = line[s][zjNum];
                    var lineCoords = [];
                    for (var k = 0; k < self.LA[s_name]['coords'].length; k++) {
                        var points = self.LA[s_name]['coords'][k][0];
                        var a = self.PointInPoly(jwd, points);
                        if (a == true) {

                            labelText.push(t);
                            label.push([parseFloat(jwd[0]), parseFloat(jwd[1])]);

                            //LA[mapcode]['textName'].push(mapcode+t+s+k+"line");//存储追加的等值线的值
                            //self.zmap2dview.AddTextLabel(mapcode+t+s+k+"line", parseFloat(jwd[0]), parseFloat(jwd[1]), t);
                        }
                    }
                }
            }

            //self.addPoint(undefined,s_name+'textname',labelText,label,[],false,[]);
            var data = {};
            data['name'] = s_name + 'textname';
            data['imageStyle'] = undefined;
            data['texts'] = labelText;
            data['icons'] = [];
            data['points'] = label;
            data['showGeometry'] = true;
            data['attrs'] = [];
            data['radius'] = 0.01;
            self.addPoint(data);
        }

        //任意划面工具
        this.dreawMap = function(type, s_name, val1, val2,showT) {
            // this.LA[s_name]= getLA();
            self.LA[s_name]['isDreaw'] = false;
            self.clearLineArea(s_name);
            if (s_name == 'draw') self.getLineData(s_name);
            self.LA[s_name]['lineAreaType'] = type;

            function AnyPolygonStart(e) {}

            function AnyPolygonEnd(e) {
                var geom = e.feature.getGeometry();
                if (geom == undefined) return;
                var extent = geom.getExtent();

				var min = ZMap2D.Convert(self.projection,'EPSG:4326', [extent[0], extent[1]]);
				var max = ZMap2D.Convert(self.projection,'EPSG:4326', [extent[2], extent[3]]);
				extent= [ min[0], min[1], max[0], max[1]];

                self.LA[s_name]['searchExtent'] = extent;
                var extent1 = self.zmap2dview.MapCoord2Screen([extent[0], extent[1]]);
                var extent2 = self.zmap2dview.MapCoord2Screen([extent[2], extent[3]]);
                self.LA[s_name]['m_ContourGridWidth'] = extent2[0] - extent1[0];
                self.LA[s_name]['m_ContourGridHeight'] = extent1[1] - extent2[1]; //self.LA[s_name]['m_ContourGridWidth'];
                var point = e.coordinate;
                if (geom == null) {
                    return true;
                }
                self.zmap2dtool.ClearAll();
                var polys = geom.getCoordinates();
				for(var i=0;i<polys.length;i++){
					for(var j=0;j<polys[i].length;j++)
					{
						polys[i][j]=self.mkt2jw(polys[i][j]);
					}
				}
                self.LA[s_name]['coords'] = [polys];
                var polys = self.zmap2dview.Polygon(polys);
                self.zmap2dview.AddGeometrys(s_name + "tmp-draw-polygon", polys, ZMap2D.DefaultStyle, true);
                self.dzmFunc(s_name, val1, val2,showT);
                return true;
            }
            //  layer.msg("请在按下鼠标左键在视图中任意画多边形区, 鼠标左键弹起结束!");
            self.zmap2dtool.ClearGeometry();
            self.zmap2dtool.StartAnyPolygonTool(AnyPolygonStart, AnyPolygonEnd);
        }

        //生成等值面
        this.dzmFunc = function(s_name, val1, val2,showT) {
            self.LA[s_name]['isDreaw'] = true; //已生成等值面
            self.Listener[s_name] = self.Listener[s_name] || {};
            self.Listener[s_name]['type'] = 'zoom';
            self.Listener[s_name]['fun'] = function() {
                var zoom = self.zmap2dview.GetZoom(); //获取地图级别
                //重绘等值面
                if (self.LA[s_name]['zoomLast'] == "") {
                    self.LA[s_name]['zoomLast'] = zoom;
                } else if (self.LA[s_name]['zoomLast'] != zoom) {

                    //重绘等值面
                    if (self.LA[s_name]['isDreaw'] == true) {

                        if (zoom >= self.LA[s_name]['zoomLast']) {
                            if (zoom > self.LA[s_name]['zoomLast']) m_RecordMaxZoom = zoom;
                            else return;

                            self.LA[s_name]['m_ContourGridWidth'] = self.LA[s_name]['m_ContourGridWidth'] >= self.LA[s_name]['m_MaxGridWidth'] ? self.LA[s_name]['m_MaxGridWidth'] : self.LA[s_name]['m_ContourGridWidth'] += self.LA[s_name]['m_StepWH'];
                            self.LA[s_name]['m_ContourGridHeight'] = self.LA[s_name]['m_ContourGridHeight'] >= self.LA[s_name]['m_MaxGridHeight'] ? self.LA[s_name]['m_MaxGridHeight'] : self.LA[s_name]['m_ContourGridHeight'] += self.LA[s_name]['m_StepWH'];

                            self.dreawLine(self.LA[s_name]['coords'], val1, val2, s_name,showT);

                        } else if (zoom < self.LA[s_name]['zoomLast']) {
                            self.LA[s_name]['m_ContourGridWidth'] = self.LA[s_name]['m_ContourGridWidth'] <= self.LA[s_name]['m_MinGridWidth'] ? self.LA[s_name]['m_MinGridWidth'] : self.LA[s_name]['m_ContourGridWidth'] -= self.LA[s_name]['m_StepWH'];
                            self.LA[s_name]['m_ContourGridHeight'] = self.LA[s_name]['m_ContourGridHeight'] <= self.LA[s_name]['m_MinGridHeight'] ? self.LA[s_name]['m_MinGridHeight'] : self.LA[s_name]['m_ContourGridHeight'] -= self.LA[s_name]['m_StepWH'];
                            m_MapZoom = zoom;
                            self.dreawLine(self.LA[s_name]['coords'], val1, val2, s_name,showT);
                        }
                    }
                    self.LA[s_name]['zoomLast'] = zoom;
                }
            }

            self.zmap2dview.AddEventListener('zoom', self.Listener[s_name]['fun']); //地图级别改变重新绘图以及站点数量改变
            self.dreawLine(self.LA[s_name]['coords'], val1, val2, s_name,showT);
        }

        /****************************** 去掉重复值 *****************************************/
        this.unique = function(arr) {
            var temp = new Array();
            //arr=evlabc(arr);
            for (i = 0; i < arr.length; i++) {
                if (arr[i] == arr[i + 1]) {
                    continue;
                }
                temp[temp.length] = arr[i];
            }
            return temp;
        }

        /*获取等值线等值面数据参数，数据该地图上图的数据根据下拉选择*/
        this.getLineData = function(s_name) {
            //self.getline(s_name);
            var val = [];//$('#' + self.mapcode + 'type1').combobox('getData');

            for (key in self.paramdata) {
                if (key.indexOf(self.mapcode) != -1 && self.paramdata[key]['data']['name'] != undefined && self.paramdata[key]['data']['geometryType'] == "MultiPoint")
                {
                    val.push(self.paramdata[key]);
                }
            }



            var newValue =$('#' + self.mapcode + 'type1').val(); //$('#' + self.mapcode + 'type1').combobox('getValue');
            var datas;
            for (var i = 0; i < val.length; i++) {
                if (newValue == val[i]['name']) {
                    datas = val[i]['data'];
                    break;
                }
            }
            self.LA[s_name]['sitData'] = datas['features'];
        }

        /*移除等值线等值面相关的图层及事件和数据 ，s_name为该等值线等值面设置的名称*/
        this.clearLineArea = function(s_name) {
            if (self.LA[s_name]['isDreaw'] == undefined) return;
            self.LA[s_name]['isDreaw'] = false;
            //本次等值面的图层
            self.Listener[s_name] = self.Listener[s_name] || {};
            self.zmap2dview.RemoveEventListener('zoom', self.Listener[s_name]['fun']);
            delete self.Listener[s_name];
            self.zmap2dview.RemoveLayer(self.LA[s_name]['singleLayer']);
            //上次等值面的图层
            if (self.LA[s_name]['singleLayerBK'] != null && self.LA[s_name]['singleLayerBK'] != undefined) self.zmap2dview.RemoveGeometrys(self.LA[s_name]['singleLayerBK']);
            //工具画出的多边形
            self.zmap2dview.RemoveGeometrys(s_name + 'tmp-draw-polygon');

            self.zmap2dview.RemoveLayer(self.LayerName[s_name + 'textname']);

            //self.zmap2dview.RemoveCustomControl('tuli');
            //生成等值面状态为false
        }
        /*添加等值线等值面图层，s_name为该等值线等值面设置的名称，datas为对应的数据，type为类型：line(等值线)和 gridline(等值面)*/
        this.addLine = function(s_name, datas, type,showT) {


            self.LA[s_name] = getLA();
            self.LA[s_name]['isDreaw'] = false;
            self.clearLineArea(s_name);
            //self.getline(s_name);
            self.LA[s_name]['sitData'] = datas.data['features'];
            self.LA[s_name]['lineAreaType'] = type == undefined ? "gridline": type;

            if (typeof datas.coords === "string" && datas.coords!="") datas['coords'] = (self.getDatasource()[datas.coords]||{}).coords;
            if (datas.coords == undefined || datas.coords.length == 0) {
                if (datas.searchExtent == undefined || datas.searchExtent.length != 4) {
                    var polys = [0, 0, 0, 0];
                    for (var x = 0; x < datas.data['features'].length; x++) {
                        var xx = datas.data['features'][x]['geometry']['coordinates'][0];
                        var yy = datas.data['features'][x]['geometry']['coordinates'][1];
                        if (x == 0) {
                            polys[0] = xx;
                            polys[2] = xx;
                            polys[1] = yy;
                            polys[3] = yy;
                        } else {
                            polys[0] = polys[0] <= xx ? polys[0] : xx;
                            polys[2] = polys[2] >= xx ? polys[2] : xx;
                            polys[1] = polys[1] <= yy ? polys[1] : yy;
                            polys[3] = polys[3] >= yy ? polys[3] : yy;
                        }

                    }
                } else {
                    var polys = datas.searchExtent;
                }
                var poly = [[[[polys[0], polys[1]], [polys[0], polys[3]], [polys[2], polys[3]], [polys[2], polys[1]], [polys[0], polys[1]]]]];
            } else {
                if (datas.searchExtent == undefined || datas.searchExtent.length != 4) {
                    var polys = [0, 0, 0, 0];
                    for (var qq = 0; qq < datas.coords.length; qq++) {
                        for (var q = 0; q < datas.coords[qq].length; q++) {
                            for (var x = 0; x < datas.coords[qq][q].length; x++) {
                                var xx = datas.coords[qq][q][x][0];
                                var yy = datas.coords[qq][q][x][1];
                                if (x == 0 && qq == 0) {
                                    polys[0] = xx;
                                    polys[2] = xx;
                                    polys[1] = yy;
                                    polys[3] = yy;
                                } else {
                                    polys[0] = polys[0] <= xx ? polys[0] : xx;
                                    polys[2] = polys[2] >= xx ? polys[2] : xx;
                                    polys[1] = polys[1] <= yy ? polys[1] : yy;
                                    polys[3] = polys[3] >= yy ? polys[3] : yy;
                                }

                            }
                        }
                    }
                } else {
                    var polys = datas.searchExtent;
                }
                var poly = datas.coords;
            }
            self.LA[s_name]['searchExtent'] = [polys[0], polys[1], polys[2], polys[3]];
            self.LA[s_name]['coords'] = poly;
            var extent1 = self.zmap2dview.MapCoord2Screen([polys[0], polys[1]])||[0,0];
            var extent2 = self.zmap2dview.MapCoord2Screen([polys[2], polys[3]])||[0,0];
            self.LA[s_name]['m_ContourGridWidth'] = extent2[0] - extent1[0];
            self.LA[s_name]['m_ContourGridHeight'] = extent1[1] - extent2[1];
            self.LA[s_name]['m_ContourGridWidth'] = self.LA[s_name]['m_ContourGridWidth'] >= self.LA[s_name]['m_MaxGridWidth'] ? self.LA[s_name]['m_MaxGridWidth'] : self.LA[s_name]['m_ContourGridWidth'];
            self.LA[s_name]['m_ContourGridHeight'] = self.LA[s_name]['m_ContourGridHeight'] >= self.LA[s_name]['m_MaxGridHeight'] ? self.LA[s_name]['m_MaxGridHeight'] : self.LA[s_name]['m_ContourGridHeight'];
            self.LA[s_name]['m_ContourGridWidth'] = self.LA[s_name]['m_ContourGridWidth'] <= self.LA[s_name]['m_MinGridWidth'] ? self.LA[s_name]['m_MinGridWidth'] : self.LA[s_name]['m_ContourGridWidth'];
            self.LA[s_name]['m_ContourGridHeight'] = self.LA[s_name]['m_ContourGridHeight'] <= self.LA[s_name]['m_MinGridHeight'] ? self.LA[s_name]['m_MinGridHeight'] : self.LA[s_name]['m_ContourGridHeight'];

            var polyss = self.zmap2dview.MultiPolygon(poly);
            self.zmap2dview.AddGeometrys(s_name + "tmp-draw-polygon", polyss, ZMap2D.DefaultStyle, true);

            var val1 = datas.valuefield;
            var val2 = datas.colorname;
            self.dzmFunc(s_name, val1, val2,showT);
            if (datas.showlegend != "否"&&datas.showlegend !=false) self.addLegend(val2,s_name);

        }
        /*添加图例显示*/
        this.addLegend = function(val2,name) {
            //self.zmap2dview.RemoveCustomControl('tuli');
            if (self.getDatasource()[val2] == undefined || self.getDatasource()[val2]['color'] == undefined) {
                console.log('无色表数据');
                return;
            }
			var h=$('#'+self.mapcode).height()-340;
			var a = document.getElementById(self.mapcode + 'sbt');//通过getelementbyid方法获取dom节点
			if(a){

			}
			else{
				self.zmap2dview.RemoveCustomControl('tuli');
				var htm='<div id="' + self.mapcode + 'sbt" style="max-height:'+h+'px;overflow-x:hidden;overflow-y:auto;width:87px;background: rgba(0,0,0,0);border-radius: 2px;">';
				self.zmap2dview.AddCommonControl('tuli', htm, '5', '', '', '210', 60, undefined, 10);
				$('#' + self.mapcode + 'sbt').parent('div').css("border-radius", "2px");
				$('#' + self.mapcode + 'sbt').parent('div').css("font-family", "微软雅黑");
				$('#' + self.mapcode + 'sbt').parent('div').css("box-shadow", " 0px 0px 8px 1px #e4c3c3");
				$('#' + self.mapcode + 'sbt').parent('div').css("background", "rgba(255,255,255,1)")
			}

			$('#tab'+self.mapcode+name+'tl').remove();

            var data = self.getDatasource()[val2]['color'];
            var html = '    <table id="tab'+self.mapcode+name+'tl" style="text-align:center;margin:0px 10px 0px 2px;border-spacing:0">' + '    <tr><th colspan="2" style="text-align:center;font-size:12px;height:55px;">' +name+"<br/>"+ (self.getDatasource()[val2].name||val2) + '</th></tr>' + '';
            for (var i = data.length-1; i >=0; i--) {
                html += '<tr height="15px" ><td width="20px" height="15px" style="color:#000;background-color:' + data[i].color + '" ></td>' + ' <td style="text-align:center;"><input style="background-color:rgba(0,0,0,0);text-align:center;font-size:12px;border:none;width:30px;height:14px;margin-top:-10px;vertical-align:text-top;" readonly value="' + data[i].max + '"></input></td>' + '</tr>'
				if(i==0)
					html += '<tr><td style="color:#000;background-color:rgba(0,0,0,0)" ></td>' + ' <td style="text-align:left;"><input style="background-color:rgba(0,0,0,0);text-align:center;margin-top:-10px;font-size:12px;border:none;width:30px;height:14px;vertical-align:text-top" readonly value="' + data[i].min + '"></input></td>' + '</tr>'

            }

            html += '</table>';
			$('#' + self.mapcode + 'sbt').prepend(html);


        }

        //添加区要素数据
        this.addRegionalLayer = function(labelName, data, lx) {

            var line = [];
            var vecSource;
            self.LayerName[labelName] = labelName;
            self.zmap2dview.RemoveLayer(self.LayerName[labelName]);
            var unkLayer = self.zmap2dview.GetUnkLayer(labelName);

            self.tooltipHtmlFun[data.name] ={
                clickFun:0,
                hoverFun:0
            }
            if(data.hoverFun)
            {
                if(typeof data.hoverFun =='function')
                    self.tooltipHtmlFun[labelName].hoverFun = data.hoverFun;
                else
                    self.tooltipHtmlFun[labelName].hoverFun = self.polygonHoverFun;
            }
            if(data.clickFun)
            {
                if(typeof data.clickFun =='function')
                    self.tooltipHtmlFun[labelName].clickFun = data.clickFun;
                else
                    self.tooltipHtmlFun[labelName].clickFun = self.polygonClickFun;
            }


            if (unkLayer == undefined) {
                //添加矢量图层
                vecSource = new ol.source.Vector();
                if (data.styleFunction && typeof data.styleFunction == 'function')
                {
                    unkLayer = new ol.layer.Vector({
                        name: labelName,
                        //source: new ol.source.ImageVector({
                        source: vecSource,
                        style:data.styleFunction
                        //})
                        //maxResolution: 0.05,
                    });
                }
                else
                {
                    unkLayer = new ol.layer.Vector({
                        name: labelName,
                        //source: new ol.source.ImageVector({
                            source: vecSource
                        //})
                        //maxResolution: 0.05,
                    });
                }
                // unkLayer = new ol.layer.Vector({
                //     name: labelName,
                //     //source: new ol.source.ImageVector({
                //         source: vecSource
                //     //})
                //     //maxResolution: 0.05,
                // });
                self.zmap2dview.olMap.addLayer(unkLayer);
            }
            var isArray = function(o) {
                return Object.prototype.toString.call(o) === '[object Array]';
            }
            // if(lx==0){
            var features = [];
            for (var i = 0; i < data.data.features.length; i++) {
                var li = data.data.features[i].geometry.coordinates;
                if (data.data.features[i].geometry.type == "Polygon") {
                    var geoms = self.zmap2dview.MultiPolygon([li]);
                }
				else if(data.data.features[i].geometry.type == "MultiPolygon") {
                    var geoms = self.zmap2dview.MultiPolygon(li);
                }
				else if(data.data.features[i].geometry.coordinates[0][0][0] instanceof Array){
					var geoms = self.zmap2dview.MultiPolygon(li);
				}
				else{
					var geoms =self.zmap2dview.MultiPolygon([li]);
				}

                if (lx == 0) {
                    var color = self.getDatasource()[data.colorname] || {};
                    if (color == undefined || color['color'] == undefined) {
                        color['color'] = [];
                    }
                    var fill = data.fillcolor||'rgba(' + (i % 255) + ', 255, 128, 0.25)';
                    var num = parseFloat(data.data.features[i].properties[data.valuefield]);
                    if (!isNaN(num)) {
                        for (var x = 0; x < color.color.length; x++) {
                            if (num >= color.color[x].min && num <= color.color[x].max) {
                                var co = color.color[x].color;
                                var tm = isNaN(parseInt(data.transparency) / 100) ? 1 : (parseInt(data.transparency) / 100);
                                if (co.indexOf("rgb(") > -1){
                                    fill = co.replace(")", "," + tm + ")").replace("rgb(", "rgba(");
                                }
                                else if(co.indexOf("rgba(") > -1){
                                    fill=co.substring(0,co.lastIndexOf(','))+','+tm+')';
                                }
                                else
                                    fill=co;

                                break;
                            }
                        }
                    }
                    var style = new ZMap2D.Style({
                        fill: fill,
                        stroke: data.linecolor||fill,
                        width_: 0
                    })
                } else if (lx == 1) {
                    var fill = data.fillcolor||'rgba(255, 255, 128, 0)';

                    var stroke = data.linecolor;
                    var soption = {
                        fill: fill,
                        stroke: stroke
                    };
                    if (data.linestyle == "否") soption['lineDash'] = [10];
                    var style = new ZMap2D.Style(soption);
                }
                var attrs = data.data.features[i];
                attrs['QNAME'] = labelName + i;
                attrs['ATTRNAME'] = labelName;
                var feature = new ol.Feature({
                    geometry: geoms,
                    name: labelName + i+'_feature',
                    attr: attrs
                });
                if (data.styleFunction && typeof data.styleFunction == 'function')
                {

                }
                else{
                    var myStyle = style ? style: ZMap2D.DefaultStyle;
                    feature.setStyle(myStyle);
                }

                features.push(feature)


            }
            vecSource.addFeatures(features);
            // self.removePointMoveListener('qu');
            // var upname = 0;
            // self.addPointMoveListener('qu', heightUp,{type:'Polygon'});
            // function heightUp(info) {
            //     if (info == null||info.length==0) {
            //         self.zmap2dview.RemoveGeometrys(upname);
            //         upname = 0;
            //         return;
            //     }
            //     if(info[0].type!="Polygon"&&info[0].type!="MultiPolygon")
            //     {
            //         return;
            //     }
            //     if(!info[0].subs[0].value.attr)
            //     {
            //         return;
            //     }
            //     if (info[0].subs[0].value.attr.QNAME == upname && upname != 0)
            //         return;
            //     if (info[0].subs[0].value.attr.QNAME == undefined)
            //         return;
            //     self.zmap2dview.RemoveGeometrys(upname);
            //     upname = info[0].subs[0].value.attr.QNAME;
			// 	// if (info[0].subs[0].value.attr.geometry.type == "Polygon") {
            //     //    var geomPoly = self.zmap2dview.MultiPolygon([info[0].subs[0].value.attr.geometry.coordinates]);
            //     // }
			// 	// else if(info[0].subs[0].value.attr.geometry.type == "MultiPolygon") {
            //     //     var geomPoly = self.zmap2dview.MultiPolygon(info[0].subs[0].value.attr.geometry.coordinates);
            //     // }
			// 	// else if(info[0].subs[0].value.attr.geometry.coordinates[0][0][0] instanceof Array){
			// 	// 	var geomPoly = self.zmap2dview.MultiPolygon(info[0].subs[0].value.attr.geometry.coordinates);
			// 	// }
			// 	// else{
			// 	// 	var geomPoly = self.zmap2dview.MultiPolygon([info[0].subs[0].value.attr.geometry.coordinates]);
			// 	// }
			// 	var geomPoly = new ol.geom.MultiPolygon(info[0].pos, 'XY');

            //    // var geomPoly = new ZMap2D.Polygon(info.subs[0].attr.geometry.coordinates);
            //     var highstyle = new ZMap2D.Style(data.highstyle||{});
            //     self.zmap2dview.AddGeometrys(upname, geomPoly,highstyle, false);
            //     if(data.hoverFun)
            //     {
            //         if(typeof data.hoverFun =='function')
            //             data.hoverFun(info[0],);
            //         else
            //             self.pointHoverFun(info[0],);
            //     }
            // }

            if (data.showlegend != "否" &&data.showlegend!=false) self.addLegend(data['colorname'],labelName);
        }
        this.addMultiRoam = function(data) {
            self.removeMultiRoam(data.data.name);

            var ii = 0;
            for (var i = 0; i < data.data.features.length; i++) {
                var li = data.data.features[i].geometry.coordinates;
                if (data.data.features[i].geometry.type == "MultiLineString") {
                    for (var p = 0; p < li.length; p++) {
                        var roam = {
                            name: data.data.name + ii,
                            line: li[p],
                            image: data.icon,
                            //data.data.features.image,
                            lineStyle: {
                                stroke: data.linecolor,
                                width: parseInt(data.linewidth),
                                lineDash: ((data.linestyle == "是"||data.linestyle == true) ? [20] : [0])
                            },
                            isShowPoint: ((data.showpoint == "是"||data.showpoint == true) ? true: false),
                            pointStyle: {
                                stroke: data.linecolor,
                                width: 3,
                                lineDash: [0],
                                fill: '#ddd'
                            },
                            roamnumber: parseInt(data.roundnum),
                            speed: parseInt(data.speed),
                            callback:data.callback
                        }
                        self.addRoam(roam);
                        ii++
                    }
                } else {
                    var roam = {
                        name: data.data.name + ii,
                        line: li,
                        image: data.icon,
                        //data.data.features.image,
                        lineStyle: {
                            stroke: data.linecolor,
                            width: parseInt(data.linewidth),
                            lineDash: ((data.linestyle == "是"||data.linestyle == true) ? [20] : [0])
                        },
                        isShowPoint: ((data.showpoint == "是"||data.showpoint == true) ? true: false),
                        pointStyle: {
                            stroke: data.linecolor,
                            width: 3,
                            lineDash: [0],
                            fill: '#ddd'
                        },
                        roamnumber: parseInt(data.roundnum),
                        speed: parseInt(data.speed),
                        callback:data.callback
                    }
                    self.addRoam(roam);
                    ii++;
                }

            }
        }

        this.removeMultiRoam = function(name) {
            for (var key in self.yypathflyTool) {
                if (key.indexOf(name) > -1) {
                    self.clearRoam(key);
                }
            }
        }

        /* addRom为单条线路漫游接口，数据类型如data所示：

                  data={
                          name:'name',                                                                    //名称              （必须项）
                          line:[[110.1,25.1],[111.1,25.5],[111.7,26.1],[112.5,26.9],[113.0,27.2]],        //线的点坐标集合    （必须项）
                          lineStyle:{
                                    stroke:'#fff',                                                        //线颜色
                                    width:3,                                                              //线宽
                                    lineDash:[0]                                                          //设置虚线样式，数组中元素为0表示为实线
                                  },                                                                      //线样式
                          pointStyle:{
                                    stroke:'#fff',
                                    width:3,
                                    lineDash:[0],
                                    fill:'#ddd'                                                           //填充颜色
                                  },                                                                      //节点样式
                          image:'./image/fire.png',                                                       //图标地址
                          div:'<img src="./image/fire.png" onclick="test()">',                            //自定义图标         （image和div两个必须最少包含一项）
                          isinfowin:false,                                                                //是否显示气泡窗口
                          isShowPoint:true,                                                                //显示节点
                          infowin:'<h4 style="margin:0 0 5px 0;padding:0.2em 0">消防设施信息</h4>
                                  <ul class="infoUl"><li><span>设施名称:</span>
                                  <b>消防栓</b></li></ul>',                                               //气泡窗口内容
                          callback:function(){},                                                          //漫游过程中的回调方法
                          endCallBack:function(){},                                                       //循环漫游结束回调方法
                          roamnumber:1,                                                                   //预演循环次数，为0或undefined一直循环漫游
                          speed:500                                                                       //预演的速度
                        }

                        */
        this.addRoam = function(data) {

            if (data.name == undefined) return;
            var name = data.name;
            self.clearRoam(name);
            var line = data.line;
            if (line == undefined || line.length == 0) return;
            var lineStyle = data.lineStyle == undefined ? {}: data.lineStyle;
            var geomLine = self.zmap2dview.MultiLine([line]);
            var lStyle = new ZMap2D.Style(lineStyle);
            self.zmap2dview.AddGeometrys(name, geomLine, lStyle, true);
            var cen = line[0];
            var click = ''; // 'onclick="Test(\'name\')"';
            var tempImg = data.image;
            var divparam = data.div == undefined ? '<img src="' + tempImg + '" ' + click + '>': data.div;
            var olay = self.zmap2dview.AddImageLabel(name, cen[0], cen[1], divparam, 'center-center');
            self.yypathflyTool[name] = new JSPathFlyTool(self.zmap2dview, olay);
            if (data.isShowPoint) {
                var point = self.zmap2dview.MultiPoint(line);
                var pointStyle = data.pointStyle == undefined ? {}: data.pointStyle;
                var pStyle = new ZMap2D.Style(pointStyle);
                self.zmap2dview.AddGeometrys(name, point, pStyle, false);
            }
            if (data.isinfowin) {
                self.infoWindow[name] = self.zmap2dview.InfoWindow([cen[0], cen[1]], infowin);
                self.zmap2dview.OpenInfoWindow(self.infoWindow[name]);
            }
            var speed = data.speed == undefined ? 2000 : data.speed;
            self.yypathflyTool[name].InitPlay(line, true, speed, self.infoWindow[name], position, {
                endCallBack: expParam
            });
            self.yypathflyTool[name].ShowInfoWindow(true);
            self.yypathflyTool[name].Play();
            var roamnumber = 0;
            function position(e) {
                if (data.callback) data.callback(e);
            }
            function expParam(e) {

                roamnumber++;
                if (data.roamnumber == roamnumber) {
                    if (data.endCallBack) data.endCallBack(e);
                    self.yypathflyTool[name].Stop();
                }
            }
        }
        /*
        移除单个漫游所产生的点线漫游工具等
        */
        this.clearRoam = function(name) {
            self.zmap2dview.RemoveGeometrys(name);
            if (self.yypathflyTool[name] != undefined) {
                self.yypathflyTool[name].Destroy();
                delete self.yypathflyTool[name];
            }
            self.zmap2dview.RemoveLabel(name);
        }

        this.addMultiLine = function(data,type)
        {

            self.tooltipHtmlFun[data.name] ={
                clickFun:0,
                hoverFun:0
            }
            if(data.hoverFun)
            {
                if(typeof data.hoverFun =='function')
                    self.tooltipHtmlFun[data.name].hoverFun = data.hoverFun;
                else
                    self.tooltipHtmlFun[data.name].hoverFun = self.lineHoverFun;
            }
            if(data.clickFun)
            {
                if(typeof data.clickFun =='function')
                    self.tooltipHtmlFun[data.name].clickFun = data.clickFun;
                else
                    self.tooltipHtmlFun[data.name].clickFun = self.lineClickFun;
            }

            self.zmap2dview.RemoveLayer(data.name);
            var lineData = {
                        styleFunction:data.styleFunction,
                        linestrings:[],
                        colors:[],
                        widths:[],
                        dashs:[],
                        texts:[],
                        attrs:[],
                        name:data.name
                };
            var colors=(self.getDatasource()[data.colorMapID]||{color:[]}).color||[];
            var i = 0;
            for(i=0;i< data.data.features.length;i++)
            {
                var featrue = data.data.features[i];
                var color = data.line_stroke_default||'#ff0000';
                if(colors.length>0&&data.colorMap_properties!=''&&featrue.properties[data.colorMap_properties])
                {
                    var lcolor = featrue.properties[data.colorMap_properties];
                    for(var s=0;s<colors.length;s++)
                    {
                        if(lcolor>=colors[s].min&&lcolor<=colors[s].max)
                        {
                            var co = colors[s].color;
                            var tm = 1;
                            if (co.indexOf("rgb(") > -1)
                                color = co.replace(")", "," + tm + ")").replace("rgb(", "rgba(")
                            else
                                color = co;
                            break;
                        }
                    }
                }
                if(data.line_stroke_properties!=''&&featrue.properties[data.line_stroke_properties])
                {
                    color = featrue.properties[data.line_stroke_properties];
                }
                var width = featrue.properties[data.line_width_properties]||data.line_width_default||1;
                var dash = featrue.properties[data.line_Dash_properties]||data.line_Dash_default||[0];
                var line = featrue.geometry.coordinates||[];
                var text = featrue.properties[data.line_text_properties]||data.line_txtx_default||'';
                var attr = featrue.properties;
                attr['ATTRNAME'] = data.name;
                if(featrue.geometry['type'] == "LineString"||!(line[0][0] instanceof Array))
                {
                    line = [line];
                }

                // if(type == 0)
                // {
                //     continue;
                // }


                var icon = featrue.properties[data.line_symbol_properties]||data.line_symbol_default||'';

                if(icon.indexOf('.svg')>-1||icon.indexOf('MapServlet?method=outSvg&id=')>-1)
                {

                    if(self.svg[icon]==undefined)
                    {
                        $.ajax({
                            url:icon,
                            dataType: 'xml',
                            async: false,
                            success:function(svg){
                                if(svg==null||svg==undefined){
                                    svg=$('<svg xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200" width="100" height="100" version="1.1" ><svg xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200" width="200" height="200" version="1.1" ><circle cx="100" cy="100" r="100"  fill="red" /></svg></svg>')[0];
                                }
                                excuteSvg(svg);
                            }
                        })
                    }
                    else
                    {
                        excuteSvg(self.svg[icon]);
                    }


                    function excuteSvg(svg){
                        self.svg[icon] = svg;
                        var size = data.size||[10,10];
                        $(svg).children('svg').eq(0).attr('width',size[0]||10);
                        $(svg).children('svg').eq(0).attr('height',size[1]||10);
                        setChild($(svg).children('svg').eq(0))
                        function setChild(obj){
                            if(obj.children()!=undefined&&obj.children().length!=0)
                            {
                                for(var is=0;is<obj.children().length;is++)
                                {
                                    var c1=obj.children()[is];
                                    if(c1.nodeName=="svg"){
                                        setChild($(c1));
                                    }
                                    else{
                                        if($(c1).parent('svg').attr('fun')!="1")
                                        {
                                            var xx=$(c1).attr('fill');

                                            $(c1).attr('fill',color||xx||'red');

                                        }
                                    }
                                }
                            }
                        }
                    icon = 'data:image/svg+xml;base64,'+Base64.encode((new XMLSerializer()).serializeToString(svg));
                    }
                }




                if(type == 1)
                {
                    for(var n = 0;n<line.length;n++)
                    {
                        data.effect = data.effect||{};
                        self.lineEffect(i+'-'+data.name+'-'+n,{
                            pointArr:line[n],
                            animatePointNum:data.animatePointNum||1,
                            url:icon,
                            size:data.size||[10,10],
                            effect:{
                                color:color||data.effect.color,
                                width:data.effect.width||3,
                                trailLength:data.effect.trailLength||10,
                                style:data.effect.style||2,
                                pointNum:data.effect.pointNum||5
                            },
                            playTime:data.effect.playTime||20000,
                            infoWindow:data.InfoWindow,
                            frameCallBack:data.frameCallBack,
                            expParam:{endCallBack:data.endFun},
                            loop:data.loop ==true?true:false
                        })
                    }
                }
                else if(type == 2)
                {
                    var arcLine = [];
                    for(var n = 0;n<line.length;n++)
                    {
                        var pointLines = [];
                        for(var m=0;m<line[n].length-1;m++)
                        {
                            var pointLine = self.getArcPoint(line[n][m],line[n][m+1],data.radiusAngle||45,data.pointNum||90);
                            pointLines = pointLines.concat(pointLine);
                        }
                        arcLine.push(pointLines);
                    }

                    line = arcLine;

                    for(var n = 0;n<line.length;n++)
                    {
                            data.effect = data.effect||{};
                            self.lineEffect(i+'-'+data.name+'-'+n,{
                                pointArr:line[n],
                                animatePointNum:data.animatePointNum||1,
                                url:icon,
                                size:data.size||[10,10],
                                effect:{
                                    color:color,
                                    width:data.effect.width||3,
                                    trailLength:data.effect.trailLength||10,
                                    style:data.effect.style||2,
                                    pointNum:data.effect.pointNum||5
                                },
                                playTime:data.effect.playTime||20000,
                                infoWindow:data.InfoWindow,
                                frameCallBack:data.frameCallBack,
                                expParam:{endCallBack:data.endFun},
                                loop:data.loop ==true?true:false
                            })
                    }
                }





                lineData.linestrings.push(line);
                lineData.colors.push(color);
                lineData.widths.push(width);
                lineData.dashs.push(dash);
                lineData.texts.push(text);
                lineData.attrs.push(attr);

            }

            return self.addMulitLineString(lineData);

        }
        this.animationFly = new ZMap.MapWidget.LineAnimationManger(self.zmap2dview);
        this.lineEffect  = function(name,option)
        {
            return self.animationFly.addLineAnimation(name,option)
        }

        this.addMulitLineString = function(options)
        {
            self.LayerName[options.name] = options.name;
            function pointStyleFunction(feature, resolution) {
                    if(options.styleFunction&&typeof options.styleFunction=='function')
                    {
                        return options.styleFunction(feature,resolution);
                    }
                    return new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: feature.get('color')||'#ff0000',
                            width: feature.get('width')||1,
                            lineDash:feature.get('dash')||[0],
                            lineJoin:'round'
                        }),
                        text: new ol.style.Text({
                            text: feature.get('text')||'',
                            fill: new ol.style.Fill({
                              color: feature.get('color')||'#ff0000'
                            })
                          })
                    })
                }

                //查找图层名称
                var vecSource;
                var unkLayer  = self.zmap2dview.GetUnkLayer(options.name);
                if (unkLayer == undefined)
                {
                    //添加矢量图层
                    vecSource = new ol.source.Vector();
                    unkLayer = new ol.layer.Vector(
                        {   name: options.name,
                            source: vecSource,
                            style: pointStyleFunction
                        });
                    self.zmap2dview.olMap.addLayer(unkLayer);
                }
                else
                {
                    //获取
                    vecSource = unkLayer.getSource();
                }

                if (options.bClear)
                {
                    vecSource.clear();
                }
                var isArray = function (o) {
                    return Object.prototype.toString.call(o) === '[object Array]';
                }
                var features = [];
                var linestring  = options.linestrings||[];
                var width = options.widths||[];
                var color=options.colors||[];
                var dash=options.dashs||[];
                var attr = options.attrs||[];
                var text = options.texts||[]
                for (var i = 0; i < linestring.length; i++)
                {
                    var point = self.zmap2dview.MultiLine(linestring[i]);
                    var feature = new ol.Feature({
                         geometry: point,
                         color: color[i],
                         width:width[i],
                         dash: dash[i],
                         attr: attr[i],
                         text: text[i]
                         }
                         );
                   features.push(feature);
                }
                vecSource.addFeatures(features);
                return unkLayer;
        }

        this.getArcPoint = function (p1,p2,arc,pointnum)
        {
            var  sides =pointnum|| 90;
            var arcNum = arc||30;
            var x = p2[0] - p1[0];
            var y = p1[1] - p2[1];
            if(x!=0)
            {
                var d = Math.atan(y / x) / Math.PI * 180;
            }
            else{
                var d = 90;
                if(y<0)
                {
                    d = 270;
                }
            }
            if (x >= 0)
            {
                d = d;
            }
            else
            {
                d = 180+d;
            }
            var radius =Math.sqrt((Math.pow(x,2) + Math.pow(y,2)))/2/Math.cos((180-arcNum)*Math.PI/360);
            var origin = {
                x:0,
                y:0
            }
            origin.x = p1[0] + (radius * Math.cos((d+(180-arcNum)/2)*Math.PI/180))
            origin.y = p1[1] - (radius * Math.sin((d+(180-arcNum)/2)*Math.PI/180));
            var rotatedAngle;
            var angle = 180 + d +(180-arcNum)/2;
            var points = [p1];
            for(var i=0; i<sides; i++) {

                rotatedAngle = (angle + (i *arcNum/sides))*Math.PI/180;
                var x1 = origin.x + (radius * Math.cos(rotatedAngle));
                var y1 = origin.y - (radius * Math.sin(rotatedAngle));
                points.push([x1,y1]);
            }
            points.push(p2);
            return points;
        }

        this.getEllipsePoint = function(center,x,y,rotation,pointnum)
        {
            var assemble=new Array();
            var angle;
            var dot;
            num =90;
            if(pointnum&&!isNaN(parseInt(pointnum))&&parseInt(pointnum)>=4)
            {
                num = parseInt(pointnum);
            }

            for(i=0;i<=num;i++)
            {
                angle = (2* Math.PI / num) * i;
                var x1 = center[0]+Math.sin(angle)*x;
                var y1 = center[1]+Math.cos(angle)*y
                dot = [x1, y1];
                assemble.push(dot);
            }
            if(!isNaN(parseInt(rotation)))
            {
                for(var j =0 ;j<assemble.length;j++)
                {
                    var a = assemble[j][0]-center[0];
                    var b = center[1]-assemble[j][1];
                    if(a!=0)
                    {
                        var d = Math.atan(b/a);
                    }
                    else{
                        var d = Math.PI/2;
                        if(b<0)
                        {
                            d = 3*Math.PI/2;
                        }
                    }

                    if (a>= 0)
                    {
                        d = d;
                    }
                    else
                    {
                        d = Math.PI+d;
                    }
                    var rotatedAngle = d+(2* Math.PI / 360) * parseInt(rotation);
                    var radius = Math.sqrt(a*a +b*b);

                    assemble[j][0] = center[0] + (radius * Math.cos(rotatedAngle));
                    assemble[j][1] = center[1] - (radius * Math.sin(rotatedAngle));
                }
            }
            return assemble;
        }

        this.addMigrationChart = function(data)
        {

        }

        this.QueryFeature = function(x, y, options)
        {
            var info = [];
            var map_ = self.zmap2dview;
            var onfeature =  function(f, l){
                var fout = {};
                var props = f.getProperties();
                fout.pos = f.getGeometry().getCoordinates();//map_.MapCoord2JW(pos);
                fout.value = props;
                fout.subs = [];
                fout.type = f.values_.geometry.getType();
                if(fout.type.indexOf(type)==-1)
                {
                    return false;
                }
                if (props.features && props.features.length > 0)
                {
                    for (var i = 0; i < props.features.length; ++i)
                    {
                        var subf = props.features[i];
                        fout.subs.push({
                            type: subf.values_.geometry.getType(),
                            pos: subf.getGeometry().getCoordinates(),
                            value: props.features[i].getProperties()
                        });
                    }
                }
                else{
                    fout.subs.push({
                            pos: fout.pos,
                            value: fout.value,
                            type:fout.type
                        });
                }
                info.push(fout);
                return false;
            };
            var torence = options?(options.torence?options.torence:15):15;
            var type = options?(options.type?options.type:""):"";
            map_.olMap.forEachFeatureAtPixel([x, y], onfeature, {hitTolerance: torence});
            return info;
        }

        this.bufferAnalysis = function(option)
        {
            if(!option)
            {
                return;
            }
            $.ajax({
                url: self.getGISServerAddress() + 'zs/utilities/buffer',
                data: {
                    geo: option.geojson,
                    /// 缓冲区半径
                    radius : option.radius||100000,
                    /// 数据单位，degree 或者 meta
                    unit: option.unit||'meta'
                },
                dataType: 'text',
                success: function(data){
                    if(option.callback&&typeof option.callback =='function')
                    {
                        option.callback(data);
                    }
                }
            });
        }

        this.boolAnalysis = function(option)
        {
            if(!option)
            {
                return;
            }
            $.ajax({
                url:self.getGISServerAddress() +'zs/utilities/bool',
                data: {
                    g1: option.g1,
                    g2: option.g2,
                    op: option.op
                },
                dataType: 'text',
                success: function(data){
                    if(option.callback&&typeof option.callback =='function')
                    {
                        option.callback(data);
                    }
                }
            });
        }

        this.binaryAnalysis = function(option)
        {
            if(!option)
            {
                return;
            }
            $.ajax({
                url:self.getGISServerAddress() +'zs/utilities/binary',
                data: {
                    g1: option.g1,
                    g2: option.g2,
                    op: option.op
                },
                dataType: 'text',
                success: function(data){
                    if(option.callback&&typeof option.callback =='function')
                    {
                        option.callback(data);
                    }
                }
            });
        }
    }


    /*-------------------------*/
    //// 分页获取地图上图数据方法  options为ajax请求参数项，pageoption为分页参数项，updateCallback为成功回调方法
    /*options参数中示例：

              options= {url:'http://localhost:8080/qx/zMapBaseServiceServlet?',//ajax请求的url
                        type:'POST',  //ajax请求的type
                        dataType:'json',   //ajax请求的dataType
                        data:{
                            'param':JSON.stringify(pat),
                            'user':user,
                            'pagination':true,
                            'pageNumber':1,
                            'pageSize':10
                            },//查询所需的参数，分页字段需放在data中。ajax请求的data
                        defaultname:'数据1',//其他所需参数。defaultname为该数据默认名称
                        imgurl:'img/a1.png',//其他所需参数。imgurl为该数据默认图标地址
                        x:'X',//对应数据经度字段
                        y:'Y',//对应数据纬度度字段
                        geometryType:'MultiPoint'//数据点类型为多点。
                        },

            pageoption=  {
                  ispage:true,//是否分页查询
                  page:'pageNumber',//对应option的data中对应分页的字段对应分页数
                  pagesize:'pageSize',//对应option的data中对应分页的字段对应每页大小
              }

        updateCallback为回调方法

        */

    ZMap.MapWidget.getDatasource = function(options, pageoption, updateCallback) {

        var pagenum = 5;
        if (!pageoption.ispage) pagenum = 1;
        var pg = 0;
        var data = {
            total: 0,
            rows: [],
            fields: [],
            success: true,
            lg: 0
        };
        var datas = {};
        // ajax成功回调将数据合并汇总并转化为地图图层上图所需格式
        function addData(_data) {
            data.rows = data.rows.concat(_data.rows);
            data.lg += _data.rows.length;
            data.total = _data.total;
            data.fields = _data.fields;
            pg++;
            if (pg == pagenum || data.lg == data.total) {
                datas['name'] = options.defaultname;
                datas['type'] = 'Features';
                datas['imgurl'] = options.imgurl;
                datas['x'] = options.x;
                datas['y'] = options.y;
                datas['geometryType'] = options.geometryType;
                var features = [];
                for (var x = 0; x < data['rows'].length; x++) {
                    var feature = {};
                    var tempJD = parseFloat(data['rows'][x][datas.x]);
                    var tempWD = parseFloat(data['rows'][x][datas.y]);
                    if (tempJD == null || tempWD == null) continue;
                    feature['geometry'] = {
                        type: 'Point'
                    };
                    feature['geometry'] = {
                        coordinates: [tempJD, tempWD]
                    };
                    feature['type'] = 'Feature';
                    feature['properties'] = data['rows'][x];
                    features.push(feature);
                }
                datas['features'] = features;
                datas['fields'] = data['fields'];

                updateCallback(datas);
            }

        }

        // 第一次请求，分页获取数据小于查询总数将进行并发分页请求获取数据
        $.ajax({
            url: options.url,
            type: options.type,
            dataType: options.dataType,
            data: options.data,
            success: function(_data) {

                if (_data.success) {
                    if (_data.rows.length == _data.total) {
                        addData(_data);
                    } else {
                        getData(options, pageoption, updateCallback, _data)
                    }
                } else {
                    updateCallback(_data);
                }

            },
            error:function() {
               updateCallback({success:false});
            }
        })
        // 5次并发请求获取数据
        function getData(options, pageoption, updateCallback, _data) {
            if(pageoption.ispage)
            {
                for (var i = 0; i < 5; i++) {

                    options.data[pageoption.page] = i + 1;
                    options.data[pageoption.pagesize] = Math.round(_data.total / 5) + 1;
                    $.ajax({
                        url: options.url,
                        type: options.type,
                        dataType: options.dataType,
                        data: options.data,
                        success: function(_data) {

                            if (_data.success) {
                                addData(_data)
                            } else {
                                updateCallback(_data);
                            }

                        },
                        error:function() {
                           updateCallback({success:false});
                        }

                    })
                }
            }
        }
    }





    ZMap.MapWidget.overlay = function overlay(map) {
            var self=this;
            this.map2dview=map;
            this.layers={};
            /*--添加overlay--*/
            this.addLayer = function(options) {
                var layer=new ZMap.MapWidget.overlayLayer();
                layer.data=options;
                layer.size=options.size||[];
                layer.scale=options.scale||1;
                layer.mapdiv=self.map2dview.olDiv;
                self.layers[options.name]=layer;
                layer.carate(self);
                return layer;
            }
            /*--绘制--*/
            this.draw = function(map){
                for(let i in self.layers){
                    self.layers[i].draw(map);
                }
            }

            this.removeAll = function(){
                for(let i in self.layers){
                    self.layers[i].remove();
                }
            }

            /*--移除所有overlay--*/
            this.removeAllLayer = function(){
                self.removeAll();
                this.layers={};
            }

            /*--移除单个overlay--*/
            this.removeLayer = function(name){
                self.layers[name].remove();
                delete self.layers[name];
            }

            /*--缩放--*/
            this.scale = function(s){
                for(let i in self.layers){
                    self.layers[i].toscale(s);
                }
            }

        }

        ZMap.MapWidget.overlayLayer = function(){
            var self = this;
            this.data = '';
            this.mapdiv = '';
            this.doms = [];
            this.size =[];
            this.viewModel = [];
            this.scale = 1;
            this.toscale = function(s){
                self.scale=s||1;
                const style='<style id="'+self.data.name+'">.'+self.data.name+'{transform:translate(-50%,-50%) scale('+s+');}</style>'
                    $('head').children('#'+self.data.name).remove();
                    $(style).appendTo('head');
            }
            this.carate = function(selfs){
                self.toscale(self.scale);
                $('#test').children('.ol-viewport').children('.ol-overlaycontainer-stopevent').children('.'+this.data.name).remove();
                for(let i=0;i<this.data.points.length;i++){
                    var xy=exchangeXY(selfs.map2dview.JW2MapCoord(this.data.points[i]),selfs.map2dview.olMap.frameState_.coordinateToPixelTransform,selfs.map2dview.GetMapSize());
                    if(xy==false)
                        continue;
                    //var s=self.size[i]||[0,0];
                    var innertext=(this.data.innerhtml||[])[i]||'';
                    let dom = $('<div class="'+this.data.name+'" style="position:absolute;left:'+xy[0]+'px;top:'+xy[1]+'px" >'+innertext+'</div>');
                    $('#'+self.mapdiv).children('.ol-viewport').children('.ol-overlaycontainer-stopevent').append(dom);
                    self.doms.push(dom);
                }
                if(self.size.length==0)
                {
                    setTimeout(function(){self.draw(selfs.map2dview.olMap),1},1000);
                }
            }
            this.draw = function(map,isonload){
                for(var i=0;i<this.data.points.length;i++){
                    var proj = map.getView().getProjection().getCode();
                    var poi = ZMap2D.Convert('EPSG:4326', proj, this.data.points[i])
                    //var xy=map.getPixelFromCoordinate();//exchangeXY(this.data.points[i],map.GetMapSize(),selfs.map.GetViewRect());
                    var xy=exchangeXY(poi,map.frameState_.coordinateToPixelTransform,map.getSize());
                    if(xy[0]<=0||xy[1]<=0)
                    {
                        self.doms[i].hide();
                    }
                    else{
                        self.doms[i].show();
                        self.doms[i].css('top',xy[1]+'px');
                        self.doms[i].css('left',xy[0]+'px');
                    }
                }

            }
            this.remove = function(){
                $('#'+self.mapdiv).children('.ol-viewport').children('.ol-overlaycontainer-stopevent').children('.'+this.data.name).remove();
                $('head').children('#'+self.data.name).remove();
            }


            function exchangeXY(coors,transform,mapsize){
                var xy = [0,0];
                xy[0] = transform[0] *coors[0] + transform[2] * coors[1] + transform[4];
                xy[1] = transform[1] * coors[0] + transform[3] * coors[1] + transform[5];
                return xy;
            }

        }



         ZMap.MapWidget.LineAnimationManger = function(map)
        {
            var self = this;
            this.map = map;
            this.lineAnimation = {};
            this.animationNum = 0;
            this.largeNum = 2000;
            this.addLineAnimation = function(name,option)
            {
                    self.lineAnimation[name] = new ZMap.MapWidget.LineAnimationTool(self.map,option);
                    self.animationNum++;
                    return self.lineAnimation[name];
            }

            this.removeLineAnimation = function(name)
            {
                if(self.lineAnimation[name])
                {
                    delete self.lineAnimation[name];
                    self.animationNum--;
                }
            }
            this.removeLineAnimationFname =function(name){
                for(var k in self.lineAnimation)
                {
                    if(k.indexOf('-'+name+'-')>-1)
                    {
                        delete self.lineAnimation[k];
                        self.animationNum--;
                    }
                }
            }
            this.clearAll = function()
            {
                self.lineAnimation = {};
                self.animationNum = 0;

            }
            this.play = function(event)
            {
                var num = 0 ;
                var y = Math.ceil(self.animationNum/self.largeNum)||1;
                for(var key in self.lineAnimation){
                    if(num%y == 0)
                    {
                        self.lineAnimation[key].moveNext(event);
                    }
                    num++;
                };
            }
            this.Pause = function()
            {
                for(var key in self.lineAnimation){
                    self.lineAnimation[key].Pause();
                };
            }
            this.Resume = function()
            {
                for(var key in self.lineAnimation){
                    self.lineAnimation[key].Resume();
                };
            }

            this.map.olMap.on('postcompose', function(event) {
                    self.play(event);
            })

        }

        ZMap.MapWidget.LineAnimationTool = function(map,option)
        {
            this.config =
            {
                Length : 0,
                PlayTime : option.playTime||100,
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
                Loop:option.loop==true?true:false,
                IsFinish:false,
                DesObj:{},
                Speed:10,
                IsWndShow: false
            };

            //对象名称
            this._map        = map;
            this._overlay    =  option.mapOverlay;
            this._infoWindow = null;
            this._frameCallBack = null;
            this._endCallBack   = null;
            this.animatePointNum = option.animatePointNum||1;
            this.pointStyle = {
                url:option.url,
                size:option.size
            };
            this.isFrist = true;
            var self = this;
            this.isImage = false;
            this.effect = option.effect||{};
            this.effect.trailLength=this.effect.trailLength||15;
            this.effect.color=this.effect.color||'#ff0000';
            this.effect.width=this.effect.width||5;
            this.effect.pointNum=this.effect.pointNum||15;
            if(option.url&&option.url!='')
            {
                this._image=new Image();
                this.imageIsload = false;
                this.isImage = true;
                this._image.src = option.url;
                this._image.onload = function(){
                    if(self.pointStyle.size==undefined){
                        self.pointStyle.size=[this.width||30,this.height||30];
                    }
                    self.imageIsload = true;
                }
            }
            else
            {
                this.imageIsload = true;
            }
            this.isStop = false;
            this.lastData = null;
            this.config.Points=[];
            for (var i = 0; i < option.pointArr.length; ++i)
            {
                var pnode = option.pointArr[i];
                this.config.Points.push({x: pnode[0], y: pnode[1]});
            }
            this.config.Segments = this.config.Points.length - 1;
            this.CalcDistance =function (p1, p2)
            {
                var x = (p1.x - p2.x);
                var y = (p1.y - p2.y);
                return Math.sqrt(x * x + y * y) / Math.PI * 6378137;
            }
            for (var i = 0; i < this.config.Segments; ++i)
            {
                this.config.Distances[i] = self.CalcDistance(this.config.Points[i], this.config.Points[i + 1]);
                this.config.Length += this.config.Distances[i];
            }
            this.config.CurPlayTime = 0;
            this.config.Speed    = this.config.Length /  this.config.PlayTime;
            this.config.Step        = this.config.PlayDelay*this.config.Length /   this.config.PlayTime;
            this._infoWindow        = option.infoWindow;
            this._frameCallBack     = option.frameCallBack;
            this._endCallBack       = (option.expParam && option.expParam.endCallBack) ? option.expParam.endCallBack : null;
            this.config.CurJW=option.pointArr[0];
            this.lastData = new Date();
            this.ShowInfoWindow = function(visible)
            {
                if (!self._infoWindow)
                {
                    return ;
                }
                self.config.IsWndShow = visible;
                if (self.config.IsWndShow)
                {
                    self._infoWindow.setPosition(self.config.CurJW);
                    var div = self._infoWindow.element_;
                    $(div).children().css("display", "block");
                }
                else
                {
                    //this._infoWindow.setPosition(undefined);
                }
            }
            this.Pause = function()
            {
                self.config.Pause = true;
            }
            this.Resume = function()
            {
                self.config.Pause = false;
            }
            this.IsFinish = function()
            {
               return self.config.IsFinish;
            }
            this.stop = function()
            {
                self.config.IsFinish = true;
            }
            this.moveNext = function(event)
            {
                var now = new Date();
                var seconds = now.getTime()   - self.lastData.getTime();
                self.config.CurPlayTime  += seconds;
                self.lastData = now;
                if (self.config.IsFinish) return;

                self.config.Step = seconds*self.config.Speed

                if (self.config.CurPos >= self.config.Length)
                {
                    var cbP = {
                       'position' : self.config.CurJW,
                       'direction': self.config.CurDir,
                       'time': self.config.CurSegment
                    };
                    if (self.config.Loop == true)
                    {
                        self.config.CurPos      = 0;
                        self.config.CurSegment  = 0;
                        self.config.CurPlayTime = 0;
                        if (self._endCallBack) self._endCallBack(cbP);
                    }
                    else
                    {
                        self.config.IsFinish = true;
                        self.config.CurPos      = 0;
                        self.config.CurSegment  = 0;
                        self.config.CurPlayTime = 0;
                        self.stop();
                        if (self._endCallBack) self._endCallBack(cbP);
                        return;
                    }
               }

                var nextPoss = self.config.CurPos + self.config.Step;
                if(self.config.Pause)  {
                    nextPoss=self.config.CurPos;
                }
                var isTrue = true;
                var nowNum = self.animatePointNum;
                var points=[];
                var dirs=[];
                var nPoints = [];
                while(isTrue)
                {
                    var nextPos = nextPoss - (self.animatePointNum-nowNum)*(self.config.Length/self.animatePointNum);

                    if(self.isFrist&&nextPos<0){
                        self.isFrist=false;
                        isTrue=false;
                        continue;
                    }
                    else if(nextPos<0){
                        nextPos=self.config.Length+nextPos;
                    }
                //查找段
                    if(nowNum==self.animatePointNum)
                    {
                        self.config.CurSegment = self.config.Distances.length-1;
                        var dis = 0;
                        for (var i = 0; i < self.config.Distances.length; i++)
                        {
                            dis += self.config.Distances[i];
                            if (nextPos - dis < 0)
                            {
                                self.config.CurSegment = i;
                                break ;
                            }
                        }

                        self.config.CurPos = nextPos;
                        var curPos = self.config.CurPos;
                        for (var i = 0; i < self.config.CurSegment; i++)
                        {
                            curPos -= self.config.Distances[i];
                        }

                        var curSegment = self.config.CurSegment;
                    }
                    else{
                        var curSegment = self.config.Distances.length-1;
                        var dis = 0;
                        for (var i = 0; i < self.config.Distances.length; i++)
                        {
                            dis += self.config.Distances[i];
                            if (nextPos - dis < 0)
                            {
                                curSegment = i;
                                break ;
                            }
                        }
                        var curPos = nextPos;
                        for (var i = 0; i < curSegment; i++)
                        {
                            curPos -= self.config.Distances[i];
                        }
                    }
                    var amount = curPos / self.config.Distances[curSegment];
                    var p1 = self.config.Points[curSegment];
                    var p2 = self.config.Points[curSegment + 1];
                    var pos = self.Interpolate(amount, p1 , p2);
                    var dir = self.InterpolateDir(amount, p1 , p2);
                    if(nowNum==self.animatePointNum)
                    {
                        self.config.CurJW = [pos.x, pos.y];
                        self.config.CurDir= dir;
                        self._updatePosition(pos, dir);
                    //callback
                        if (self._frameCallBack)
                        {
                            var cbP = {
                            "position": [pos.x, pos.y],
                            "direction": dir
                            };
                            self._frameCallBack(cbP);
                        }
                    }
                    points.push([pos.x,pos.y]);
                    dirs.push(dir);

                    var extent=self._map.Map2JWExtent(event.frameState.extent);

                    var opl = self.effect.trailLength/self.effect.pointNum*(extent[2]- extent[0])/event.frameState.size[0]/ Math.PI * 6378137;

                    var nPoint = [] ;
                    for(var z=0;z<self.effect.pointNum;z++)
                    {
                        var curSegment = self.config.Distances.length-1;
                        var nextPl = nextPoss - (self.animatePointNum-nowNum)*(self.config.Length/self.animatePointNum)-z*opl;
                        var firPl= nextPoss - (self.animatePointNum-nowNum)*(self.config.Length/self.animatePointNum);
                        var endPl= nextPoss - (self.animatePointNum-nowNum)*(self.config.Length/self.animatePointNum)-(self.effect.pointNum-1)*opl;
                        if(firPl<0&&endPl<0){
                            nextPl=self.config.Length+nextPl;
                        }
                        else if(nextPl<=0)
                        {
                            nextPl = 0;
                        }

                        var dis = 0;
                        for (var i = 0; i < self.config.Distances.length; i++)
                        {
                            dis += self.config.Distances[i];
                            if (nextPl - dis < 0)
                            {
                                curSegment = i;
                                break ;
                            }
                        }
                        var curPos = nextPl;
                        for (var i = 0; i < curSegment; i++)
                        {
                            curPos -= self.config.Distances[i];
                        }

                        var amount = curPos / self.config.Distances[curSegment];
                        var p1 = self.config.Points[curSegment];
                        var p2 = self.config.Points[curSegment + 1];
                        var pos = self.Interpolate(amount, p1 , p2);
                        nPoint.push([pos.x,pos.y]);
                    }

                    nPoints.push(nPoint)

                    nowNum--;
                    if(nowNum<=0){
                        isTrue=false;
                    }
                }
                self._updatePositionAll(points,dirs,event,nPoints);
            }

            this._updatePositionAll = function(pos, dir,event,npos)
            {
                self.addPoint({
                    map:self._map,
                    points:pos,
                    nPoints:npos,
                    rotations:dir,
                    url:self.pointStyle.url,
                    size:self.pointStyle.size,
                    bClear:true,
                    scale:self.scale,
                    event:event
                })

            }
            this.addPoint = function(options)
            {
                var vectorContext = options.event.context//options.event.vectorContext;
                while(options.points.length<self.animatePointNum){
                    options.points.push([self.config.Points[0].x,self.config.Points[0].y]);
                    var p1 = self.config.Points[0];
                    var p2 = self.config.Points[1];
                    var dir = self.InterpolateDir(0, p1 , p2);
                    options.rotations.push(dir);
                }
                for(var i=0;i<options.points.length;i++)
                {
                    if(i<options.nPoints.length)
                    {
                        if(self.effect.style == 1)
                        {
                            vectorContext.beginPath();
                            vectorContext.lineWidth=self.effect.width;
                            vectorContext.strokeStyle=self.effect.color;
                            for(var x=0;x<options.nPoints[i].length-1;x++)
                            {
                                var p1 = self.getPx(options.nPoints[i][x],options.event.frameState.coordinateToPixelTransform,options.event.frameState.size);
                                var p2 = self.getPx(options.nPoints[i][x+1],options.event.frameState.coordinateToPixelTransform,options.event.frameState.size);
                                if(p1&&p2)
                                {
                                    vectorContext.moveTo(p1[0],p1[1]);
                                    vectorContext.lineTo(p2[0],p2[1]);
                                }
                            }
                            vectorContext.stroke();  // 画
                        }
                        else
                        {
                            for(var x=0;x<options.nPoints[i].length-1;x++)
                            {
                                var ncolor = self.effect.color
                                if(ncolor.indexOf('#')>-1)
                                {
                                    ncolor = self.exColor(ncolor,100-100*x/options.nPoints[i].length);
                                }
                                else if(ncolor.indexOf('rgba')>-1)
                                {
                                    var clo = ncolor.split(',');
                                    clo[3] = (1-x/options.nPoints[i].length)+')';
                                    ncolor = clo.join(',');
                                }
                                else if(ncolor.indexOf('rgb(')>-1)
                                {
                                    var clo = ncolor.replace("rgb(","rgba(").replace(")","").split(',');
                                    clo[3] = (1-x/options.nPoints[i].length)+')';
                                    ncolor = clo.join(',');
                                }
                                var p1 = self.getPx(options.nPoints[i][x],options.event.frameState.coordinateToPixelTransform,options.event.frameState.size);
                                var p2 = self.getPx(options.nPoints[i][x+1],options.event.frameState.coordinateToPixelTransform,options.event.frameState.size);
                                if(p1&&p2)
                                {
                                        vectorContext.beginPath();
                                        vectorContext.lineWidth=self.effect.width||5;
                                        vectorContext.strokeStyle=ncolor;
                                        vectorContext.moveTo(p1[0],p1[1]);
                                        vectorContext.lineTo(p2[0],p2[1]);
                                        vectorContext.stroke();  // 画
                                }
                            }
                        }
                    }

                    // if(self.isImage)
                    // {
                    //     var p = self.getPx(options.points[i],options.event.frameState.extent,options.event.frameState.size);
                    //     if(p)
                    //     {
                    //         options.size=options.size||[10,10];
                    //         var t =Math.PI/180*(options.rotations[i]||0);
                    //         vectorContext.rotate(Math.PI/180*(options.rotations[i]||0));

                    //         var b = Math.atan(p[1]/p[0]);

                    //         var x = Math.sqrt((Math.pow(p[1],2)+Math.pow(p[0],2))/(1+Math.pow(Math.tan(b-t),2)));
                    //         var y = Math.tan(b-t)*x;

                    //         vectorContext.drawImage(self._image,x-options.size[0]/2,y-options.size[1]/2,options.size[0],options.size[1]);

                    //         vectorContext.rotate(-(Math.PI/180*(options.rotations[i]||0)));
                    //     }
                    // }

                    if(self.isImage&&self.getPx(options.points[i],options.event.frameState.coordinateToPixelTransform
                        ,options.event.frameState.size))
                    {
                        var style = new ol.style.Icon( ({
                                    anchor: [0.5, 0.5],
                                    anchorXUnits: 'fraction',
                                    anchorYUnits: 'fraction',
                                    scale:options.scale||1,
                                    img:self._image,
                                    imgSize:options.size,
                                    rotation:Math.PI/180*(options.rotations[i]||0)
                                }));

                        var imageStyle = new ol.style.Style({
                              image: style
                            });
                        options.event.vectorContext.setStyle(imageStyle);
                        options.event.vectorContext.drawGeometry(self._map.MultiPoint([options.points[i]]));
                    }


                }



            }

            this.getPx = function(coors,transform,mapsize)
            {
                coors = self._map.JW2MapCoord(coors);
                var xy = [0,0];
                xy[0] = transform[0] *coors[0] + transform[2] * coors[1] + transform[4];
                xy[1] = transform[1] * coors[0] + transform[3] * coors[1] + transform[5];
                if(xy[0]<-20||xy[0]>mapsize[0]+20||xy[1]<-20||xy[1]>mapsize[1]+20)
                    return false;
                else
                return xy;
            }

            this.exColor = function(value,tm){
                var v=value.replace("#","");
                var l=v.length/3;
                var v1=v.substring(0,l);
                var v2=v.substring(l,2*l);
                var v3=v.substring(2*l,3*l);
                var vt=isNaN(parseInt(tm))?100:parseInt(tm);
                var vau='rgba('+parseInt([v1],"16")+','+parseInt([v2],"16")+','+parseInt([v3],"16")+','+(vt/100)+')';
                return vau;
            }
            this._updatePosition = function(pos, dir)
            {
                var mapCoord = [pos.x, pos.y];
                mapCoord = self._map.JW2MapCoord(mapCoord);
                if (self._overlay)
                {
                    self._overlay.setPosition(mapCoord);
                    var name = self._overlay.get("name")
                    dir = -dir;
                    var rotate = "rotate("+ dir +"deg)";
                    $("#" + name + " img").css("transform", rotate);
                }

               //更新信息窗口位置
                if (self._infoWindow && self.config.IsWndShow)
                {
                    self._infoWindow.setPosition(mapCoord);
                }
            }

            this.getPosition = function()
            {
                return self.config.CurJW;
            }

            this.getDir = function ()
            {
                return self.config.CurDir;
            }

            this.Interpolate = function(amount, p1, p2)
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

            this.InterpolateDir = function(amount, p1, p2)
            {
                var d = 0;
                //屏蔽x\y方向
                var x = p2.x - p1.x;
                var y = p1.y - p2.y;
                var d = Math.atan(y / x) / Math.PI * 180;
                if (x >= 0)
                {
                    d = d;
                }
                else
                {
                    d = 180+d//180 + Math.abs(d);
                }
                return d;
            }

        }




} ());

var Base64 = Base64|| {

    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode: function(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode: function(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode: function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode: function(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}

// Base64.encode("www.78oa.com")// 编码
// Base64.decode("d3d3Ljc4b2EuY29t") //解码
function zmapInfoWindowChange(map2dview,n){
    if(n!=undefined){
      $('#zmap-infowindow-pseudo1').remove();
      $('#zmap-infowindow-pseudo2').remove();
      $('#zmap-infowindow-pseudo3').remove();
      $('#zmap-infowindow-pseudo4').remove();
    }
    var size=map2dview.GetMapSize();

    var w=parseInt($('.zmap-infowindow').css('width'));
    var h=parseInt($('.zmap-infowindow').css('height'));
    var zl=isNaN(parseInt($('.zmap-infowindow').css('left')))?0:parseInt($('.zmap-infowindow').css('left'));
    var zt=isNaN(parseInt($('.zmap-infowindow').css('top')))?0:parseInt($('.zmap-infowindow').css('top'));
    var b=parseInt($('.zmap-infowindow').parent('div').css('bottom'));
    var l=parseInt($('.zmap-infowindow').parent('div').css('left'));
    var r=size[0]-l;
    var t=size[1]-b;
    var style='';
    if(t>0&&r>0&&l>0&&b>0&w>0&h>0){
        if(t+b>h+h){

            if(zl+l<-10){
                    style='<style id="zmap-infowindow-pseudo1">.zmap-infowindow{left:'+(-10-l)+'px;right:auto;} .zmap-infowindow:before,.zmap-infowindow:after{left:'+(l+8)+'px;right: auto;}</style>'
                    $('#zmap-infowindow-pseudo1').remove();
                    $(style).appendTo('head');

            }
            else if(r-w-zl<-10){
                    style='<style id="zmap-infowindow-pseudo1">.zmap-infowindow{left:'+(r-w+10)+'px;right:auto;} .zmap-infowindow:before,.zmap-infowindow:after{left:'+(w-r-8)+'px;right: auto;}</style>'
                    $('#zmap-infowindow-pseudo1').remove();
                    $(style).appendTo('head');

            }
            else if(l>w/2&&r>w/2){
                    style='<style id="zmap-infowindow-pseudo1">.zmap-infowindow{left:-'+(w/2)+'px;right:auto;} .zmap-infowindow:before,.zmap-infowindow:after{left:'+(w/2-2)+'px;right: auto;}</style>'
                    $('#zmap-infowindow-pseudo1').remove();
                    $(style).appendTo('head');
            }
            if(h>t){
                style='<style id="zmap-infowindow-pseudo2">.zmap-infowindow{top:22px;bottom: auto;} .zmap-infowindow:before,.zmap-infowindow:after{top:-22px;border-color: transparent;border-bottom-color: white;}</style>'
                $('#zmap-infowindow-pseudo2').remove();
                $(style).appendTo('head');
            }
            else if(h>b){
                style='<style id="zmap-infowindow-pseudo2">.zmap-infowindow{top:auto;bottom: 12px;} .zmap-infowindow:before,.zmap-infowindow:after{top:100%;border-color: transparent;border-top-color: white;}</style>'
                $('#zmap-infowindow-pseudo2').remove();
                $(style).appendTo('head');
            }


        }
        else if(r+l>w+w){
            if(zt+t<-10){
                    style='<style id="zmap-infowindow-pseudo3">.zmap-infowindow{top:'+(-10-t)+'px;left:22px;bottom: auto;right:auto;margin:0;} .zmap-infowindow:before,.zmap-infowindow:after{top:'+(t-10)+'px;left:-10px;right:auto;border-color: transparent;border-right-color: white;}</style>'
                    $('#zmap-infowindow-pseudo3').remove();
                    $(style).appendTo('head');

            }
            else if(b-h-zt<-10){
                    style='<style id="zmap-infowindow-pseudo3">.zmap-infowindow{top:'+(b-h+10)+'px;left:22px;bottom: auto;right:auto;margin:0;} .zmap-infowindow:before,.zmap-infowindow:after{top:'+(h-b-40)+'px;left:-10px;right:auto;border-color: transparent;border-right-color: white;}</style>'
                    $('#zmap-infowindow-pseudo3').remove();
                    $(style).appendTo('head');

            }
            if(w>r){
                style='<style id="zmap-infowindow-pseudo2">.zmap-infowindow{left:auto;bottom: auto;right:22px;margin: 0;} .zmap-infowindow:before,.zmap-infowindow:after{left:auto;right:-22px;border-color: transparent;border-left-color: white;}</style>'
                $('#zmap-infowindow-pseudo2').remove();
                $(style).appendTo('head');
            }
            else if(w>l){
                style='<style id="zmap-infowindow-pseudo2">.zmap-infowindow{left:22px;bottom: auto;right:auto;margin: 0;} .zmap-infowindow:before,.zmap-infowindow:after{left:-10px;right:auto;border-color: transparent;border-right-color: white;}</style>'
                $('#zmap-infowindow-pseudo2').remove();
                $(style).appendTo('head');
            }
        }
    }
}
