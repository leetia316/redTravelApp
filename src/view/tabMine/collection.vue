<template>
  <div>
    <van-nav-bar
      v-if="!isWeChatUS"
      left-text="返回"
      title="我的收藏"
      left-arrow
      @click-left="$router.back()"
      :fixed="true"
    >
    </van-nav-bar>
    <van-tabs ref="centerDiv" v-model="activeTab" sticky :line-width="90" swipeable @change="clickTab">
      <van-tab title="景点">
        <Scroll class="main"
                ref="scroll1"
                :pullUpLoad="pullUpLoad"
                @LoadMore="LoadMore1"
        >
          <div>
            <ul>
              <Loading v-show="showLoading1"/>
              <li class="Spots-Card" v-for="(item,index)  in spots" :key="index" @click="toPlaceDetail(item.id)">
                <img :src="item.access_url">
                <div class="title-bar">
                  <p>{{item.name}}</p>
                  <span>{{item.address}}</span>
                </div>
              </li>
            </ul>
          </div>
        </Scroll>
      </van-tab>
      <van-tab title="活动">

        <Scroll class="main"
                ref="scroll2"
                :pullUpLoad="pullUpLoad"
                @LoadMore="LoadMore2"
        >
          <div class="activity-container">
            <ul>
              <Loading v-show="showLoading2"/>
              <template v-for="item in activitys">
                <li class="van-hairline--bottom Activity-Card" @click="goToActivityDetail(item.id)">
                  <div class="left">
                    <img v-lazy="item.cover_img_url">
                  </div>
                  <div class="right">
                    <p class="title">{{item.name}}</p>
                    <p class="desc van-ellipsis">{{item.desc}}</p>
                    <p class="date">{{item.create_date | FormatDate}}</p>
                  </div>
                </li>
              </template>
            </ul>
          </div>
        </Scroll>
      </van-tab>
    </van-tabs>

  </div>
</template>

<script>
  import weChat from '@/tools/public'
  export default {
    name: "collection",
    data() {
      return {
        activeTab: '',
        spots: [],
        activitys: [],
        total1: 10,
        total2: 10,
        pageNo1: 1,
        pageNo2: 1,
        pageSize: 10,
        pullUpLoad: true,
        showLoading1: true,
        showLoading2: false,
        initTab2: true,
        isWeChatUS: !!weChat.inWeChat()
      }
    },
    computed: {},

    created() {
      this.getItems1()
    },

    mounted() {
      if(this.isWeChatUS){   //微信环境下去掉顶部栏
        this.$refs.centerDiv.$el.style.top = 0;
      }
    },
    methods: {
      clickTab(index, title) {
        if (index === 1 && this.initTab2) {
          this.initTab2 = false;
          this.getItems2();

        }
      },
      goToActivityDetail(id) {
        this.$router.push({
          name: 'activityDetail',
          query: {id}
        })
      },
      toPlaceDetail(id) {
        this.$router.push({
          name: 'placeDetail',
          query: {
            spotId: id
          }
        })
      },
      getItems1() {
        this.showLoading1 = true;
        this.$ajaxGet2('/needId/spot/getCollectList', {
          type: 's',
          pageNo: this.pageNo1,
          pageSize: this.pageSize
        }).then(res => {
          this.total1 = res.data.totalEmelents;
          this.spots = res.data.content;
          this.$nextTick(() => {
            this.$refs.scroll1.refresh();
            this.showLoading1 = false;
          })
        }).catch(err => {
          this.showLoading1 = false;
        });
      },
      getItems2() {
        this.showLoading2 = true;
        this.$ajaxGet2('/needId/spot/getCollectList', {
          type: 'a',
          pageNo: this.pageNo2,
          pageSize: this.pageSize
        }).then(res => {
          this.total2 = res.data.totalEmelents;
          this.activitys = res.data.content;
          this.$nextTick(() => {
            this.$refs.scroll2.refresh();
            this.showLoading2 = false;
          })
        }).catch(err => {
          this.showLoading2 = false;
        })
      },
      LoadMore1() {
        if (this.spots.length == this.total1) {
          this.$refs.scroll1.finishPullUpLoad();
          this.$toast('已无更多景点收藏！')
          return
        }
        this.pageNo1 = this.pageNo1 + 1;
        let startTime = new Date();
        this.$ajaxGet2('/needId/spot/getCollectList', {
          type: 's',
          pageNo: this.pageNo1,
          pageSize: this.pageSize
        }).then(res => {
          let endTime = new Date(); //处理数据更新过快 loading效果加载不出来
          if (endTime - startTime < 1550) {
            setTimeout(() => {
              this.spots.push(...res.data.content);
              this.$refs.scroll1.finishPullUpLoad()
            }, 2500 - (endTime - startTime))
          } else {
            this.spots.push(...res.data.content);
            this.$refs.scroll1.finishPullUpLoad()
          }
        }).catch(err => {
        })
      },
      LoadMore2() {
        if (this.activitys.length == this.total2) {
          this.$refs.scroll2.finishPullUpLoad()
          this.$toast('已无更多活动收藏！')
          return
        }
        this.pageNo2 = this.pageNo2 + 1;
        let startTime = new Date();
        this.$ajaxGet2('/needId/spot/getCollectList', {
          type: 'a',
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }).then(res => {
          let endTime = new Date(); //处理数据更新过快 loading效果加载不出来
          if (endTime - startTime < 1550) {
            setTimeout(() => {
              this.activitys.push(...res.data.content);
              this.$refs.scroll2.finishPullUpLoad()
            }, 2500 - (endTime - startTime))
          } else {
            this.activitys.push(...res.data.content);
            this.$refs.scroll2.finishPullUpLoad()
          }
        }).catch(err => {
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .van-tabs {
    top: 45px;
  }

  .main {
    @include scroll-div(10px);
    top: 90px;
    background: $theme-background;
  }

  .Spots-Card {
    padding: 10px 12px 0 12px;
    position: relative;
    img {
      width: 100%;
      height: 14vh;
      border-radius: 2px;
    }
    .title-bar {
      position: absolute;
      right: 30px;
      top: 50%;
      transform: translateY(-50%);
      /*width: 100%;*/
      text-align: right;
      p {
        font-size: $text-main;
        color: $text-color-w;
        padding-top: 8px;
      }
      span {
        display: block;
        font-size: $text-s;
        padding-top: 8px;
        color: $text-color-wg;
      }
    }
  }
  .activity-container{
    padding: 0 12px 15px 12px;
    box-sizing: border-box;
  }
  .Activity-Card {
    display: flex;
    padding: 12px 0;
    .left {
      width: 30%;
      img {
        width: 100%;
        height: 90px;
        border-radius: 3px;
      }
    }
    .right {
      margin-left: 10px;
      width: 70%;
      position: relative;
      p {
        word-break: break-all;
      }
      .title {
        font-size: $text-l;
        color: $text-color-b;
        font-weight: 500;
        letter-spacing: 1px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        position: relative;
        word-wrap: break-word;
        padding-top: 2px;
      }
      .desc {
        letter-spacing: 1px;
        padding: 8px 0 5px 0;
      }
      .date {
        position: absolute;
        bottom: 3px;
        font-size: $text-s;
        color: $text-color-g;
        align-self: flex-end;
      }
    }

  }
</style>
