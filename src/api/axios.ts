import axios from "axios";
// import { showMessage } from "./status";   // 引入状态码文件
import { ElMessage } from "element-plus"; // 引入el 提示框，这个项目里用什么组件库这里引什么

function getInstance() {
  let instance = axios.create({
    timeout: 1200000,
    // 默认url
    baseURL: "/",
    // 允许请求中携带cookie
    withCredentials: true,
    // 请求头
    headers: {
      "Content-Type": "application/json",
    },
  });
  // 请求拦截
  instance.interceptors.request.use((request) => {
    return request;
  });
  // 响应拦截
  instance.interceptors.response.use(
    (response) => {
      if (response.status === 200) {
        return Promise.resolve(response);
      } else {
        return Promise.resolve(response);
      }
    },
    (error) => {
      if (error && error.response) {
        return Promise.resolve(error);
      }
    }
  );

  return instance;
}


// 站点相关
export const SiteRequest = {
  /** 获取站点列表 */
  getListData(params:any) {
      return getInstance().get('/weather/SQLServlet/wuhan_weather_net_station/query/station/all?',{params})
  },

  /** 获取站点类型总数 */
  getTotal() {
    return getInstance().get('/weather/SQLServlet/wuhan_weather_net_station/query/station/statistics')
  }
};
