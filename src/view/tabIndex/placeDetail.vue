<template>
  <transition name="slide">
    <div class="scroll-container">
      <div class="van-hairline--bottom van-nav-bar van-nav-bar--fixed" ref="header"
           style="z-index: 1;">
        <div class="van-nav-bar__left" v-if="!isWeChatUS">
          <div><i data-v-9bb1f9f2="" class="van-icon van-icon-arrow van-nav-bar__arrow"></i><span
            class="van-nav-bar__text" @click="$router.back()">返回</span></div>
        </div>
        <div class="van-ellipsis van-nav-bar__title">{{headerTitle}}</div>
        <div class="van-nav-bar__right" @click="onClickLike"><i
          :class="[isCollectionActive ? 'icon-favor_fill_light' : 'icon-collection']" class="mine-icon"></i></div>
      </div>
      <Scroll class="detail-container" ref="scroll" @scroll="scroll" :probe-type="3" :listenScroll="true">
        <div>
          <div class="img-bar">
            <img :src="headerImgUrl" ref="headerImg"/>
            <div class="img-bar-dec">
              <van-rate v-model="avgStars" disabled disabled-color="rgb(255, 210, 30)"/>
            </div>
          </div>
          <div class="detail-main-container">
            <div class="part1">
              <p class="title">{{name}}</p>
              <p class="location">地址：{{address}}</p>
              <p class="info-collection">
                <i class="mine-icon icon-my"/>
                {{visitCount}}人游览
                <i class="mine-icon icon-locationfill"/>
                距离{{distance}}km
              </p>
            </div>
            <div class="part2 van-hairline--bottom" style="margin-bottom: 20px">
              <div class="map" id="map">

              </div>
              <div class="map-operation">
                <div @click="goToThirdMap">
                  <i class="mine-icon icon-daohang1"/>
                  一键导航
                </div>
                <div class="van-hairline--right"></div>
                <div @click="$router.push({name:'around'})">
                  <i class="mine-icon icon-zhoubianyou"/>
                  周边服务
                </div>
              </div>
            </div>
            <div class="part3">
              <p class="title"><i class="icon-place"></i>景点介绍</p>
              <div class="spot-content"
                   v-html="HtmlParseSpecialChars(introduction)">
              </div>
              <div class="video">
                <video
                  id="video"
                  :src="mp4.access_url"
                  controls="true"
                  :poster="posterImg"
                  preload="auto"
                  webkit-playsinline="true"
                  playsinline="true"
                  x-webkit-airplay="allow"
                  x5-video-player-type="h5"
                  x5-video-player-fullscreen="true"
                  x5-video-orientation="portraint"
                  style="object-fit:fill">
                </video>
              </div>
              <div class="audio van-hairline--bottom" v-show="showMp3Control">
                <p @click="playAudio"><i class="mine-icon icon-erji"/>音频播放
                  <van-icon name="play"/>
                </p>
              </div>
              <div class="audio van-hairline--bottom" v-show="!showMp3Control">
                <p @click="stopAudio"><i class="mine-icon icon-erji"/>暂停
                  <van-icon name="pause"/>
                </p>
              </div>
              <audio preload="auto" id="audio" :src="mp3.access_url">
                <source :src="mp3.access_url" type="audio/mpeg">
              </audio>
            </div>
          </div>
        </div>
      </Scroll>
      <div class="bottom van-hairline--top">
        <div style="display: flex;align-items: center">
          <span style="padding-left: 25px">服务评价：</span>
          <van-rate v-model="stars" :disabled="isHasRated" disabled-color="rgb(255, 210, 30)"/>
        </div>
        <button @click="onClickRate" :disabled="isHasRated" :style="{backgroundColor:isHasRatedBtnBackColor}">
          {{isHasRated?'已评价':'评价'}}
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
  import {getToken, isRealNum} from "../../common/js/common";
  import weChat from '@/tools/public'
  export default {
    name: "placeDetail",
    data() {
      return {
        scrollY: 0,
        imageHeight: 180,
        spotId: null,
        name: '',
        address: '',
        introduction: '',
        visitCount: 0,
        distance: 0,
        avgStars: 5,
        headerImgUrl: '',
        posterImg: '',
        mp3: {},
        mp4: {},
        headerTitle: '',
        point: '',
        res: '',
        lang: '',
        lat: '',
        showMp3Control: true,
        stars: 0,
        isHasRated: false,
        isCollectionActive: false, //是否收藏
        isWeChatUS: !!weChat.inWeChat()
      }
    },
    created() {
      // this.loadBMapScript();
    },
    computed: {
      isHasRatedBtnBackColor() {
        return this.isHasRated ? '#847f7f' : 'red'
      }
    },
    mounted() {
      this.$toast.loading({
        mask: true,
        message: '加载中...',
        loadingType: 'spinner'
      });
      this.spotId = this.$route.query.spotId;
      this.$ajaxGet2('/spot/getSpotById', {spotId: this.spotId, userId: getToken()}).then(res => {
        let data = res.data;
        // window['bMapInit'] = () => {
        //   this.setMap(data.lang, data.lat);
        // };

        this.name = data.name;
        this.address = data.address;
        this.introduction = data.introduction;
        this.visitCount = data.visitCount;
        this.lang = data.lang;
        this.lat = data.lat;

        this.avgStars = Math.abs(data.avgStars);
        if (isRealNum(data.stars)) {
          this.stars = Math.abs(data.stars);
          this.isHasRated = true;
        } else {
          this.stars = 0;
        }
        if (data.isCollect == '1') {
          this.isCollectionActive = true;
        }
        if (data.fileList.length > 0) {
          data.fileList.map(item => {
            if (item.file_name === '头部背景图') {
              this.headerImgUrl = item.access_url;
              this.$refs.headerImg.src = item.access_url;
              this.$nextTick(()=>{
                this.$refs.headerImg.onload = this.imageOnload
              })
              return
            }
            if (item.file_name === '音频介绍') {
              this.mp3 = item;
              return
            }
            if (item.file_name === "视频介绍") {
              this.mp4 = item;
              return
            }
            if (item.file_name === "视频介绍覆盖图") {
              this.posterImg = item.access_url;
              return
            }
          })
        }
        this.setMap(data.lang, data.lat, data.name);
        this.$toast.clear();
      }).catch(err => {
        this.$toast.clear();
      })
    },
    methods: {
      playAudio() {
        this.showMp3Control = !this.showMp3Control;
        document.getElementById('audio').play()
      },
      stopAudio() {
        this.showMp3Control = !this.showMp3Control;
        document.getElementById('audio').pause()
      },
      imageOnload() {
        this.imageHeight = this.$refs.headerImg.clientHeight;
      },
      onClickLike() {
        if (this.isCollectionActive) {
          this.$ajaxGet('/needId/spot/cancel', {refId: this.spotId, type: 's'}).then(res => {
            this.isCollectionActive = false;
            this.$toast('已取消收藏')
          }).catch(err => {
          })
        } else {
          this.$ajaxGet('/needId/spot/collect', {refId: this.spotId, type: 's'}).then(res => {
            this.isCollectionActive = true;
            this.$toast('已添加收藏')
          }).catch(err => {
          })
        }
      },
      onClickRate() {
        this.$ajaxGet2('/needId/spot/evaluate', {spotId: this.spotId, stars: this.stars}).then(res => {
          this.isHasRated = true;
          this.$toast('谢谢您的评价！')
        }).catch(err => {
          console.log(err)
        })
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      //获取距离

      setMap(x, y, name) {

        //地图初始化
        let map = new BMap.Map("map");
        console.log(BMap)
        map.addControl(new BMap.NavigationControl());
        let point = new BMap.Point(x, y);
        map.centerAndZoom(point, 16);
        map.enableScrollWheelZoom();
        let marker = new BMap.Marker(point);  // 创建标注

        map.addOverlay(marker);
        let label = new BMap.Label(name, {
          offset: new BMap.Size(15, -25)
        });
        label.setStyle({
          width: "120px",
          color: '#fff',
          background: '#ff8355',
          border: '1px solid "#ff8355"',
          borderRadius: "5px",
          textAlign: "center",
          height: "26px",
          lineHeight: "26px",
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
          'white-space': 'nowrap'
        });
        marker.setLabel(label);

        //获取位置
        this.$ajaxGet2('/spot/getDistance',
          {
            lat1: x,
            lng1: y,
            lat2: this.$store.state.user.currentPosition.latitude,
            lng2: this.$store.state.user.currentPosition.longitude
          }).then(res => {
          if (res.data) {
            this.distance = Number.parseFloat(res.data).toFixed(2);
          }
        }).catch(err => {
          console.log(err)
        })

        //百度地图获取当前位置
        // let geolocation = new BMap.Geolocation();
        // geolocation.getCurrentPosition(function(r){
        //   console.log(r)
        //   if(this.getStatus() == 0){
        //
        //     alert('您的位置：'+r.point.lng+','+r.point.lat);
        //   }
        //   else {
        //     alert('获取定位失败：'+this.getStatus());
        //   }
        // },{enableHighAccuracy: true})
        // 关于状态码
        //BMAP_STATUS_SUCCESS	检索成功。对应数值“0”。
        //BMAP_STATUS_CITY_LIST	城市列表。对应数值“1”。
        //BMAP_STATUS_UNKNOWN_LOCATION	位置结果未知。对应数值“2”。
        //BMAP_STATUS_UNKNOWN_ROUTE	导航结果未知。对应数值“3”。
        //BMAP_STATUS_INVALID_KEY	非法密钥。对应数值“4”。
        //BMAP_STATUS_INVALID_REQUEST	非法请求。对应数值“5”。
        //BMAP_STATUS_PERMISSION_DENIED	没有权限。对应数值“6”。(自 1.1 新增)
        //BMAP_STATUS_SERVICE_UNAVAILABLE	服务不可用。对应数值“7”。(自 1.1 新增)
        //BMAP_STATUS_TIMEOUT	超时。对应数值“8”。(自 1.1 新增)
      },
      goToThirdMap() {
        this.$JsToWebview('goToThirdMap', {
          destinationName: this.name,
          longitude: this.lang,
          latitude: this.lat
        }).then(res => {
          // this.name = res;
          // alert(res)
        }).catch(err => {
          // alert(err)
        })
      },
      HtmlParseSpecialChars(str) {
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
    },
    watch: {
      scrollY(newY) {
        const percent = Math.abs(newY / this.imageHeight)
        if (newY < -this.imageHeight) {
          this.headerTitle = this.name;
        } else {
          this.headerTitle = ''
        }
        if (newY < 0) {
          this.$refs.header.style.background = `rgba(212, 68, 57, ${percent})`
        } else {
          this.$refs.header.style.background = `rgba(212, 68, 57, 0)`
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  .icon-favor_fill_light, .icon-collection {
    color: white;
  }

  .slide-enter-active, .slide-leave-active {
    transition: all 0.2s
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(30%, 0, 0);
    opacity: 0;
  }

  .van-nav-bar .van-nav-bar__title, .van-nav-bar .van-icon, .van-nav-bar__text {
    color: $text-color-w !important;
  }

  .van-nav-bar {
    background: rgba(255, 255, 255, 0);
  }

  .van-nav-bar::after {
    border-bottom: none;
  }

  .detail-container {
    @include scroll-div(55px);
    .img-bar {
      position: relative;
      img {
        display: block;
        width: 100%;
        height: 100%;
        min-height: 25vh;
        max-height: 40vh;
      }
      .img-bar-dec {
        width: 100%;
        background-color: #33333347;
        position: absolute;
        bottom: 0;
        right: 0;
        display: flex;
        flex-direction: row-reverse;
        padding: 5px 10px;
      }
    }
  }

  .detail-main-container {
    padding: 15px;
    .part1 {
      .title {
        font-size: $text-xl;
        color: $text-color-b;
        /*font-weight: 500;*/
        margin-bottom: 15px;
        margin-top: 5px;
      }
      .location {
        font-size: $text-s;
        color: $text-color-g;
      }
      .info-collection {
        font-size: $text-m;
        line-height: 1.3;
        margin: 15px 0;
        letter-spacing: 1px;
        display: flex;
        align-items: center;
        i {
          display: inline-block;
          color: #a1a1a2;
          font-size: $text-l;
          line-height: 1.3;
          margin-top: -2px;
          padding-right: 3px;
        }
        .icon-locationfill {
          margin-left: 20px;
        }
      }
    }
    .part2 {
      .map {
        width: 100%;
        height: 25vh;
        border: 1px solid lightblue;
      }
      .map-operation {
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
    }

    .part3 {
      .title {
        font-size: $text-xl;
        color: $text-color-b;
        /*font-weight: 500;*/
        margin-bottom: 15px;
        margin-top: 5px;
        line-height: 1;
      }
      .icon-place {
        vertical-align: sub;
        display: inline-block;
        @include bg-image('../../assets/tabIndex/detail/icon_introduction');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        width: 20px;
        height: 20px;
        line-height: 1;
        margin-right: 5px;

      }
      /*.place-p {*/
      /*letter-spacing: 1px;*/
      /*text-indent: 28px;*/
      /*line-height: 20px;*/
      /*}*/
      .video {
        margin-top: 20px;
        width: 100%;
        video {
          width: 100%;
          height: 170px;
        }
      }
      .audio {
        padding: 10px 20px;
        display: flex;
        justify-content: flex-end;
        p {
          display: flex;
          align-items: center;
        }
        i {
          margin: 0 8px;
        }
      }
    }

  }

  .bottom {
    background: $theme-background;
    z-index: 2;
    box-shadow: 0 -1px 3px #e8e8e8cf;
    height: 50px;
    width: 100%;
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    button {
      height: 100%;
      background-color: red;
      color: white;
      padding: 0 25px;
      border: none;
    }
  }
</style>
