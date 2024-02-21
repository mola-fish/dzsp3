var Map3DSDK=Map3DSDK||{};!function(){var e=function(e,t){this._map=e,this._box=t.box,this._scale=t.scale?t.scale:[1,1,1],this._offset=t.offset?t.offset:[0,0,0],this._line=[0,0,80,1e3,0,0,0,0,0,0,0,0,0,0,0,0],this._vol={pri:null,apprance:null,mat:null},this._sect={pri:[],apprance:null,mat:null},this._filter={pri:null,apprance:null,mat:null},this._url=t.url?t.url:"BaseWhite";var a=Date.parse(new Date);this._name=t.name?t.name:"Volume_TimeStap_"+a,this._sectpri=[]};e.prototype.InitShader=function(){$.ajax({url:"./libs/zmap3dgl/glsl/glsl.htm",async:!1,dataType:"text",success:function(e){var t=e;$(document.body).append(t)},error:function(e){console.log(e.message)}}),$.ajax({url:"./libs/zmap3dgl/glsl/filter.htm",async:!1,dataType:"text",success:function(e){var t=e;$(document.body).append(t)},error:function(e){console.log(e.message)}}),$.ajax({url:"./libs/zmap3dgl/glsl/sect.htm",async:!1,dataType:"text",success:function(e){var t=e;$(document.body).append(t)},error:function(e){console.log(e.message)}})},e.prototype.Reset=function(){return this._scale=[1,1,1],this._offset=[0,0,0],this.Refresh()},e.prototype.Refresh=function(){this.Destroy(),this.ShowVolume()},e.prototype.SetVisible=function(e){this._map.GetView();this._vol.pri&&(this._vol.pri.show=e)},e.prototype.IsVisible=function(e){this._map.GetView();return!!this._vol.pri&&this._vol.pri.show},e.prototype.ShowVolume=function(){this._CreateModel(1),this.SetVisible(!0)},e.prototype.Destroy=function(){var e=this._map.GetView().scene.primitives;this._vol.pri&&(e.remove(this._vol.pri),this._vol.pri=null)},e.prototype.EnableFilterAnlyze=function(e){e?this._CreateModel(2):this._CreateModel(1)},e.prototype.EnableSectAnlyze=function(e){e?this._CreateModel(3):this._CreateModel(1)},e.prototype.SetSectPlaneAnlyze=function(e,t,a){this._sectpri[e]},e.prototype.SetBox=function(e){this._box=e},e.prototype.GetBox=function(){return this._box},e.prototype.SetScale=function(e){this._scale=e,this.Refresh()},e.prototype.GetScale=function(e){return this._scale},e.prototype.Filter=function(e){Array.isArray(e)&&(this._filter.pri&&(this._filter.pri.appearance.material.uniforms.line=e))},e.prototype.SetMinHei=function(e){null!=e&&(this._vol.pri&&(this._vol.pri.appearance.material.uniforms.minHeight=e))},e.prototype.SetMinLon=function(e){null!=e&&(this._vol.pri&&(this._vol.pri.appearance.material.uniforms.minLongitude=e))},e.prototype.SetMinLat=function(e){null!=e&&(this._vol.pri&&(this._vol.pri.appearance.material.uniforms.minLatitude=e))},e.prototype.SetMaxHei=function(e){null!=e&&(this._vol.pri&&(this._vol.pri.appearance.material.uniforms.maxHeight=e))},e.prototype.SetMaxLon=function(e){null!=e&&(this._vol.pri&&(this._vol.pri.appearance.material.uniforms.maxLongitude=e))},e.prototype.SetMaxLat=function(e){null!=e&&(this._vol.pri&&(this._vol.pri.appearance.material.uniforms.maxLatitude=e))},e.prototype.SetOffset=function(e){this._offset=e,this.Refresh()},e.prototype._calcScaleOffsetBox=function(){var e={},t=this._box,a=this._offset,i=this._scale,r=a[0],n=a[1],o=a[2],s=i[0],m=i[1],p=i[2];return e.xmin=r+t.xmin*s,e.xmax=r+t.xmax*s,e.ymin=n+t.ymin*m,e.ymax=n+t.ymax*m,e.zmin=o+t.zmin*p,e.zmax=o+t.zmax*p,e},e.prototype._getModelMatrix=function(){return this._vol.pri.modelMatrix},e.prototype._setModelMatrix=function(e){this._vol.pri.modelMatrix=e},e.prototype.SetModelMatrix=function(e,t){null==t?this._vol.pri.modelMatrix=this.CalculateMatrix(e):this.getSecPri(t).modelMatrix=this.CalculateMatrix(e)},e.prototype.CalculateMatrix=function(e){return GmMap3D.Matrix4.multiplyByTranslation(GmMap3D.Transforms.eastNorthUpToFixedFrame(GmMap3D.Cartesian3.fromDegrees(e[0],e[1],e[2])),new GmMap3D.Cartesian3(0,0,0),new GmMap3D.Matrix4)},e.prototype._calcModelMatrix=function(){this._offset;var e=this._scale,t=(new GmMap3D.Matrix4,this._box),a=(t.xmin,t.xmax,t.ymin,t.ymin,new GmMap3D.TranslationRotationScale),i=GmMap3D.HeadingPitchRoll.fromDegrees(0,0,0,new GmMap3D.HeadingPitchRoll);return a.rotation=GmMap3D.Quaternion.fromHeadingPitchRoll(i,new GmMap3D.Quaternion),a.scale=GmMap3D.Cartesian3.fromElements(e[0],e[1],e[2],new GmMap3D.Cartesian3),GmMap3D.Matrix4.fromTranslationRotationScale(a,new GmMap3D.Matrix4)},e.prototype._calcParam=function(){this._scale,this._offset;var e=this._calcScaleOffsetBox(),t=(e.xmin+e.xmax)/2,a=(e.ymin+e.ymax)/2,i=(e.zmin+e.zmax)/2,r=e.zmax-e.zmin,n=e.zmin,o=e.zmax,s=GmMap3D.Cartesian3.fromDegrees(e.xmin,e.ymax,n),m=GmMap3D.Cartesian3.fromDegrees(e.xmin,e.ymin,n),p=GmMap3D.Cartesian3.fromDegrees(e.xmax,e.ymax,n),l=Math.sqrt((p.x-s.x)*(p.x-s.x)+(p.y-s.y)*(p.y-s.y)+(p.z-s.z)*(p.z-s.z)),u=Math.sqrt((m.x-s.x)*(m.x-s.x)+(m.y-s.y)*(m.y-s.y)+(m.z-s.z)*(m.z-s.z)),c=GmMap3D.Matrix4.multiplyByTranslation(GmMap3D.Transforms.eastNorthUpToFixedFrame(GmMap3D.Cartesian3.fromDegrees(e.xmin,e.ymin,n)),new GmMap3D.Cartesian3(0,0,0),new GmMap3D.Matrix4),h=new GmMap3D.Matrix4;return{xcen:t,ycen:a,zcen:i,deltaH:r,deltaMinH:n,deltaMaxH:o,a:s,c:m,d:p,deltaX:l,deltaY:u,cenMatrix:c,invCenMatrix:h=GmMap3D.Matrix4.inverse(c,h)}},e.prototype._CreateModel=function(e){"use strict";var t=this._map.GetView(),a=this._calcParam(),i=a.xcen,r=a.ycen,n=a.zcen,o=(a.deltaH,a.deltaMinH),s=a.deltaMaxH,m=a.deltaX,p=a.deltaY,l=a.cenMatrix,u=a.invCenMatrix;if(1==e){var c=null;this._vol.mat?((c=this._vol.mat).uniforms.invMat=GmMap3D.Matrix4.toArray(u),c.uniforms.boxLon=m,c.uniforms.boxLat=p,c.uniforms.boxHeight=s,c.uniforms.minHeight=0,c.uniforms.minLongitude=0,c.uniforms.minLatitude=0,c.uniforms.maxHeight=s,c.uniforms.maxLongitude=m,c.uniforms.maxLatitude=p):c=this._vol.mat=new GmMap3D.Material({fabric:{type:"PramLQ",uniforms:{cubeTex:this._url,transferTex:"./color.jpg",invMat:GmMap3D.Matrix4.toArray(u),boxLon:m,boxLat:p,boxHeight:s,minHeight:0,minLongitude:0,minLatitude:0,maxHeight:s,maxLongitude:m,maxLatitude:p,line:this._line}}});var h=new GmMap3D.BoxGeometry({maximum:new GmMap3D.Cartesian3(m,p,s),minimum:new GmMap3D.Cartesian3(0,0,o)}),x=null;x=this._vol.geom?this._vol.geom:this._vol.geom=GmMap3D.BoxGeometry.createGeometry(h);var M=null;if(M=this._vol.apperance?this._vol.apperance:this._vol.apperance=new GmMap3D.MaterialAppearance({material:c,vertexShaderSource:document.getElementById("filterVertexShaderPass").textContent,fragmentShaderSource:document.getElementById("filterFragmentShaderPass").textContent,faceForward:!0,closed:!0}),!this._vol.pri){var f=this._vol.pri=new GmMap3D.Primitive({geometryInstances:new GmMap3D.GeometryInstance({geometry:x,debugShowBoundingVolume:!0,modelMatrix:l,id:this._name}),asynchronous:!1,appearance:M});t.scene.primitives.add(f)}}else if(2==e){this._vol.pri&&(this._vol.pri.show=!1);c=this._vol.mat,x=this._vol.geom;if(M=this._filter.apperance?this._filter.apperance:this._filter.apperance=new GmMap3D.MaterialAppearance({material:c,vertexShaderSource:document.getElementById("filterVertexShaderPass").textContent,fragmentShaderSource:document.getElementById("filterFragmentShaderPass").textContent,faceForward:!0,closed:!0}),!this._filter.pri){f=this._filter.pri=new GmMap3D.Primitive({geometryInstances:new GmMap3D.GeometryInstance({geometry:x,debugShowBoundingVolume:!0,modelMatrix:l,id:this._name}),asynchronous:!1,appearance:M});t.scene.primitives.add(f)}}else{var y=this._box.xmin,d=this._box.ymin,_=this._box.zmin;this._sectpri=[];c=new GmMap3D.Material({fabric:{type:"PramLQ",uniforms:{cubeTex:"./radar.png",transferTex:"./color.jpg",invMat:GmMap3D.Matrix4.toArray(u),boxLong:m,boxWidth:p,boxHeight:s}}});var D=["lonSection","latSection","heiSection"],G=[],v=[],g=[],w=[],S=[],b=new Float64Array([1e-6,0,0,0,p,0,0,0,s,0,p,s]),C=new Float32Array([0,0,1,0,0,1,0,0,1,0,0,1]),A=new Float32Array([0,1,0,.5,.5,0,1,1]),T=GmMap3D.Matrix4.multiplyByTranslation(GmMap3D.Transforms.eastNorthUpToFixedFrame(GmMap3D.Cartesian3.fromDegrees(i,d,_)),new GmMap3D.Cartesian3(0,0,0),new GmMap3D.Matrix4),F=new Uint32Array([0,1,3,3,2,0]);G.push(b),v.push(C),g.push(A),w.push(F),S.push(T);var z=new Float64Array([0,1e-8,0,m,0,0,0,0,s,m,0,s]),L=new Float32Array([0,0,1,0,0,1,0,0,1,0,0,1]),P=new Float32Array([0,1,0,.5,.5,0,1,1]),B=(T=GmMap3D.Matrix4.multiplyByTranslation(GmMap3D.Transforms.eastNorthUpToFixedFrame(GmMap3D.Cartesian3.fromDegrees(y,r,_)),new GmMap3D.Cartesian3(0,0,0),new GmMap3D.Matrix4),new Uint32Array([0,1,3,3,2,0]));G.push(z),v.push(L),g.push(P),w.push(B),S.push(T);var H=new Float64Array([0,0,1e-6,m,0,0,0,p,0,m,p,0]),V=new Float32Array([0,0,1,0,0,1,0,0,1,0,0,1]),I=new Float32Array([0,1,0,.5,.5,0,1,1]),E=new Uint32Array([0,1,3,3,2,0]);T=GmMap3D.Matrix4.multiplyByTranslation(GmMap3D.Transforms.eastNorthUpToFixedFrame(GmMap3D.Cartesian3.fromDegrees(y,d,n)),new GmMap3D.Cartesian3(0,0,0),new GmMap3D.Matrix4);G.push(H),v.push(V),g.push(I),w.push(E),S.push(T);for(var R=0;R<D.length;R++){var U=new GmMap3D.GeometryAttributes;U.position=new GmMap3D.GeometryAttribute({componentDatatype:GmMap3D.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:G[R]}),U.normal=new GmMap3D.GeometryAttribute({componentDatatype:GmMap3D.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:v[R]}),U.st=new GmMap3D.GeometryAttribute({componentDatatype:GmMap3D.ComponentDatatype.FLOAT,componentsPerAttribute:2,values:g[R]});var N=new GmMap3D.Geometry({attributes:U,indices:w[R],primitiveType:GmMap3D.PrimitiveType.TRIANGLES,boundingSphere:GmMap3D.BoundingSphere.fromVertices(G[R])});f=new GmMap3D.Primitive({geometryInstances:new GmMap3D.GeometryInstance({geometry:N,id:D[R]}),modelMatrix:S[R],asynchronous:!1,appearance:new GmMap3D.MaterialAppearance({material:c,vertexShaderSource:document.getElementById("sliceVertexShaderPass").textContent,fragmentShaderSource:document.getElementById("sliceFragmentShaderPass").textContent,faceForward:!0})});this._sectpri.push(f),t.scene.primitives.add(f)}}},e.prototype.getSecPri=function(e){for(var t=this._sectpri,a=null,i=0;i<t.length;i++)if(t[i]._instanceIds[0]==e){a=t[i];break}return a},Map3DSDK.MapVolume=e}();