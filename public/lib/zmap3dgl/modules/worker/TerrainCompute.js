importScripts("../../libs/axios.min.js");const TO_RADIANS=Math.PI/180,TO_DEGREES=180/Math.PI;class Position{constructor(t,e,n){this.x=t,this.y=e,this.z=n}}async function requestFloat64Array(t,e){const n=getUrl(t,e),o=await axios.get(n,{responseType:"arraybuffer"});return new Float64Array(o.data)}const getUrl=function(t,e){return`http://192.168.8.97:9080/zs/data/DEMO/DEM/tile/dem?=&origin=left%7Ctop&id=16%2C20129%2C109019&size=${e[0]}%2C${e[1]}&range=${t.west}%2C${t.south}%2C${t.east}%2C${t.north}`};function dispatchCompute(t){switch(t){case"submerged":return submergedCompute;case"viewCompute":return viewCompute;case"dominantCompute":return dominantCompute;default:return t=>{console.error("未找到指定计算类型方法！")}}}async function dominantCompute(t){const e=t.positions,n=t.interpolationDensity,o=[n,n],s=getRectangle(e),i=await requestFloat64Array(s,o);let r,a=0;for(let t=0;t<i.byteLength;t++){const o=win2pos({left:t%n,top:Math.floor(t/n)},{width:n,height:n},s),h=i[t];o.z=h,h>a&&isInnerPoint(o,e)&&(a=h,r=o)}self.postMessage(r)}async function viewCompute(t){const e=t.positions,n=t.center,o=t.interpolationDensity,s=n.z,i=[o,o],r=getRectangle(e),a=await requestFloat64Array(r,i),h=[];for(let t=0;t<e.length;t++){const i=e[t];for(let t=1;t-1<o;t++){const e=(i.x-n.x)*t/o+n.x,u=(i.y-n.y)*t/o+n.y,c=(i.z-n.z)*t/o+n.z,p=pos2win({x:e,y:u,z:c},{width:o,height:o},r);if(a[p.top*o+p.left]>s){h.push({x:e,y:u,z:c});break}}h.length<t+1&&h.push(i)}self.postMessage(h)}async function submergedCompute(t){const e=t.positions,n=t.height,o=t.canvasSize,s=t.imgData,i=s.data,r=getRectangle(e),a=await requestFloat64Array(r,o),h=o[0],u=o[1];for(let t=0;t<i.length;t+=4){const o=t/4;isInnerPoint(win2pos({left:t/4%h,top:Math.floor(t/h/4)},{width:h,height:u},r),e)&&a[o]<n&&(i[t+3]=255,i[t+2]=255,i[t+1]=255,i[t]=255)}self.postMessage(s)}function pos2win(t,e,n){const o=t.x,s=t.y,i=e.width*(o-n.west)/(n.east-n.west),r=e.height*(n.north-s)/(n.north-n.south);return{left:parseInt(i),top:parseInt(r)}}function win2pos(t,e,n){var o=n.east*t.left/e.width+n.west*(e.width-t.left)/e.width,s=n.north*(e.height-t.top)/e.height+n.south*t.top/e.height;return new Position(o,s,0)}function getRectangle(t){for(var e=t[0].x<t[1].x?t[0].x:t[1].x,n=t[0].y<t[1].y?t[0].y:t[1].y,o=t[0].x>t[1].x?t[0].x:t[1].x,s=t[0].y>t[1].y?t[0].y:t[1].y,i=0;i<t.length;i++)i<2||(t[i].x>o&&(o=t[i].x),t[i].x<e&&(e=t[i].x),t[i].y>s&&(s=t[i].y),t[i].y<n&&(n=t[i].y));return{west:e,south:n,east:o,north:s}}function isInnerPoint(t,e){var n,o,s,i=e,r=t.x,a=t.y,h=0,u=0,c=0,p=0;if(i.length<3)return!1;for(n=0,o=i.length,s=0;s<o;s++){var l=s+1;l>=o&&(l=0),h=i[s].x,c=i[s].y,u=i[l].x,p=i[l].y,(a>=c&&a<p||a>=p&&a<c)&&Math.abs(c-p)>0&&h-(h-u)*(c-a)/(c-p)<r&&n++}return n%2!=0}onmessage=async function(t){const e=t.data,n=e.type;if(!n)throw"未指定计算类型！";const o=dispatchCompute(n);"function"==typeof o&&o(e)};