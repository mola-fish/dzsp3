import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import axios from 'axios';
// import ElementUI from 'element-ui';
import ElementPlus from 'element-plus' //全局引入
import 'element-plus/dist/index.css';
import pinia from './store'
import 'animate.css/animate.min.css' //引入

// 全局样式
import './assets/css/common.less';
import './assets/css/theme.less';
import './assets/css/navigationControls.less';
import 'nouislider/dist/nouislider.css';
import './assets/css/Draw.less';
const app = createApp(App)
const getConfigFile =(url:string) => {
    axios.get(url).then((res) => {
        const params = eval('(' + res.data + ')').params;
        Object.keys(params).forEach(item => {
            app.config.globalProperties[item] = params[item]
        })
    }).catch((e) => {
        console.warn(new Error(e));
    })
};
getConfigFile('/config.jsonc')
getConfigFile('/typeConfig.jsonc')
// 全局捕获未被处理的 Promise 错误
window.addEventListener('unhandledrejection', function(event) {
    // console.error('Unhandled Promise Rejection:');
    // console.error(event);
});

app.config.globalProperties.$axios = axios

app.use(router)
app.use(pinia)
app.use(ElementPlus)
app.mount('#app')
