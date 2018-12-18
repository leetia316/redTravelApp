<template>
  <div>
    <van-nav-bar
      v-if="!isWeChatUS"
      left-text="返回"
      title="关于"
      left-arrow
      @click-left="$router.back()"
      @click-right=""
      :fixed="true"
    >
    </van-nav-bar>
    <div class="main" ref="centerDiv" >
      <van-cell-group>
        <van-cell title="单位"  value="中国贵阳市委党史研究室"/>
        <van-cell title="技术支持"  value="北京中油瑞飞信息技术有限责任公司" />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
  import weChat from '@/tools/public'
  export default {
    name: "about",
    data() {
      return {
        isWeChatUS: !!weChat.inWeChat()
      }
    },
    computed: {},

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
  .main{
    @include scroll-div();
    top:45px;
  }
</style>
