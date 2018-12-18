/* eslint-disable */
const ZMS = {
  login: (callback, onFai) => {
    // 跳转登录
    Dcbaseapi.login((accessticket) => {
      // 登录成功后获取票据
      callback(accessticket)
    }, (Fail) => { 
      // 登录失败，无法获取用户票据
      onFai(Fail)
      // 通过调用此方法，Html应用可以返回到进入h5前的原生页面
      Dcbaseapi.popViewController()
    })
  },
  getTicket: (callback, onFai) => {
    // 获得票据
    Dcbaseapi.getAccessTicket(
      (accessticket) => {
        // 获得票据
        callback(accessticket)
      }, (Fail) => {
        // 获取失败(需要登录)
        onFai(Fail)
      }
    )
  }

};
let inWeChat = ()=>{  //全局变量判断是否在微信环境下
  let ua = window.navigator.userAgent.toLowerCase();
  return ua.match(/MicroMessenger/i) == 'micromessenger'
};
export default {
  ZMS,
  inWeChat
}
