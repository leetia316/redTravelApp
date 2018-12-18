<template>
  <div class="page-container">
    <van-nav-bar
      :left-text="leftInfo"
      :title="title"
      :left-arrow="leftArrow"
      @click-left="$router.back()"
      @click-right="onClickLike"
      :fixed="true"
    >
      <i :class="[isCollectionActive ? 'icon-favor_fill_light' : 'icon-collection']" class="mine-icon" slot="right"
         style="color: black"/>
    </van-nav-bar>
    <Scroll ref="scroll" class="activity-detail">
      <div class="activity-main">
        <div class="activity-header">
          <p v-if="!isWeChatUS" class="title">{{name}}</p>
          <div class="activity-info">
            <span>{{create_date | FormatDate}}</span>
            <span class="article-hasRead">
                <i class="mine-icon icon-iconkanguo"></i>
                {{view_count}}
              </span>
          </div>
        </div>
        <div class="activity-content van-hairline--top-bottom"
             v-html="HtmlParseSpecialChars(content)">
        </div>
      </div>
    </Scroll>
  </div>
</template>

<script>
  import {getToken} from "../../common/js/common";
  import weChat from '@/tools/public'
  export default {
    name: "activityDetail",
    data() {
      return {
        id:'',
        name: '',
        content: '',
        view_count: 0,
        content_img_url: '',
        create_date: '',
        isCollectionActive: false, //是否收藏
        isWeChatUS: !!weChat.inWeChat(),
        leftInfo:"返回",
        leftArrow: true,
        title:"活动详情"
      }
    },
    computed: {},

    created() {
      this.id = this.$route.query.id;
      this.$ajaxGet('/spot/getActivityById', {actId: this.id, userId: getToken()}).then(res => {
        let data = res.data;
        this.name = data.name;
        this.content = data.content;
        this.view_count = data.view_count;
        this.content_img_url = data.content_img_url;
        this.create_date = data.create_date;
        if (data.isCollect == '1') {
          this.isCollectionActive = true;
        }
        if(this.isWeChatUS){   //微信环境下去掉顶部栏
          this.title = data.name;
          this.leftInfo = "";
          this.leftArrow = false;
        }
        this.$refs.scroll._resetScrollImageLoad();
      })
    },

    mounted() {

    },


    methods: {
      onClickLike() {
        if(this.isCollectionActive){
          this.$ajaxGet('/needId/spot/cancel',{refId:this.id,type:'a'}).then(res=>{
            this.isCollectionActive = false;
            this.$toast('已取消收藏')
          }).catch(err=>{
          })
        }else{
          this.$ajaxGet('/needId/spot/collect',{refId:this.id,type:'a'}).then(res=>{
            this.isCollectionActive = true;
            this.$toast('已添加收藏')
          }).catch(err=>{
          })
        }
      },
      HtmlParseSpecialChars(str){
        let s1 = /&amp;/g;
        let s2 = /&lt;/g;
        let s3 = /&gt;/g;
        let s4 = /&quot;/g;
        str = str.replace(s1, "&");
        str = str.replace(s2, "<");
        str = str.replace(s3, ">");
        str = str.replace(s4, "\"");
        return str;
      }
    }
  }
</script>

<style scoped lang="scss">
  .activity-detail {
    @include scroll-div();
    top: 55px;
    background: $theme-background;
    .activity-main {
      padding: 20px 15px;
    }
    .activity-header {
      padding-bottom: 8px;
      .title {
        letter-spacing: 1px;
        font-size: $text-xl;
        line-height: 1.5;
        text-align: center;
        padding-bottom: 10px;
      }
      .activity-info {
        display: flex;
        justify-content: space-between;
        font-size: $text-m;
        line-height: 1.7;
        color: $text-color-gg;
      }
    }

  }
</style>
