import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import Vant from 'vant'
import 'vant/lib/vant-css/index.css'
import 'vant/lib/vant-css/icon-local.css'
fastclick.attach(document.body)
import 'lib-flexible/flexible'  // 打包时在 build/until.js 中开启px to rem  开启rem 适配时使用
Vue.use(Vant)

import { Lazyload } from 'vant';
// options 为可选参数，无则不传
Vue.use(Lazyload);


import Scroll from '_c/scroll/scroll'
import Loading from '_c/loading/loading'
Vue.component('Scroll',Scroll)
Vue.component('Loading',Loading)

// import {setToken} from "./common/js/common";
// setToken('')
import * as filters from './common/js/filters' // global filters

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
import commonFun from '_com/js/req' // 封装请求方法和vue filter FormatDate及日期格式化
Vue.use(commonFun)
Vue.config.productionTip = false
// 识别筑民生APP内置浏览器内核标识
let ua = window.navigator.userAgent.toLowerCase()
if (ua.match(/dfhapp/)) {
  document.addEventListener('deviceready', function () {
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')

  })
}else{
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')

}
