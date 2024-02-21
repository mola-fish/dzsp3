import axios from 'axios';
import Config from '@/tools/Config';
import qs from 'qs';
import { Loading, Message } from 'element-ui';

/**
 * api请求
 * @class ApiRequest
 */
class ApiRequest {
    constructor () {
        this.axiosConfig = {
            baseURL: Config.service,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        };
    }

    /**
     * 网络请求：GET方法
     * @param {Object} data 传入数据(url, body, header ···)
     * @param {function(Object)} success 请求成功返回方法
     * @param {function(Object)} failure 请求失败返回方法
     */
    get (data, success, failure) {
        const method = 'get';
        this._sendRequest(data, method, success, failure);
    }

    /**
     * 网络请求：POST方法
     * @param {Object} data 传入数据(url, body, header ···)
     * @param {function(Object)} success 请求成功返回方法
     * @param {function(Object)} failure 请求失败返回方法
     */
    post (data, success, failure) {
        const method = 'post';
        this._sendRequest(data, method, success, failure);
    }

    /**
     * 传入请求函数
     * @param {Object} data 传入数据
     * @param {String} method 使用请求方法
     * @param {function(Object)} success 成功返回函数
     * @param {function(Object)} failure 失败返回函数
     */
    _sendRequest (data, method, success, failure) {
        const request = Object.assign({}, this.axiosConfig);
        if (data.loading) {
            this.loading = Loading.service({
                lock: true,
                text: '加载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
        }
        request.method = method;
        request.headers = data.header ? data.header : this.axiosConfig.headers;
        request.url = data.url;
        request.withCredentials = data.withCredentials === undefined ? true : data.withCredentials;

        if (method === 'get') {
            request.params = data.body;
        } else if (request.headers['Content-Type'].indexOf('application/json') !== -1) {
            request.data = JSON.stringify(data.body);
        } else if (request.headers['Content-Type'].indexOf('application/x-www-form-urlencoded') !== -1) {
            request.data = qs.stringify(data.body);
        } else {
            request.data = data.body;
        }

        let msgType = 0;
        let message = '';
        return axios(request).then(res => {
            // 加载状态
            data.loading && this.loading.close();

            // 操作提示
            if (parseInt(res.data.flag) === 1 || parseInt(res.data.code) === 1000) {
                msgType = 1;
                message = data.message && data.message.success ? data.message.success : '';
            } else if (parseInt(res.data.flag) === -1 || parseInt(res.data.code) === 1001) {
                msgType = 2;
                message = data.message && data.message.warning ? data.message.warning : '';
            }
            message && this.showMessage(message, msgType);

            // 操作回调
            if (parseInt(res.data.flag) === 1 || res.data.msg === '成功' || parseInt(res.data.code) === 1000) {
                if (success && typeof success === 'function') {
                    success(res);
                    return;
                }
            } else if (parseInt(res.data.flag) === -1 || parseInt(res.data.code) === 1001) {
                if (failure && typeof failure === 'function') {
                    failure(res);
                    return;
                }
            }

            // 默认提示
            this.showMessage(res.data.msg, msgType);
        }).catch(err => {
            // 加载状态
            data.loading && this.loading.close();

            // 操作提示
            msgType = 3;
            message = data.message && data.message.error ? data.message.error : '';
            message && this.showMessage(message, msgType);

            // 操作回调
            if (failure && typeof failure === 'function') {
                failure(err);
                return;
            }

            // 默认提示
            err && err.data && this.showMessage(err.data.msg, msgType);
        });
    }

    /**
     * 消息提示
     * @param {String} msg 提示文字
     * @param {String} t 提示类型，1：信息, 2：成功, 3：警告, 4：错误
     */
    showMessage (msg, t) {
        const types = ['info', 'success', 'warning', 'error'];
        Message({
            showClose: true,
            message: msg,
            duration: 2500,
            type: types[t]
        });
    }
}

const apiRequest = new ApiRequest();

export default apiRequest;
