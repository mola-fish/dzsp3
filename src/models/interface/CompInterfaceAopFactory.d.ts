import MapLayerMenuEnum from "../enum/MapLayerMenuEnum";
import CompInterface from "./CompInterface";
type CompInterfaceAop = {
    key: MapLayerMenuEnum;
    fun: {
        new (type: MapLayerMenuEnum): CompInterface;
    };
};
declare class CompInterfaceAopFactory {
    static members: Array<CompInterfaceAop>;
    static register(key: MapLayerMenuEnum, value: {
        new (type: MapLayerMenuEnum): CompInterface;
    }): void;
    static find(key: MapLayerMenuEnum): new (type: MapLayerMenuEnum) => CompInterface;
}
export default CompInterfaceAopFactory;
