
interface MapType {
    [name:string]:any
}
let modeConfig:MapType = {
    // 风廓线
    '风廓线仪': {
        "url": "/data/3dtiles/04/tileset.json",
        pitch: 40,
        distanceScale: 25,
    },
    'S波段天气雷达': {
        "url": "/data/3dtiles/03/tileset.json",
        pitch: 45,
        distanceScale: 320,
    },
    'X波段天气雷达': {
        "url": "/data/3dtiles/15/tileset.json",
        pitch: 52.454433746635914,
        distanceScale: 10,
    },
    '浮标气象站': {
        "url": "/data/3dtiles/06/tileset.json",
        pitch: 60,
        distanceScale: 10,
    },
    '气象观测站': {
        "url": "/data/3dtiles/01/tileset.json",
        pitch: 60,
        distanceScale: 25,
    },
    '微波辐射仪': {
        "url": "/data/3dtiles/09/tileset.json",
        pitch: 60,
        distanceScale: 10,
    },
    '气溶胶激光雷达': {
        "url": "/data/3dtiles/10/tileset.json",
        pitch: 60,
        distanceScale: 10,
    },
    '毫米波测云仪': {
        "url": "/data/3dtiles/11/tileset.json",
        pitch: 60,
        distanceScale: 10,
    },
    '垂直梯度观测站': {
        "url": "/data/3dtiles/12/tileset.json",
        pitch: 70,
        distanceScale: 25,
    },
    '国家气象站': {
        "url": "/data/3dtiles/13/tileset.json",
        pitch: 30,
        distanceScale: 30,
    },
    '测风激光雷达': {
        "url": "/data/3dtiles/14/tileset.json",
        pitch: 60,
        distanceScale: 5,
    },
    '旧S波段雷达': {
        "url": "/data/3dtiles/16/tileset.json",
        pitch: 90,
        distanceScale: 5,
    },
    'temp': {
        "url": "/data/3dtiles/temp/tileset.json",
        pitch: 50,
        distanceScale: 20,
    },
    '卫星': {
        "url":"/data/3dtiles/17/tileset.json",
        pitch: 50,
        distanceScale: 20,
    },
    '国家农业实验气象站': {
        "url": "/data/3dtiles/18/tileset.json",
        pitch: 50,
        distanceScale: 20,
    },
    '智能感知设备': {
        "url":"/data/3dtiles/19/tileset.json",
        pitch: 50,
        distanceScale: 20,
    },
}

export { modeConfig }