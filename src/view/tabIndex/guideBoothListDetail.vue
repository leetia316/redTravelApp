<template>
  <div>
    <van-nav-bar
      v-if="!isWeChatUS"
      left-text="返回"
      title= "展台详情"
      left-arrow
      @click-left="$router.back()"
      :fixed="true"
    >
    </van-nav-bar>
    <Loading v-show="showLoading"/>
    <Scroll class="main" ref="scroll">
      <div class="main-content">

       <!-- <p class="title"><i class="icon-place"></i>附近景点：{{hasSpots}}</p>
        <ul v-for="(item,index) in spots">
          <li :key="item.id" class="title van-hairline&#45;&#45;bottom" style="padding: 10px" @click="switchData(item.id)">{{item.name}}</li>
        </ul>-->
        <p class="title"><i class="icon-spot-detail "></i>展台名称：{{title}}</p>
        <div class="spot-detail-content van-hairline--top-bottom" v-show="this.spots.length">
          <div class="activity-content"
               v-html="HtmlParseSpecialChars(introduction)">
          </div>
          <div class="video" v-show="mp4">
            <video
              id="video"
              :src="mp4"
              controls="true"
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
          <div v-show="mp3">
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
          </div>
          <audio preload="auto" id="audio" :src="mp3">
            <source :src="mp3" type="audio/mpeg">
          </audio>
        </div>
      </div>
    </Scroll>
  </div>
</template>

<script>
  import weChat from '@/tools/public'
  import {websocketUrl} from "../../config";
  export default {
    name: "guideBoothListDetail",
    data() {
      return {
        spots:[],
        title:'展台详情',
        mp4:'',
        mp3:'',
        introduction:'',
        showMp3Control: true,
        currentPos:{
          x: 11879290,
          y: 3071619,
          groupId:0,
        },
        parentId: this.$route.params.id,
        pageApi: "/booth/getBoothInfo",
        showLoading: false,
        isWeChatUS: !!weChat.inWeChat()
      }
    },
    computed: {
      hasSpots(){
        if(this.spots.length){
          return ''
        }else {
          return '无'
        }
      }
    },

    created() {
     this.getListItem();
    },

    mounted() {
      if(this.isWeChatUS){   //微信环境下去掉顶部栏
        this.$refs.scroll.$el.style.top = "5px";
      }
    },

    methods: {
      getListItem(){
        this.showLoading = true;
        this.$ajaxGet2(this.pageApi, {boothId: this.parentId}).then(res => {
          if (!res.data) {
            this.noResult = true;
            return this.$toast('无查询结果！')
          }
          this.spots.push(res.data);
          this.setContent(res.data);
          this.$nextTick(() => {
            this.showLoading = false;
          })
        }).catch(err => {
          this.showLoading = false;
        })
      },
      switchData(id){
        let data = this.spots.find(item=> id === item.id)
        this.setContent(data)
      },
      setContent(data){
        this.title = data.name;
        this.introduction = data.content;
        this.x = data.x;
        this.y = data.y;
        this.groupId = data.groupId;
        if (data.boothResEntities.length > 0) {
          data.boothResEntities.map(item => {
            if (item.resName === '头部背景图') {
              return
            }
            if (item.resName === '音频介绍') {
              this.mp3 = item.accessUrl;
              return
            }
            if (item.resName === "视频介绍") {
              this.mp4 = item.accessUrl;
              return
            }
            if (item.resName === "视频介绍覆盖图") {
              this.posterImg = item.access_url;
              return
            }
          })
        }
        this.$nextTick(()=>{
          this.$refs.scroll.refresh()
        })
      },
      playAudio() {
        this.showMp3Control = !this.showMp3Control;
        document.getElementById('audio').play()
      },
      stopAudio() {
        this.showMp3Control = !this.showMp3Control;
        document.getElementById('audio').pause()
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
  .main {
  @include scroll-div();
    top: 55px;
    background: $theme-background;
    .main-content {
      padding: 0 12px 10px 12px;
      .title{
        font-size: $text-main;
        letter-spacing: 2px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        position: relative;
        word-wrap: break-word;
        padding-top: 2px;
        margin-bottom: 10px;
      }
      .spot-li{

      }
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
    .icon-spot-detail {
      vertical-align: sub;
      display: inline-block;
      @include bg-image('../../assets/tabIndex/detail/icon_management');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      width: 20px;
      height: 20px;
      line-height: 1;
      margin-right: 5px;
    }
  }
</style>
