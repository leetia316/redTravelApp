<template>
  <div class="page-container">
    <van-nav-bar
      v-if="!isWeChatUS"
      left-text="返回"
      title="绑定卡牌"
      left-arrow
      @click-left="$router.back()"
      @click-right="Scan"
      :fixed="true"
    >
      <i v-if="isWeChatUS" class="mine-icon icon-scan_light" slot="right"></i>
    </van-nav-bar>
    <div class="main" ref="centerDiv">
      <div style="margin-top: 10px">
        <van-cell-group>
          <van-field
            v-model="cardNo"
            type="number"
            placeholder="请输入室内导航卡卡号/或扫一扫自动输入"
            clearable
            required
            icon="mine-icon icon-scan_light"
            @click-icon="Scan"
          >
            <i slot="icon" class="mine-icon icon-scan_light" ></i>
          </van-field>
        </van-cell-group>
      </div>
      <div style="padding: 15px">
        <van-button size="danger" block @click="submitQuestion">提交</van-button>
      </div>
    </div>
  </div>
</template>

<script>
  import store from '../../store'
  import {mapState} from 'vuex';
  import {Toast} from 'vant';
  import weChat from '@/tools/public'
  window.getCardNumber = function (response) {  //注册window方法，Android端调起设置卡号
    let res = JSON.parse(response);
    if (res.success) {
      Toast.success('扫描成功');
      if (res.text) {
        store.commit('setCardNo', res.text);
        localStorage.setItem('cardNo', JSON.stringify(res.text))
      }
    } else {
      Toast.fail('扫一扫出错啦！');
    }
  }
  export default {
    name: "bindCard",
    data() {
      return {
        leftArrow: true,
        backInfo: "返回",
        title: "绑定卡牌",
        isWeChatUS: !!weChat.inWeChat()
        // cardNumber:''
      }
    },
    computed: {
      ...mapState({
        cardNo: state => state.user.cardNo,
      }),
    },

    created() {
    },

    mounted() {
      if(this.isWeChatUS){   //微信环境下去掉顶部栏
        this.$refs.centerDiv.style.top = 0;
      }
    },

    methods: {
      Scan() {
        // 识别筑民生APP内置浏览器内核标识
        let ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/dfhapp/)) {
          cordova.plugins.barcodeScanner.scan((response) => {
            //返回扫描对象
            console.log(result.text);
            let res = JSON.parse(response);
            if (res.success) {
              Toast.success('扫描成功');
              if (res.text) {
                store.commit('setCardNo', res.text);
                localStorage.setItem('cardNo', JSON.stringify(res.text))
              }
            } else {
              Toast.fail('扫一扫出错啦！');
            }
        }, (error) => {
            //扫描失败
            console.log("Scanning failed: " + error);
          });
          return;
        }
        this.$JsToWebview('startRedTripScan').then(res => {

        }).catch(err => {
          alert(err)
        })
      },
      submitQuestion() {
        if (!this.cardNo) {
          this.$toast('卡号不能为空！');
          return
        }
        this.$toast.loading({
          mask: false,
          duration: 0,       // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          loadingType: 'spinner',
          message: '提交中'
        });
        this.$ajaxGet2('/needId/spot/bingCard', {cardNo: this.cardNo}).then(res => {
          this.$toast.clear();
          if (res.success) {
            this.$toast(res.message)
          }
        }).catch(err => {
          this.$toast.clear();
          console.log(err)
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .main {
    @include scroll-div();
    top: 45px;
  }
</style>
