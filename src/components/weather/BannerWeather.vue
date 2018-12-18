<template>
  <div class="weather-container" v-show="show" @click="GoToWeather">
    <div class="location">
      <van-icon name="location"/>
      <span>{{city}}</span>
    </div>
    <div class="weather-container-bottom">
      <div class="cloumn">
        <div class="vertical-container">
          <svg class="weather-icon" aria-hidden="true">
            <use :xlink:href="classType"></use>
          </svg>
        </div>
        <!--<img src="../../assets/tabIndex/scence_icon_cloudy@2x.png" class="weather-desc-img"/>-->
        <!--<div :class="className"></div>-->
        <span class="weather-desc">{{date}} &nbsp;{{type}}</span>
      </div>
      <div class="cloumn">
        <span class="templature vertical-container">{{temperature}}&#176;</span>
        <span class="air">空气质量：<span class="aqi-bg" :style="{background:aqi_bgColor}">{{aqi}}&nbsp;{{switchAqiType(aqi)}}</span>
          <!--<img src="../../assets/tabIndex/scence_icon_perfect@2x.png"/>-->
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import '../../assets/fonts/weather_iconfont'
  import {weatherType2Icon} from "_com/js/weathertype2icon";
  import axios from 'axios';
  // axios.defaults.withCredentials = true
  export default {
    name: "BannerWeather",
    data() {
      return {
        show:false,
        forecast: [],
        city: '',
        date:new Date().toLocaleDateString(),
        temperature:'',
        icon:'',
        type:'',
        classType:'',
        aqi:55,
        aqi_bgColor:'transparent'
      }
    },
    computed: {
    },

    created() {
    },
    beforeMount() {
      // this.getUserLocation()
    },
    mounted() {
      // this.$toast.loading({
      //   mask: true,
      //   message: '加载中...',
      //   loadingType:'spinner'
      // })
      axios.get('http://wthrcdn.etouch.cn/weather_mini?citykey=101260101').then(res=>{
        // console.log(res.data.data)
        let Data = res.data.data;
        this.city = Data.city;
        this.temperature =Data.wendu;
        this.forecast = Data.forecast;
        this.type = this.forecast[0].type;
        this.classType = '#icon-'+ weatherType2Icon(this.forecast[0].type)
        this.aqi = Data.aqi;
        // this.$toast.clear();
        this.show = true;
      }).catch(err=>{
        // this.$toast.clear();
      })
    },
    methods: {
      GoToWeather(){
        this.$router.push({
          name:'weather'
        })
      },
      switchAqiType(aqi){
        let Aqi_desc = '良';
        if(aqi>0 && aqi<=50){
            this.aqi_bgColor = '#40c057';
            Aqi_desc = '优'
        }else if(aqi>50 && aqi<=100){
          this.aqi_bgColor = '#82c91e';
          Aqi_desc = '良'
        }else if(aqi>100 && aqi<=200){
          this.aqi_bgColor = '#f76707';
          Aqi_desc = '轻度污染'
        }else if(aqi>200 && aqi<=300){
          this.aqi_bgColor = '#e03131';
          Aqi_desc = '中度污染'
        }else if(aqi>300){
          this.aqi_bgColor = '#540822';
          Aqi_desc = '严重污染'
        }
        return Aqi_desc;
      },

      // async getWeatherData() {
      //   try {
      //     const response = await axios.get('http://api.openweathermap.org/data/2.5/forecast/daily', {
      //       params: {
      //         q: this.city,
      //         units: 'metric',
      //         appid: OWA_API_KEY
      //       }
      //     })
      //     this.forecast = response.data.list
      //     console.log(this.forecast)
      //     const today = this.forecast[0];
      //     this.temperature =  today.temp.day;
      //     this.icon =  today.weather[0].icon;
      //     this.date =  new Date(today.dt*1000).toLocaleDateString();
      //     this.main =  today.weather[0].main;
      //   } catch (error) {
      //     this.forecast = {}
      //     this.$toast("Couldn't get data for this city!");
      //   }
      // },

      // async getUserLocation() {
      //   try {
      //     const response = await axios.get("http://ipinfo.io", "jsonp")
      //     this.city = response.data.city
      //     this.getWeatherData()
      //   } catch (error) { }
      // }
    }
  }
</script>

<style scoped lang="scss">
  .weather-container {
    position: absolute;
    width: 100%;
    height: 28vh;
    z-index: 100;
    color: $text-color-w;
    .location {
      @include vertical-container;
      padding-top: 5vh;
      line-height: 20px;
      font-size: $text-xxl;
      span {
        line-height: 22px;
        margin-left: 4px;
      }
    }
    .weather-container-bottom {
      display: flex;
      justify-content: space-around;
      padding-top: 15px;
      margin: 0 auto;
      .cloumn {
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: $text-m;
      }
      .weather-desc-img {
        width: 85px;
        height: 60px;
        display: block;
      }
      .weather-desc {
        margin-top: 15px;
      }
      .templature {
        height: 60px;
        font-size: 40px;
      }
      .air {
        margin-top: 15px;
        line-height: 16px;
        .aqi-bg{
          height: 14px;
          /*line-height: 14px;*/
          border-radius: 3px;
          padding: 2px 15px;
          /*opacity: 0.8;*/

        }
        img {
          width: 16px;
          height: 16px;
          vertical-align: middle;
        }
      }
    }
  }

</style>
