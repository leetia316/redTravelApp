<template>
  <div class="page-container">
    <van-nav-bar
      v-if="!isWeChatUS"
      left-text="返回"
      title="展台列表"
      left-arrow
      @click-left="$router.back()"
     
    >
    </van-nav-bar>
    <van-popup v-model="showPop" position="right" :overlay="false">
      <guide-inside-map @closePop="showMap" :currentPos="currentPos" :targetPos="targetPos"/>
    </van-popup>
    <div>
      <form action="/">
        <van-search
          v-model="search"
          show-action
          @search="getListItems"
        >
          <div slot="action" @click="getListItems">搜索</div>
        </van-search>
      </form>
    </div>
    <Scroll class="list"
            ref="scroll"
    >
      <ul>
        <Loading v-show="showLoading"/>
        <p class="no-search-result-p" v-show="noResult"><van-icon name="info-o" />没有搜索到结果...</p>
        <template v-for="item in items">
          <li class="van-hairline--bottom container" @click="goToListDetail(item.id)">
            <div class="left">
              <img :src="item.imgUrl" style="width: 100px;height:100px">
            </div>
            <div class="right">
              <p class="title">{{item.name}}</p>
              <div class="title-info">
                <span class="date">{{item.createDate | FormatDateYDM}}</span>
                <span class="mine-icon icon-daohang navi" @click.stop="showMap(item)">路线</span>
              </div>
            </div>
          </li>
        </template>
      </ul>
    </Scroll>

  </div>
</template>

<script>
  import guideInsideMap from '_v/tabGuide/guideInsideMap.vue'
  import weChat from '@/tools/public'
  export default {
    name: "guideBoothList",
    components:{guideInsideMap},
    data() {
      return {
        showPop:false,
        search: "",
        noResult: false,
        items: [],
        showLoading: false,
        pageApi: '/booth/boothList',
        currentPos:{
         /* x: 11879290,
          y: 3071619,*/
          x: 11879272.485, y: 3071616.4349999996,
          groupId:2,
        },
        targetPos:null,
        isWeChatUS: !!weChat.inWeChat()
      }
    },
    computed: {},

    created() {
    },

    mounted() {
      if(this.isWeChatUS){   //微信环境下去掉顶部栏
        this.$refs.scroll.$el.style.top = "36px";
      }
      this.$refs.scroll.refresh();
      this.getListItems();
    },


    methods: {
      showMap(item){
        if(item){
          this.targetPos = {
            x: item.x,
            y: item.y,
            groupId: item.groupId
          };
        }
        this.showPop = ! this.showPop;
      },
      getListItems(){
        this.items = [];
        this.showLoading = true;
        this.$ajaxGet2(this.pageApi, {name: this.search}).then(res => {
          if (res.data.length === 0) {
            this.noResult = true;
            this.$toast('无查询结果！')
          }
          res.data.forEach((v,i) => {
            v.imgUrl = this.HtmlParseSpecialChars(v.content).split("src=\"")[1].split("\"")[0];
          })
          this.items = res.data;
          this.$nextTick(() => {
            this.showLoading = false;
          })
        }).catch(err => {
          this.showLoading = false;
        })
      },
      goToListDetail(id) {
        this.$router.push({
          name: 'guideBoothListDetail',
          params: {
            id
          }
        })
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

  .list{
    @include scroll-div();
    box-sizing: border-box;
    top:90px;
    .container{
      display: flex;
      padding: 17px;
      margin-bottom: 10px;
      background: $theme-background;

      .left{
        width: 25%;
        img{
          width: 100%;
          height: 75px;
          border-radius: 3px;
        }
      }
      .right {
        margin-left: 10%;
        width: 75%;
        position: relative;
        /*display: flex;*/
        /*flex-direction: column;*/
        p{
          word-break: break-all;
        }
        .title{
          line-height: 1.3;
          font-size: $text-xxl;
          letter-spacing: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          position: relative;
          word-wrap: break-word;
          padding-top: 5px;
        }
        .title-info{
          position: absolute;
          bottom:5%;
          width: 100%;
          color: $text-color-g;
          align-self: flex-end;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .navi{
            font-size: $text-xl;
          }
          .date{
            font-size: $text-m;
          }
        }
      }

    }

  }
</style>
