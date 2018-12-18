<template>
  <div class="page-container">
    <van-nav-bar
      :left-text="leftInfo"
      :title="title"
      :left-arrow="leftArrow"
      @click-left="$router.back()"
      @click-right="onClickRight"
    >
      <span slot="right">
        <a @click.stop="pullData">模拟推送</a>
        <!--<i class="mine-icon icon-ditu"  style="margin-right: 3px"></i>-->
        全部展台</span>
    </van-nav-bar>
    <van-popup v-model="showPop" position="right" :overlay="false">
      <guide-inside-map @closePop="showMap" :currentPos="currentPos" :targetPos="targetPos"/>
    </van-popup>
    <Scroll class="list"
            ref="scroll"
    >
      <ul>
        <Loading v-show="showLoading"/>
        <p class="no-search-result-p" v-show="noResult"><van-icon name="info-o" />当前没有任何展台...</p>
        <transition-group appear tag="ul">
        <template v-for="item in items" >
          <li :key="item.id" class="van-hairline--bottom container" @click="goToListDetail(item.id)">
            <div class="left">
              <img :src="item.imgUrl" style="width: 100px;height:100px">
            </div>
            <div class="right">
              <p class="title">{{item.name}}</p>
              <div class="title-info">
                <span class="date">{{item.createDate | FormatDateYDM}}</span>
                <span class="mine-icon icon-daohang navi" @click.stop="showMap(item)"><a>路线</a></span>
              </div>
            </div>
          </li>
        </template>
        </transition-group>
      </ul>
    </Scroll>
  </div>
</template>

<script>
  import guideInsideMap from '_v/tabGuide/guideInsideMap.vue'
  import {getToken} from "../../common/js/common";
  import {Dialog} from 'vant';
  import router from '../../router'
  import {mapState} from 'vuex'
  import Toast from "vant/es/toast/index";
  import weChat from '@/tools/public'
  export default {
    name: "guideInside",
    components:{guideInsideMap},
    data() {
      return {
        showPop:false,
        pageApi: '/booth/boothList',
        items: [],
        showLoading: false,
        currentPos:{
         /* x: 11879290,
          y: 3071619,*/
          x: 11879272.485, y: 3071616.4349999996,
          groupId:2,
        },
        targetPos: null,
        ws: null,
        noResult:true,
        isWeChatUS: !!weChat.inWeChat(),
        leftInfo: "返回",
        title: "附近展台",
        leftArrow: true,
        cardInfo: "DA3F487800000000000000009E5F0001"  /*"274348780000000000000000"*/
      }
    },
    computed: {
      hasSpots(){
        if(this.spots.length){
          return ''
        }else {
          return '无'
        }
      },
      ...mapState({
        cardNo:state =>state.user.cardNo,
        headerImg: state => state.user.headerImg,
        userName: state => state.user.userName,
        provinceCity: state => state.user.provinceCity,
        sex: state => state.user.sex,
      }),
    },
    watch:{
     /* items: {
        handler: function (val, oldVal) {
          this.$nextTick(() => {
            this.$refs.scroll._initScroll();
            this.$refs.scroll.refresh();
          })
        },
        deep:true
      }*/
    },
    created() {
      let that = this;
      //判断用户有无导航卡
      // if(this.hasCard()){
        // ws://11.11.74.38:8777/redtripapi/websocket/
        if ("WebSocket" in window) {
          // 打开一个 web socket
          this.ws = new WebSocket(" ws://11.11.74.38:8777/redtripapi/websocket/" + this.cardInfo);
          let ws = this.ws;

          ws.onopen = function () {
            // Web Socket 已连接上，使用 send() 方法发送数据
            ws.send(JSON.stringify("发送的数据"));
            that.$toast("连接后台中...");
          };

          ws.onmessage = function (evt) {
            let received_msg = evt.data;
            that.$toast("websocket成功接收消息！");
            console.log("-------received_msg--------------");
            // console.log(received_msg);
            received_msg = JSON.parse(received_msg);
            if(Object.prototype.toString.call(received_msg) === '[object Object]'){
              that.noResult = false;
              received_msg.data.forEach((v,i) => {
                v.imgUrl = that.HtmlParseSpecialChars(v.content).split("src=\"")[1].split("\"")[0];
                that.items.unshift(v);
              });
            }
          };
          ws.onclose = function () {
            // 关闭 websocket
            Toast("websocket连接已关闭...");
          };
          ws.onerror = function(){
            that.$toast("通信发生错误...");
          }
        } else {
          that.$toast('不支持webSocket')
        }
      // }

    },
    destroyed(){
      this.ws.onclose();
    },
    mounted() {
      if(this.isWeChatUS){   //微信环境下去掉顶部栏
        this.leftInfo = "";
        this.title = "";
        this.leftArrow = false;
      }
      this.$refs.scroll.refresh();
    },

    methods: {
      pullData(){
        let str = {"success":true,"message":"成功","data":
            [{"boothResEntities":null,"id":1,"name":"英勇的第三军团","devIp":"10.88.148.36","devAnt":2,"sort":1,"status":1,
              "content":"&lt;p&gt;\n\t测速\n&lt;/p&gt;\n&lt;p style=&quot;text-align:center;&quot;&gt;\n\t&lt;img src=&quot;http://11.11.74.38:8090/kindRes/1/1536628760286_ppaC.png&quot; width=&quot;200&quot; height=&quot;200&quot; title=&quot;jpa方法例子&quot; alt=&quot;jpa方法例子&quot; /&gt; \n&lt;/p&gt;\n&lt;p&gt;\n\t&lt;a h&lt;=&quot;&quot; p=&quot;&quot; href=&quot;www.baidu.com&quot; target=&quot;_blank&quot;&gt;打开百度...&lt;/a&gt; \n&lt;/p&gt;\n&lt;p style=&quot;text-align:center;&quot;&gt;\n\t&lt;img src=&quot;http://localhost/booth/1/20180830/1535591403064.imgfile&quot; alt=&quot;&quot; /&gt; \n&lt;/p&gt;\n&lt;p&gt;\n\t顶尽快础苏打\n&lt;/p&gt;",
              "groupId":1,"x":1.2961648E7,"y":4861814.5,"createDate":1533262437000,"updateDate":1533262444000},
              {"boothResEntities":null,"id":10,"name":"测试","devIp":"123","devAnt":4,"sort":2,"status":1,"content":"&lt;p&gt;\n\t阿萨德df\n&lt;/p&gt;\n&lt;p&gt;\n\t&lt;img src=&quot;http://11.11.74.38:8090/booth/1/20180907/1536286289447.imgfile&quot; alt=&quot;&quot; /&gt;\n&lt;/p&gt;\n&lt;p&gt;\n\t用于\n&lt;/p&gt;",
                "groupId":null,"x":null,"y":null,"createDate":null,"updateDate":null}]};
        // this.getListItems();
        this.ws.send(JSON.stringify(str));
      },
      hasCard(){
        let Token = getToken();
        if(Token){
          if(this.cardNo){
            return true
          }else{
            Dialog.confirm({
              title: '提示',
              message: '您未绑定导航卡,是否前往绑定？'
            }).then(() => {
              router.push({name:'bindCard'})
            }).catch(() => {
              // on cancel
            });
            return false
          }
        }else{
          //跳转到微信登录
          Dialog.confirm({
            title: '提示',
            message: '您未登录,是否登录？'
          }).then(() => {
            router.push({name:'login'})
          }).catch(() => {
            // on cancel
          });
          return false
        }
      },
      onClickRight(){
        // this.showPop = ! this.showPop
        this.$router.push({
          name: 'guideBoothList'
        })
      },
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
        this.$ajaxGet2(this.pageApi, {name: ""}).then(res => {
          if (this.search !== ''&& res.data.length === 0) {
            this.noResult = true;
            this.$toast('无搜索结果！')
          }
          res.data.forEach((v,i) => {
            v.imgUrl = this.HtmlParseSpecialChars(v.content).split("src=\"")[1].split("\"")[0];
          });
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
  .v-enter,
  .v-leave-to{
    opacity: 0;
    transform: translateY(80px);
  }
  .v-enter-active,
  .v-leave-active{
    transition: all 1s ease;
  }
  /*添加进场效果*/
  .v-move{
    transition: all 2s ease;
  }
  .v-leave-active{
    position: absolute;
  }

  .list{
    @include scroll-div();
    box-sizing: border-box;
    top: 55px;
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
