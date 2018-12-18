<template>
  <div >
    <van-nav-bar
      :left-text="backInfo"
      right-text="新建"
      :title="title"
      :left-arrow="leftArrow"
      @click-left="$router.back()"
      @click-right="$router.push({name:'newQuestion'})"
      :fixed="true"
    >
    </van-nav-bar>
    <Scroll  class="main"
             ref="scroll"
             :pullUpLoad="pullUpLoad"
             @LoadMore="LoadMore">
        <div >
          <Loading v-show="showLoading"/>
          <template v-for="item in items">
            <div class="list"  :key="item.id" >
              <div class="left"><div class="icon-question"></div></div>
              <div  class="right van-hairline--bottom">
                <p class="question">{{item.problemDescription}}</p>
                <p class="answer"><span>回复：</span>{{item.problemAnswer | ifNoAnswer}}</p>
                <p class="date">{{item.createDate | FormatDateYMD}}</p>
              </div>
            </div>
          </template>
        </div>
    </Scroll>
  </div>
</template>

<script>
  import {pageMixin} from '_com/js/mixin'
  import weChat from '@/tools/public'
  export default {
    name: "question",
    mixins: [pageMixin],
    filters:{
      ifNoAnswer(val){
        if(!val){
          return '还没回答您的问题，请再等等'
        }else{
          return val
        }
      }
    },
    data() {
      return {
        leftArrow: true,
        isWeChatUS: !!weChat.inWeChat(),
        title: "问题咨询",
        backInfo: "返回",
        pageApi: '/needId/knowledge/getMyProblemList',
        pageSize:10,
        question:''
      }
    },
    computed: {},

    created() {
    },

    mounted() {
      if(this.isWeChatUS){   //微信环境下去掉顶部栏
        this.title = "";
        this.backInfo = "";
        this.leftArrow = false;
      }
    },


    methods: {}
  }
</script>

<style scoped lang="scss">
  .main{
    @include scroll-div(10px);
    top:45px;
    background: $theme-background;
    .list{
      display: flex;
      padding: 17px 15px 0 0;
      letter-spacing: 1px;
      height: 100%;
      .left{
        width: 12%;
        display: flex;
        justify-content: center;
        .icon-question {
          @include bg-image('../../assets/mine/profile_icon_consult');
          background-size: 100% 100%;
          background-repeat: no-repeat;
          width: 25px;
          height: 25px;
        }
      }
      .right{
        width: 88%;
        line-height: 1.5;
        .question{
          font-size: $text-l;

        }
        .answer{
          background: $gray-back;
          font-size: $text-m;
          color: $text-color-g;
          padding: 5px;
          margin-top: 7px;
          span{
            font-size: $text-main;
            color: $text-color-b;
          }
        }
        .date{
          font-size: $text-ss;
          color: $text-color-g;
          text-align: right;
          margin: 10px 0;
        }
      }
    }
  }
</style>
