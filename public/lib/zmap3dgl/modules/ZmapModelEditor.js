import Calc from"./ZmapCompute.js";export default class{constructor(e,t={}){if(!(e instanceof Cegore.Viewer))throw"必须传入viewer参数！";this.opts=t,this.calc=new Calc(e),this.trackedEntity=null,this.czviewer=e._czdata.viewer,this.selectedModel=null,this.palette=document.getElementById("palette"),this.showPanel=!!t.showPanel}startPickModel(){const{silhouetteColor:e,silhouetteSize:t,isTrack:o}=this.opts,{viewer:l,czviewer:i}=this,s=Cegore.TypeCheck.defaultValue(o,!0);let n=null,r=0;this.listener=this.czviewer.selectedEntityChanged.addEventListener(o=>{o&&o.model&&o.model instanceof Cesium.ModelGraphics?(this.trackeModel&&(this.trackeModel.silhouetteSize=r,this.trackeModel.silhouetteColor=n),this.trackeModel=o.model,n=o.model.silhouetteColor,r=o.model.silhouetteSize,o.model.silhouetteColor=Cegore.TypeCheck.defaultValue(e,Cesium.Color.YELLOW),o.model.silhouetteSize=Cegore.TypeCheck.defaultValue(t,2),s&&(i.trackedEntity=o,this.trackedEntity=o),this.showPanel&&(this.bindModel(o.model),this.palette.style.display="block"),i.scene.screenSpaceCameraController.enableInputs=!1):(i.scene.screenSpaceCameraController.enableInputs=!0,this.trackeModel.silhouetteSize=r,this.trackeModel.silhouetteColor=n,s&&this.trackedEntity===i.trackedEntity&&(i.trackedEntity=null),this.showPanel&&(this.unbindModel([this.colorE,this.alphaE,this.silhouetteColorE,this.silhouetteSizeE,this.silhouetteAlphaE,this.scaleE]),this.palette.style.display="none"))}),this.registerActions()}bindModel(e){function t(t,o,l,i){const s="function"==typeof l?l(e[t]):e[t];s&&(o.value=s),o.onchange=l=>{e[t]="function"==typeof i?i(o.value):o.value}}this.colorE=document.getElementsByName("color")[0],this.alphaE=document.getElementsByName("alpha")[0],this.silhouetteColorE=document.getElementsByName("silhouetteColor")[0],this.silhouetteSizeE=document.getElementsByName("silhouetteSize")[0],this.silhouetteAlphaE=document.getElementsByName("silhouetteAlpha")[0],this.scaleE=document.getElementsByName("scale")[0],t("color",this.colorE,this.colorRGB2Hex,Cesium.Color.fromCssColorString),t("color",this.alphaE,e=>{if(e)return e.getValue().alpha},t=>{if(e.color)return this.getColorByAlpha(e.color,t)}),t("silhouetteColor",this.silhouetteColorE,this.colorRGB2Hex,Cesium.Color.fromCssColorString),t("silhouetteSize",this.silhouetteSizeE),t("silhouetteColor",this.silhouetteAlphaE,e=>{if(e)return e.getValue().alpha},t=>{if(e.silhouetteColor)return this.getColorByAlpha(e.silhouetteColor,t)}),t("scale",this.scaleE,parseFloat,parseFloat)}registerActions(){const{viewer:e,czviewer:t,calc:o}=this,l=this.sceneHandler=new Cesium.ScreenSpaceEventHandler(this.czviewer.canvas);let i=!1;l.setInputAction(e=>{i=!0},Cesium.ScreenSpaceEventType.LEFT_DOWN),l.setInputAction(e=>{if(!i||!t.selectedEntity)return;if(!(t.selectedEntity.model instanceof Cesium.ModelGraphics))return;const l=o.getendpt(e.endPosition,0);l&&(t.selectedEntity.position=l)},Cesium.ScreenSpaceEventType.MOUSE_MOVE),l.setInputAction(e=>{i=!1},Cesium.ScreenSpaceEventType.LEFT_UP)}unbindModel(e){e.forEach(e=>e.onchange=null)}colorRGB2Hex(e){if(!e)return null;if(e instanceof Cesium.ConstantProperty&&(e=e.getValue()),!(e instanceof Cesium.Color))throw"只支持Cesium.Color对象的转换";const t=e.toBytes();return"#"+((1<<24)+(parseInt(t[0])<<16)+(parseInt(t[1])<<8)+parseInt(t[2])).toString(16).slice(1)}getColorByAlpha(e,t){if(!e)return null;if(e instanceof Cesium.ConstantProperty&&(e=e.getValue()),!(e instanceof Cesium.Color))throw"只支持Cesium.Color对象的转换";return Cesium.Color.fromAlpha(e,parseFloat(t))}destroy(){this.czviewer.selectedEntityChanged.removeEventListener(this.listener)}}