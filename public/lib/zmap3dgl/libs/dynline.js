var Color=Cesium.Color,defined=Cesium.defined,defineProperties=Cesium.defineProperties,Event=Cesium.Event,createPropertyDescriptor=Cesium.createPropertyDescriptor,Property=Cesium.Property,Material=Cesium.Material;function PolylineDynMaterialProperty(e){e=e||{},this._definitionChanged=new Event,this.color=e.color,this.color2=e.color2||Color.RED,this.lineLength=1,this.lineSpeed=1,this.startPos=0,this.endPos=1,this.moveTime=Delay+2,this.stopTime=1}PolylineDynMaterialProperty.MaterialType="PolylineDyn",PolylineDynMaterialProperty.MaterialShader="uniform vec4 color;uniform vec4 color2;uniform float startPos;uniform float endPos;uniform float moveTime;uniform float stopTime;uniform float tranDelay;uniform float lineLength;uniform float lineSpeed;czm_material czm_getMaterial(czm_materialInput materialInput){    czm_material material = czm_getDefaultMaterial(materialInput);    vec2 st = materialInput.st;    vec4 c;    float cl = 0.01;    float s = st.s * lineLength;    float t = st.t * lineLength;    if(endPos<=cl){        if (s < startPos) c = color;        else if (s < endPos) {            float h = 0.04*t*t-0.04*t+cl;            float h_s = endPos-s;            if(h_s<h){                c = color;            }else{                c = color2;            }        }        else c = color;    }else{        if (s < startPos) c = color;        else if (s < endPos) {            float st_l = endPos-cl;            float st_l2 = endPos-0.2;            if(s>=st_l){                float h = 0.04*t*t-0.04*t+cl;                float h_s = endPos-s;                if(h_s<h){                    c = color;                }else{                    c = color2;                }            }else{                if(s>=st_l2){                    if(t<0.2||t>0.8){                        c = color;                    }else{                        float t_t = (s - startPos) / lineSpeed;                        float d = (tranDelay - moveTime + t_t) / tranDelay;                        if (d < 0.0) d = 0.0;                        c = mix(color, color2, d);                    }                }else{                    c = color;                }            }        }        else c = color;    }    material.emission = c.rgb;    material.alpha = c.a;    return material;}",defineProperties(PolylineDynMaterialProperty.prototype,{isConstant:{get:function(){return!1}},definitionChanged:{get:function(){return this._definitionChanged}}}),PolylineDynMaterialProperty.prototype.getType=function(e){return PolylineDynMaterialProperty.MaterialType},PolylineDynMaterialProperty.prototype.getValue=function(e,t){return defined(t)||(t={}),t.color=this.color,t.color2=this.color2,t.startPos=this.startPos,t.endPos=this.endPos,t.moveTime=this.moveTime,t.stopTime=this.stopTime,t.tranDelay=Delay,t.lineLength=this.lineLength,t.lineSpeed=this.lineSpeed,t};var Delay=1;PolylineDynMaterialProperty.prototype.update=function(e){this.moveTime+=e,this.stopTime?this.moveTime-this.stopTime>Delay&&(this.startPos=0,this.endPos=this.startPos,this.moveTime=0,this.stopTime=0):this.endPos>this.lineLength?this.stopTime=this.moveTime:this.endPos+=e*this.lineSpeed},PolylineDynMaterialProperty.prototype.equals=function(e){return this===e},Material._materialCache.addMaterial(PolylineDynMaterialProperty.MaterialType,{fabric:{type:PolylineDynMaterialProperty.MaterialType,uniforms:{color:new Color(1,1,1,1),color2:Color.RED,startPos:0,endPos:0,stopTime:0,moveTime:0,tranDelay:Delay,lineSpeed:1,lineLength:1},source:PolylineDynMaterialProperty.MaterialShader},translucent:!0});