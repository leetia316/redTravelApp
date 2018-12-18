<template>
  <div class="login">
    <div class="back-icon" @click="$router.back()">
      <i class="mine-icon icon-back"></i>
    </div>
    <div class="title">
      <h1>
        <div class="hi"></div>
        欢迎您的到来
      </h1>
    </div>
    <div class="form">
      <!--<form>-->
      <div>
        <input type="text" placeholder="请输入手机号" v-model="username" required/>
        <div class="van-hairline--bottom" style="margin-bottom: 10px"></div>
        <input type="password" placeholder="密码" v-model="password" required/>
        <div class="van-hairline--bottom"></div>
      </div>

      <button @click="onSubmit">登录</button>
      <!--</form>-->
    </div>
    <div class="middle-text-container" style="margin-top: 120px">
      <div class="van-hairline--bottom"></div>
      <span>快速登录</span>
      <div class="van-hairline--bottom"></div>
    </div>
    <div class="vertical-container" style="margin-top: 40px">
      <div class="login-by-weChat" @click="toWeChat"></div>
    </div>
  </div>
</template>

<script>
  import store from '../../store';
  import {setToken} from "../../common/js/common";
  import {$ajaxGet2} from "../../common/js/req";
  import {Toast} from 'vant';

  let globalRouter;
  window.wechatLoginRes = function (code) {  //注册全局方法，Android端微信授权后调起，使用传回的code调起后端请求用户信息，完成登录
    Toast.loading({
      mask: false,
      type: 'loading',
      duration: 0,       // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      loadingType: 'spinner',
      message: '登录中...' + code
    });
    $ajaxGet2('/wechat/getUserInfo', {code: code}).then(res => {
      if (res.success) {
        let data = res.data;

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
        globalRouter.back();
        localStorage.setItem('userInfo', JSON.stringify(data))
      } else {
        Toast.clear();
        Toast.fail('拉取用户信息失败')
      }

    }).catch(err => {
      Toast.clear();
      Toast.fail('登录失败，请重试' + err)
    })
  }
  export default {
    name: "index",
    data() {
      globalRouter = this.$router;
      return {
        username: 'mark',
        password: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
      }
    },
    methods: {
      onSubmit() {
        this.$toast('登录中...')
        this.$ajaxGet2('/spot/userLogin', {userName: this.username, password: this.password}).then(res => {
          this.$toast.clear();
          if (res.success) {
            setToken(res.data.user_id)
            this.$router.back()
          }
        }).catch(err => {

        })
      },
      toWeChat() {
        this.$JsToWebview('wechatLogin').then(res => {

        }).catch(err => {
          this.$toast.fail(err)
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .login {
    height: 100vh;
    padding: 0 25px;
    /*background-color: aliceblue;*/
    background-color: white;
    .back-icon {
      margin-left: -25px;
      padding: 15px 20px 20px 15px;
      position: fixed;
      i {
        font-size: $text-xxl;
      }
    }
    .title {
      text-align: left;
      box-sizing: border-box;
      padding-top: 15vh;
      color: $text-color;
      .hi {
        display: inline-block;
        @include bg-image('../../assets/login/login_img_hi');
        width: 40px;
        height: 40px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        margin-bottom: -10px;
      }
      h1 {
        font-size: 25px;
        line-height: 1;
        margin: 20px 0;
      }
    }
    .form {
      input {
        width: 100%;
        border: none;
        padding: 15px 15px;
        font-size: 16px;
        line-height: 16px;
        box-sizing: border-box;
        &:hover {
          outline: 0;
        }
      }
      button {
        margin-top: 50px;
        width: 100%;
        background-color: $theme;
        font-size: $text-l;
        color: white;
        line-height: $text-l;
        padding: 15px;
        border: none;
        border-radius: 30px;
      }
    }
    .login-by-weChat {
      @include bg-image('../../assets/login/icon_ichat');
      @include extend-click;
      width: 40px;
      height: 30px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
  }
</style>
