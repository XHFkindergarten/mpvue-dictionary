<template>
  <div class="card-container">
    <div class="pic-container">
      <img class="pic" :src="cardInfo.img">
    </div>
    <div class="content-container">
      <div :class="[{'freeword':cardInfo.isFree===0}]">{{cardInfo.isFree===1?cardInfo.voc:cardInfo.front}}</div>
      <div class="time">{{cardInfo.countTime}}</div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {

    }
  },
  props: [
    'cardInfo'
  ],
  mounted () {
    wx.loadFontFace({
      family: 'general',
      source: 'url("https://img.xhfkindergarten.cn/PublicaPlay-Regular.otf")'
    })
  }
}
</script>
<style lang="less" scoped>
.freeword{
  font-size: 40rpx;
}
.card-container{
  margin: 60rpx;
  height: auto;
  width: 100%;
  border-radius: 60rpx;
  overflow: hidden;
  .content-container{
    padding: 30rpx 60rpx;
    font-size: 60rpx;
    background: #F6F6F6;
    font-family: 'general';
    .time{
      font-size: 36rpx;
      color: #707070;
    }
  }
  .pic-container{
    overflow: hidden;
    height: 400rpx;
    width: 100%;
    .pic{
      width: 100%;
      min-height: 100%;
      object-fit: cover;
    }
  }

}
</style>
