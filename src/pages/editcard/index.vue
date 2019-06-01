<template>
  <div class="page-container">
    <div class="add-tip" style="margin-top:50rpx">{{cardInfo.isFree===0?'卡片标题':'问题标题'}}</div>
    <div class="title-container">
      <input type="text" v-model="cardInfo.title">
    </div>
    <div class="add-tip">{{cardInfo.isFree===0?'正面媒体':'问题媒体'}}</div>
    <div class="media-container">
      <div @click="beginRecord">
        <Icon icon="mic"></Icon>
      </div>
      <div @click="uploadImg">
        <Icon icon="image"></Icon>
      </div>
    </div>
    <div v-if="isRecording" class="record-tip">
      <button @click="stopRecord">
        <Icon icon="dot-red" size="mid"></Icon>
      </button>
      <button @click="toggleRecord">
        <Icon :icon="pauseRecord?'start-white':'pause'" size="mid"></Icon>
      </button>
      <button @click="cancelRecord">
        <Icon icon="cross" size="mid"></Icon>
      </button>
    </div>
    <div v-if="cardInfo.rec1" :class="['existRecord',{'red-bg':isReadingRec1}]" @click="readAudio(1)">
      录音1
      <div @click.stop="deleteRecord(1)" style="display:flex;justify-content:center;">
        <Icon icon="cross-white" size="mini"></Icon>
      </div>
    </div>
    <div v-if="cardInfo.img" class="img-preview">
      <div @click="removeImg(1)" class="removeimg">
        <Icon icon="cross-white" size="mini"></Icon>
      </div>
      <image class="preview" :src="cardInfo.img" mode="aspectFill"></image>
    </div>
    <div class="add-tip">{{cardInfo.isFree===0?'正面文字':'问题描述'}}
      <div v-if="cardInfo.freeFront" class="font-num">{{cardInfo.freeFront.length}}/80</div>
    </div>
    <div class="front">
      <textarea v-model="cardInfo.freeFront" class="front-input" maxlength="80"></textarea>
    </div>
    <div class="add-tip">{{cardInfo.isFree===0?'背面媒体':'答案媒体'}}</div>
    <div class="media-container">
      <div @click="beginRecord2">
        <Icon icon="mic"></Icon>
      </div>
      <div @click="uploadImg2">
        <Icon icon="image"></Icon>
      </div>
    </div>
    <div v-if="isRecording2" class="record-tip">
      <button @click="stopRecord2">
        <Icon icon="dot-red" size="mid"></Icon>
      </button>
      <button @click="toggleRecord">
        <Icon :icon="pauseRecord?'start-white':'pause'" size="mid"></Icon>
      </button>
      <button @click="cancelRecord2">
        <Icon icon="cross" size="mid"></Icon>
      </button>
    </div>
    <div v-if="cardInfo.rec2" :class="['existRecord',{'red-bg':isReadingRec2}]" @click="readAudio(2)">
      录音2
      <div @click.stop="deleteRecord(2)" style="display:flex;justify-content:center;">
        <Icon icon="cross-white" size="mini"></Icon>
      </div>
    </div>
    <div v-if="cardInfo.img2" @click="uploadImg" class="img-preview">
      <div @click="removeImg(2)" class="removeimg">
        <Icon icon="cross-white" size="mini"></Icon>
      </div>
      <image class="preview" :src="cardInfo.img2" mode="aspectFill"></image>
    </div>
    <div class="add-tip">{{cardInfo.isFree===0?'背面文字':'答案描述'}}
      <div v-if="cardInfo.freeBack" class="font-num">{{cardInfo.freeBack.length}}/80</div>
    </div>
    <div class="front">
      <textarea v-model="cardInfo.freeBack" class="front-input" cols="10" rows="3" maxlength="80"></textarea>
    </div>
    <div class="switch" v-if="cardInfo.isFree===0">
      是否开启随机正反面<switch :checked="randomSide" color="#587AA5" @change="toggleRandom"></switch>
    </div>
    <div class="btn-container">
      <button @click="updateCard" class="update">update</button>
      <button @click="deleteCard" class="delete">delete</button>
    </div>
  </div>
</template>

<script>
import config from '@/config'
import Icon from '@/components/Icon'
export default {
  data () {
    return {
      // 卡片id
      id: '',
      // 卡片信息
      cardInfo: '',
      // 七牛云token
      QiniuToken: '',
      // 图片临时本地地址
      tempPath: '',
      // 图片的七牛云地址
      // realPath: 'https://img.xhfkindergarten.cn/1559030566938',
      // realPath2: '',
      // 卡片前面的文字
      frontWord: '',
      // 卡片背面文字
      backWord: '',
      // 是否正在录音
      isRecording: false,
      isRecording2: false,
      // 录音的临时存储地址
      recordTempPath: '',
      // 是否暂停录音
      pauseRecord: false,
      // recorderManager实例
      recorderManager: '',
      // // 七牛云录音地址1
      // realRecordPath: '11',
      // // 七牛云录音地址2
      // realRecordPath2: '',
      // 是否准备上传录音
      ready2uploadRec: false,
      // 是否准备上传录音2
      ready2uploadRec2: false,
      // // 录音1的长度
      // recordDuration1: '11',
      // // 录音2的长度
      // recordDuration2: ''
      // 音频实例
      audioContext1: '',
      audioContext2: '',
      // 是否暂停
      isReadingRec1: false,
      isReadingRec2: false,
      randomSide: false
    }
  },
  components: {
    Icon
  },
  computed: {

  },
  methods: {
    toggleRandom (e) {
      if (e.target.value) {
        this.randomSide = true
      } else {
        this.randomSide = false
      }
    },
    // 更新卡片
    async updateCard () {
      const params = {
        id: this.cardInfo.id,
        img: this.cardInfo.img,
        img2: this.cardInfo.img2,
        rec1: this.cardInfo.rec1,
        rec2: this.cardInfo.rec2,
        freeFront: this.cardInfo.freeFront,
        freeBack: this.cardInfo.freeBack,
        randomSide: this.randomSide ? 0 : 1
      }
      wx.showLoading({
        title: '上传ing'
      })
      const res = await this.$request(`${config.host}/word/updateCard`, 'POST', params)
      console.log(res)
      wx.hideLoading()
      if (res.success) {
        this.$message.success('更新成功', 1000)
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      }
    },
    async deleteCard () {
      const that = this
      wx.showModal({
        title: 'info',
        content: '删除后卡片不可恢复,请问是否删除？',
        success: async res => {
          if (res.confirm) {
            const res1 = await that.$request(`${config.host}/word/deleteCard?id=${this.cardInfo.id}`)
            if (res1.success) {
              this.$message.success('删除成功', 1000)
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            }
          }
        }
      })
    },
    // 播放录音
    readAudio (num) {
      if (num === 1) {
        if (this.isReadingRec2) {
          return
        }
        if (!this.audioContext1) {
          wx.showLoading({
            title: '咳咳..'
          })
          // 创建音频实例
          this.audioContext1 = wx.createInnerAudioContext()
          this.audioContext1.autoplay = true
          this.audioContext1.src = this.cardInfo.rec1
          this.audioContext1.onPlay(() => {
            this.isReadingRec1 = true
            // 播放时执行
            wx.hideLoading()
            console.log('开始播放')
          })
          this.audioContext1.onPause(() => {
            this.isReadingRec1 = false
            console.log('暂停')
          })
          this.audioContext1.onEnded(() => {
            this.isReadingRec1 = false
            console.log('音频播放结束')
            this.audioContext = ''
          })
          this.audioContext1.onError((res) => {
            this.$message.error(res)
          })
        } else if (this.audioContext1 && this.audioContext1.paused) {
          // 如果有音频实例且正在暂停状态
          this.audioContext1.play()
        } else {
          this.audioContext1.pause()
        }
      } else {
        if (this.isReadingRec1) {
          return
        }
        if (!this.audioContext2) {
          wx.showLoading({
            title: '咳咳..'
          })
          // 创建音频实例
          this.audioContext2 = wx.createInnerAudioContext()
          this.audioContext2.autoplay = true
          this.audioContext2.src = this.cardInfo.rec2
          this.audioContext2.onPlay(() => {
            // 播放时执行
            this.isReadingRec2 = true
            wx.hideLoading()
            console.log('开始播放')
          })
          this.audioContext2.onPause(() => {
            this.isReadingRec2 = false
            console.log('暂停')
          })
          this.audioContext2.onEnded(() => {
            console.log('音频播放结束')
            this.isReadingRec2 = ''
          })
          this.audioContext2.onError((res) => {
            this.$message.error(res)
          })
        } else if (this.audioContext2 && this.audioContext2.paused) {
          // 如果有音频实例且正在暂停状态
          this.audioContext2.play()
        } else {
          this.audioContext2.pause()
        }
      }
    },
    // 图片上传到七牛云
    uploadImgToQiniu (num) {
      let that = this
      const key = new Date().getTime()
      wx.showLoading({
        title: '上传图片ing'
      })
      console.log('upload qiniu', that.tempPath)
      console.log('token', that.QiniuToken)
      wx.uploadFile({
        url: 'https://up-z2.qiniup.com',
        name: 'file',
        filePath: that.tempPath,
        header: {
          'Content-Type': 'multipart/form-data'
        },
        formData: {
          token: that.QiniuToken,
          key
        },
        success: function (res) {
          that.tempPath = ''
          wx.hideLoading()
          if (num === 1) {
            that.cardInfo.img = `${config.imgHost}/${JSON.parse(res.data).key}`
          } else {
            that.cardInfo.img2 = `${config.imgHost}/${JSON.parse(res.data).key}`
          }
        }
      })
    },
    // 上传图片
    uploadImg () {
      let that = this
      wx.chooseImage({
        count: 1,
        size: ['original'],
        sourceType: ['album', 'camera'],
        success (res) {
          that.tempPath = res.tempFilePaths[0]
          that.uploadImgToQiniu(1)
        }
      })
    },
    // 上传图片
    uploadImg2 () {
      let that = this
      wx.chooseImage({
        count: 1,
        size: ['original'],
        sourceType: ['album', 'camera'],
        success (res) {
          that.tempPath = res.tempFilePaths[0]
          that.uploadImgToQiniu(2)
        }
      })
    },
    // 删除图片
    removeImg (num) {
      if (num === 1) {
        this.cardInfo.img = ''
      } else {
        this.cardInfo.img2 = ''
      }
    },
    // 删除录音
    deleteRecord (num) {
      if (num === 1) {
        console.log('删除录音1')
        this.cardInfo.rec1 = ''
        // this.recordDuration1 = ''
      } else {
        console.log('删除录音2')
        this.cardInfo.rec12 = ''
        // this.recordDuration2 = ''
      }
    },
    // 暂停/重新开始录音
    toggleRecord () {
      console.log('toggle')
      if (this.pauseRecord) {
        // 如果是暂停
        this.recorderManager.resume()
        this.pauseRecord = false
      } else {
        // 如果正在录音
        this.recorderManager.pause()
        this.pauseRecord = true
      }
    },
    // 取消录音
    cancelRecord () {
      this.isRecording = false
      this.pauseRecord = false
      console.log('取消录音')
      this.recorderManager.stop()
    },
    // 取消录音2
    cancelRecord2 () {
      this.isRecording2 = false
      this.pauseRecord = false
      console.log('取消录音')
      this.recorderManager.stop()
    },
    // 完成录音
    stopRecord () {
      this.isRecording = false
      this.pauseRecord = false
      this.ready2uploadRec = true
      this.recorderManager.stop()
    },
    // 完成录音2
    stopRecord2 () {
      this.isRecording2 = false
      this.pauseRecord = false
      this.ready2uploadRec2 = true
      this.recorderManager.stop()
    },
    // 开始录音
    beginRecord () {
      if (this.isRecording) {
        return
      }
      this.isRecording = true
      const options = {
        sampleRate: 44100,
        numberOfChannels: 1,
        encodeBitRate: 192000,
        format: 'mp3'
        // frameSize: 50
      }
      this.recorderManager.start(options)
    },
    // 开始录音2
    beginRecord2 () {
      if (this.isRecording) {
        return
      }
      this.isRecording2 = true
      const options = {
        sampleRate: 44100,
        numberOfChannels: 1,
        encodeBitRate: 192000,
        format: 'mp3'
        // frameSize: 50
      }
      this.recorderManager.start(options)
    },
    // 获取卡片所有信息
    async getCardInfo () {
      const res = await this.$request(`${config.host}/word/oneCard?id=${this.id}`)
      this.cardInfo = res.card
    },
    // 录音上传到七牛云
    uploadRecordToQiniu (num) {
      let that = this
      const key = `audio${new Date().getTime()}`
      wx.showLoading({
        title: '上传录音ing'
      })
      console.log('tempPath', that.recordTempPath)
      wx.uploadFile({
        url: 'https://up-z2.qiniup.com',
        name: 'file',
        filePath: that.recordTempPath,
        header: {
          'Content-Type': 'multipart/form-data'
        },
        formData: {
          token: that.QiniuToken,
          key
        },
        success: function (res) {
          that.recordTempPath = ''
          wx.hideLoading()
          that.$message.success('上传音频成功', 800)
          console.log('num', num)
          if (num === 1) {
            that.cardInfo.rec1 = `${config.imgHost}/${JSON.parse(res.data).key}`
          } else {
            that.cardInfo.rec2 = `${config.imgHost}/${JSON.parse(res.data).key}`
          }
          that.ready2uploadRec = false
          that.ready2uploadRec2 = false
        },
        fail: function (err) {
          console.log(err)
          wx.hideLoading()
        }
      })
    },
    // 新建录音实例
    createAudioManager () {
      // 新建录音实例
      const recorderManager = wx.getRecorderManager()
      // 开始事件
      recorderManager.onStart(() => {
        console.log('recorder start')
      })
      // 暂停事件
      recorderManager.onPause(() => {
        console.log('recorder pause')
      })
      // 重新开始录音事件
      recorderManager.onResume(() => {
        console.log('recorder resume')
      })
      // 错误事件
      recorderManager.onError((err) => {
        console.log('recorder err', err)
      })
      // 结束事件
      recorderManager.onStop((res) => {
        console.log('recorder stop', res)
        const { tempFilePath } = res
        console.log('tempFIlePath', tempFilePath)
        this.recordTempPath = tempFilePath
        if (this.ready2uploadRec) {
          // this.recordDuration1 = `${Math.ceil(res.duration / 1000)}s`
          this.uploadRecordToQiniu(1)
        } else if (this.ready2uploadRec2) {
          // this.recordDuration2 = `${Math.ceil(res.duration / 1000)}s`
          this.uploadRecordToQiniu(2)
        }
      })
      // recorderManager.onFrameRecorded((res) => {
      //   const { frameBuffer } = res
      //   console.log('frameBuffer.byteLength', frameBuffer.byteLength)
      // })
      this.recorderManager = recorderManager
    },
    // 获取七牛云临时token
    async getToken () {
      const res = await this.$request(`${config.host}/getQnToken`)
      this.QiniuToken = res.token
    }
  },
  onLoad (option) {
    this.id = option.id
  },
  watch: {
    cardInfo (newValue, oldValue) {
      console.log('cardInfo change', newValue)
    }
  },
  async mounted () {
    this.cardInfo = ''
    await this.getCardInfo()
    await this.createAudioManager()
    await this.getToken()
    if (this.cardInfo.randomSide === 0) {
      this.randomSide = true
    } else {
      this.randomSide = false
    }
  }
  // onShow () {
  //   this.cardInfo = ''
  // }
  // onHide () {
  //   console.log('onHide')
  // }
}
</script>
<style lang="less" scoped>
.red-bg{
  background: red !important;
}
.page-container{
  padding-bottom: 60rpx;
  min-height: 100vh;
  background: #F6F6F6;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  .btn-container{
    display: flex;
    flex-direction: column;
    .update{
      margin: 30rpx 0;
      width: 500rpx;
      height: 80rpx;
      border-radius: 40rpx;
      background: #6497D7;
      font-size: 40rpx;
      font-weight: bold;
      line-height: 80rpx;
      color: #fff;
    }
    .delete{
      margin: 30rpx 0;
      width: 500rpx;
      height: 80rpx;
      border-radius: 40rpx;
      background: red;
      font-weight: bold;
      font-size: 40rpx;
      color: #FFF;
      line-height: 80rpx;
    }
  }
  .front{
    .front-input{
      background: #EEE;
      height: 200rpx;
      padding: 30rpx;
      font-size: 28rpx;
      border-radius: 10rpx;
      width: 460rpx;
    }
  }
  .switch{
    padding: 60rpx;
    font-size: 34rpx;
    width: 500rpx;
    text-align: left;
  }
  .img-preview{
    margin: 30rpx 0;
    width: 520rpx;
    height: 280rpx;
    overflow: hidden;
    position: relative;
    .preview{
      // display: inline;
      width: 520rpx;
      border-radius: 20rpx;
    }
    .removeimg{
      position: absolute;
      right: 20rpx;
      top:20rpx;
    }
  }
  .existRecord {
    font-size: 32rpx;
    color: #FFF;
    display: flex;
    justify-content: space-between;
    text-align: left;
    line-height: 60rpx;
    width: 500rpx;
    padding: 0 30rpx;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 30rpx;
    height: 60rpx;
  }
  .record-tip{
    margin-bottom: 30rpx;
    padding: 30rpx 0;
    width: 500rpx;
    border-radius: 40rpx;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: space-around;
    button{
      background-color: rgba(0, 0, 0, 0)
    }
  }
  .media-container{
    width: 500rpx;
    display: flex;
    justify-content: space-around;
    margin: 30rpx 0;
  }
  .title-container{
    width: 560rpx;
    input{
      width: 500rpx;
      height: 80rpx;
      padding: 5rpx 30rpx;
      border-radius: 45rpx;
      font-size: 34rpx;
      background: #EEE;
    }
  }
  .add-tip{
    padding: 20rpx;
    font-size: 34rpx;
    width: 500rpx;
    text-align: left;
    // margin-top: 60rpx;
    .font-num{
      display: inline-block;
      float: right;
      font-size: 28rpx;
      color: #64656a;
    }
  }
}
</style>



