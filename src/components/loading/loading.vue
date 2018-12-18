<template>
  <div class="loading">
    <img src="./loading.gif" width="24" height="24">
    <p>{{text}}</p>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '加载中...'
    }
  }
}
</script>

<style lang="scss" scoped>

.loading {
  width: 100%;
  height: auto;
  text-align: center;
  img {
    margin-top: 10px;
  }
  p{
    padding: 10px 0;
    font-size: $text-ss;
  }
}
</style>
