function GifImageProperty(e){var r=this;this._url=null,this._lastFrameTime=null,this._frames=null,this._gifCanvas=document.createElement("canvas"),this._gifCanvas.width=1,this._gifCanvas.height=1,this._gifCtx=null,this._frameIndex=-1,this._lastIndex=-1,this._gif=null,this._src=e.url,this.image=new Image,this.image.src=e.url,this._image=new Image,this._image.src=e.url,this._setInterval=setInterval((function(){r.setSrc()}),20),e.url&&(this.url=e.url)}!function e(r,t,a){function s(n,o){if(!t[n]){if(!r[n]){var l="function"==typeof require&&require;if(!o&&l)return l(n,!0);if(i)return i(n,!0);var p=new Error("Cannot find module '"+n+"'");throw p.code="MODULE_NOT_FOUND",p}var f=t[n]={exports:{}};r[n][0].call(f.exports,(function(e){return s(r[n][1][e]||e)}),f,f.exports,e,r,t,a)}return t[n].exports}for(var i="function"==typeof require&&require,n=0;n<a.length;n++)s(a[n]);return s}({1:[function(e,r,t){function a(e){this.data=e,this.pos=0}a.prototype.readByte=function(){return this.data[this.pos++]},a.prototype.peekByte=function(){return this.data[this.pos]},a.prototype.readBytes=function(e){for(var r=new Array(e),t=0;t<e;t++)r[t]=this.readByte();return r},a.prototype.peekBytes=function(e){for(var r=new Array(e),t=0;t<e;t++)r[t]=this.data[this.pos+t];return r},a.prototype.readString=function(e){for(var r="",t=0;t<e;t++)r+=String.fromCharCode(this.readByte());return r},a.prototype.readBitArray=function(){for(var e=[],r=this.readByte(),t=7;0<=t;t--)e.push(!!(r&1<<t));return e},a.prototype.readUnsigned=function(e){var r=this.readBytes(2);return e?(r[1]<<8)+r[0]:(r[0]<<8)+r[1]},r.exports=a},{}],2:[function(e,r,t){var a=e("./bytestream");function s(e){this.stream=new a(e),this.output={}}s.prototype.parse=function(e){return this.parseParts(this.output,e),this.output},s.prototype.parseParts=function(e,r){for(var t=0;t<r.length;t++){var a=r[t];this.parsePart(e,a)}},s.prototype.parsePart=function(e,r){var t,a=r.label;if(!r.requires||r.requires(this.stream,this.output,e))if(r.loop){for(var s=[];r.loop(this.stream);){var i={};this.parseParts(i,r.parts),s.push(i)}e[a]=s}else r.parts?(t={},this.parseParts(t,r.parts),e[a]=t):r.parser?(t=r.parser(this.stream,this.output,e),r.skip||(e[a]=t)):r.bits&&(e[a]=this.parseBits(r.bits))},s.prototype.parseBits=function(e){var r={},t=this.stream.readBitArray();for(var a in e){var s=e[a];s.length?r[a]=t.slice(s.index,s.index+s.length).reduce((function(e,r){return 2*e+r}),0):r[a]=t[s.index]}return r},r.exports=s},{"./bytestream":1}],3:[function(e,r,t){var a={readByte:function(){return function(e){return e.readByte()}},readBytes:function(e){return function(r){return r.readBytes(e)}},readString:function(e){return function(r){return r.readString(e)}},readUnsigned:function(e){return function(r){return r.readUnsigned(e)}},readArray:function(e,r){return function(t,a,s){for(var i=r(t,a,s),n=new Array(i),o=0;o<i;o++)n[o]=t.readBytes(e);return n}}};r.exports=a},{}],4:[function(e,r,t){var a=e("./gif");"undefined"!=typeof window&&(window.gifuct=a),"undefined"!=typeof define&&define.amd&&define((function(){return a}))},{"./gif":5}],5:[function(e,r,t){var a=e("../bower_components/js-binary-schema-parser/src/dataparser"),s=e("./schema");function i(e){var r=new Uint8Array(e),t=new a(r);this.raw=t.parse(s),this.raw.hasImages=!1;for(var i=0;i<this.raw.frames.length;i++)if(this.raw.frames[i].image){this.raw.hasImages=!0;break}}i.prototype.decompressFrame=function(e,r){if(e>=this.raw.frames.length)return null;var t=this.raw.frames[e];if(t.image){var a=t.image.descriptor.width*t.image.descriptor.height,s=function(e,r,t){var a,s,i,n,o,l,p,f,d,h,u,c,m,g,_,y,v=4096,b=t,x=new Array(t),w=new Array(v),I=new Array(v),B=new Array(4097);for(o=1+(s=1<<(c=e)),a=s+2,p=-1,i=(1<<(n=c+1))-1,d=0;d<s;d++)w[d]=0,I[d]=d;for(u=f=count=m=g=y=_=0,h=0;h<b;){if(0===g){if(f<n){u+=r[_]<<f,f+=8,_++;continue}if(d=u&i,u>>=n,f-=n,a<d||d==o)break;if(d==s){i=(1<<(n=c+1))-1,a=s+2,p=-1;continue}if(-1==p){B[g++]=I[d],m=p=d;continue}for((l=d)==a&&(B[g++]=m,d=p);s<d;)B[g++]=I[d],d=w[d];m=255&I[d],B[g++]=m,a<v&&(w[a]=p,I[a]=m,0==(++a&i)&&a<v&&(n++,i+=a)),p=l}g--,x[y++]=B[g],h++}for(h=y;h<b;h++)x[h]=0;return x}(t.image.data.minCodeSize,t.image.data.blocks,a);t.image.descriptor.lct.interlaced&&(s=function(e,r){for(var t=new Array(e.length),a=e.length/r,s=[0,4,2,1],i=[8,8,4,2],n=0,o=0;o<4;o++)for(var l=s[o];l<a;l+=i[o])p=l,f=n,d=e.slice(f*r,(f+1)*r),t.splice.apply(t,[p*r,r].concat(d)),n++;var p,f,d;return t}(s,t.image.descriptor.width));var i={pixels:s,dims:{top:t.image.descriptor.top,left:t.image.descriptor.left,width:t.image.descriptor.width,height:t.image.descriptor.height}};return t.image.descriptor.lct&&t.image.descriptor.lct.exists?i.colorTable=t.image.lct:i.colorTable=this.raw.gct,t.gce&&(i.delay=10*(t.gce.delay||10),i.disposalType=t.gce.extras.disposal,t.gce.extras.transparentColorGiven&&(i.transparentIndex=t.gce.transparentColorIndex)),r&&(i.patch=function(e){for(var r=e.pixels.length,t=new Uint8ClampedArray(4*r),a=0;a<r;a++){var s=4*a,i=e.pixels[a],n=e.colorTable[i];t[s]=n[0],t[s+1]=n[1],t[s+2]=n[2],t[s+3]=i!==e.transparentIndex?255:0}return t}(i)),i}return null},i.prototype.decompressFrames=function(e){for(var r=[],t=0;t<this.raw.frames.length;t++)this.raw.frames[t].image&&r.push(this.decompressFrame(t,e));return r},r.exports=i},{"../bower_components/js-binary-schema-parser/src/dataparser":2,"./schema":6}],6:[function(e,r,t){var a=e("../bower_components/js-binary-schema-parser/src/parsers"),s={label:"blocks",parser:function(e){for(var r=[],t=e.readByte();0!==t;t=e.readByte())r=r.concat(e.readBytes(t));return r}},i={label:"gce",requires:function(e){var r=e.peekBytes(2);return 33===r[0]&&249===r[1]},parts:[{label:"codes",parser:a.readBytes(2),skip:!0},{label:"byteSize",parser:a.readByte()},{label:"extras",bits:{future:{index:0,length:3},disposal:{index:3,length:3},userInput:{index:6},transparentColorGiven:{index:7}}},{label:"delay",parser:a.readUnsigned(!0)},{label:"transparentColorIndex",parser:a.readByte()},{label:"terminator",parser:a.readByte(),skip:!0}]},n={label:"image",requires:function(e){return 44===e.peekByte()},parts:[{label:"code",parser:a.readByte(),skip:!0},{label:"descriptor",parts:[{label:"left",parser:a.readUnsigned(!0)},{label:"top",parser:a.readUnsigned(!0)},{label:"width",parser:a.readUnsigned(!0)},{label:"height",parser:a.readUnsigned(!0)},{label:"lct",bits:{exists:{index:0},interlaced:{index:1},sort:{index:2},future:{index:3,length:2},size:{index:5,length:3}}}]},{label:"lct",requires:function(e,r,t){return t.descriptor.lct.exists},parser:a.readArray(3,(function(e,r,t){return Math.pow(2,t.descriptor.lct.size+1)}))},{label:"data",parts:[{label:"minCodeSize",parser:a.readByte()},s]}]},o={label:"text",requires:function(e){var r=e.peekBytes(2);return 33===r[0]&&1===r[1]},parts:[{label:"codes",parser:a.readBytes(2),skip:!0},{label:"blockSize",parser:a.readByte()},{label:"preData",parser:function(e,r,t){return e.readBytes(t.text.blockSize)}},s]},l={label:"frames",parts:[i,{label:"application",requires:function(e,r,t){var a=e.peekBytes(2);return 33===a[0]&&255===a[1]},parts:[{label:"codes",parser:a.readBytes(2),skip:!0},{label:"blockSize",parser:a.readByte()},{label:"id",parser:function(e,r,t){return e.readString(t.blockSize)}},s]},{label:"comment",requires:function(e,r,t){var a=e.peekBytes(2);return 33===a[0]&&254===a[1]},parts:[{label:"codes",parser:a.readBytes(2),skip:!0},s]},n,o],loop:function(e){var r=e.peekByte();return 33===r||44===r}},p=[{label:"header",parts:[{label:"signature",parser:a.readString(3)},{label:"version",parser:a.readString(3)}]},{label:"lsd",parts:[{label:"width",parser:a.readUnsigned(!0)},{label:"height",parser:a.readUnsigned(!0)},{label:"gct",bits:{exists:{index:0},resolution:{index:1,length:3},sort:{index:4},size:{index:5,length:3}}},{label:"backgroundColorIndex",parser:a.readByte()},{label:"pixelAspectRatio",parser:a.readByte()}]},{label:"gct",requires:function(e,r){return r.lsd.gct.exists},parser:a.readArray(3,(function(e,r){return Math.pow(2,r.lsd.gct.size+1)}))},l];r.exports=p},{"../bower_components/js-binary-schema-parser/src/parsers":3}]},{},[4]),Object.defineProperties(GifImageProperty.prototype,{url:{get:function(){return this._url},set:function(e){if(this._url=e,this._url){var r=this;Cesium.Resource.fetchArrayBuffer({url:this._url}).then((function(e){r._gif=new gifuct(e),r._frames=r._gif.decompressFrames(!0),r._frameIndex=-1,r._lastFrameTime=null,r._gifCanvas||(r._gifCanvas=document.createElement("canvas")),r._gifCanvas.width=r._frames[0].dims.width,r._gifCanvas.height=r._frames[0].dims.height,r._gifCtx=r._gifCanvas.getContext("2d"),r._gifCtx.clearRect(0,0,r._gifCanvas.width,r._gifCanvas.height);for(var t=0;t<r._frames.length;t++){r._frames[t].data=new Uint8ClampedArray(r._frames[0].patch.length);for(var a=0;a<r._frames[0].patch.length;a++)r._frames[t].data[a]=r._frames[0].patch[a];for(var s=r._frames[t].dims,i=s.top;i<s.height+s.top;i++)for(var n=s.left;n<s.width+s.left;n++){var o=i*r._frames[0].dims.width+n,l=(i-s.top)*s.width+n-s.left;r._frames[t].pixels[l]!==r._frames[t].transparentIndex&&(r._frames[t].data[4*o]=r._frames[t].patch[4*l],r._frames[t].data[4*o+1]=r._frames[t].patch[4*l+1],r._frames[t].data[4*o+2]=r._frames[t].patch[4*l+2],r._frames[t].data[4*o+3]=r._frames[t].patch[4*l+3])}}}))}else this._frames=null,this._gif=null}}}),GifImageProperty.prototype.destroy=function(){this._frames=null,this._gif=null},GifImageProperty.prototype.renderFrame=function(e){var r=this._gifCtx.getImageData(0,0,this._gifCanvas.width,this._gifCanvas.height);r.data.set(e.data),this._gifCtx.putImageData(r,0,0),this._src=this._gifCanvas.toDataURL()},GifImageProperty.prototype.getValue=function(e){return this._image},GifImageProperty.prototype.setSrc=function(){if(this._frames&&this._frames.length){this._currentTime=new Date,this._lastFrameTime||(this._lastFrameTime=new Date);var e=this._currentTime-this._lastFrameTime;0<=this._frameIndex?this._frameIndex<this._frames.length?this._frames[this._frameIndex].delay<=e&&(this.renderFrame(this._frames[this._frameIndex]),this._lastFrameTime=this._currentTime,this._frameIndex++):this._frameIndex=0:(this._lastFrameTime=this._currentTime,this._frameIndex=0),this._gifCanvas}else;this.imageOp=this.imageOp||{},this._lastIndex!=this._frameIndex&&(this.imageOp[this._lastIndex]=this.imageOp[this._lastIndex]||new Image,this.imageOp[this._lastIndex].src=this._src,this._image=this.imageOp[this._lastIndex],this._lastIndex=this._frameIndex)},Cesium.GifImageProperty=GifImageProperty;