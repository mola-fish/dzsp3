const dev = true;
let websocket, service;
if (dev) { // 开发环境
    websocket = `ws://${location.host}`;
    service = './';
} else { // TODO 实际环境 更新实际环境的地址
    websocket = `ws://${location.host}`;
    service = './';
}

/**
 * @example load=三师生产环境配置.json
 * @example dev=true
 * @example dev=false
 * @return {string|*}
 */
const getConfigFile = () => {
    const loadReg = /load=.+\.jsonc/g;
    const href = location.href;
    if (href.match(loadReg)) {
        return href.match(loadReg)[0].replace('load=', '');
    }
    const index = href.indexOf('dev=true');
    if (index > -1) return './config-dev.jsonc';
    else return './config.jsonc';
};

const getromoConfigFile = () => {
    const loadReg = /load=.+\.jsonc/g;
    const href = location.href;
    if (href.match(loadReg)) {
        return href.match(loadReg)[0].replace('load=', '');
    }
    const index = href.indexOf('dev=true');
    if (index > -1) return './config-dev.jsonc';
    else return './configroma.jsonc';
};

const mq = {
    username: 'admin',
    password: 'admin',
    host: '66.33.75.82',
    port: 10032,
    type: '/topic',
    name: 'topic.bd.location'
};

export default {
    websocket,
    service,
    getConfigFile,
    getromoConfigFile,
    mq
};
