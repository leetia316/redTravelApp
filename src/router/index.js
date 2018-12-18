import Vue from 'vue'
import Router from 'vue-router'
import {routers} from "./routers";
Vue.use(Router);
import {getToken} from "../common/js/common";
import {wechatLogin} from "../common/js/req";
// 路由配置
const RouterConfig = {
  mode: 'history',
  routes: routers,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
};
const router = new Router(RouterConfig);
export default router

router.beforeEach((to,from,next)=>{
  document.title = to.meta.title || '贵州红色旅游';
  router.app.$options.store.commit('changeTabBarName',to.meta.title);
  let Token = getToken();
  let ua = window.navigator.userAgent.toLowerCase();
  if(!Token && ua.match(/MicroMessenger/i) == 'micromessenger'){  //微信环境下的授权登录
    switch (to.name){
      case 'tabIndex':
      case 'tabActivity':
      case 'tabGuide':
      case 'tabKnowledge':
      case 'tabMine':
        wechatLogin(to.name,()=>{
          next();
        });
        break;
    }
  }else{
    switch (to.name){
      case 'tabIndex':
        router.app.$options.store.commit('changeActiveTabBar',0);
        break;
      case 'tabActivity':
        router.app.$options.store.commit('changeActiveTabBar',1);
        break;
      case 'tabGuide':
        router.app.$options.store.commit('changeActiveTabBar',2);
        break;
      case 'tabKnowledge':
        router.app.$options.store.commit('changeActiveTabBar',3);
        break;
      case 'tabMine':
        router.app.$options.store.commit('changeActiveTabBar',4);
        break;
      default:
        router.app.$options.store.commit('changeActiveTabBar',0);
        break;
    }
    next();
  }
});

router.afterEach((to)=>{
  // router.app.$options.store.commit('ChangeIffHasRightArrow',to.meta.ifHasRightArrow);
});

