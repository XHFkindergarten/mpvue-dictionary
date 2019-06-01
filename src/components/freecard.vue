<template>
  <div class="card-container" @click="changeSide">
    <div v-if="(cardSide&&wordInfo.rec1)||(!cardSide&&wordInfo.rec2)" @click.stop="readRec" class="rec-container">
      <Icon v-if="!isReading" icon="start" size="mid"></Icon>
      <Icon v-else icon="start-red" size="mid"></Icon>
    </div>
    <div class="title">{{wordInfo.title}}</div>
    <div v-if="currentPic" class="pic-container" @click.stop="previewPic">
      <image class="pic" :src="currentPic" mode="aspectFit"></image>
    </div>
    <div class="content-container">
      <div class="frontword" v-if="cardSide">
        <span v-html="front"></span>
      </div>
      <div class="backword" v-else>
        <span v-html="back"></span>
      </div>
    </div>
  </div>
</template>
<script>
import Icon from '@/components/Icon'
export default {
  data () {
    return {
      // 展示图片
      picUrl: '',
      // 卡片的正反面
      cardSide: true,
      // 是否正在播放
      isReading: false
    }
  },
  components: {
    Icon
  },
  computed: {
    // 用于预览的图片数组
    pics () {
      const arr = []
      if (this.wordInfo.img) {
        arr.push(this.wordInfo.img)
      }
      if (this.wordInfo.img2) {
        arr.push(this.wordInfo.img2)
      }
      return arr
    },
    // 当前卡片页是否有图片
    currentPic () {
      if (this.cardSide && this.wordInfo.img) {
        return this.wordInfo.img
      } else if (!this.cardSide && this.wordInfo.img2) {
        return this.wordInfo.img2
      } else {
        return ''
      }
    },
    front () {
      const reg = /\n/
      return this.wordInfo.freeFront.replace(reg, '<br>')
    },
    back () {
      const reg = /\n/
      return this.wordInfo.freeBack.replace(reg, '<br>')
    }
  },
  props: [
    'wordInfo'
  ],
  methods: {
    // 播放录音
    readRec () {
      // 发出震动
      wx.vibrateShort({
        success: () => {
          console.log('震动')
        }
      })
      // 创建音频实例
      const audio = wx.createInnerAudioContext()
      audio.autoplay = true
      audio.src = this.cardSide ? this.wordInfo.rec1 : this.wordInfo.rec2
      audio.onPlay(() => {
        this.isReading = true
        wx.hideLoading()
        // 播放时执行
        console.log('播放suc1')
      })
      audio.onError((res) => {
        wx.hideLoading()
        this.$message.error(res)
      })
      audio.onEnded(() => {
        this.isReading = false
      })
    },
    previewPic () {
      this.$store.previewImg = true
      wx.previewImage({
        current: this.currentPic,
        urls: this.pics
      })
    },
    changeSide () {
      this.cardSide = !this.cardSide
    }
  },
  mounted () {
    this.$store.previewImg = false
    if (this.wordInfo.isFree === 0 && this.wordInfo.randomSide === 0) {
      const random = Math.ceil(Math.random() * 2)
      if (random === 1) {
        this.cardSide = true
        console.log('随机显示正面')
      } else {
        this.cardSide = false
        console.log('随机显示反面')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.title{
  width: 90%;
  padding-left: 30rpx;
  margin-bottom: 30rpx;
  font-size: 40rpx;
  font-weight: bold;
  text-align: center;
}
.card-container{
  padding-bottom: 60rpx;
  padding-top: 110rpx;
  background: #F6F6F6;
  margin-top: 30rpx;
  height: auto;
  width: 100%;
  border-radius: 60rpx;
  overflow: hidden;
  position:relative;
  .rec-container{
    position: absolute;
    top: 30rpx;
    right: 60rpx;
  }
  .pic-container{
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
      color: #000;
      word-wrap: break-word;
    }
    .backword{
      width: 90%;
      margin: 10rpx 0;
      color: #000;
      word-wrap: break-word;
    }
  }
}
</style>
