import Control from"./modules/Zmapfly.js";import draw from"./modules/ZmapDrawing.js";import aly from"./modules/ZmapAlysis.js";export default function init(){var e=null;$("#startControl").click(()=>{null==e?e=new Control(map3DView.GetView()):(e.closeFly(),e=null)}),$("#distanceMeasure").click(()=>{var e=map3DView.GetCegore();new aly(e).startMeasureDistance()}),$("#areaMeasure").click(()=>{AddFlashTip("左键点击开始量算，双击结束量算",2e3);var e=map3DView.GetCegore(),a=map3DView.GetView();const t=new draw(e);map3DView.RemoveEntity("measureArea"),t.startMeasureArea({leftDbClick:(e,t)=>{var l=ZMap3DLib.Math.CalcAnyPolyArea(e),r="";r=l>=1e4?"总面积:"+(l/=1e6).toFixed(2)+"平方公里":"总面积:"+l.toFixed(2)+"平方米";let i=0,o=0,n=0;for(let a=0;a<e.length;a++)i+=e[a].x,o+=e[a].y,n+=e[a].z;i/=e.length,o/=e.length,n/=e.length;let s=new GmMap3D.Cartesian3(i,o,n);a.entities.add({position:s,id:"measureArea",label:{fillColor:new GmMap3D.Color(1,25/255,25/255),text:r,font:"1.5vw arial"}})},rightClick:()=>{a.entities.removeById("measureArea")}})})}init();