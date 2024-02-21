var VectorEffect=VectorEffect||{};
(function() {

    /// 启用严格模式
    'use strict';

	
	//this.manager=new VectorEffect.Manager();
    /// 效果类
    VectorEffect.Effect = function()
    {

    };

    
    VectorEffect.Effect.prototype = {
        /// 绘制对象
        draw: function(geo){}
    };

    /// 符号对象
    VectorEffect.Symbol = function(){
	};

    VectorEffect.Symbol.prototype = {
        draw : function(geo) {
			
			
		}
    };

    /// 图层类
    VectorEffect.Layer = function()
    {
        this._data = '';
        this._symbol = '';
		this._effect = '';
    };

    VectorEffect.Layer.prototype = {
        
        constructor : VectorEffect.Layer,

        /// 绘制当前图层
        draw: function (self) {
			if(this._symbol.type=="circle"){
				for(var i=0;i<this._data.points.length;i++){
					if(!self.maplayer.olMap.frameState_)
					{
						continue;
					}
					var xy=exchangeXY(self.maplayer.JW2MapCoord(this._data.points[i]),self.maplayer.olMap.frameState_.coordinateToPixelTransform,self.maplayer.GetMapSize());
					if(xy==false)
						continue;
					var op=this._symbol;
					op['xy']=xy;
					op['ctx']=self.ctx;
					if(this._data.size[i])
					{
						if(Array.isArray(this._data.size[i])&&typeof this._data.size[i][0] =='number')
						{
							op['hmax'] = this._data.size[i][0]*1.5;
							op['rmin'] = this._data.size[i][0];
						}
						else if(typeof this._data.size[i] =='number'){
							op['hmax'] = this._data.size[i]*1.5;
							op['rmin'] = this._data.size[i];
						}
						
					}
					op['color']=this._data.color[i]||this._symbol.color;
					op['effect']=this._effect||'normal';
					if(op['effect']=='high')
						self.circle.addhighPoint(op);
					else if(op['effect']=='click')
						self.circle.addclickPoint(op);
					else
						self.circle.addPoint(op);				
				}
				
			}
			else if(this._symbol.type=="isogon"){
				for(var i=0;i<this._data.points.length;i++){
					if(!self.maplayer.olMap.frameState_)
					{
						continue;
					}
					var xy=exchangeXY(self.maplayer.JW2MapCoord(this._data.points[i]),self.maplayer.olMap.frameState_.coordinateToPixelTransform,self.maplayer.GetMapSize());
					if(xy==false)
						continue;
					var op=this._symbol;
					op['xy']=xy;
					op['ctx']=self.ctx;
					if(this._data.size[i])
					{
						if(Array.isArray(this._data.size[i])&&typeof this._data.size[i][0] =='number')
						{
							op['hmax'] = this._data.size[i][0]*1.5;
							op['rmin'] = this._data.size[i][0];
						}
						else if(typeof this._data.size[i] =='number'){
							op['hmax'] = this._data.size[i]*1.5;
							op['rmin'] = this._data.size[i];
						}
					}
					op['color']=this._data.color[i]||this._symbol.color;
					op['pointnum']=this._symbol.pointnum||this._symbol.iconpoints||3;
					op['hmax']=this._symbol.hmax||this._symbol.radius1||this._symbol.radius||10;
					op['r2max']=this._symbol.r2max||this._symbol.radius2||0;
					op['effect']=this._effect||'normal';
					if(op['effect']=='high')
						self.isogon.addhighPoint(op);
					else if(op['effect']=='click')
						self.isogon.addclickPoint(op);
					else
						self.isogon.addPoint(op);	
				}
			}	
			else if(this._symbol.type=="heart"){
				for(var i=0;i<this._data.points.length;i++){
					if(!self.maplayer.olMap.frameState_)
					{
						continue;
					}
					var xy=exchangeXY(self.maplayer.JW2MapCoord(this._data.points[i]),self.maplayer.olMap.frameState_.coordinateToPixelTransform,self.maplayer.GetMapSize());
					if(xy==false)
						continue;
					var op=this._symbol;
					op['xy']=xy;
					op['ctx']=self.ctx;
					if(this._data.size[i])
					{
						if(Array.isArray(this._data.size[i])&&typeof this._data.size[i][0] =='number')
						{
							op['hmax'] = this._data.size[i][0]*1.5;
							op['rmin'] = this._data.size[i][0];
						}
						else if(typeof this._data.size[i] =='number'){
							op['hmax'] = this._data.size[i]*1.5;
							op['rmin'] = this._data.size[i];
						}
					}
					op['color']=this._data.color[i]||this._symbol.color;
					op['pointnum']=this._symbol.pointnum||this._symbol.iconpoints||3;
					op['hmax']=this._symbol.hmax||this._symbol.radius1||this._symbol.radius||10;
					op['r2max']=this._symbol.r2max||this._symbol.radius2||0;
					op['effect']=this._effect||'normal';
					if(op['effect']=='high')
						self.heart.addhighPoint(op);
					else if(op['effect']=='click')
						self.heart.addclickPoint(op);
					else
						self.heart.addPoint(op);	
				}
			}
			//this.symbol.draw(this);
			
		}
    };

    ///
    VectorEffect.Manager = function()
    {
		
        this._layers = [];
		this.maplayer='';
		this.circle = new Circle.init({});
		this.isogon = new Isogon.init({});
		this.heart = new Heart.init({});
		this.ctx= '';
		this.isover=true;
    };

    ///
    VectorEffect.Manager.prototype = {
        
        /// 
        constructor: VectorEffect.Manager,
		
        addLayer: function(options) {
			var layer=new VectorEffect.Layer();
			layer._data=options.data;
			layer._data.points = layer._data.points||[];
			layer._data.color = layer._data.color||[];
			layer._data.size = layer._data.size||[];
			layer._symbol=options.symbol;
			layer._effect = options.effect;
			this._layers.push(layer);
			layer.draw(this);
			
			return layer;
		},

        /// 删除，输入addLayer返回的layer对象
        removeLayer: function(layer){
			if(layer){
				var a=-1;
				for(var i=0;i<this._layers.length;i++){
					if(this._layers[i]===layer)
					{
						a=i;
						break;}
				}
				if(a!=-1)
				{					
					this._layers.splice(a,1);
					//this.ctx.clearRect(0,0,this.maplayer.GetMapSize()[0],this.maplayer.GetMapSize()[1]);
					if(layer._effect=="high")
					{
						this.resetHighPoint();
					}
					else if(layer._effect=="click")
					{
						this.resetClickPoint();
					}
					else{
						this.resetPoint();
					}
						
				}
			}
		},
		
		draw:function(){
			this.isover=false;
			if(this.circle.IPointCollection.length==0&&this.isogon.IPointCollection.length==0&&this.heart.IPointCollection.length==0){
				for(var i=0;i<this._layers.length;i++){
				this._layers[i].draw(this);
				}
			}
			this.ctx.clearRect(0,0,this.maplayer.GetMapSize()[0],this.maplayer.GetMapSize()[1]);
			
			this.circle.IPointCollection.map(function(line) {
					line.step();
				})
			this.isogon.IPointCollection.map(function(line1) {
					line1.step();
				})
			this.heart.IPointCollection.map(function(line11) {
					line11.step();
				})
			this.circle.highPoint.map(function(line2) {
					line2.step();
				})
			this.isogon.highPoint.map(function(line3) {
					line3.step();
				})
			this.heart.highPoint.map(function(line13) {
					line13.step();
				})
			this.circle.clickPoint.map(function(line4) {
					line4.step();
				})
			this.isogon.clickPoint.map(function(line5) {
					line5.step();
				})
			this.heart.clickPoint.map(function(line15) {
					line15.step();
				})
			
			
		},
		resetPoint:function(){
			this.circle.IPointCollection=[];
			this.isogon.IPointCollection=[];
			this.heart.IPointCollection=[];
			this.resetHighPoint();
			this.resetClickPoint();			
		},
		resetHighPoint:function(){
			this.circle.highPoint=[];
			this.isogon.highPoint=[];
			this.heart.highPoint=[];
		},
		resetClickPoint:function(){
			this.circle.clickPoint=[];
			this.isogon.clickPoint=[];
			this.heart.clickPoint=[];
		},
		getPointNum:function(){
			return this.heart.highPoint.length+this.heart.clickPoint.length+this.heart.IPointCollection.length+this.circle.IPointCollection.length+this.isogon.IPointCollection.length+this.circle.highPoint.length+this.isogon.highPoint.length+this.circle.clickPoint.length+this.isogon.clickPoint.length;
		}
        ///
    };  
	function exchangeXY(coors,transform,mapsize){
		var xy = [0,0];
		xy[0] = transform[0] *coors[0] + transform[2] * coors[1] + transform[4];
		xy[1] = transform[1] * coors[0] + transform[3] * coors[1] + transform[5]; 
		if(xy[0]<0||xy[0]>mapsize[0]||xy[1]<0||xy[1]>mapsize[1])
			return false;
		else
		return xy;
	}
})();









//上图形状


var Circle=Circle||{};
(function() {
	Circle.init=function init(option){
		var self = this;	
		this.option=option||{};
		this.IPointCollection=[];
		this.highPoint=[];
		this.clickPoint=[];
		this.addclickPoint=function(op){
			for(var key in op){
				self.option[key]=op[key];
			}
			self.clickPoint.push(new Circle.drowPoint(self.option))
		}
		this.resetclickPoint=function(){
			self.clickPoint=[];
		}
		this.addhighPoint=function(op){
			for(var key in op){
				self.option[key]=op[key];
			}
			self.highPoint.push(new Circle.drowPoint(self.option))
		}
		this.resethighPoint=function(){
			self.highPoint=[];
		}
		this.addPoint=function(op){
			for(var key in op){
				self.option[key]=op[key];
			}
			self.IPointCollection.push(new Circle.drowPoint(self.option))
		}
		this.resetPoint=function(){
			self.IPointCollection=[];
		}
	}
	Circle.drowPoint=function setPoint(option){			
			var t = this;
			this.ctx=option.ctx;
			this.radius_high_max=option.hmax||12;   			     // 初始半径最大值
			this.radius_high_min=option.hmin||t.radius_high_max-3;   			     // 初始半径最小值
				
			this.radius_min=option.rmin||1;   			     // 初始半径最小值
			this.radius_max=option.rmax||t.radius_min+1;   			     // 初始半径最大值	
			this.opacity_min=option.opacitymin||0.8;                // 初始透明度最小值
			this.opacity_max=option.opacitymax||1.0;				 // 初始透明度最大值
			this.opacity_prev_min=option.opacityprevmin||0.02;            // 透明度递减值最小值
			this.opacity_prev_max=option.opacityprevmax||0.04;          // 透明度递减值最大值
			this.radius_add_min=option.raddmin||(t.radius_high_min-t.radius_max)/25;             // 半径增加最小值
			this.radius_add_max=option.raddmax||(t.radius_high_max-t.radius_min)/25;             // 半径增加最大值		
			this.light_min=option.lightmin||60;               // 颜色亮度最小值
			this.light_max=option.lightmax||80;
			this.color=option.color||'rgb(255,0,0)';
			this.effect=option.effect||'normal';
			this.lineWidth=option.lineWidth||(parseInt((t.radius_high_max-t.radius_min)/5)>2?parseInt((t.radius_high_max-t.radius_min)/5):2);
			this.n=option.n||3; 
			var pi = Math.PI;
			t.x = option.xy[0];
			t.y = option.xy[1];
			t.radius = find_random(t.radius_min,t.radius_max);
			t.radius_change = find_random(t.radius_add_min,t.radius_add_max);
			t.opacity = find_random(t.opacity_min,t.opacity_max);
			t.opacity_change = find_random(t.opacity_prev_min,t.opacity_prev_max);
			t.light = find_random(t.light_min,t.light_max);
			t.h=true;
			this.step = function(){
				if(t.effect=='normal'){
					t.step1();
				}
				else if(t.effect=='high'||t.effect=='click'){
					t.high();
				}
				else if(t.effect=='ring'){
					t.step2();
				}
			}
			this.reset=function(){
					t.radius = find_random(t.radius_min,t.radius_max);
					t.radius_change = find_random(t.radius_add_min,t.radius_add_max);
					t.opacity = find_random(t.opacity_min,t.opacity_max);
					t.opacity_change = find_random(t.opacity_prev_min,t.opacity_prev_max);
					t.light = find_random(t.light_min,t.light_max);
				},
			this.step1=function(){
					if(t.radius<=t.radius_high_max)
					{
						t.opacity -= t.opacity_change/10;
						t.radius += t.radius_change;		
						
					}
					else {
						t.opacity -= t.opacity_change;
						t.radius += t.radius_change/10;
					}
					if(t.opacity <= 0){
						t.reset();
						
					}
					t.ctx.fillStyle = t.color;
					t.ctx.globalAlpha = t.opacity;
					t.ctx.beginPath();
					t.ctx.arc(t.x,t.y,t.radius,0,2*pi);
					t.ctx.closePath();
					t.ctx.fill();
					t.ctx.globalAlpha = 1;
				}
			this.x1=0;this.y1=0;this.z1=0;
			this.a=false;this.b=false;
			this.step2 = function(){
				t.x1++;
				if(t.x1>parseInt(t.opacity/t.opacity_change)-1)
					t.x1=0;
				t.ctx.strokeStyle=t.color;
				t.ctx.lineWidth=t.lineWidth;
				t.ctx.globalAlpha=t.opacity-t.x1*t.opacity_change;
				//t.ctx.shadowColor=t.color;
				//t.ctx.shadowBlur=5;
				t.ctx.beginPath();
				t.ctx.arc(t.x,t.y,t.radius_min+t.x1*t.radius_high_max*t.opacity_change/t.opacity,0,2*pi);
				t.ctx.closePath();
				t.ctx.stroke();
				t.ctx.globalAlpha = 1;
				if(t.x1>parseInt(t.opacity/(3*t.opacity_change))-1)
				t.a=true;

				if(t.x1>parseInt(t.opacity*2/(3*t.opacity_change))-1)
				t.b=true;
				if(t.a==true){
				t.y1++;
				if(t.y1>parseInt(t.opacity/t.opacity_change)-1)
				t.y1=0;
				t.ctx.strokeStyle=t.color;
				t.ctx.lineWidth=t.lineWidth;
				t.ctx.globalAlpha=t.opacity-t.y1*t.opacity_change;
				//t.ctx.shadowColor=t.color;
				//t.ctx.shadowBlur=5;
				t.ctx.beginPath();
				t.ctx.arc(t.x,t.y,t.radius_min+t.y1*t.radius_high_max*t.opacity_change/t.opacity,0,2*pi);
				t.ctx.closePath();
				t.ctx.stroke();
				t.ctx.globalAlpha = 1;
				}
				if(t.b==true){
				t.z1++;
				if(t.z1>parseInt(t.opacity/t.opacity_change)-1)
				t.z1=0;
				t.ctx.strokeStyle=t.color;
				t.ctx.lineWidth=t.lineWidth;
				t.ctx.globalAlpha=t.opacity-t.z1*t.opacity_change;
				//t.ctx.shadowColor=t.color;
				//t.ctx.shadowBlur=5;
				t.ctx.beginPath();
				t.ctx.arc(t.x,t.y,t.radius_min+t.z1*t.radius_high_max*t.opacity_change/t.opacity,0,2*pi);
				t.ctx.closePath();
				t.ctx.stroke();	
				t.ctx.globalAlpha = 1;				
			}
			}
			this.high=function(){
				if(t.radius<t.radius_high_min-0.3)
					t.radius=t.radius_high_min;
				if(t.radius > t.radius_high_max){
					t.h=!t.h;	
				}
				if(t.radius < t.radius_high_min){
					t.h=!t.h;	
				}
				if(t.h)
				 {
					t.radius += 0.3;
				 }
				else{
					t.radius -= 0.3;
				}	
				
				t.ctx.fillStyle = t.color;				
				t.ctx.beginPath();
				t.ctx.arc(t.x,t.y,t.radius,0,2*pi,true);
				t.ctx.closePath();
				t.ctx.fill();
				t.ctx.globalAlpha = 1;
			}
			function find_random(num_one,num_two){
				return Math.random()*(num_two-num_one)+num_one;
			}
		}
})();

var Isogon=	Isogon||{};
(function() {
	Isogon.init=function init(option){
		var self = this;	
		this.option=option||{};
		this.IPointCollection=[];
		this.highPoint=[];
		this.clickPoint=[];
		this.addclickPoint=function(op){
			for(var key in op){
				self.option[key]=op[key];
			}
			self.clickPoint.push(new Isogon.drowPoint(self.option))
		}
		this.resetclickPoint=function(){
			self.clickPoint=[];
		}
		this.addhighPoint=function(op){
			for(var key in op){
				self.option[key]=op[key];
			}
			self.highPoint.push(new Isogon.drowPoint(self.option))
		}
		this.resethighPoint=function(){
			self.highPoint=[];
		}
		this.addPoint=function(op){
			for(var key in op){
				self.option[key]=op[key];
			}
			self.IPointCollection.push(new Isogon.drowPoint(self.option))
		}
		this.resetPoint=function(){
			self.IPointCollection=[];
		}
	}
	Isogon.drowPoint=function drowPoint(option){			
			var t = this;
			this.ctx=option.ctx;
			this.radius_high_max=option.hmax||12;   			     // 初始半径最大值
			this.radius_high_min=option.hmin||t.radius_high_max-3;   			     // 初始半径最小值
				
			this.radius_min=option.rmin||1;   			     // 初始半径最小值
			this.radius_max=option.rmax||t.radius_min+1;   			     // 初始半径最大值	
			this.opacity_min=option.opacitymin||0.9;                // 初始透明度最小值
			this.opacity_max=option.opacitymax||1.0;				 // 初始透明度最大值
			this.opacity_prev_min=option.opacityprevmin||0.01;            // 透明度递减值最小值
			this.opacity_prev_max=option.opacityprevmax||0.02;          // 透明度递减值最大值
			this.radius_add_min=option.raddmin||(t.radius_high_min-t.radius_max)/50;             // 半径增加最小值
			this.radius_add_max=option.raddmax||(t.radius_high_max-t.radius_min)/50;             // 半径增加最大值		
			this.light_min=option.lightmin||60;               // 颜色亮度最小值
			this.light_max=option.lightmax||80;
			this.color=option.color||'rgb(255,0,0)';
			this.radius2_max=option.r2max||0; 
			this.radius2_min=option.r2min||((t.radius2_max-1)<0?0:(t.radius2_max-1));   			     // 初始半径最小值
			this.effect=option.effect||'normal';
			this.n=option.pointnum||3; 
			this.lineWidth=option.lineWidth||(parseInt((t.radius_high_max-t.radius_min)/5)>2?parseInt((t.radius_high_max-t.radius_min)/5):2);
			var pi = Math.PI;
			t.x = option.xy[0];
			t.y = option.xy[1];
			t.radius = find_random(t.radius_min,t.radius_max);
			t.radius2 = find_random(t.radius_min*t.radius2_min/t.radius_high_min,t.radius_max*t.radius2_max/t.radius_high_max);
			t.opacity = find_random(t.opacity_min,t.opacity_max);
	
			t.radius_change = find_random(t.radius_add_min,t.radius_add_max);
			
			t.opacity_change = find_random(t.opacity_prev_min,t.opacity_prev_max);
			
			t.aradius =t.radius+(t.radius_change*t.opacity/t.opacity_change)/3;
			t.aradius2 = t.radius2==0? 0:t.radius2+((t.radius_change*t.radius2_max/t.radius_high_max)*t.opacity/t.opacity_change)/3;
			t.aopacity = t.opacity/3;
			t.bradius = (t.radius_change*t.opacity/t.opacity_change)*2/3+t.radius;
			t.bradius2 = t.radius2==0? 0:t.radius2+((t.radius_change*t.radius2_max/t.radius_high_max)*t.opacity/t.opacity_change)*2/3;
			t.bopacity =  t.opacity*2/3
			
			
			
			t.light = find_random(t.light_min,t.light_max);
			t.h=true;
			this.step = function(){
				if(t.effect=='normal'){
					t.step3();
				}
				else if(t.effect=='high'||t.effect=='click'){
					t.high();
				}
				else if(t.effect=='ring'){
					t.step4();
				}
			}
			this.reset=function(){
					
					t.radius = find_random(t.radius_min,t.radius_max);
					t.radius2 = find_random(t.radius_min*t.radius2_min/t.radius_high_min,t.radius_max*t.radius2_max/t.radius_high_max);
					t.opacity = find_random(t.opacity_min,t.opacity_max);										
					t.radius_change = find_random(t.radius_add_min,t.radius_add_max);				
					t.opacity_change = find_random(t.opacity_prev_min,t.opacity_prev_max);
					t.light = find_random(t.light_min,t.light_max);	
				}
			this.reset1=function(){
					t.aradius = find_random(t.radius_min,t.radius_max);
					t.aradius2 = find_random(t.radius_min*t.radius2_min/t.radius_high_min,t.radius_max*t.radius2_max/t.radius_high_max);
					t.aopacity = find_random(t.opacity_min,t.opacity_max);		
			}
			this.reset2=function(){
					t.bradius = find_random(t.radius_min,t.radius_max);
					t.bradius2 = find_random(t.radius_min*t.radius2_min/t.radius_high_min,t.radius_max*t.radius2_max/t.radius_high_max);
					t.bopacity = find_random(t.opacity_min,t.opacity_max);
			}
			this.step2 = function(){
					t.bopacity -= t.opacity_change;	
					t.bradius2 =t.bradius2==0? 0:t.bradius2+t.radius_change*t.radius2_max/t.radius_high_max;
					t.bradius += t.radius_change;		
					if(t.bopacity <= 0){
						t.reset2();
							//return false;
					}
					t.ctx.fillStyle = t.color;
					t.ctx.globalAlpha = t.bopacity;
					t.ctx.beginPath();
					polygon(t.ctx,t.n,t.x,t.y,t.bradius,t.bradius2);
					t.ctx.fill();
					
					t.aopacity -= t.opacity_change;	
					t.aradius2 =t.aradius2==0? 0:t.aradius2+t.radius_change*t.radius2_max/t.radius_high_max;
					t.aradius += t.radius_change;		
					if(t.aopacity <= 0){
						t.reset1();
							//return false;
					}
					t.ctx.fillStyle = t.color;
					t.ctx.globalAlpha = t.aopacity;
					t.ctx.beginPath();
					polygon(t.ctx,t.n,t.x,t.y,t.aradius,t.aradius2);
					t.ctx.fill();
					
					t.opacity -= t.opacity_change;	
					t.radius2 =t.radius2==0? 0:t.radius2+t.radius_change*t.radius2_max/t.radius_high_max;
					t.radius += t.radius_change;		
					if(t.opacity <= 0){
						t.reset();
							//return false;
					}
					t.ctx.fillStyle = t.color;
					t.ctx.globalAlpha = t.opacity;
					t.ctx.beginPath();
					polygon(t.ctx,t.n,t.x,t.y,t.radius,t.radius2);
					t.ctx.fill();										
					t.ctx.globalAlpha = 1;
			
			}
			
			this.x1=0;this.y1=0;this.z1=0;
			this.a=false;this.b=false;
			this.step4 = function(){
				t.x1++;
				if(t.x1>parseInt(t.opacity/t.opacity_change)-1)
					t.x1=0;
				t.ctx.strokeStyle=t.color;
				t.ctx.lineWidth=t.lineWidth;
				t.ctx.globalAlpha=t.opacity-t.x1*t.opacity_change;
				//t.ctx.shadowColor=t.color;
				//t.ctx.shadowBlur=5;
				t.ctx.beginPath();
				polygon(t.ctx,t.n,t.x,t.y,t.radius_min+t.x1*t.radius_high_max*t.opacity_change/t.opacity,t.x1*t.radius2_max*t.opacity_change/t.opacity);
				t.ctx.closePath();
				t.ctx.stroke();
				t.ctx.globalAlpha = 1;
				if(t.x1>parseInt(t.opacity/(3*t.opacity_change))-1)
				t.a=true;

				if(t.x1>parseInt(t.opacity*2/(3*t.opacity_change))-1)
				t.b=true;
				if(t.a==true){
				t.y1++;
				if(t.y1>parseInt(t.opacity/t.opacity_change)-1)
				t.y1=0;
				t.ctx.strokeStyle=t.color;
				t.ctx.lineWidth=t.lineWidth;
				t.ctx.globalAlpha=t.opacity-t.y1*t.opacity_change;
				//t.ctx.shadowColor=t.color;
				//t.ctx.shadowBlur=5;
				t.ctx.beginPath();
				polygon(t.ctx,t.n,t.x,t.y,t.radius_min+t.y1*t.radius_high_max*t.opacity_change/t.opacity,t.y1*t.radius2_max*t.opacity_change/t.opacity);
				t.ctx.closePath();
				t.ctx.stroke();
				t.ctx.globalAlpha = 1;
				}
				if(t.b==true){
				t.z1++;
				if(t.z1>parseInt(t.opacity/t.opacity_change)-1)
				t.z1=0;
				t.ctx.strokeStyle=t.color;
				t.ctx.lineWidth=t.lineWidth;
				t.ctx.globalAlpha=t.opacity-t.z1*t.opacity_change;
				//t.ctx.shadowColor=t.color;
				//t.ctx.shadowBlur=5;
				t.ctx.beginPath();
				polygon(t.ctx,t.n,t.x,t.y,t.radius_min+t.z1*t.radius_high_max*t.opacity_change/t.opacity,t.z1*t.radius2_max*t.opacity_change/t.opacity);
				t.ctx.closePath();
				t.ctx.stroke();	
				t.ctx.globalAlpha = 1;				
			}
			}
			
			this.step1=function(){
					if(t.radius<=t.radius_high_max)
					{
						t.opacity -= t.opacity_change/10;	
						t.radius2 =t.radius2==0? 0:t.radius2+t.radius_change*t.radius2_max/t.radius_high_max;
						t.radius += t.radius_change;		
						if(t.opacity <= 0){
						t.reset();
							return false;
						}
						t.ctx.fillStyle = t.color;
						t.ctx.globalAlpha = t.opacity;
						t.ctx.beginPath();
						polygon(t.ctx,t.n,t.x,t.y,t.radius,t.radius2);
						//t.ctx.shadowColor=t.color;
						t.ctx.fill();
						t.ctx.globalAlpha = 1;
					}
					else if(t.radius<=t.radius_high_max+10){
						t.opacity -= t.opacity_change;
						t.radius2 =t.radius2==0? 0:t.radius2+t.radius_change*t.radius2_max/t.radius_high_max;
						t.radius += t.radius_change;
						if(t.opacity <= 0){
						t.reset();
							return false;
						}
						t.ctx.fillStyle = t.color;
						t.ctx.globalAlpha = t.opacity;
						t.ctx.strokeStyle=t.color;
						t.ctx.beginPath();
						polygon(t.ctx,t.n,t.x,t.y,t.radius_high_max,t.radius2_max);
						t.ctx.fill();
						
						
						
						t.ctx.beginPath();
						polygon(t.ctx,t.n,t.x,t.y,t.radius,t.radius2);
						//t.ctx.shadowColor=t.color;
						t.ctx.stroke();
						t.ctx.globalAlpha = 1;
					}
					else {
						t.opacity -= t.opacity_change;
						t.radius2 =t.radius2==0? 0:t.radius2+t.radius_change*t.radius2_max/t.radius_high_max;
						t.radius += t.radius_change;
						if(t.opacity <= 0){
						t.reset();
							return false;
						}
						t.ctx.fillStyle = t.color;
						t.ctx.globalAlpha = t.opacity;
						t.ctx.strokeStyle=t.color;
						t.ctx.beginPath();
						polygon(t.ctx,t.n,t.x,t.y,t.radius_high_max,t.radius2_max);
						t.ctx.fill();
						
						
						
						t.ctx.beginPath();
						polygon(t.ctx,t.n,t.x,t.y,t.radius,t.radius2);
						//t.ctx.shadowColor=t.color;
						t.ctx.stroke();
						t.ctx.globalAlpha = 1;
					}

														
				}
			this.step3=function(){
					if(t.radius<=t.radius_high_max)
					{
						t.opacity -= t.opacity_change/10;	
						t.radius2 =t.radius2==0? 0:t.radius2+t.radius_change*t.radius2_max/t.radius_high_max;
						t.radius += t.radius_change;		
						
					}
					else if(t.radius<=t.radius_high_max+10){
						t.opacity -= t.opacity_change;
						t.radius2 =t.radius2==0? 0:t.radius2+(t.radius_change*t.radius2_max/t.radius_high_max)/5;
						t.radius += t.radius_change/5;
					}
					else {
						t.opacity -= t.opacity_change;
						t.radius2 =t.radius2==0? 0:t.radius2+(t.radius_change*t.radius2_max/t.radius_high_max)/10;
						t.radius += t.radius_change/10;
					}
					if(t.opacity <= 0){
						t.reset();
							return false;
					}
					t.ctx.fillStyle = t.color;
					t.ctx.globalAlpha = t.opacity;
					t.ctx.beginPath();
					polygon(t.ctx,t.n,t.x,t.y,t.radius,t.radius2);
					t.ctx.fill();
					t.ctx.globalAlpha = 1;
					
														
				}
			this.high=function(){
				if(t.radius<t.radius_high_min-0.3)
					t.radius=t.radius_high_min;
				if(t.radius > t.radius_high_max){
					t.h=!t.h;	
				}
				if(t.radius < t.radius_high_min){
					t.h=!t.h;	
				}
				if(t.h)
				 {
					t.radius += 0.3;
				 }
				else{
					t.radius -= 0.3;
				}	
				t.radius2=t.radius2_max*t.radius/t.radius_high_max;
				t.ctx.fillStyle = t.color;				
				t.ctx.beginPath();
				polygon(t.ctx,t.n,t.x,t.y,t.radius,t.radius2);
				
				t.ctx.fill();
				t.ctx.globalAlpha = 1;
			}
			function find_random(num_one,num_two){
				return Math.random()*(num_two-num_one)+num_one;
			}
			function polygon(c,n,x,y,r1,r2,angle,counterclockwise){
				var r=r1;
				var angle = angle || 0;  
				var counterclockwise = counterclockwise || false;  
				c.moveTo(x + r1*Math.sin(angle), y - r1*Math.cos(angle));     //确立第一个点  
				
				if(r2==undefined||r2==0){
					var delta = 2*Math.PI/n;        //相邻两个顶点之间的夹角  
					for(var i=0;i<n;i++){            //其他顶点  
						angle += counterclockwise ? -delta : delta;     //角度调整  
						c.lineTo(x + r*Math.sin(angle), y - r*Math.cos(angle));  
					}  
					c.closePath();      //首位相邻  
				}
				else{
					var delta = Math.PI/n;        //相邻两个顶点之间的夹角  
					for(var i=0;i<2*n;i++){            //其他顶点  
						angle += counterclockwise ? -delta : delta;     //角度调整  
						r=r1;
						if(i%2==0)
						r=r2;
						c.lineTo(x + r*Math.sin(angle), y - r*Math.cos(angle));  
					}  
					c.closePath();      //首位相邻 
				}
			}
		}
})();

var Heart=Heart||{};
(function() {
	Heart.init=function init(option){
		var self = this;	
		this.option=option||{};
		this.IPointCollection=[];
		this.highPoint=[];
		this.clickPoint=[];
		this.addclickPoint=function(op){
			for(var key in op){
				self.option[key]=op[key];
			}
			self.clickPoint.push(new Heart.drowPoint(self.option))
		}
		this.resetclickPoint=function(){
			self.clickPoint=[];
		}
		this.addhighPoint=function(op){
			for(var key in op){
				self.option[key]=op[key];
			}
			self.highPoint.push(new Heart.drowPoint(self.option))
		}
		this.resethighPoint=function(){
			self.highPoint=[];
		}
		this.addPoint=function(op){
			for(var key in op){
				self.option[key]=op[key];
			}
			self.IPointCollection.push(new Heart.drowPoint(self.option))
		}
		this.resetPoint=function(){
			self.IPointCollection=[];
		}
	}
	Heart.drowPoint=function setPoint(option){			
			var t = this;
			this.ctx=option.ctx;
			this.radius_high_max=option.hmax||12;   			     // 初始半径最大值
			this.radius_high_min=option.hmin||t.radius_high_max-3;   // 初始半径最小值
				
			this.radius_min=option.rmin||1;   			     // 初始半径最小值
			this.radius_max=option.rmax||t.radius_min+1;   			     // 初始半径最大值	
			this.opacity_min=option.opacitymin||0.8;                // 初始透明度最小值
			this.opacity_max=option.opacitymax||1.0;				 // 初始透明度最大值
			this.opacity_prev_min=option.opacityprevmin||0.01;            // 透明度递减值最小值
			this.opacity_prev_max=option.opacityprevmax||0.02;          // 透明度递减值最大值
			this.radius_add_min=option.raddmin||(t.radius_high_min-t.radius_max)/50;             // 半径增加最小值
			this.radius_add_max=option.raddmax||(t.radius_high_max-t.radius_min)/50;             // 半径增加最大值		
			this.light_min=option.lightmin||60;               // 颜色亮度最小值
			this.light_max=option.lightmax||80;
			this.color=option.color||'rgb(255,0,0)';
			this.effect=option.effect||'normal';
			this.lineWidth=option.lineWidth||(parseInt((t.radius_high_max-t.radius_min)/5)<2?2:parseInt((t.radius_high_max-t.radius_min)/5));
			this.n=option.n||3; 
			var pi = Math.PI;
			t.x = option.xy[0];
			t.y = option.xy[1];
			t.radius = find_random(t.radius_min,t.radius_max);
			t.radius_change = find_random(t.radius_add_min,t.radius_add_max);
			t.opacity = find_random(t.opacity_min,t.opacity_max);
			t.opacity_change = find_random(t.opacity_prev_min,t.opacity_prev_max);
			t.light = find_random(t.light_min,t.light_max);
			t.h=true;
			this.step = function(){
				if(t.effect=='normal'){
					t.step1();
				}
				else if(t.effect=='high'||t.effect=='click'){
					t.high();
				}
				else if(t.effect=='ring'){
					t.step2();
				}
			}
			this.reset=function(){
					t.radius = find_random(t.radius_min,t.radius_max);
					t.radius_change = find_random(t.radius_add_min,t.radius_add_max);
					t.opacity = find_random(t.opacity_min,t.opacity_max);
					t.opacity_change = find_random(t.opacity_prev_min,t.opacity_prev_max);
					t.light = find_random(t.light_min,t.light_max);
				},
			this.x1=0;this.y1=0;this.z1=0;
			this.a=false;this.b=false;
				
			this.step1=function(){				
				if(t.radius<=t.radius_high_max)
					{
						t.opacity -= t.opacity_change/10;
						t.radius += t.radius_change;								
					}
				else {
						t.opacity -= t.opacity_change;
						t.radius += t.radius_change/10;
					}
				if(t.opacity <= 0){
						t.reset();						
					}
				t.ctx.fillStyle = t.color;
				t.ctx.globalAlpha = t.opacity;
				var a1=t.radius;
				var b1=3*a1/2;
				var x1=t.x;
				var y1=t.y-a1/2;
				t.ctx.beginPath();
				t.ctx.moveTo(x1,y1);
				t.ctx.bezierCurveTo(x1+a1/2,y1-b1*2/3,x1+a1*2,y1+b1/3,x1,y1+b1);
				t.ctx.bezierCurveTo(x1-a1* 2,y1+ b1/3,x1-a1/2,y1-b1*2/3,x1,y1);
				t.ctx.closePath();
				t.ctx.fill();
				t.ctx.globalAlpha = 1;
			}

			this.step2 = function(){
				t.x1++;
				if(t.x1>parseInt(t.opacity/t.opacity_change)-1)
					t.x1=0;
				t.ctx.strokeStyle=t.color;
				t.ctx.lineWidth=t.lineWidth;
				t.ctx.globalAlpha=t.opacity-t.x1*t.opacity_change;
				//t.ctx.shadowColor=t.color;
				//t.ctx.shadowBlur=5;
				var a1=t.radius_min+t.x1*t.radius_high_max*t.opacity_change/t.opacity;
				var b1=3*a1/2;
				var x1=t.x;
				var y1=t.y-a1/2;
				t.ctx.beginPath();
				t.ctx.moveTo(x1,y1);
				t.ctx.bezierCurveTo(x1+a1/2,y1-b1*2/3,x1+a1*2,y1+b1/3,x1,y1+b1);
				t.ctx.bezierCurveTo(x1-a1* 2,y1+ b1/3,x1-a1/2,y1-b1*2/3,x1,y1);
				t.ctx.closePath();
				
				t.ctx.stroke();
				t.ctx.globalAlpha = 1;
				if(t.x1>parseInt(t.opacity/(3*t.opacity_change))-1)
				t.a=true;

				if(t.x1>parseInt(t.opacity*2/(3*t.opacity_change))-1)
				t.b=true;
				if(t.a==true){
				t.y1++;
				if(t.y1>parseInt(t.opacity/t.opacity_change)-1)
				t.y1=0;
				t.ctx.strokeStyle=t.color;
				t.ctx.lineWidth=t.lineWidth;
				t.ctx.globalAlpha=t.opacity-t.y1*t.opacity_change;
				//t.ctx.shadowColor=t.color;
				//t.ctx.shadowBlur=5;
				var a2=t.radius_min+t.y1*t.radius_high_max*t.opacity_change/t.opacity;
				var b2=3*a2/2;
				var x2=t.x;
				var y2=t.y-a2/2;
				t.ctx.beginPath();
				t.ctx.moveTo(x2,y2);
				t.ctx.bezierCurveTo(x2+a2/2,y2-b2*2/3,x2+a2*2,y2+b2/3,x2,y2+b2);
				t.ctx.bezierCurveTo(x2-a2* 2,y2+ b2/3,x2-a2/2,y2-b2*2/3,x2,y2);
				t.ctx.closePath();
				t.ctx.stroke();
				t.ctx.globalAlpha = 1;
				}
				if(t.b==true){
				t.z1++;
				if(t.z1>parseInt(t.opacity/t.opacity_change)-1)
				t.z1=0;
				t.ctx.strokeStyle=t.color;
				t.ctx.lineWidth=t.lineWidth;
				t.ctx.globalAlpha=t.opacity-t.z1*t.opacity_change;
				//t.ctx.shadowColor=t.color;
				//t.ctx.shadowBlur=5;
				var a3=t.radius_min+t.z1*t.radius_high_max*t.opacity_change/t.opacity;
				var b3=3*a3/2;
				var x3=t.x;
				var y3=t.y-a3/2;
				t.ctx.beginPath();
				t.ctx.moveTo(x3,y3);
				t.ctx.bezierCurveTo(x3+a3/2,y3-b3*2/3,x3+a3*2,y3+b3/3,x3,y3+b3);
				t.ctx.bezierCurveTo(x3-a3* 2,y3+ b3/3,x3-a3/2,y3-b3*2/3,x3,y3);
				t.ctx.closePath();
				t.ctx.stroke();	
				t.ctx.globalAlpha = 1;				
			}
			}
			this.high=function(){
				if(t.radius<t.radius_high_min-0.3)
					t.radius=t.radius_high_min;
				if(t.radius > t.radius_high_max){
					t.h=!t.h;	
				}
				if(t.radius < t.radius_high_min){
					t.h=!t.h;	
				}
				if(t.h)
				 {
					t.radius += 0.3;
				 }
				else{
					t.radius -= 0.3;
				}	
				
				t.ctx.fillStyle = t.color;
				t.ctx.globalAlpha = t.opacity;
				var a1=t.radius;
				var b1=3*a1/2;
				var x1=t.x;
				var y1=t.y-a1/2;
				t.ctx.beginPath();
				t.ctx.moveTo(x1,y1);
				t.ctx.bezierCurveTo(x1+a1/2,y1-b1*2/3,x1+a1*2,y1+b1/3,x1,y1+b1);
				t.ctx.bezierCurveTo(x1-a1* 2,y1+ b1/3,x1-a1/2,y1-b1*2/3,x1,y1);
				t.ctx.closePath();
				t.ctx.fill();
				t.ctx.globalAlpha = 1;
			}
			function find_random(num_one,num_two){
				return Math.random()*(num_two-num_one)+num_one;
			}
		}
})();
