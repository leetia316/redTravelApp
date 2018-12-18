<template>
  <div>
    <div class="header vertical-container">
      <div class="input-container ">
        <input placeholder="大家都在看的活动" v-model="search"/>
        <van-icon name="search" @click="getItems"></van-icon>
      </div>
    </div>
    <Scroll class="list"
            ref="scroll"
            :pullUpLoad="pullUpLoad"
            @LoadMore="LoadMore"
    >
      <ul>
        <Loading v-show="showLoading"/>
        <p class="no-search-result-p" v-show="noResult"><van-icon name="info-o" />没有搜索到结果...</p>
        <template v-for="item in items">
          <li class="van-hairline--bottom container" @click="goToActivityDetail(item.id)">
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
    </Scroll>
  </div>
</template>

<script>
  import {pageMixin} from '_com/js/mixin'

  export default {
    name: "index",
    mixins: [pageMixin],
    data() {
      return {
        pullDownRefresh:true,
        pullUpLoad:true,
        pageApi: '/spot/getActivityList',
      }
    },
    mounted() {
      // this.$refs.scroll.$refs.scrollContainer.style.minHeight = document.documentElement.clientHeight -70 - 50+'px';
    },

    methods: {
      goToActivityDetail(id) {
        this.$router.push({
          name: 'activityDetail',
          query: {id}
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .header {
    /*background: url("../../assets/activaity/activity_nav_bg@2x.png") no-repeat fixed top;*/
    @include bg-image('../../assets/activaity/activity_nav_bg');
    background-size: cover;
    background-repeat: no-repeat;
    width: 100%;
    height: 70px;
    .input-container {
      width: 100%;
      display: flex;
      justify-content: center;
      input {
        margin-left: 30px;
        width: 50%;
        border: none;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: $text-m;
        line-height: $text-m;
        text-align: center;
      }
      i {
        @include vertical-container;
        padding: 0 15px;
      }
    }
  }

  .list {
    padding: 0 12px 15px 12px;
    box-sizing: border-box;
    @include scroll-div(55px);
    top: 75px;
    .container {
      display: flex;
      padding: 10px 0;
      .left {
        width: 25%;
        img {
          width: 100%;
          height: 80px;
          border-radius: 3px;
        }
      }
      .right {
        margin-left: 10px;
        width: 75%;
        position: relative;
        /*display: flex;*/
        /*flex-direction: column;*/
        p {
          word-break: break-all;
        }
        .title {
          font-size: $text;
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
          font-size: $text-m;
          padding: 8px 0 5px 0;
        }
        .date {
          position: absolute;
          bottom: 3px;
          font-size: $text-ss;
          color: $text-color-g;
          align-self: flex-end;
        }
      }

    }

  }
</style>
