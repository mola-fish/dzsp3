const files = require.context('.', false, /\.ts$/);
let configRouters = [];
files.keys().forEach(key => {
    if (key === './index.js')
        return;
    configRouters = configRouters.concat(files(key).default); // 读取文件中的 default 模块
});
export default configRouters; // 抛出一个 Vue-router 期待的结构的数组
