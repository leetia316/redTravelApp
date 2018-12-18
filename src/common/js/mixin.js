export const routerLink = {
  props: {
    url: String,
    replace: Boolean,
    to: [String, Object]
  },

  methods: {
    routerLink: function routerLink() {
      let to = this.to,
        url = this.url,
        $router = this.$router,
        replace = this.replace;

      if (to && $router) {
        $router[replace ? 'replace' : 'push'](to);
      } else if (url) {
        replace ? location.replace(url) : location.href = url;
      }
    }
  }
};
export const pageMixin = {
  data() {
    return {
      search: '',
      pageNo: 1,
      pageSize: 10,
      total: 12,
      items: [],
      pullUpLoad: false,
      showLoading: true,
      noResult: false,
    }
  },
  activated() {
    this.getItems()   //修改成这样可以保证缓存的 Main 页面不重复请求的bugs 原因不知道
  },
  methods: {
    getItems() {
      if(this.items.length>0) return // 激活时不重复请求
      this.noResult = false;
      this.showLoading = true;
      this.$ajaxGet2(this.pageApi, {search: this.search, pageNo: this.pageNo, pageSize: this.pageSize}).then(res => {
        if (this.search !== '' && this.pageNo === 1 && res.data.content.length === 0) {
          this.noResult = true;
          this.$toast('无搜索结果！')
        }
        this.total = res.data.totalEmelents;
        this.items = res.data.content;
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
          this.showLoading = false;
        })
      }).catch(err => {
        this.showLoading = false;
      })
    },
    onPullingUp() {
      this.pageNo = 1;
      this.getItems();
    },
    LoadMore() {

      if (this.items.length == this.total) {
        this.$refs.scroll.finishPullUpLoad()
        this.$toast('已无更多数据！')
        return
      }
      this.pageNo = this.pageNo + 1;
      let startTime = new Date();
      this.$ajaxGet2(this.pageApi, {search: this.search, pageNo: this.pageNo, pageSize: this.pageSize}).then(res => {
        let endTime = new Date(); //处理数据更新过快 loading效果加载不出来
        if (endTime - startTime < 1550) {
          setTimeout(() => {
            this.items.push(...res.data.content);
            this.$refs.scroll.finishPullUpLoad()
          }, 2500 - (endTime - startTime))
        } else {
          this.items.push(...res.data.content);
          this.$refs.scroll.finishPullUpLoad()
        }

      }).catch(err => {
      })
    }
  }
}
