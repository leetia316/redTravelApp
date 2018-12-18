<template>
  <Scroll class="main-content"
          ref="scroll"
  >
    <div>
      <div class="slider-wrapper">
        <BannerWeather/>
        <van-swipe :autoplay="5000">
          <van-swipe-item v-for="(item, index) in banner" :key="item.id">
            <img :src="item.picUrl"/>
          </van-swipe-item>
        </van-swipe>

      </div>
      <div class="index-operation">
        <div @click="$router.push({name:'guideInside'})">
          <i class="mine-icon icon-dibiao"/>
          室内导航
        </div>
        <div class="van-hairline--right"></div>
        <div @click="filterAroundSpot">
          <i class="mine-icon icon-zhoubianyou"/>
          附近景点
        </div>

      </div>
      <div class="bottom-style"></div>
      <transition name="slide-fade">
        <Loading v-show="showLoading"/>
      </transition>

      <p class="no-search-result-p" v-show="showNoAroundSpot">
        <van-icon name="info-o"/>
        附近都没有景点哦...
        <a  @click='showAllSpots' style="display: block;margin-top: 20px;font-size: 12px;text-decoration: underline;text-underline-position: under;text-decoration-color: #ff6c6c"> 显示所有景点列表</a>
      </p>
      <div class="album-content" v-show="hideList">
        <ul class="album-list">
          <li v-for="(item,index)  in items" :key="index" @click="toPlaceDetail(item.id)">
            <img :src="item.access_url">
            <div class="title-bar">
              <p>{{item.name}}</p>
              <span>{{item.address}}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </Scroll>
</template>

<script>
  import BannerWeather from '_c/weather/BannerWeather'
  import {pageMixin} from '_com/js/mixin'
  import {getToken,getLocation} from "../../common/js/common";
  import Tool from '@/tools/public'
  export default {
    name: "index",
    components: {BannerWeather},
    mixins: [pageMixin],
    data() {
      return {
        hideList:true,
        showNoAroundSpot: false,
        pageApi: '/spot/getSpotList',
        pageSize: 12,
        banner: [{picUrl: require('../../assets/tabIndex/1.jpg'), id: '11'},
          {picUrl: require('../../assets/tabIndex/2.jpg'), id: '22'},
          {picUrl: require('../../assets/tabIndex/3.jpg'), id: '33'}],
        currentPos:{
          latitude:1,
          longitude:1
        }
      }
    },
    created() {
      let Token = getToken();
      let ua = window.navigator.userAgent.toLowerCase();
      if(!Token){
        if (ua.match(/dfhapp/)) {  // 识别筑民生APP内置浏览器内核标识
          Tool.ZMS.login(
            accessticket => {
              alert("登录返回的票据：" +accessticket);
              // this.accessticket = accessticket
            },
            onFai => {
              alert('登录失败：' + onFai)
            });
          Tool.ZMS.getTicket(
            accessticket => {
              this.accessticket = accessticket
            },
            onFai => {
              alert('自动票据获取失败：' + onFai)
            }
          )
        }
      }

    },
    mounted() {
      //异步加载百度地图和微信JSSDK
      setTimeout(() => {
        this.loadBMapScript();
        /*if(!!Tool.inWeChat()){
          let openId = "",userInfo = localStorage.getItem("userInfo");
          if(!userInfo){
            alert("微信接口调用失败");
            return;
          }
          openId = JSON.parse(userInfo).openid;
          console.log("openId---" + openId);
          console.log(location.href);
          //获取微信签名
          this.$ajaxGet('/wechat/getJsapiTicket', {
            url: location.href,
            openId:openId
          }).then(res => {
            let data = res.data;
            console.log("签名数据");console.log(res);
            wx.config({
              debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: 'wx12f354f4670e6574', // 必填，公众号的唯一标识
              timestamp: '', // 必填，生成签名的时间戳
              nonceStr: '', // 必填，生成签名的随机串
              signature: '',// 必填，签名
              jsApiList: ['scanQRCode','getLocation'] // 必填，需要使用的JS接口列表
            });
            wx.ready(function () {
              wx.checkJsApi({
                jsApiList: ['scanQRCode','getLocation'],
                success: function (res) {
                  alert("check后" + JSON.stringify(res));
                },
                fail: function(){
                  alert("当前客户端版本过低，请升级");
                }
              });
            });
            wx.error(function(res){
              alert("微信接口调用失败");
            });
            //获取地理位置
            wx.getLocation({
              type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
              success: function (res) {
                alert(JSON.stringify(res));
                var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                var speed = res.speed; // 速度，以米/每秒计
                var accuracy = res.accuracy; // 位置精度
              },
              cancel: function (res) {
                alert('用户拒绝授权获取地理位置');
              }
            });
          }).catch(err => {

          });
          //扫一扫
         /!* wx.scanQRCode({
            needResult: 1,
            desc: 'scanQRCode desc',
            success: function (res) {
              alert(JSON.stringify(res));
            }
          });*!/
        }*/
      }, 200);
      this.$nextTick(()=>{
        this.$refs.scroll.refresh(); //保证页面scroll可滚动
      });
      // h5 获取当前位置
      let locationError = function(error){
        switch(error.code) {
          case error.TIMEOUT:
            alert('A timeout occured! Please try again!');
            break;
          case error.POSITION_UNAVAILABLE:
            alert('We can\'t detect your location. Sorry!');
            break;
          case error.PERMISSION_DENIED:
            alert('Please allow geolocation access for this to work.');
            break;
          case error.UNKNOWN_ERROR:
            alert('An unknown error occured!');
            break;
        }
      };
      this.$store.commit('setCurrentPos',this.currentPos)
      let handlePosition = (pos)=>{
        console.log('维度：'+ pos.coords.latitude+',经度：'+ pos.coords.longitude);
        this.currentPos.latitude = pos.coords.latitude;
        this.currentPos.longitude = pos.coords.longitude;
      };
      if (navigator.geolocation){
        // navigator.geolocation.getCurrentPosition(handlePosition, locationError);
      } else {
        alert('不支持地理定位。');
      }
    },
    methods: {
      loadBMapScript() {
        if(window.BMap) return
        let script = document.createElement('script');
        script.src = 'http://api.map.baidu.com/api?v=3.0&ak=uKgsNLa0CicOFy7ezOrE84WMxCasBFW9&callback=bMapInit';
        script.type = 'text/javascript';
        script.defer = true;
        document.body.appendChild(script);
      },
      toPlaceDetail(id) {
        this.$router.push({
          name: 'placeDetail',
          query: {
            spotId: id
          }
        })
      },
      showAllSpots(){
        this.hideList = !this.hideList;
        this.showNoAroundSpot = false;
      },
      filterAroundSpot() {
        this.$ajaxGet('/spot/getNearbySpot', {
          userId: getToken(),
          lat: this.currentPos.latitude,
          lng: this.currentPos.longitude,
        }).then(res => {
          let data = res.data;
          if (Array.isArray(data) && data.length > 0) {
            let ids = data.map(item => (item.id))
            this.items = this.items.filter(item => {
              return ids.includes(item.id)
            })
          }else {
            this.showNoAroundSpot = true;
            this.hideList = false
          }
        }).catch(err => {

        })
      }
    },
  }
</script>

<style scoped lang="scss">
  .main-content {
    @include scroll-container;
    .slider-wrapper {
      width: 100%;
      overflow: hidden;
      img {
        display: block;
        width: 100%;
        height: 31vh;
      }
    }
    .index-operation {
      margin-top: 10px;
      padding-bottom: 5px;
      display: flex;
      justify-content: space-around;
      //color: $text-color-g;
      div {
        padding: 6px;
      }
      i {
        padding-right: 3px;
      }

    }
    .bottom-style {
      width: 100%;
    }
    .bottom-style::after {
      content: '';
      display: block;
      height: 2px;
      background: -webkit-repeating-linear-gradient(135deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #3283fa 0, #3283fa 45%, transparent 0, transparent 50%);
      background: repeating-linear-gradient(-45deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #3283fa 0, #3283fa 45%, transparent 0, transparent 50%);
      background-size: 80px;
    }
    .search-aroundSpot {
      /*margin-top: 7px;*/
      display: flex;
      > div:nth-child(1) {
        width: 20%;
        .aroundSpot {
          font-size: $text-s;
          width: 100%;
          height: 44px;
          box-sizing: border-box;
          border: none;
          background: rgb(242, 242, 242);
        }
      }
      > div:nth-child(2) {
        width: 80%;

      }
    }
    .album-content {
      position: relative;
      box-sizing: border-box;
      width: 100%;
      .album-list {
        li {
          padding: 10px 12px 0 12px;
          position: relative;
        }
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
            width: 90vw;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            display: block;
            font-size: $text-s;
            padding-top: 8px;
            color: $text-color-wg;
          }
        }
      }
    }
  }
</style>
