import ComMap = CZMAP.ComMap;

/**
 * 图层控制工具<br>
 * UI和底层的衔接类
 */
class MapLayerDebuggerControls  {
    private map:ComMap;

    constructor (map: ComMap) {
        this.map = map;
        // this.loadDebug();
    }

    // TODO delete it
    private loadDebug () {
        this.addGridLine({
            id: "165网段",
            name: "165网段",
            url: "./data/wall/165-line.json"
        });
        this.addGridLine({
            id: "168网段",
            name: "168网段",
            url: "./data/wall/168-line.json"
        });
    }

    // TODO delete it
    /** 添加围网线 */
    private addGridLine(opt){
        const height = 200;
        const viewer = this.map.view3d.czviewer;
        const repeatY = 1;

        fetch(opt.url)
            .then(e => e.json())
            .then((opoints) => {
                const offsetX = -5.14;
                const offsetY = -5.24;
                const points = opoints.map(item => ([Number(item.lng) + offsetX, Number(item.lat) + offsetY, height])).flat();
                const c3s = Cesium.Cartesian3.fromDegreesArrayHeights(points);
                const pts2 = [c3s[0]];
                let length = 0;
                for (let i = 1; i < c3s.length; ++i)
                {
                    const p0 = c3s[i-1];
                    const p1 = c3s[i];
                    const d = Cesium.Cartesian3.distance(p0, p1);
                    length += d;
                    const num = Math.round(d / height);
                    for (let i = 1; i < num; ++i)
                    {
                        pts2.push(Cesium.Cartesian3.lerp(p0, p1, i / num, new Cesium.Cartesian3()));
                    }

                    pts2.push(p1);
                }
                const entity = viewer.entities.add({
                    id: opt.id,
                    name: opt.name,
                    wall: {
                        positions: pts2,

                        material: new Cesium.ImageMaterialProperty({
                            image: "./image/debug/gridline2.png",
                            repeat: new Cesium.Cartesian2(length / height * repeatY, repeatY),
                            transparent: true,
                        }),
                        outline: true,
                        outlineColor: Cesium.Color.DARKGREEN,
                        outlineWidth: 2
                    },
                });
                setTimeout(() => {
                    viewer.zoomTo(entity);
                },3000)
            });
    }
}

export default MapLayerDebuggerControls;
