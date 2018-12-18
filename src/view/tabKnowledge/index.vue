<template>
  <div class="page-container">
    <div class="header">
        <button id="konwledge-btn" ></button>
    </div>
    <div>
      <form action="/">
        <van-search
          v-model="search"
          show-action
          @search="getItems"
        >
          <div slot="action" @click="getItems">搜索</div>
        </van-search>
      </form>
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
          <li class="van-hairline--bottom container" @click="goToGame(item.id)">
            <div class="left">
              <img :src="item.cover_img_url">
            </div>
            <div class="right">
              <p class="title">{{item.type_name}}</p>
              <div class="title-info">
                <span class="tag">{{item.type_title}}</span>
                <span class="date">{{item.create_date | FormatDateYDM}}</span>
              </div>
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
    mixins:[pageMixin],
    data() {
      return {
        pageApi: '/knowledge/getInteractionsTypeList',
      }
    },
    computed: {},

    created() {
    },

    mounted() {
      this.$refs.scroll.refresh();
    },


    methods: {
      goToActivityDetail() {
        this.$router.push({
          name: 'knowledgeDetail',
          query: {}
        })
      },
      goToGame(id) {
        this.$router.push({
          name: 'knowledgeGame',
          query: {
            id
          }
        })
      },
      onSearch(value){
        console.log(value)
      }
    }
  }
</script>

<style scoped lang="scss">

  .header{
    /*background: url("../../assets/activaity/activity_nav_bg@2x.png") no-repeat fixed top;*/
    @include bg-image('../../assets/konwledge/knowledge_nav_bg');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    width: 100%;
    height: 70px;
    position: relative;
    #konwledge-btn{
      @include bg-image('../../assets/konwledge/knowledge_nav_btn');
      background-size: 100% auto;
      background-repeat: no-repeat;
      width: 70px;
      height: 26px;
      border: none;
      border-radius: 2px;
      opacity: 0.85;
      position: absolute;
      bottom: 11%;
      right: 10px;
    }

  }
  .list{
    box-sizing: border-box;
    @include scroll-div(55px);
    top:116px;
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
        margin-left: 10px;
        width: 75%;
        position: relative;
        /*display: flex;*/
        /*flex-direction: column;*/
        p{
          word-break: break-all;
        }
        .title{
          line-height: 1.3;
          font-size: $text-l;
          letter-spacing: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          position: relative;
          word-wrap: break-word;
          padding-top: 2px;
        }
        .title-info{
          position: absolute;
          bottom:3px;
          width: 100%;
          color: $text-color-g;
          align-self: flex-end;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .tag{
            font-size: $text-s;
            background: $gray-back;
            padding: 6px ;
            border-radius: 3px;
          }
          .date{
            font-size: $text-m;
          }
        }
      }

    }

  }
</style>
