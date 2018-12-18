<template>
  <div class="page-container">
    <div id="map">

    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        items: [],
        pageNo: 1,
        pageSize: 12
      }
    },
    created() {
      this.loadBMapScript();
      window.goDetail = (id)=>{
        this.$router.push({
          name: 'placeDetail',
          query: {
            spotId:id
          }
        })
      }
    },
    mounted() {
      // window['bMapInit'] = () => {
      //   this.qeuryLocation();
      // };
      this.qeuryLocation();
    },
    methods: {
      loadBMapScript() {
        if(window.BMap) return
        let script = document.createElement('script');
        script.src = 'http://api.map.baidu.com/api?v=3.0&ak=uKgsNLa0CicOFy7ezOrE84WMxCasBFW9&callback=bMapInit';
        script.type = 'text/javascript';
        document.body.appendChild(script);
      },
      qeuryLocation() {
        this.$ajaxGet('/spot/getSpotList', {pageNo: this.pageNo, pageSize: this.pageSize,search:''}).then(res => {
          this.total = res.data.totalEmelents;
          this.items = res.data.content;
          let items = res.data.content;
          let map = new BMap.Map("map");
          map.centerAndZoom(new BMap.Point(items[0].lang, items[0].lat), 13);
          map.enableScrollWheelZoom();
          map.addControl(new BMap.NavigationControl());
          for (let i = 0; i < items.length; i++) {
            let marker = new BMap.Marker(new BMap.Point(items[i].lang, items[i].lat));  // 创建标注
            let opts = {
              width: 220,     // 信息窗口宽度
              height: 85,     // 信息窗口高度
              title: items[i].name, // 信息窗口标题
              enableMessage: true,//设置允许信息窗发送短息
              // offset:{width:-12,height:-12}
            };

           // let content = `<div class="info-content"><div class="right">地址：${items[i].address}<button onclick="goDetail(${items[i].id})">景点详情</button></div><img  src="${items[i].access_url}"></div>`;
           // let content = `<div class="info-content"><div class="right"><p class="address">地址：${items[i].address}</p><p class="desc" style="padding: 2px 0">简介：${items[i].introduction.substring(0,30)}...</p><button onclick="goDetail(${items[i].id})">景点详情</button></div></div>`;
            let content = `<div class="info-content"><div class="right"><p class="address">地址：${items[i].address}</p><button onclick="goDetail(${items[i].id})" style="margin-top: 5px">景点详情</button></div></div>`;
            map.addOverlay(marker);               // 将标注添加到地图中
            addClickHandler(content, opts, marker);
          }

          function addClickHandler(content, opts, marker) {
            marker.addEventListener("click", function (e) {
                openInfo(content, opts, e)
              }
            );
          }

          function openInfo(content, opts, e) {
            let p = e.target;
            let point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
            let infoWindow = new BMap.InfoWindow(content, opts);  // 创建信息窗口对象
            map.openInfoWindow(infoWindow, point); //开启信息窗口
          }

        })

      }
    }
  }
</script>

<style scoped lang="scss">

  #map {
    height: 100%;
  }

</style>
