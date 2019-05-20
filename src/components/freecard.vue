<template>
  <div class="card-container">
    <div class="pic-container">
      <img class="pic" :src="picUrl">
    </div>
    <div class="content-container">
      <div class="font7">测试内容testcontent</div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      picUrl: 'http://img.xhfkindergarten.cn/default_label_img.jpg'
    }
  }
}
</script>
<style lang="less" scoped>
.card-container{
  margin-top: 30rpx;
  height: 800rpx;
  width: 100%;
  border-radius: 60rpx;
  overflow: hidden;
  .pic-container{
    overflow: hidden;
    height: 400rpx;
    width: 100%;
    .pic{
      object-fit: cover;
    }
  }
  .content-container{
    padding: 30rpx;
    font-size: 16px;
    background: #F6F6F6;
    height: 400rpx;
    width: 100%;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif
  }
}
</style>
