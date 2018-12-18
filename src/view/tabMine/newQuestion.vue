<template>
  <div class="page-container">
    <van-nav-bar
      left-text="返回"
      title="问题咨询"
      left-arrow
      @click-left="$router.back()"
      :fixed="true"
    >
    </van-nav-bar>
    <div class="main">
      <div style="margin-top: 10px">
        <van-cell-group>
          <van-field
            v-model="question"
            type="textarea"
            placeholder="请输入您想要咨询的内容，我们将竭诚为你解答！"
            rows="15"
            clearable
            required
          />
          <!--<van-cell title="" value="12" />-->
        </van-cell-group>
      </div>
      <div style="padding: 15px">
        <van-button size="danger" block @click="submitQuestion">提交</van-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "question",
    data() {
      return {
        question:''
      }
    },
    computed: {},

    created() {
    },

    mounted() {

    },

    methods: {
      submitQuestion(){
        this.$toast.loading({
          mask: false,
          duration: 0,       // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          loadingType: 'spinner',
          message: '提交中'
        });
        this.$ajaxGet2('/needId/knowledge/quiz',{problemDescription:this.question}).then(res=>{
          this.$toast.clear()
          if(res.success){
            this.$toast(res.message)
          }
        }).catch(err=>{
          this.$toast.clear()
          console.log(err)
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .main{
    @include scroll-div();
    top:45px;
  }
</style>
