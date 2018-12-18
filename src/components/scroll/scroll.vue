<template>
  <div ref="wrapper" class="better-scroll-wrapper" id="better-scroll-wrapper">
    <div ref="scrollContainer">
      <Loading text="加载更多中..." v-show="showPullDownLoading"/>
      <slot></slot>
      <Loading text="加载更多中..." v-show="showPullUpLoading"/>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: false
      },
      data: {
        type: Array,
        default: null
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      pullUp: {
        type: Boolean,
        default: false
      },
      refreshDelay: {
        type: Number,
        default: 20
      },
      pullDownRefresh: {
        type: Boolean,
        default: false
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        scrollHeight: 0,
        showPullUpLoading: false,
        showPullDownLoading:false,
      }
    },
    mounted() {
      setTimeout(() => {
        this._initScroll();
      }, 20)
      // this.$nextTick(()=>{
      //   this._initScroll();
      //   console.log(this.scroll)
      // })
    },
    methods: {
      _initScroll() {
        // this.$refs.scrollContainer.style.minHeight = document.documentElement.clientHeight -70 - 50+'px';

        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click,
          pullDownRefresh: {
            threshold: 50, // 下拉距离超过30px触发pullingDown事件
            stop: 0 // 回弹停留在距离顶部20px的位置

          },
          pullUpLoad: {
            threshold: 100
          }
        })

        if (this.listenScroll) {
          let _this = this
          this.scroll.on('scroll', (pos) => {
            _this.$emit('scroll', pos)
          })
        }
        if (this.pullUp) {
          this.scroll.on('scrollEnd', () => {
            if (this.scroll.y <= (this.scroll.maxScrollY + 70)) {
              this.$emit('scrollToEnd')
            }
          })
        }
        if (this.pullDownRefresh) {  //下拉刷新功能
          this.scroll.on('pullingDown', () => {
            this.showPullDownLoading = true;
            this.$nextTick(() => {
              this.refresh()
              this.$emit('RefreshData')
            })
          })
        }
        if (this.pullUpLoad) {  //上拉加载功能
          this.scroll.on('pullingUp', () => {
            this.showPullUpLoading = true;
            this.$nextTick(() => {
              this.refresh()
              this.$emit('LoadMore')
            })
          })
        }
      },
      finishPullUpLoad() {
        this.scroll.finishPullUp();
        this.showPullUpLoading = false;
        this.$nextTick(() => {
          this.refresh();
        })
      },
      finishPullDownRefesh() {
        this.scroll.finishPullDown();
        this.showPullDownLoading = false;
        this.$nextTick(() => {
          this.refresh();
        })
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      },
      //处理有图片的页面 图片加载完成要重新初始化 滚动
      _resetScrollImageLoad() {
        let imageList = document.querySelectorAll('#better-scroll-wrapper img');
        let imgArr = [];
        console.log(imageList)
        let that = this;
        if (imageList.length > 0) {
          for (let i = 0; i < imageList.length; i++) {
            let img = new Image();
            img.src = imageList[i].src;
            imgArr.push(img);
            img.onLoad = () => {
              that.refresh();
            }
            img.onerror = () => {
              console.log('onerror')
              setTimeout(() => {
                that.refresh()
              }, that.refreshDelay)
            }
            img.onabort = () => {
              console.log('onabort')
              setTimeout(() => {
                that.refresh()
              }, that.refreshDelay)
            }
          }
        } else {
          return
        }
      }
    },
    watch: {
      data: {
        handler: function () {
          setTimeout(() => {
            this.refresh()
          }, this.refreshDelay)
        },
        deep: true
      }
    }
  }
</script>

<style>

</style>
