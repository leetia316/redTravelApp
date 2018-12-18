<template>
  <div class="page-container">
    <van-nav-bar
      left-text="返回"
      title="知识详情"
      left-arrow
      @click-left="$router.back()"
      @click-right=""
      :fixed="true"
    >
      <i  class="mine-icon icon-collection" slot="right"/>
    </van-nav-bar>
    <Scroll class="activity-detail">
        <div >
          <div class="activity-header">
            <p class="title">这是一个很长带你飞卡死你的饭卡开始的离开</p>
            <div class="activity-info">
              <span>2018-12-01&nbsp;6:00</span>
              <span class="article-hasRead">
                <i class="mine-icon icon-iconkanguo" ></i>
                200
              </span>
            </div>
          </div>
          <div class="activity-content van-hairline--top-bottom ">
            <p >
              水电费卡洛斯的父母克拉美丽是开放的美丽；马上贷；浪费了；米拉多少麻烦了；阿所面临的；免费拉什么福利妈妈是打发马上离开父母离开吗
            </p>
            <img src="../../assets/4.jpg"/>
            <p>爱上对方就拉上开放啦；开始；付了款；拉斯大佛扣发收款方面来看麦科勒姆凯莉米洛开发商没地方看了疯狂拉升美女反馈拉什么返款了吗莱克斯诺付款啦的看法是没法来看</p>
            <p>爱上对方就拉上开放啦；开始；付了款；拉斯大佛扣发收款方面来看麦科勒姆凯莉米洛开发商没地方看了疯狂拉升美女反馈拉什么返款了吗莱克斯诺付款啦的看法是没法来看</p>
            <p>爱上对方就拉上开放啦；开始；付了款；拉斯大佛扣发收款方面来看麦科勒姆凯莉米洛开发商没地方看了疯狂拉升美女反馈拉什么返款了吗莱克斯诺付款啦的看法是没法来看</p>
          </div>
        </div>
    </Scroll>
  </div>
</template>

<script>
    export default {
        name: "activityDetail",
        data() {
            return {}
        },
        computed: {},

        created() {
        },

        mounted() {
        },


        methods: {}
    }
</script>

<style scoped lang="scss">
  .activity-detail{
    @include scroll-div();
    top:55px;
    background: $theme-background;
    >div{
      padding: 20px 15px;
    }
    .activity-header{
      padding-bottom: 8px;
      .title{
        letter-spacing: 1px;
        font-size: $text-xl;
        line-height: 1.5;
      }
      .activity-info{
        display: flex;
        justify-content: space-between;
        font-size: $text-m;
        line-height: 1.7;
        color:$text-color-gg;
      }
    }
    .activity-content{
      padding: 12px 0;
      p{
        letter-spacing: 1px;
        text-indent: 28px;
        line-height: 1.4;
      }
      img{
        width: 100%;
        height: auto;
        margin: 15px 0;
        border-radius: 5px;
      }
    }

  }
</style>
