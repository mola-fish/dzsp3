let oMyTask=null;export default function WaterVision(e){if(new.target!=WaterVision)throw"构造函数只能通过new关键字调用！";this._canvas=e.canvas;const t=this;var a,i;let r;this._material=new Cesium.Material({fabric:{type:"Water",uniforms:{specularMap:e.canvas,normalMap:"./zmap3dgl/libs/ZmapCegore/dep.debug/Assets/Textures/waterNormals.jpg",frequency:1e4,animationSpeed:.01,amplitude:1}}}),this._appearance=new Cesium.EllipsoidSurfaceAppearance({aboveGround:!0,faceForward:!1,material:this._material,renderState:{fog:{enabled:!0,density:.01}}}),this._geometry=new Cesium.RectangleGeometry({rectangle:(a=e.points,i=function(e){for(var t=e[0].x<e[1].x?e[0].x:e[1].x,a=e[0].y<e[1].y?e[0].y:e[1].y,i=e[0].x>e[1].x?e[0].x:e[1].x,r=e[0].y>e[1].y?e[0].y:e[1].y,n=0;n<e.length;n++)n<2||(e[n].x>i&&(i=e[n].x),e[n].x<t&&(t=e[n].x),e[n].y>r&&(r=e[n].y),e[n].y<a&&(a=e[n].y));return{minx:t,maxx:i,miny:a,maxy:r}}(a),Cesium.Rectangle.fromDegrees(i.minx,i.miny,i.maxx,i.maxy)),vertexFormat:Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,height:e.height,extrudedHeight:e.extrudedHeight,granularity:Math.PI/5e3}),this._primitive=e.viewer._czdata.viewer.scene.primitives.add(new Cesium.Primitive({geometryInstances:new Cesium.GeometryInstance({geometry:this._geometry}),appearance:this._appearance,show:!0})),function(a){var i=a.getContext("2d"),n=i.getImageData(0,0,a.width,a.height);n.data;const s=new Worker("./zmap3dgl/modules/worker/TerrainCompute.js"),o=e.points;o.forEach((e,t)=>{o[t]={x:e.x,y:e.y,z:e.z}}),s.postMessage({type:"submerged",positions:o,height:e.height,imgData:n,canvasSize:[a.width,a.height]}),s.onmessage=e=>{!function(e){r&&document.body.removeChild(r);e.style.position="absolute",e.style.bottom="0",e.style.left="0",document.body.appendChild(e),r=e}(a),i.putImageData(e.data,0,0);const n=t._material._textures.specularMap;n&&n.copyFrom(a),s.terminate()}}(e.canvas),this.remove=function(){e.viewer._czdata.viewer.scene.primitives.remove(this._primitive),r&&document.body.removeChild(r)}}