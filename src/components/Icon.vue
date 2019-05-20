<template>
  <div class="icon-container">
    <img
      :class="size"
      :src="'/static/icon/'+icon+'.png'">
  </div>
</template>
<script>
export default {
  props: {
    icon: {
      required: true
    },
    size: {
      default: 'mid'
    }
  }
}
</script>
<style lang="less" scoped>
.icon-container{
  display: flex;
  justify-content: center;
  align-items: center;
  .mid{
    height:60rpx;
    width: 60rpx;
  }
  .mini{
    height: 30rpx;
    width: 30rpx;
  }
}
</style>
