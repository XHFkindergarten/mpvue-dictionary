<template>
  <div class="card-container" @click="changeSide">
    <div class="pic-container">
      <image class="pic" :src="wordInfo.img" mode="aspectFill"></image>
    </div>
    <div class="content-container">
      <div class="frontword" v-if="cardSide">{{wordInfo.freeFront}}</div>
      <div class="backword" v-else>{{wordInfo.freeBack}}</div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 展示图片
      picUrl: '',
      // 卡片的正反面
      cardSide: false
    }
  },
  props: [
    'wordInfo'
  ],
  methods: {
    changeSide () {
      this.cardSide = !this.cardSide
    }
  }
}
</script>
<style lang="less" scoped>
.card-container{
  margin-top: 30rpx;
  height: auto;
  width: 100%;
  border-radius: 60rpx;
  overflow: hidden;
  .pic-container{
    overflow: hidden;
    height: 400rpx;
    width: 100%;
    .pic{
      min-height: 100%;
      width: 100%;
      // object-fit: scale-down;
    }
  }
  .content-container{
    padding: 30rpx 30rpx 60rpx;
    font-size: 32rpx;
    background: #F6F6F6;
    width: 100%;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    .frontword{
      width: 90%;
      margin: 10rpx 0;
      color: #8A8A8A;
      word-wrap: break-word;
    }
    .backword{
      width: 90%;
      margin: 10rpx 0;
      color: #8A8A8A;
      word-wrap: break-word;
    }
  }
}
</style>
