

// 图码联侦
const tmlzServer = 'http://192.170.11.244';
const tmlzProxy = tmlzServer + '/tmlz';

var graphicService = {
    statisticsULR: tmlzProxy + '/graphCode/v1/pictureCode/homePage/statistics',
    peopleListURL: tmlzProxy + '/graphCode/v1/pictureCode/homePage/findPersonRecordList',
    equipmentsURL: tmlzProxy + '/policeWeb/v1/graphCode/homepage/showEquipments',
    cameraInfoURL: tmlzProxy + '/policeWeb/v1/detection/camera/page',
    detectionURL: tmlzProxy + '/policeWeb/v1/detection/control/identity/pageTask',

    ///
    imageBaseURL: tmlzServer,
    personInfoULR: tmlzServer + '/#/imageCodeJointInvestigation/personalInfo?pid=',

    loginFunction: async function () {
        const url = tmlzProxy + '/policeWeb/v1/sys/login';
        const body = {
            username: 'admin',
            password: 'NKeRjmIbFcDyZfI+iLSAfpkcUzHyW3k/jH48RIC8Rkd44G/cDCB+kLlGRYjIqPrJzwQAAlRjHTbtk1mlChbGGkSo21SdGlldRqyPUAUjZtIAuKpU7aUoyxfbEvON9SLkSxngODYTqMJWAqWPd5zeRBdR+EZuY950+e1Zix+aXoE=',
            tryCode:'123'    
        };

        ///
        return await ajax.postJSON(url, body);
    },

    loginURL: tmlzServer + '/#/login?username=police&password=NfO7BTXC7pGK3cNniDMw3Z3jIxZjtMQ2M5/WsvFoTyoSnXDMJPfPdQytboZTy1/Iqmgh1RwfTYbo2BhNy/pSIJPeJo3fhEGgqch8ID7ApZfyzHNUduJ8Z5OrKbJ0NpgqtDgxCKjjgHjEZt8WCRHuyWHfzlu62jGz01SF9HHFv1Y=',

    updateInterval: 5000,//5000
    timeUpdateInterval: 1000,//1000
};

var keti2Service = {
    PersonCheck: '192.170.11.243:8887',
    TextCheck: '192.170.11.239:8081',
    PersonCount: '192.170.11.239:8769'
};

if (location.search.indexOf('dev=true') != -1) {
    graphicService = {
        statisticsULR: 'cfg/graphic/statistics.json',
        peopleListURL: 'cfg/graphic/personlist.json',
        equipmentsURL: 'cfg/graphic/equipments.json',
        cameraInfoURL: 'cfg/graphic/cameras.json',
        detectionURL: 'cfg/graphic/detection.json',
        imageBaseURL: '',
        personInfoULR: '',
        loginFunction: undefined,
        loginURL: 'www.baidu.com',
        updateInterval: 5000,
        timeUpdateInterval: 1000,
    };
}

/**
 * 应用配置
 */
var AppConfig = {

    openMap: true,
    logLevel: 1,
    singleServer: 'ws://localhost:81/',
    /*
     * 主场景设置
     */
    MainScene: {
        bgColor: '#206DEF',
        /**
         * 主场景模型
         */
        model: {
            type: '3dtiles',
            uri: `http://${location.host}/jinshan/tileset.json`,
            uri: '',
            position: [121.29479, 30.701498, 35],
            pose: [170, 0, 0],
            scale: [1, 1, 1]
        },

        tops: [],

        ///
        charts: [],
        /**
         * 提示框
         */
        tips: [],

        devices: []
    },

    Buildings: [
        {
            bgColor: '#206DEF',
            /// 模型的外包范围
            // range: [
            //     [120.000234, 20.000432, 2037.772095],
            //     [120.000737, 20.000762, 2038.103430],
            //     [120.001215, 20.000066, 2036.883370],
            //     [120.000750, 19.999774, 2036.050805],
            //     [120.000234, 20.000432, 2037.772095]
            // ],

            model: {
                type: '3dtiles',
                // uri: `http://${location.host}/cf/tileset.json`,
                uri: '',
                // wrappeds: ['/外壳/1F/航站楼 1F  结构.ifc', '/外壳/2F/航站楼 2F 结构.ifc', '/外壳/顶/屋顶.ifc'],
                position: [121.29067, 30.731233, 0],
                pose: [0, 0, 0],
                scale: [20, 20, 20]
            },

            tops: [],

            tips: [],

            charts: [],

            devices: [],//cameraPoints.concat()

            fires: [
                //[120.000098,19.999634,8.498304]
            ]
        }
    ]

};
