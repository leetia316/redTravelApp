<template>
  <div>
    <van-nav-bar
      v-if="!isWeChatUS"
      left-text="返回"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
      @click-right=""
      :fixed="true"
    >
    </van-nav-bar>
    <div class="main" ref="centerDiv">
      <van-cell-group>
        <van-cell title="昵称" :value="userName"/>
        <van-cell title="性别" :value="sex"/>
        <van-cell title="地区" :value="provinceCity"/>
        <van-cell title="室内导航卡卡号" :value="cardNo"/>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import weChat from '@/tools/public'
  export default {
    name: "personInfo",
    data() {
      return {
        isWeChatUS: !!weChat.inWeChat()
      }
    },
    computed: {
      ...mapState({
        cardNo:state =>state.user.cardNo,
        headerImg: state => state.user.headerImg,
        userName: state => state.user.userName,
        provinceCity: state => state.user.provinceCity,
        sex: state => state.user.sex,
      }),
    },

    created() {
    },

    mounted() {
      if(this.isWeChatUS){   //微信环境下去掉顶部栏
        this.$refs.centerDiv.style.top = 0;
      }
    },


    methods: {}
  }
</script>

<style scoped lang="scss">
  .main {
    @include scroll-div();
    top: 45px;
  }
</style>
