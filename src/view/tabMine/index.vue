<template>
  <div class="page-container">
    <van-nav-bar
      v-if="!isWeChatUS"
      title="我的"
      :fixed="true"
    />
    <div ref="centerDiv" class="main">
      <div class="header" @click="$router.push({name:'personInfo'})" v-if="showLogOut">
        <div class="avatar">
          <img :src="headerImg"/>
        </div>
        <div class="info">
          <p class="name van-ellipsis">{{userName}}</p>
          <p class="place">{{provinceCity}}</p>
        </div>
        <div class="right-arrow">
          <van-icon name="arrow"/>
        </div>
      </div>
      <div class="unlogin-header" v-else>
        <div class="title">
          <h1>
            <div class="hi"></div>
            欢迎您的到来
          </h1>
        </div>
        <div style="text-align: center">
          <button class="login-button" @click="toLogin">登陆</button>
        </div>
      </div>
      <div class="operation-list">
        <van-cell-group>
          <!--<van-cell title="登录" :clickable="true" icon="add" to="login" is-link v-show="!showLogOut">-->
          <!--</van-cell>-->
          <van-cell title="注销登录" :clickable="true" @click="logOut" is-link v-show="showLogOut" v-if="showLogOut2">
            <template slot="icon">
              <div class="icon-clean"></div>
            </template>
          </van-cell>
          <van-cell title="绑定室内导航卡"  icon="setting" to="/mine/bindCard" :clickable="true" is-link />

          <van-cell title="我的收藏"  to="/mine/collection" :clickable="true" is-link>
            <template slot="icon">
              <div class="icon-like"></div>
            </template>
          </van-cell>
          <van-cell title="问题咨询" to="/mine/question" :clickable="true" is-link>
            <template slot="icon">
              <div class="icon-question"></div>
            </template>
          </van-cell>
          <van-cell title="关于我们" :clickable="true" to="/mine/about" is-link>
            <template slot="icon">
              <div class="icon-about"></div>
            </template>
          </van-cell>
        </van-cell-group>
      </div>
    </div>
  </div>
</template>

<script>
  import {getToken, setToken} from "../../common/js/common";
  import {wechatLogin} from "../../common/js/req";
  import {mapState} from 'vuex'
  import weChat from '@/tools/public'
  export default {
    name: "index",
    data(){
      return {
        showLogOut:!!getToken(),
        isWeChatUS: !!weChat.inWeChat()
      }
    },
    computed:{
    ...mapState({
      headerImg: state => state.user.headerImg,
      userName: state => state.user.userName,
      provinceCity: state => state.user.provinceCity,
      sex: state => state.user.sex,
      }),
      showLogOut2: function(){
        return this.isWeChatUS ? false : this.showLogOut
      }
    },
    created() {
     /* let Token = getToken();
      if(!Token && weChat.inWeChat()){
        wechatLogin(()=>{
          this.showLogOut = getToken() ? true : false;
        });
      }*/
    },
    mounted(){
      if(this.isWeChatUS){   //微信环境下去掉顶部栏
        this.$refs.centerDiv.style.top = 0;
      }
    },
    activated(){
      this.showLogOut = getToken() ? true : false;
    },
    methods: {
      logOut() {
        setToken('');
        localStorage.clear();
        this.$store.commit('logOut');
        this.showLogOut = false;
        this.$toast.success('注销成功');
      },
      toLogin(){
        this.$router.push({
          name:'login'
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .main {
    @include scroll-div(55px);
    top: 53px;
    .unlogin-header{
      width: 100%;
      height: 150px;
      .title {
        text-align: left;
        box-sizing: border-box;
        color: $text-color;
        margin-left: 10%;
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
      .login-button{
        margin-top: 10px;
        width: 35%;
        background-color: $theme-background;
        font-size: $text-l;
        color: $theme;
        line-height: $text-l;
        padding: 12px;
        border: none;
        letter-spacing: 3px;
        border-radius: 25px;
      }
    }
    .header {
      @include bg-image('../../assets/mine/profile_banner_bg');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      height: 150px;
      color: $text-color-w;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .avatar {
        width: 90px;
        height: 90px;
        border-radius: 45px;
        border: 2px solid white;
        outline: none;
        img {
          width: 100%;
          height: 100%;
          border-radius: 45px;
          outline: none;
        }
      }
      .info {
        margin-left: -30px;
        p {
          line-height: 1.7;
        }
        .name {
          font-size: $text-xl;
          letter-spacing: 1px;
        }
        .place {
          font-size: $text-m;
          color: #e6e5e5;
          letter-spacing: 1px;
        }
      }
      .right-arrow {
        padding: 50px 30px;
        margin-right: -30px;
        margin-left: -30px;
      }
    }

    .operation-list {
      margin-top: 15px;
      background: $theme-background;
      height: 100%;
      .van-cell {
        padding: 13px;
        font-size: $text;
      }
      .icon-like {
        @include bg-image('../../assets/mine/profile_icon_collection');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        width: 23px;
        height: 20px;
        margin-right: 10px;
      }
      .icon-question {
        @include bg-image('../../assets/mine/profile_icon_consult');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        width: 23px;
        height: 23px;
        margin-right: 10px;
      }
      .icon-about {
        @include bg-image('../../assets/mine/profile_icon_about');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        width: 23px;
        height: 23px;
        margin-right: 10px;
      }
      .icon-clean {
        @include bg-image('../../assets/mine/profile_icon_cleaup');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        width: 23px;
        height: 23px;
        margin-right: 10px;
      }
    }
  }
</style>
