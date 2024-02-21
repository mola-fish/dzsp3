import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    vue()
  ],
  server: {
    host: 'localhost',	// 本机的局域网IP
    port: 8087,  // 端口号，一般情况下为8080
    open: true,
    // 开发环境接口地址
    proxy: {
      '/zs': {
        target: 'http://192.168.8.215:19080',
        changeOrigin: true,
        rewrite:path=>path.replace(/^\/zs/,'/zs') // 设置重写的路径
      },
      '/weather': {
        target: 'http://192.168.8.215:19080',
        changeOrigin: true,
        rewrite:path=>path.replace(/^\/weather/,'/weather') // 设置重写的路径
      },
    },
  }

})
