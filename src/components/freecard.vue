<template>
  <div class="card-container" @click="changeSide">
    <div v-if="pics.length>0" class="pic-container" @click.stop="previewPic">
      <image class="pic" :src="cardSide?pics[0]:pics[1]" mode="aspectFit"></image>
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
      cardSide: true
    }
  },
  computed: {
    pics () {
      if (!this.wordInfo.img) {
        return []
      }
      if (!this.wordInfo.img2) {
        this.wordInfo.img2 = this.wordInfo.img
      }
      return [
        this.wordInfo.img,
        this.wordInfo.img2
      ]
    }
  },
  props: [
    'wordInfo'
  ],
  methods: {
    previewPic () {
      wx.previewImage({
        current: this.cardSide ? this.pics[0] : this.pics[1],
        urls: this.pics
      })
    },
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
    background: #F6F6F6;
    overflow: hidden;
    // height: 400rpx;
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
