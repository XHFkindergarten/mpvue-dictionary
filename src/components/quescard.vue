<template>
  <div @click="changeSide" class="card-container">
    <div v-if="(cardSide&&wordInfo.rec1)||(!cardSide&&wordInfo.rec2)" @click.stop="readRec" class="rec-container">
      <Icon v-if="!isReading" icon="start" size="mid"></Icon>
      <Icon v-else icon="start-red" size="mid"></Icon>
    </div>
    <div class="title">{{wordInfo.title}}</div>
    <div v-if="currentPic" class="pic-container" @click.stop="previewPic">
      <image class="pic" :src="currentPic" mode="aspectFit"></image>
    </div>
    <div class="content-container">
      <div class="frontword">
        <span v-html="question"></span>
      </div>
      <div class="backword" v-if="!cardSide">
        <div class="answer" v-html="answer"></div>
        <div class="answer-tip">comparison result</div>
        <div class="compareres" v-html="res[0]"></div>
        <div style="padding:20rpx;" class="compareres" v-html="res[1]"></div>
      </div>
    </div>
    <div v-if="cardSide" class="input-container">
      <input v-model="userinput" type="text">
    </div>
    <div v-if="cardSide" class="btn-container">
      <button @click.stop="checkAns">
        <Icon icon="right-gray"></Icon>
      </button>
    </div>
    <!-- <div v-html="res[0]"></div>
    <div v-html="res[1]"></div> -->
  </div>
</template>
<script>
import compare from '../utils/compare'
import Icon from '@/components/Icon'
export default {
  data () {
    return {
      // 展示图片
      picUrl: '',
      // 卡片的正反面
      cardSide: true,
      // 是否正在播放
      isReading: false,
      // 输入的答案
      userinput: '',
      res: ''
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
    question () {
      const reg = /\n/g
      return this.wordInfo.freeFront.replace(reg, '<br>')
    },
    answer () {
      const reg = /\n/g
      return this.wordInfo.freeBack.replace(reg, '<br>')
    }
  },
  props: [
    'wordInfo'
  ],
  watch: {
    cardSide (newValue) {
      console.log(newValue)
    }
  },
  methods: {
    // 检查答案
    checkAns () {
      console.log('check answer')
      const answer = this.wordInfo.freeBack
      const input = this.userinput
      const res = compare(answer, input)
      this.res = res
      this.cardSide = false
      console.log('ok')
    },
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
      // 没有检查答案之前不能翻面
      if (!this.res || this.cardSide) {
        return
      }
      this.cardSide = !this.cardSide
    }
  },
  mounted () {
    this.$store.previewImg = false
  }
}
</script>
<style lang="less" scoped>

.title{
  text-align: center;
  width: 90%;
  padding-left: 30rpx;
  margin-bottom: 30rpx;
  font-size: 40rpx;
  font-weight: bold;
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
  .input-container{
    width: 100%;
    display: flex;
    justify-content: center;
    input{
      height: 80rpx;
      border-radius: 40rpx;
      font-size: 30rpx;
      padding: 0 30rpx;
      width: 80%;
      background: #EEE;
    }
  }
  .btn-container{
    margin-top: 30rpx;
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .content-container{
    padding: 30rpx 0 0 30rpx;
    font-size: 32rpx;
    background: #F6F6F6;
    width: 100%;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    .frontword{
      width: 90%;
      margin: 10rpx 0 30rpx;
      color: #000;
      word-wrap: break-word;
    }
    .backword{
      width: 90%;
      
      .answer{
        font-size: 34rpx;
        margin: 20rpx 0;
        color: #000;
        word-wrap: break-word;
      }
      .answer-tip{
        text-align: left;
        color: #000;
        word-wrap: break-word;
        margin: 40rpx 0 20rpx;
        color: #706F74;
      }
      .compareres{
        text-align: center;
        margin: 10rpx 0;
      }
    }
  }
}
</style>
