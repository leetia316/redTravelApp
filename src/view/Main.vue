<template>
  <div>
    <div class="container" ref="centerDiv">
      <!--<Loading v-show="$store.state.tabBar.showLoading"></Loading>-->
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
    <!--<div class="tabBar-container">-->
    <van-tabbar v-model="activeTabBar" :fixed="true" v-if="notWeChatUS">
      <van-tabbar-item to="/tabIndex"><i class="mine-icon icon-home" slot="icon"></i>首页</van-tabbar-item>
      <van-tabbar-item icon="activity" to="/tabActivity">
        <i class="mine-icon icon-tubiao-" slot="icon"></i>
        活动
      </van-tabbar-item>
      <van-tabbar-item to="/tabGuide">
        <i class="mine-icon icon-ditu" slot="icon"></i>导览
      </van-tabbar-item>
      <van-tabbar-item to="tabKnowledge">
        <i class="mine-icon icon-zhishi" slot="icon"></i>知识
      </van-tabbar-item>
      <van-tabbar-item to="/tabMine">
        <i class="mine-icon icon-my" slot="icon"></i>我的
      </van-tabbar-item>
    </van-tabbar>
    <!--</div>-->
  </div>
</template>

<script>
  export default {
    name: "Main",
    data() {
      return {
        notWeChatUS: true
      }
    },
    mounted() {
      let ua = window.navigator.userAgent.toLowerCase();
      if(ua.match(/MicroMessenger/i) == 'micromessenger'){   //微信环境下去掉顶部栏
        this.$refs.centerDiv.style.bottom = "5px";
      }
    },
    watch: {},
    created(){
      if(this.isWeChatUS()){
        this.notWeChatUS = false;
      }
    },
    computed: {
      msgTotalNum() {
        return this.$store.getters.msgTotalNum
      },
      activeTabBar: {
        get() {
          return this.$store.state.tabBar.activeTabBar;
        },
        set(val) {
          this.$store.commit('changeActiveTabBar', val);
        }
      }
    },
    methods: {
      isWeChatUS(){
        let ua = window.navigator.userAgent.toLowerCase();
        return ua.match(/MicroMessenger/i) == 'micromessenger';
      },
      backRouter() {
        this.$router.back();
      },
      handleRightIcon() {
        // callback();
      },
    },
  }
</script>

<style scoped>
  .container {
    position: fixed;
    width: 100%;
    top: 0;
    bottom: 50px;
    /*z-index: 100;*/
    overflow: hidden;
  }

  /*.tabBar-container{*/
  /*position: fixed;*/
  /*height: 50px;*/
  /*bottom: 0;*/
  /*left: 0;*/
  /*width:100%;*/
  /*}*/
</style>
