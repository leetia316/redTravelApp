<template>
  <div class="days">
    <!--<svg version="1.2" baseProfile="tiny">-->
      <!--<path class="path1" stroke="#e9e9e9" stroke-width="1" stroke-opacity="0.7" fill="none" :d="path1"></path>-->
      <!--<path class="path3" stroke="#fff" stroke-width="1" stroke-opacity="0.15" fill="none" :d="path3"></path>-->
      <!--<circle :cx="allWeatherInfo[1].x" :cy="allWeatherInfo[1].yh" r="2.5" fill="#fff"></circle>-->
      <!--<path class="path2" stroke="#e9e9e9" stroke-width="1" stroke-opacity="0.7" fill="none" :d="path2"></path>-->
      <!--<path class="path4" stroke="#fff" stroke-width="1" stroke-opacity="0.15" fill="none" :d="path4"></path>-->
      <!--<circle :cx="allWeatherInfo[1].x" :cy="allWeatherInfo[1].yl" r="2.5" fill="#fff"></circle>-->
      <!--<path class="path5" stroke-dasharray="4,4" stroke="#fff" stroke-width="1" fill="none" :d="path5" />-->
    <!--</svg>-->
      <template v-for="(item,index) in data">
        <div class="column" :key="index">
          <div class="date">{{item.dateOfDay}}</div>
          <div class="vertical-container">
            <svg class="weather-day-icon" aria-hidden="true">
              <use :xlink:href="item.classType"></use>
            </svg>
          </div>
          <div class="type van-ellipsis">{{item.type}}</div>
          <div class="high">{{item.highNum}}&#176;</div>
          <div class="low">{{item.lowNum}}&#176;</div>
          <div class="fx van-ellipsis">{{item.fengxiang}}</div>
          <div class="fx van-ellipsis">{{item.windNum}}</div>
        </div>
      </template>
  </div>
</template>

<script>
  import '../../assets/fonts/weather_iconfont'
  // import {extend,quickSort,getSVGPathByCoordinate,addData,queryData} from "_com/js/common";
  import {weatherType2Icon} from "_com/js/weathertype2icon";
  export default {
    name: "otherDaysWeather",
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        current: 1,     // 6天天气预测当前选择标志位
        path1: '',      // 曲线1
        path2: '',      // 曲线2
        path3: '',      // 曲线3
        path4: '',      // 曲线4
        path5: '',      // 虚线
      }
    },
    computed: {
      // allWeatherInfo() {
      //
      //   if (!this.data) return [] ;
      //
      //   // 拷贝对象修改
      //   let yesterday = [], otherdays = [];
      //   yesterday[0] = extend({}, this.cityWeather.yesterday),
      //
      //     this.cityWeather.forecast.forEach((item) => {
      //       otherdays.push(extend({}, item));
      //     });
      //
      //   // 重命名键名
      //   Object.defineProperty(yesterday[0], 'fengli', {value: yesterday[0].fl});
      //   Object.defineProperty(yesterday[0], 'fengxiang', {value: yesterday[0].fx});
      //
      //   delete yesterday[0].fl;
      //   delete yesterday[0].fx;
      //
      //   // 合拼数据
      //   let newO  = yesterday.concat(otherdays),
      //
      //     // 根据屏幕尺寸变化设置svg宽度
      //     offsetX = this.screenWidth / 6 / 2,
      //     // 两条曲线路径
      //     path1 = [],path2 = [];
      //
      //   let yH = [], yL = [];
      //
      //   // 提取数字
      //   for (let i = 0; i < newO.length; i++) {
      //     yH[i] = parseInt(newO[i].high.match(/-?[1-9](?:\d{0,2})(?:,\d{3})*|0/)[0]);
      //     yL[i] = parseInt(newO[i].low.match(/-?[1-9](?:\d{0,2})(?:,\d{3})*|0/)[0]);
      //   }
      //   // 根据最高温、最低温求相应温度显示坐标系数
      //   let allTemp = quickSort(yH.concat(yL)),
      //     max = allTemp[allTemp.length-1],
      //     min = allTemp[0],
      //     ratioH = Math.abs((BREAKPOINT_H + OFFSET_H_Y - HEIGHT)/ -max),
      //     ratioL = Math.abs((BREAKPOINT_L + OFFSET_L_Y - HEIGHT)/ -min);
      //   // 被除数为0出现无穷大情况
      //   if (ratioH == '-Infinity' || ratioH == 'Infinity') ratioH = 0;
      //   if (ratioL == '-Infinity' || ratioL == 'Infinity') ratioL = 0;
      //
      //   // 系数过大显示不正常情况下，统一使用同一系数,保证最高温或最低温位置置于顶部、底部
      //   let offsetHY = OFFSET_H_Y, offsetLY = OFFSET_L_Y;
      //
      //   if ((HEIGHT - max * ratioH - OFFSET_H_Y).toFixed(2) != BREAKPOINT_H) { // 最高温曲线显示不正常取最低温曲线系数
      //     ratioH = ratioL;
      //     offsetHY = HEIGHT - BREAKPOINT_H - max * ratioH;
      //   }
      //   if ((HEIGHT - min * ratioL - OFFSET_L_Y).toFixed(2) != BREAKPOINT_L) { // 最低温曲线显示不正常取最高温曲线系数
      //     ratioL = ratioH;
      //     offsetLY = HEIGHT - BREAKPOINT_L - min * ratioL;
      //   }
      //   // 采用跟最高温一样的系数，也可以不用
      //   ratioL =  ratioH;
      //
      //   // 计算，并将计算结果放入源数组对象中
      //   for (let i = 0, left = offsetX; i < newO.length; i++) {
      //     path1[i] = {};path2[i] = {};
      //
      //     // 日期转换
      //     newO[i].date = this.date2Week(newO[i], i);
      //
      //     newO[i].high = yH[i];
      //     newO[i].low  = yL[i];
      //
      //     // 根据温度换算坐标
      //     Object.defineProperty(newO[i], 'x', {value: left});
      //     path1[i].x = left;
      //     path2[i].x = left;
      //
      //     Object.defineProperty(newO[i], 'yh', {value: HEIGHT - newO[i].high * ratioH - offsetHY});
      //     path1[i].y = newO[i].yh;
      //
      //     Object.defineProperty(newO[i], 'yl', {value: HEIGHT - newO[i].low  * ratioL - offsetLY});
      //     path2[i].y = newO[i].yl;
      //
      //     left += offsetX*2;
      //   }
      //
      //   // 绘制四条三次贝塞尔曲线
      //   this.path1 = getSVGPathByCoordinate(path1.slice(1));
      //   this.path2 = getSVGPathByCoordinate(path2.slice(1));
      //   this.path3 = getSVGPathByCoordinate(path1.slice(0, 2));
      //   this.path4 = getSVGPathByCoordinate(path2.slice(0, 2));
      //   // 虚线
      //   this.path5 = `M${path1[1].x},${path1[1].y} ${path1[1].x},${path2[1].y}`;
      //
      //   return newO;
      // }
    },
    watch: {
      data: 'initData'
    },
    created() {

    },

    mounted() {

    },


    methods: {
      initData() {
        let data = this.data;
        for (let i = 0; i < data.length; i++) {
          data[i].dateOfDay = this.date2Week(data[i], i);
          data[i].classType = '#icon-'+ weatherType2Icon(data[i].type);
          data[i].highNum = parseInt(data[i].high.match(/-?[1-9](?:\d{0,2})(?:,\d{3})*|0/)[0]);
          data[i].lowNum = parseInt(data[i].low.match(/-?[1-9](?:\d{0,2})(?:,\d{3})*|0/)[0]);
          data[i].windNum = data[i].fengli.substring(9,data[i].fengli.indexOf(']]>'));
        }
      },
      // 日期转周一...周日
      date2Week(val, idx) {
        return idx == 0 ? '\u6628\u5929' : idx == 1 ? '\u4eca\u5929' : idx == 2 ? '\u660e\u5929' : '\u5468' + (val.date.split('\u65e5')[1].split('\u671f')[1] === '\u5929' ? '\u65e5' : val.date.split('\u65e5')[1].split('\u671f')[1]);
      },
    }
  }
</script>

<style scoped lang="scss">

  .weather-day-icon {
    /* 通过设置 font-size 来改变图标大小 */
    width: 70%;
    height: 80px;
    /* 图标和文字相邻时，垂直对齐 */
    vertical-align: -0.15em;
    /* 通过设置 color 来改变 SVG 的颜色/fill */
    fill: currentColor;
    /* path 和 stroke 溢出 viewBox 部分在 IE 下会显示
       normalize.css 中也包含这行 */
    overflow: hidden;
  }
  .days {
    background-color: hsla(0, 0%, 100%, .08);
    color: $text-color-w;
    font-size: $text-m;
    text-align: center;
    width: 100%;
    min-height: 50vh;
    display: flex;
    justify-content: space-around;
    .column {
      width: 100%;
      min-height: 50vh;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      >div{
        width: 100%;
      }
      .date{
        margin-top: 20px;
      }
      .type{
        font-size: $text-ss;
        margin-bottom: 10px;
      }
      .high{
        padding-left: 9px;
      }
      .low{
        padding-left: 9px;
        margin-top: 8vh;
      }
      .fx{
        font-size: $text-ss;
        margin-top: 15px;
      }
    }
  }
</style>
