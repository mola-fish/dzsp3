
/// 公共接口
import MapLayerMenuEnum from "../enum/MapLayerMenuEnum";
import {CompInterfaceInstance} from "../control3D/MapLayerControls";

interface EventParams {
  e: CZMAP.MapMouseEvent;
  args: [CZMAP.FeatureLayer, CZMAP.VectorLayer, CompInterfaceInstance];
  el?: HTMLElement,
}

abstract class CompInterface{
    private collection: Array<Cesium.Entity>;
    private _visible: boolean;
    protected type: MapLayerMenuEnum;

    protected constructor (type: MapLayerMenuEnum) {
        this.type = type;
        this.collection = [];
        this._visible = true;
    }

    get visible () {
        return this._visible;
    }

    set visible (visible) {
        this._visible = visible;
        this.collection.map(entity => {
            entity.show = visible
        });
    }

    show () {
        this.visible = true;
    }

    hide () {
        this.visible = false;
    }

    abstract hover ({e, args, el}: EventParams) : void;

    abstract click ({e, args, el}: EventParams) : void;

    // abstract zoomTo ():  void;

    // abstract lookAt (): void;

    // abstract destroy (): boolean;
}

export default CompInterface;
