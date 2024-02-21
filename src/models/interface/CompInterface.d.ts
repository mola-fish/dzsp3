import MapLayerMenuEnum from "../enum/MapLayerMenuEnum";
import { CompInterfaceInstance } from "../control3D/MapLayerControls";
interface EventParams {
    e: CZMAP.MapMouseEvent;
    args: [CZMAP.FeatureLayer, CZMAP.VectorLayer, CompInterfaceInstance];
    el?: HTMLElement;
}
declare abstract class CompInterface {
    private collection;
    private _visible;
    protected type: MapLayerMenuEnum;
    protected constructor(type: MapLayerMenuEnum);
    get visible(): boolean;
    set visible(visible: boolean);
    show(): void;
    hide(): void;
    abstract hover({ e, args, el }: EventParams): void;
    abstract click({ e, args, el }: EventParams): void;
}
export default CompInterface;
