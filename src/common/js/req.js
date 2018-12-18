import Vue from 'vue'
import {Toast} from 'vant'
import axios from 'axios'
import {Dialog} from 'vant';
import qs from 'qs'
import {getToken} from "./common";
import router from '../../router'
// let baseURL = 'http://192.168.8.8:8085/redtripapi'
import {baseURL} from "../../config";
import store from '../../store';
import {setToken} from "../../common/js/common";


const instance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  // withCredentials: true,
  headers: {
    //'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Type': 'application/json',
  }
});
const method = (type, api, params, options) => {
  if (type === 'get') {
    Toast.loading({
      mask: false,
      type:'loading',
      duration: 0,       // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      loadingType: 'spinner',
      message: '加载中'
    });
  } else {
    Toast.loading({
      mask: false,
      type:'loading',
      duration: 0,       // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      loadingType: 'spinner',
      message: '提交中'
    });
  }
  return new Promise((resolve, reject) => {
    instance[type](api, params, options).then(data => {
      console.log(`method-api:${api}：response---`);
      if (data.status === 200 && data.data.success) {
        console.log(data.data.data)
        Toast.clear();
        resolve(data.data)
      } else {
        Toast.clear();
        Dialog.alert({
          title: '出错了！',
          message: data.data.message,
        }).then(() => {
        });
        resolve(data.data)
      }
    }).catch((err) => {
      console.log(err);
      Toast.clear();
      reject(err);
      Dialog.alert({
        title: '出错了！',
        message: JSON.stringify(err.response.status+'：'+err.response.statusText),
      }).then(() => {
      });
    })
  })
};
const methodNoLoading = (type, api, params, options) => {
  return new Promise((resolve, reject) => {
    instance[type](api, params, options).then(data => {
      console.log(`methodNoLoading-api:${api}：response---`);
      if (data.status === 200 && data.data.success) {
        console.log(data.data.data)
        resolve(data.data)
      } else {
        Dialog.alert({
          title: '出错了！',
          message:data.data.message,
        }).then(() => {
        });
        resolve(data.data)
      }
    }).catch((err) => {
      Toast.clear();
      console.log(JSON.stringify(err));
      reject(err);
      Dialog.alert({
        title: '出错了！',
        message: JSON.stringify(err.response.status+'：'+err.response.statusText),
      }).then(() => {
      });
    })
  })
};
const isWechat = () => {
  let ua = window.navigator.userAgent.toLowerCase();
  return ua.match(/MicroMessenger/i) == 'micromessenger';
};
const getUrlParam = (name) => {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};
const handleIfLogin = (api,data) =>{
  if (api.includes('needId')) {
    api = api.substring(7);
    let Token = getToken();
    if(Token){
      if (typeof data === 'object' && !data.hasOwnProperty('userId')) {
        data.userId = Token;
      }
      console.log(data)
      return true
    }else{
      if(isWechat()){
        // wechatLogin();
      }else{
        Dialog.confirm({
          title: '提示',
          message: '您未登录,是否登录？'
        }).then(() => {
          router.push({name:'login'})
        }).catch(() => {
          // on cancel
        });
        return false
      }
    }
  }
  return true
}

export const wechatLogin = (menuName,callBack) => {
  //跳转到微信登录授权
  let appId = 'wx12f354f4670e6574';  //'wx390628594388f127'
  let url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appId +
    "&redirect_uri=" + location.href/*.replace("localhost","127.0.0.1") */+
    "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
  let code = getUrlParam("code");
  if (!code) {
    window.location = url;
  } else {
    let state = "";
    switch (menuName){
      case 'tabIndex':
        state = "jdgl";
        break;
      case 'tabActivity':
        state = "jdhd";
        break;
      case 'tabGuide':
        state = "jddh";
        break;
      case 'tabKnowledge':
        state = "zshd";
        break;
      case 'tabMine':
        state = "grzx";
        break;
    }
    $ajaxGet2('/wechat/auth', {url:location.href,code: code,state:state}).then(res => {
      console.log("---授权后返回的信息---");
      console.log(res);
      if (res.success) {
        let data = res.data;
        if(!data){
          Toast.fail('拉取用户信息失败');
          return;
        }
        setToken(data.id);
        store.commit('setheaderImg', data.headimgurl);
        store.commit('setUserName', data.userName);
        if (data.sex === '1') {
          data.NewSex = '男';
          store.commit('setSex', '男')
        } else if (data.sex === '0') {
          data.NewSex = '女';
          store.commit('setSex', '女')
        } else {
          data.NewSex = '未知';
          store.commit('setSex', '未知')
        }
        data.provinceCity = data.province + '-' + data.city;
        store.commit('setProvinceCity', data.province + '-' + data.city);
        Toast.clear();
        localStorage.setItem('userInfo', JSON.stringify(data));
        callBack && callBack();
      } else {
        Toast.fail('拉取用户信息失败')
        Toast.clear();
      }
    }).catch(err => {
      Toast.clear();
      Toast.fail('授权失败，请重试' + err)
    })
  }
}

const ajaxGet = (api, data = null) => {
  if(!handleIfLogin(api,data)){
    return Promise.reject(false)
  }
  if (api.includes('needId')) {
    api = api.substring(7);
  }
  return method('get', api, {params: data});
};

const ajaxPost = (api, data = null) => {
  if(!handleIfLogin(api,data)){
    return Promise.reject(false)
  }
  if (api.includes('needId')) {
    api = api.substring(7);
  }
  return method('post', api, qs.stringify(data));
};
const ajaxGet2 = (api, data = null) => {
  if(!handleIfLogin(api,data)){
    return Promise.reject(false)
  }
  if (api.includes('needId')) {
    api = api.substring(7);
  }
  return methodNoLoading('get', api, {params: data});
};

const ajaxPost2 = (api, data = null) => {
  if(!handleIfLogin(api,data)){
    return Promise.reject(false)
  }
  if (api.includes('needId')) {
    api = api.substring(7);
  }
  return methodNoLoading('post', api, qs.stringify(data));
};

const JsToWebview = (method, message) => {
  if (true) {
    return new Promise((resolve, reject) => {
      try {
        if (message) {
          if(method === 'goToThirdMap'){
            method = 'localOpenMap';
            let  response = window.AndroidWebView[method](message.latitude,message.longitude,message.destinationName);
            resolve(response)
          }else {
            let response = window.AndroidWebView[method](message)
            resolve(response)
          }
        } else {
          resolve(window.AndroidWebView[method]())
        }
      }catch (e) {
        reject(e)
      }
    })
  } else {
    return new Promise((resolve, reject) => {
      try {
        setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler(method , message, function (response) {
            //处理oc过来的回调
            //alert('收到oc过来的回调Data:' + response);
            resolve(response)
          })
        });
      }catch (e) {
        reject(e)
      }
    })

    // <!--处理 js 调用 oc -->
    function setupWebViewJavascriptBridge(callback) {
      if (window.WebViewJavascriptBridge) {
        return callback(WebViewJavascriptBridge);
      }
      if (window.WVJBCallbacks) {
        return window.WVJBCallbacks.push(callback);
      }
      window.WVJBCallbacks = [callback];
      let WVJBIframe = document.createElement('iframe');
      WVJBIframe.style.display = 'none';
      WVJBIframe.src = 'https://__bridge_loaded__';
      document.documentElement.appendChild(WVJBIframe);
      setTimeout(function () {
        document.documentElement.removeChild(WVJBIframe)
      }, 0)
    }
  }
}
export const $ajaxGet2 = ajaxGet2;
export default {
  install: (Vue, options) => {
    Vue.prototype.$ajaxGet = ajaxGet
    Vue.prototype.$ajaxGet2 = ajaxGet2
    Vue.prototype.$ajaxPost = ajaxPost
    Vue.prototype.$ajaxPost2 = ajaxPost2
    Vue.prototype.$JsToWebview = JsToWebview;
  }
}
