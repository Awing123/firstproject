<template>
  <div class="loadingGif">
    <!-- 页面加载过渡动画 -->
    <img src="../assets/wave2.gif" />
    <p>全力加载中...</p>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.loadingGif {
  // background: #ff0000;
  // border: #888 solid 2px;
  margin-top: 60px;
  margin-bottom: 20px;
  text-align: center;
  p {
    font-size: 1px;
    color: #888;
  }
}
</style>