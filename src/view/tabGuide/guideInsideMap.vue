<template>
  <div >
    <van-nav-bar
      :left-text="leftInfo"
      right-text="路线"
      title="室内地图导航"
      :left-arrow="leftArrow"
      @click-left="closePop"
      :fixed="true"
      @click-right="onClickRight"
    >
    </van-nav-bar>
    <van-actionsheet
      v-model="showActionSheet"
      :actions="actions"
      cancel-text="取消"
      @select="onSelect"
      @cancel="onCancel"
    />
    <div class="main">
      <div>
        <div id="map-container">

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Toast from "vant/es/toast/index";

  let fengmap = require('../../../static/fengmap.min');
  export default {
    name: "guideInsideMap",
    props:{
      currentPos:{
        type:Object
      },
      targetPos:{
        type:Object
      }
    },
    watch:{
      currentPos: {
        handler: function (val, oldVal) {
          this.drawNaviRoute();
          console.log("监听到的currentPos")
          console.log(val)
          this.moveTo(val)
        },
        deep:true
      },
      targetPos: {
        handler: function (val, oldVal) {
          this.drawNaviRoute();
          console.log("监听到的targetPos")
          console.log(val)
        },
        deep:true
      }
    },
    data() {
      return {
        showActionSheet: false,
        map: null,
        locationMarker: null,//位置
        defaultGroupID: 2,//楼层
        actions: [
          {
            name: '自定义起始点',
            subname: '请在地图中选择',
            key: 'A'
          }],
        navi : null,//导航对象
        leftArrow: true,
        leftInfo: "返回"
      }
    },
    computed: {},

    created() {
    },

    mounted() {
      if(this.isWeChatUS){   //微信环境下去掉顶部栏
        this.title = "";
        this.leftArrow = false;
      }
      let that = this;
      //定义全局map变量
      let fmapID = 'zggzsgwjz'; //mapId
      let resourceUrl = "../static/resource/style/wedgets/img/";
      // let navi = null;//导航
      let map = new fengmap.FMMap({
        //渲染dom
        container: document.getElementById('map-container'),
        //地图数据位置
        mapServerURL: '../static/insideMap/' + fmapID,
        //主题数据位置
        mapThemeURL: '../static/insideMap/theme',
        //设置主题
        defaultThemeName: 'zggzsgwjz',
        mapScaleLevelRange: [20, 29],     // [15, 29], 比例尺级别范围， 16级到23级
        // mapScaleRange: [200, 4000]      // [200, 4000]， 自定义比例尺范围，单位（厘米）
        // defaultMapScale: 1000,          // 默认自定义比例尺为 1：1000（厘米）
        // 默认比例尺级别设置为20级
        defaultMapScaleLevel: 21,
        //开发者申请应用下web服务的key
        appName: '贵州红色旅游',
        //开发者申请应用下web服务的key
        key: '4a1a25b0a13f6cf8fe0f7f5410049b7c',
        defaultVisibleGroups:[2],           //设置初始显示楼层，数组格式，可单个，可多个
        defaultFocusGroup: 2,              //初始聚焦楼层
        defaultControlsPose: fengmap.FMDirection.EAST,
        defaultTiltAngle: 60,
        //defaultControlsPose: 90,     //角度值。
        defaultViewMode:fengmap.FMViewMode.MODE_3D, //初始二维还是三维状态，三维状态为MODE_3D
        focusAnimateMode: true,            //开启聚焦层切换的动画显示
        viewModeAnimateMode:true,          //开启2维，3维切换的动画显示
        moveToAnimateMode:true,           //地图定位跳转动画设置
        naviLineAnimation:true            //路径线流动动画开关。false关闭
      });
      this.map = map;
      map.showCompass = true; //显示指北针控件
      //地图手势对象
      let controller = map.gestureEnableController;
      controller.enableMapPan = true; // 可移动
      controller.enableMapRotate = true; // 可旋转
      controller.enableMapIncline = true; //可倾斜
      controller.enableMapPinch = true;   //可缩放
      controller.enableMapSingleTap = true; //可单击

      //放大、缩小控件配置
      let ctlOpt1 = new fengmap.controlOptions({
        imgURL: resourceUrl,
        position: fengmap.controlPositon.RIGHT_BOTTOM, //位置 右下角
        //位置x,y的偏移量
        // offset: {
        //   x: 20,
        //   y: 60
        // }
      });

      //楼层控制控件配置参数
      let ctlOpt2 = new fengmap.controlOptions({
        //默认在右上角
        position: fengmap.controlPositon.RIGHT_TOP,
        //默认显示楼层的个数
        showBtnCount: 3,
        //初始是否是多层显示，默认单层显示
        allLayer: false,
        imgURL: resourceUrl,
        //位置x,y的偏移量
        offset: {
          x: 0, //设置为0默认为10px
          y: 10
        }
      });

      //打开Fengmap服务器的地图数据和主题
      map.openMapById(fmapID, function (error) {
        //打印错误信息
        console.log(error);
      });

      //地图加载完成回掉方法
      map.on('loadComplete', function () {
        //放大、缩小控件
        // map为FMMap对象，初始化需在地图加载后完成。
        let zoomControl = new fengmap.zoomControl(map, ctlOpt1);
        //创建楼层(按钮型)，创建时请在地图加载后(loadComplete回调)创建。
        let groupControl = new fengmap.scrollGroupsControl(map, ctlOpt2);

        //通过楼层切换控件切换聚焦楼层时的回调函数
        //groupContro 即为楼层控件对象
        groupControl.onChange(function (groups, allLayer) {
          //groups 表示当前要切换的楼层ID数组,
          //allLayer表示当前楼层是单层状态还是多层状态。
        });
        //添加2、3纬切换
        let toolControl = new fengmap.toolControl(map, {
          //初始化2D模式
          init2D: false,
          //设置为false表示只显示2D,3D切换按钮
          groupsButtonNeeded: false,
          position: fengmap.controlPositon.RIGHT_BOTTOM,
          offset: {
            x: 0,
            y: 60
          },
          imgURL: resourceUrl,
          //点击按钮的回调方法,返回type表示按钮类型,value表示对应的功能值
          clickCallBack: function (type, value) {
            // console.log(type,value);
          }
        });


        //初始化导航对象
        that.navi = new fengmap.FMNavigation({
          map: map,
          // 设置导航线的样式
          lineStyle: {
            //设置线为导航线样式
            lineType: fengmap.FMLineType.FMARROW,
            lineWidth: 6,
            //设置线的颜色
            // godColor: '#FF0000',
            //设置边线的颜色
            // godEdgeColor: '#920000',
          }
        });
        console.log("-----起点终点坐标-----");
        console.log(that.currentPos);
        console.log(that.targetPos);
        //选择目标点后初始化路线
        if(that.targetPos){
           that.drawNaviRoute();
        }
        //添加位置点
        // addLocationMarker(map.center);
      });


      // 点击计数
      let clickCount = 0;

      //判断起点是否是同一处坐标
      let lastCoord = null;

      //点击地图事件。开始选点开始后，点击地图一次为起点，第二次点击为终点
      map.on('mapClickNode', function (event) {
        if (event.nodeType == fengmap.FMNodeType.MODEL && that.navi != undefined) {
          var modelLabel = event.label;
          var coord;

          // 如果拾取的模型没有Label对象，则使用模型中心点的坐标
          // 有则使用与模型对应的Label对象的坐标。
          if (!modelLabel) {
            coord = {
              x: event.mapCoord.x,
              y: event.mapCoord.y,
              groupID: event.groupID
            }
          } else {
            coord = {
              x: modelLabel.mapCoord.x,
              y: modelLabel.mapCoord.y,
              groupID: event.groupID
            };
          }
          console.log("坐标点--------");
          console.log(coord);
          console.log(event);
          //第三次点击清除路径，重现设置起点起点
          if (clickCount == 2) {
            that.navi.clearAll();
            clickCount = 0;
            lastCoord = null;
          }
          //第一次点击添加起点
          if (clickCount == 0) {
            lastCoord = coord;
            that.navi.setStartPoint({
              x: coord.x,
              y: coord.y,
              height: 2,
              groupID: coord.groupID,
              url: '../static/resource/style/wedgets/img/start.png',
              size: 32
            });
          } else if (clickCount === 1) { //添加终点并画路线
            //判断起点和终点是否相同
            if (lastCoord.x === coord.x && lastCoord.groupID === coord.groupID) {
              alert('起点和终点不能在同一个模型上。')
              return;
            } else {

            }
            that.navi.setEndPoint({
              x: coord.x,
              y: coord.y,
              height: 2,
              groupID: coord.groupID,
              url: '../static/resource/style/wedgets/img/end.png',
              size: 32
            });
            if(that.navi.combinePoints.length < 1){
             return Toast("当前起点和终点之间没有路线，请重新选择");
            }
            // 画导航线
            // that.navi.drawNaviLine();
            that.navi.simulate();
          }
          clickCount++;
        }
      })

      //创建定位点标注
      function addLocationMarker(coord) {
        console.log(coord)
        that.locationMarker = new fengmap.FMLocationMarker({
          // url: './static/resource/style/wedgets/img/blueImageMarker.png',
          url: '../static/resource/style/wedgets/img/pointer.png',
          //设置图片显示尺寸
          size: 13,
          //设置图片高度，默认是5
          height: 2,
          callback: function () {
            // 设置LocationMarker的，初始方向
            that.locationMarker.direction = -90;
          }
        });

        map.addLocationMarker(that.locationMarker);
        that.locationMarker.setPosition({
          //设置定位点的x坐标
          x: coord.x,
          //设置定位点的y坐标
          y: coord.y,
          //设置定位点所在楼层
          groupID: that.defaultGroupID,
          //设置定位点的高于楼层多少
          zOffset: 1,
        });
      }


    },

    methods: {
      drawNaviRoute(){
        let currentPos = this.currentPos, targetPos = this.targetPos;
        this.navi.clearAll();
        console.log("调用了methods中路线规划的方法");
        if(!currentPos.x || !currentPos.y || !targetPos.y || !targetPos.y){
          return Toast("坐标点无效，请重新选择");
        }
        this.navi.setStartPoint({
          x: currentPos.x,
          y: currentPos.y,
          height: 2,
          groupID: currentPos.groupId,
          url: '../static/resource/style/wedgets/img/start.png',
          size: 32
        });
        this.navi.setEndPoint({
          x: targetPos.x,
          y: targetPos.y,
          // x:11879306.33,
          // y: 3071623.185,
          height: 2,
          groupID: targetPos.groupId,
          url: '../static/resource/style/wedgets/img/end.png',
          size: 32
        });
        if(this.navi.combinePoints.length < 1){
          return Toast("当前起点和终点之间没有路线，请重新选择");
        }
        // this.navi.drawNaviLine();
        this.navi.simulate();
      },
      onSelect(item) {
        // 点击选项时默认不会关闭菜单，可以手动关闭
        this.showActionSheet = false;
        if (item.key === 'A') {

        }
      },
      onCancel() {

      },
      onClickRight() {
        this.showActionSheet = !this.showActionSheet;
      },
      closePop() {
        this.$emit('closePop')
      },
      //移动位置坐标的方法
      moveTo(coord) {
        //改变locMarker的x值
        this.locationMarker.x = coord.x;
        //改变locMarker的y值
        this.locationMarker.y = coord.y;
        this.map.moveTo({
          //改变中心点x的位置
          x: coord.x,
          //改变中心点y的位置
          y: coord.y,
          //默认时间是0.3秒
          time: 1,
          callback: function () {
            // console.log('moveTo Complete!');
          }
        });
      }
  }
  }
</script>

<style scoped lang="scss">
  .main {
    @include scroll-div();
    top: 45px;
  }

  #map-container {
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>
