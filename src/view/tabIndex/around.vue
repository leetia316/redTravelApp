<template>
  <div class="login">
    <van-nav-bar
      v-if="!isWeChatUS"
      left-text="返回"
      title="周边服务"
      left-arrow
      @click-left="$router.back()"
      @click-right=""
      :fixed="true"
    ></van-nav-bar>
    <div class="main"  ref="centerDiv">
      <iframe src="https://map.baidu.com/mobile/webapp/index/index/foo=bar/tab=place"
              style="width: 100vw;height: 100%"
              frameborder="0"
              scrolling="no"
              id="map"
      ></iframe>
    </div>
  </div>
</template>

<script>
  import weChat from '@/tools/public'
  export default {
    name: "index",
    data() {
      return {
        username: '',
        password:'',
        isWeChatUS: !!weChat.inWeChat()
      }
    },
    methods: {
    },
    mounted(){
      if(this.isWeChatUS){   //微信环境下去掉顶部栏
        this.$refs.centerDiv.style.top = 0;
      }
    }
  }
</script>

<style scoped lang="scss">
  .login {
    height: 100vh;
    /*background-color: aliceblue;*/
    background-color: white;
    .main {
      @include scroll-div();
      top:46px;
      min-height: 93vh;
    }
  }
</style>
