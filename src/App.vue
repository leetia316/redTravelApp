<template>
    <div id="app">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>

<script>

  export default {
    name: 'app',
    mounted() {
    },
    methods: {

    }
  }
</script>

<style lang="scss">
  body, html {
    font-family: "Lantinghei SC", "Open Sans", Arial, "Hiragino Sans GB", STHeiti, "WenQuanYi Micro Hei", SimSun, sans-serif;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    background: $theme-background;
    color: $text-color;
  }

  @import 'common/scss/index.scss';
  #app {
    position: fixed;
    top: 0;
    height: 100%;
    width: 100%;
    overflow: hidden;
    font-size: $text-main;
  }
</style>
