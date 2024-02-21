import Old from '../mapTool/Old';
const { Cesium } = Old;
/**
 * 地图数据相关的调试类
 * @param viewer {Cesium.Viewer}
 */
class MapDataDebug {
    constructor(viewer) {
        this.viewer = viewer;
    }
    // getDebugServer () {
    //     return 'http://127.0.0.1:5500';
    // }
    getDebugServer() {
        return 'http://127.0.0.1/static';
    }
    loadDebugTile() {
        const images = [{
                url: this.getDebugServer() + '/tile/images2/{level}/{x}/{y}.png'
            }];
        images.forEach((img, index) => {
            const pro = new Cesium.UrlTemplateImageryProvider({
                url: img.url,
                tilingScheme: new Cesium.GeographicTilingScheme(),
                customTags: {
                    level: (i, x, y, level) => level + 1
                }
            });
            const layer = new Cesium.ImageryLayer(pro, {});
            const viewer = this.viewer;
            viewer.imageryLayers.add(layer);
        });
    }
    loadDebugData() {
        const viewer = this.viewer;
        viewer.entities.add({
            name: 'test',
            position: Cesium.Cartesian3.fromDegrees(85.685, 48.294, 35),
            show: true,
            label: {
                text: '测试label',
                // font: '15px MicroSoft YaHei',
                // font: '14px 宋体',
                // scale: 0.5,
                font: '30px Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif',
                scale: 0.5,
                pixelOffset: new Cesium.Cartesian2(20, 0), // y大小根据行数和字体大小改变
                fillColor: Cesium.Color.CHOCOLATE,
                outlineWidth: 0,
                outlineColor: Cesium.Color.CHOCOLATE,
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                showBackground: true,
                backgroundColor: Cesium.Color.fromCssColorString('#fff')
            },
            billboard: {
                // image: './img/logo/地图图标_摄像头-n.png',
                // image: './img/logo/摄像头.svg',
                image: './img/20210504/摄像头.svg',
                position: Cesium.Cartesian3.fromDegrees(85.685, 48.294, 35),
                dheight: 1,
                dwidth: 1,
                scale: 0.2,
                showLabel: true,
                heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
            }
        });
    }
}
export default MapDataDebug;
