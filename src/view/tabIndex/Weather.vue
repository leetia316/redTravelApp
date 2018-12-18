<template>
  <div>
    <van-nav-bar
      v-if="!isWeChatUS"
      left-text="返回"
      title="贵阳天气"
      left-arrow
      @click-left="$router.back()"
      :fixed="true"
    >
    </van-nav-bar>
    <div class="weather" ref="centerDiv">
      <div class="weather-header">
        <div class="left">
          <p class="weather-pollution-title">{{aqi ? "实时空气质量" : "当前城市无实时空气质量数据"}}</p>
          <p class="weather-pollution-color" v-if="aqi" :style="{background:aqi_bgColor}">
            <span class="c-gap-right-small weather-poNum list-item">{{aqi || "--"}}</span><span>{{aqi ? switchAqiType(aqi) : "未知"}}</span>
          </p>
        </div>
        <div class="right">
          <div class="weather-wrap">
            <span class="weather-update"> 更新于 <span>{{updataTime}}</span></span>
            <button class="city-picker-toggle" @click="updateData">
              <span>{{city}}</span>
              <i class="mine-icon icon-share"></i>
            </button>
          </div>
          <div class="weather-date weather-date-small"><span
            class="weather-date-info">{{gDate + ' '+ncWeek}}</span> <span class="weather-lunar">{{nDate}}</span>
          </div>
          <div class="weather-date-gz"><span>{{gzDate}}</span></div>
        </div>
      </div>
      <div class="today-container">
        <div class="today-main">
          <div class="cloumn">
            <div class="vertical-container">
              <svg class="weather-icon" aria-hidden="true">
                <use :xlink:href="classType"></use>
              </svg>
            </div>
            <span class="weather-desc">{{type}} &nbsp;{{windInfo}}</span>
          </div>
          <div class="cloumn">
            <span class="templature vertical-container">{{temperature}}&#176; </span>
            <span class="air">{{forecast.length>0?temperatureScope[0]:''}}&#176;~&nbsp;&nbsp;{{forecast.length>0?temperatureScope[1]:''}}&#176;</span>
          </div>
        </div>
        <div class="weather-prompt">
          <span class="weather-prompt-text">{{todayCare}}</span>
        </div>
      </div>
      <other-day-weather :data="daysData"></other-day-weather>
      <weather-loading :loadingShow="loadingShow"></weather-loading>
    </div>
  </div>
</template>
<script>
  import '../../assets/fonts/weather_iconfont'
  import WeatherLoading from '_c/loading/WeatherLoading'
  import OtherDayWeather from '_c/weather/otherDaysWeather'
  import {weatherType2Icon} from "_com/js/weathertype2icon";
  import {formatDate} from '_com/js/common'
  import {calendar} from '_com/js/calendar'
  import axios from 'axios';
  import weChat from '@/tools/public'
  // axios.defaults.withCredentials = true
  export default {
    name: "Weather",
    components: {WeatherLoading, OtherDayWeather},
    data() {
      return {
        loadingShow: true,
        updataTime: '',								//更新时间,这里的更新时间因API也未提供所以使用当前的刷新时间
        nDate: '',									//农历
        gDate: '',									//公历
        gzDate: '',									//天干地支
        ncWeek: '',								//星期
        forecast: [],
        city: '',
        date: new Date().toLocaleDateString(),
        temperature: '',
        icon: '',
        type: '',
        classType: '',
        aqi: 55,
        todayCare: '',
        aqi_bgColor: 'transparent',
        daysData: [],
        isWeChatUS: !!weChat.inWeChat()
      }
    },
    computed: {
      // 今天的最高温和最低温
      temperatureScope() {
        if (!this.forecast.length) return;
        // 提取数字
        let highTmp = this.forecast[0].high.match(/[1-9](?:\d{0,2})(?:,\d{3})*|0/)[0];
        let lowTmp = this.forecast[0].low.match(/[1-9](?:\d{0,2})(?:,\d{3})*|0/)[0];
        return [highTmp, lowTmp];
      },
      // 风向风力
      windInfo() {
        if (!this.forecast.length) return;
        return this.forecast[0].fengxiang + '(' + this.forecast[0].fengli.substring(9, this.forecast[0].fengli.indexOf(']]>')) + ')';
      }
    },

    created() {
    },
    beforeMount() {
      // this.getUserLocation()
    },
    mounted() {
      if(this.isWeChatUS){   //微信环境下去掉顶部栏
        this.$refs.centerDiv.style.top = 0;
      }
      // 获取当前日期、时间戳
      this.updateData();
    },
    methods: {
      updateData() {
        this.loadingShow = true;
        let date = new Date(Date.parse(new Date()));
        this.updataTime = formatDate(date, 'yyyy-MM-dd|hh:mm').split('|')[1];

        let lunar = calendar.solar2lunar();
        this.gDate = `${lunar.lYear}-${lunar.cMonth}-${lunar.cDay}`;
        this.ncWeek = `${lunar.ncWeek}`;
        this.nDate = `${lunar.IMonthCn}${lunar.IDayCn}`;
        this.gzDate = `${lunar.gzYear}年${lunar.gzMonth}月${lunar.gzDay}日`;
        axios.get('http://wthrcdn.etouch.cn/weather_mini?citykey=101260101').then(res => {
          console.log(res.data.data)
          let Data = res.data.data;
          this.city = Data.city;
          this.temperature = Data.wendu;
          this.forecast = Data.forecast;
          this.type = this.forecast[0].type;
          this.classType = '#icon-' + weatherType2Icon(this.forecast[0].type)
          this.aqi = Data.aqi;
          this.todayCare = Data.ganmao;
          Data.yesterday.fengli = Data.yesterday.fl;
          Data.yesterday.fengxiang = Data.yesterday.fx;
          this.daysData = [];
          this.daysData.push(Data.yesterday);
          this.daysData.push(...Data.forecast);
          setTimeout(() => {
            this.loadingShow = false;
          }, 1000)
        })
      },
      switchAqiType(aqi) {
        let Aqi_desc = '良';
        if (aqi > 0 && aqi <= 50) {
          this.aqi_bgColor = '#40c057';
          Aqi_desc = '优'
        } else if (aqi > 50 && aqi <= 100) {
          this.aqi_bgColor = '#82c91e';
          Aqi_desc = '良'
        } else if (aqi > 100 && aqi <= 200) {
          this.aqi_bgColor = '#f76707';
          Aqi_desc = '轻度污染'
        } else if (aqi > 200 && aqi <= 300) {
          this.aqi_bgColor = '#e03131';
          Aqi_desc = '中度污染'
        } else if (aqi > 300) {
          this.aqi_bgColor = '#540822';
          Aqi_desc = '严重污染'
        }
        return Aqi_desc;
      }
    }
  }
</script>

<style scoped lang="scss">

  .weather {
    background-color: rgba(62, 126, 191, 0.9);
    background-image: -webkit-linear-gradient(top, #3e7ebf, #6ec2ff);
    position: fixed;
    top: 46px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
  }

  .weather-header {
    box-shadow: 0 2px 2px rgba(0, 0, 0, .1);
    display: flex;
    padding: 20px 15px;
    .left {
      flex-grow: 1;
      .weather-pollution-title {
        min-width: 100px;
        max-width: 165px;
        text-align: center;
        background: hsla(0, 0%, 100%, .08);
        border-radius: 3px;
        padding: 7px 0;
        font-size: 12px;
        line-height: 1.3;
        color: #fff;
        margin-bottom: 7px;
      }
      .weather-pollution-color {
        min-width: 100px;
        max-width: 165px;
        text-align: center;
        background: hsla(0, 0%, 100%, .08);
        border-radius: 3px;
        padding: 5px 0;
        font-size: 12px;
        line-height: 1.3;
        color: #fff;
        -webkit-transition: all 1.2s linear; /* For Safari 3.1 to 6.0 */
        transition: all 1.2s linear;
        text-shadow: 1px 1px 1px rgba(0, 0, 0, .6);
        .weather-poNum {
          font-size: 13px;
          padding-right: 7px;
        }
      }
    }
    .right {
      flex-grow: 2;
      text-align: right;
      font-size: $text-s;
      color: $text-color-w;
      .weather-wrap {
        padding: 5px 0;
        text-shadow: 1px 1px 0 rgba(0, 0, 0, .23);
        .weather-update {
          color: hsla(0, 0%, 100%, .5);
          text-shadow: 1px 1px 0 rgba(0, 0, 0, .3);
          margin-right: 10px;
        }
        .city-picker-toggle {
          border-radius: 3px;
          border: 1px solid #a8a8e4;
          color: $text-color-w;
          padding: 3px 5px;
          background: transparent;
          text-shadow: 1px 1px 0 rgba(0, 0, 0, .23);
          display: inline-block;
        }
        i {
          font-size: $text-s;
          line-height: 1;
        }
      }
      .weather-date, .weather-date-gz {
        position: relative;
        text-align: right;
      }
      .weather-date-gz span {
        color: rgba(255, 255, 255, 0.5);
        font-size: 10px;
        text-shadow: 1px 1px 0 rgba(0, 0, 0, .23);
      }
      .weather-changecity, .weather-date {
        padding: 8px 0;
        text-shadow: 1px 1px 0 rgba(0, 0, 0, .23);
      }
    }

  }

  .today-container {
    /*position: absolute;*/
    width: 100%;
    color: $text-color-w;
    .location {
      @include vertical-container;
      padding-top: 6vh;
      line-height: 20px;
      font-size: $text-xxl;
      span {
        line-height: 22px;
        margin-left: 4px;
      }
    }
    .today-main {
      display: flex;
      justify-content: space-around;
      margin: 20px 50px 15px 50px;
      .cloumn {
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: $text-m;
      }
      .weather-desc {
        margin-top: 15px;
      }
      .templature {
        height: 70px;
        font-size: 40px;
      }
      .air {
        margin-top: 15px;
        line-height: 16px;
        .aqi-bg {
          height: 14px;
          border-radius: 3px;
          padding: 2px 15px;
        }
      }
    }
    .weather-prompt {
      margin: 10px;
      padding: 8px 5px;
      border-radius: 3px;
      background: hsla(0, 0%, 100%, .1);
      overflow: hidden;
      font-size: $text-s;
      line-height: 1.3;
      .aw-weather-prompt-text {
        text-shadow: 1px 1px 0 rgba(0, 0, 0, .23);
      }
    }
  }
</style>
