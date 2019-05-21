<template>
  <div class="icon-container">
    <img
      :class="size"
      :src="'/static/icon/'+icon+'.png'">
  </div>
</template>
<script>
export default {
  data () {
    return {

    }
  },
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
div{
  transition: all 0.6s;
}
.up{
  transform: rotate(0deg)
}
.down{
  transform: rotate(180deg)
}
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
  .mid-lar{
    width: 70rpx;
    height: 70rpx;
  }
}
</style>
