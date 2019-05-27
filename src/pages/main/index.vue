<template> 
  <div style="position:relative;padding-bottom:60rpx;">
    <div class="search-container">
      <input class="search" placeholder-style="font-size:14px;font-family:'thin';" @focus="searchFocus" placeholder="请输入搜索单词" type="text">
    </div>
    <div :class="[{'max-height':isCreate} ,'page-container']">
      <div @click="cancelCreate" v-if="isCreate" class="remove">
        <Icon icon="circle-cross"></Icon>
      </div>
      <div v-if="!isCreate" class="num-container">
        <div class="main-num">{{taskNum}}</div>
        <div class="explain">Cards to memorize</div>
        <div class="total">Total cards: {{totalNum}}</div>
      </div>
      <div v-if="!isCreate" class="add-container" @click="addCard">
        <Icon icon="add"></Icon>自定义卡片
      </div>

      <div v-if="isCreate" class="add-tip">卡片正面媒体</div>
      <div v-if="isCreate" class="media-container">
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
          <Icon :icon="pauseRecord?'start':'pause'" size="mid"></Icon>
        </button>
        <button @click="cancelRecord">
          <Icon icon="cross" size="mid"></Icon>
        </button>
      </div>
      <div v-if="realRecordPath" class="existRecord">
        录音1 长度:{{recordDuration1}}
        <div @click="deleteRecord(1)" style="display:flex;justify-content:center;">
          <Icon icon="cross-white" size="mini"></Icon>
        </div>
      </div>
      <div v-if="isCreate&&realPath" class="img-preview">
        <image class="preview" :src="realPath" mode="widthFill"></image>
      </div>
      <div v-if="isCreate" class="add-tip">卡片正面文字
        <div class="font-num">{{frontWord.length}}/80</div>
      </div>
      <div v-if="isCreate" class="front">
        <textarea v-model="frontWord" class="front-input" cols="10" rows="3" maxlength="80"></textarea>
      </div>
      <div v-if="isCreate" class="add-tip">卡片背面媒体</div>
      <!-- <div v-if="isCreate&&!realPath2" @click="uploadImg2" class="img-container">
        <Icon icon="add1"></Icon>
      </div> -->
      <div v-if="isCreate" class="media-container">
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
          <Icon :icon="pauseRecord?'start':'pause'" size="mid"></Icon>
        </button>
        <button @click="cancelRecord2">
          <Icon icon="cross" size="mid"></Icon>
        </button>
      </div>
      <div v-if="realRecordPath2" class="existRecord">
        录音2 长度:{{recordDuration2}}
        <div @click="deleteRecord(2)" style="display:flex;justify-content:center;">
          <Icon icon="cross-white" size="mini"></Icon>
        </div>
      </div>
      <div v-if="isCreate&&realPath" @click="uploadImg" class="img-preview">
        <image class="preview" :src="realPath" mode="widthFill"></image>
      </div>
      <div v-if="isCreate" class="add-tip">卡片背面文字
        <div class="font-num">{{backWord.length}}/80</div>
      </div>
      <div v-if="isCreate" class="front">
        <textarea v-model="backWord" class="front-input" cols="10" rows="3" maxlength="80"></textarea>
      </div>
      <div v-if="isCreate" @click="submitCard" class="submit-container">
        <button class="submit">create</button>
      </div>
    </div>
    <div v-if="!isCreate" class="btn-container">
      <button @click="begin" class="begin">开 始</button>
    </div>
  </div>
  
</template>

<script>
import Icon from '@/components/Icon'
import config from '@/config'
export default {
  data () {
    return {
      totalNum: '',
      taskNum: '',
      isCreate: false,
      // 七牛云token
      QiniuToken: '',
      // 图片临时本地地址
      tempPath: '',
      // 图片的七牛云地址
      realPath: '',
      realPath2: '',
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
      // 七牛云录音地址1
      realRecordPath: '',
      // 七牛云录音地址2
      realRecordPath2: '',
      // 是否准备上传录音
      ready2uploadRec: false,
      // 是否准备上传录音2
      ready2uploadRec2: false,
      // 录音1的长度
      recordDuration1: '',
      // 录音2的长度
      recordDuration2: ''
    }
  },
  components: {
    Icon
  },
  computed: {
  },
  onShow () {
    // this.realPath = ''
    // this.realPath2 = ''
    this.getNum()
  },
  watch: {
    // isCreate (newValue, oldValue) {
    //   if (newValue) {
    //     this.realPath = ''
    //     this.realPath2 = ''
    //   }
    // }
  },
  methods: {
    // 删除录音
    deleteRecord (num) {
      if (num === 1) {
        console.log('删除录音1')
        this.realRecordPath = ''
        this.recordDuration1 = ''
      } else {
        console.log('删除录音2')
        this.realRecordPath2 = ''
        this.recordDuration2 = ''
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
    // 提交卡片
    async submitCard () {
      if (!this.frontWord || !this.backWord) {
        this.$message.warning('请输入完整信息')
        return
      }
      wx.showLoading({
        title: '添加卡片中...'
      })
      const openId = wx.getStorageSync('userInfo').openId
      const res = await this.$request(`${config.host}/word/addCard`, 'POST', {
        openId,
        isFree: 0,
        img: this.realPath,
        img2: this.realPath2,
        freeFront: this.frontWord,
        freeBack: this.backWord
      })
      wx.hideLoading()
      if (res.success) {
        this.$message.success('添加卡片成功!')
        this.cancelCreate()
      }
    },
    // 取消创建
    cancelCreate () {
      this.isCreate = false
      this.backWord = ''
      this.frontWord = ''
      this.realPath = ''
      this.realPath2 = ''
    },
    // 获取七牛云临时token
    async getToken () {
      const res = await this.$request(`${config.host}/getQnToken`)
      this.QiniuToken = res.token
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
            that.realRecordPath = `${config.imgHost}/${JSON.parse(res.data).key}`
          } else {
            that.realRecordPath2 = `${config.imgHost}/${JSON.parse(res.data).key}`
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
            that.realPath = `${config.imgHost}/${JSON.parse(res.data).key}`
          } else {
            that.realPath2 = `${config.imgHost}/${JSON.parse(res.data).key}`
          }
        }
      })
    },
    // 上传图片
    uploadImg () {
      let that = this
      wx.chooseImage({
        count: 2,
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
        count: 2,
        size: ['original'],
        sourceType: ['album', 'camera'],
        success (res) {
          that.tempPath = res.tempFilePaths[0]
          that.uploadImgToQiniu(2)
        }
      })
    },
    // 点击添加自定义卡片
    addCard () {
      this.isCreate = true
    },
    // 点击开始学习
    begin () {
      wx.navigateTo({
        url: '/pages/remember/main'
      })
    },
    searchFocus () {
      wx.navigateTo({
        url: '/pages/search/main'
      })
    },
    // 获取卡片数量信息
    async getNum () {
      wx.showNavigationBarLoading()
      const openId = await wx.getStorageSync('userInfo').openId
      const res = await this.$request(`${config.host}/word/getTaskNum?openId=${openId}`)
      console.log(res)
      this.totalNum = res.totalNum
      this.taskNum = res.taskNum
      setTimeout(() => {
        wx.hideNavigationBarLoading()
      }, 500)
    }
    // async getTask () {
    //   wx.showNavigationBarLoading()
    //   const openId = await wx.getStorageSync('userInfo').openId
    //   const res = await this.$request(`${config.host}/word/getMyTask?openId=${openId}`)
    //   this.task = res.cards
    //   setTimeout(() => {
    //     wx.hideNavigationBarLoading()
    //   }, 500)
    // }
  },
  mounted () {
    wx.showShareMenu({
      withShareTicket: true
    })
    // 获取卡片数量
    this.getNum()
    // 获取七牛云token
    this.getToken()
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
        this.recordDuration1 = `${Math.ceil(res.duration / 1000)}s`
        this.uploadRecordToQiniu(1)
      } else if (this.ready2uploadRec2) {
        this.recordDuration2 = `${Math.ceil(res.duration / 1000)}s`
        this.uploadRecordToQiniu(2)
      }
    })
    // recorderManager.onFrameRecorded((res) => {
    //   const { frameBuffer } = res
    //   console.log('frameBuffer.byteLength', frameBuffer.byteLength)
    // })
    this.recorderManager = recorderManager
    wx.loadFontFace({
      family: 'worksans',
      source: 'url("https://img.xhfkindergarten.cn/WorkSans-Thin.woff.ttf")'
    })
    // await wx.loadFontFace({
    //   family: 'comfortaBold',
    //   source: 'url("https://img.xhfkindergarten.cn/ComfortaBold")'
    // })
    wx.loadFontFace({
      family: 'Bold',
      source: 'url("https://img.xhfkindergarten.cn/ADAM.CG%20PRO.otf")'
    })
  },
  // 下拉刷新事件
  onPullDownRefresh () {
    this.getNum()
  }
  // async onPullDownRefresh () {
  //   wx.stopPullDownRefresh()
  // },
  // onReachBottom () {
  //   console.log('refresh')
  // }
}
</script>

<style lang="less" scoped>
.existRecord {
  font-size: 32rpx;
  color: #FFF;
  display: flex;
  justify-content: space-between;
  text-align: left;
  line-height: 60rpx;
  width: 400rpx;
  padding: 0 30rpx;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 30rpx;
  height: 60rpx;
}
.record-tip{
  padding: 30rpx 0;
  width: 400rpx;
  border-radius: 40rpx;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: space-around;
  button{
    background-color: rgba(0, 0, 0, 0)
  }
}
.search-container{
  padding: 0 40rpx;
  position: absolute;
  top:0;
  margin: 20rpx 0;
  width: 90%;
  text-align: center;
  .search{
    font-size: 32rpx;
    padding: 0 40rpx;
    height: 70rpx;
    border-radius: 35rpx;
    background: #EEE;
  }
  .button{
    display: absolute;
    right: 0;
    width: 40rpx;
    height: 40rpx;
  }
}
.max-height{
  height:1800rpx !important;
  justify-content: flex-start;
} 
.page-container{
  transition: all 0.2s;
  height: 700rpx;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 200rpx 40rpx 100rpx;
  background: #e6e5e3;
  border-bottom-left-radius: 100rpx;
  border-bottom-right-radius: 100rpx;
  .remove{
    width: 60rpx;
    height: 60rpx;
    position: absolute;
    left: 30rpx;
    top: 120rpx;
  }
  .img-container{
    width: 300rpx;
    height: 300rpx;
    border: 3px #999 dashed;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20rpx 0;
  }
  .img-preview{
    width: 420rpx;
    height: 280rpx;
    overflow: hidden;
    .preview{
      // display: inline;
      width: 420rpx;
      border-radius: 20rpx;
    }
  }
  .img-tip{
    width: 60%;
    text-align: center;
    margin: 20rpx 0;
    font-size: 28rpx;
    color: #64656a;
  }
  .media-container{
    width: 400rpx;
    display: flex;
    justify-content: space-around;
    margin: 30rpx 0;
  }
  .add-tip{
    margin: 20rpx;
    font-size: 32rpx;
    width: 60%;
    text-align: left;
    
    .font-num{
      display: inline-block;
      // float: right;
      font-size: 28rpx;
      color: #64656a;
    }
  }
  .front{
    .front-input{
      background: #EEE;
      height: 200rpx;
      padding: 30rpx;
      font-size: 28rpx;
      border-radius: 10rpx;
      width: 400rpx;
    }
  }
  .submit-container{
    margin-top: 60rpx;
    width: 430rpx;
    .submit{
      width: 100%;
      height: 100rpx;
      border-radius: 50rpx;
      color: #fff;
      background: #587AA5;
      line-height: 100rpx;
    }
  }
  .add-container{
    margin-top: 100rpx;
    font-family: 'thin';
    line-height: 80rpx;
  }
  @keyframes slowup {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .num-container{
    animation: slowup 1s ease-in-out forwards;
    width: 80%;
    height: 400rpx;
    margin-top: 40rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .main-num{
      font-size: 200rpx;
      font-family: 'Bold',
    }
    .explain{
      color: #64656a;
      font-size: 40rpx;
      font-family: 'Bold'
    }
    .total{
      margin-top: 60rpx;
      font-size: 36rpx;
      font-family: 'worksans';
      color: #64656a;
    }
  }
}
.btn-container{
  margin: 100rpx 0;
  width: 100%;
  height: 100rpx;
  display:flex;
  justify-content: center;
  .begin{
    line-height: 100rpx;
    font-family: 'begin';
    color: #fff;
    width: 200rpx;
    height: 100rpx;
    border-radius: 50rpx;
    background: #6497D7;
  }
}
@font-face {font-family: 'thin';
  src: url('//at.alicdn.com/t/webfont_v5c3x1vcokc.eot'); /* IE9*/
  src: url('//at.alicdn.com/t/webfont_v5c3x1vcokc.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('//at.alicdn.com/t/webfont_v5c3x1vcokc.woff') format('woff'), /* chrome、firefox */
  url('//at.alicdn.com/t/webfont_v5c3x1vcokc.ttf') format('truetype'), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
  url('//at.alicdn.com/t/webfont_v5c3x1vcokc.svg#思源黑体-极细') format('svg'); /* iOS 4.1- */
}
@font-face {font-family: 'begin';
  src: url('//at.alicdn.com/t/webfont_prwjwi2tk2.eot'); /* IE9*/
  src: url('//at.alicdn.com/t/webfont_prwjwi2tk2.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('//at.alicdn.com/t/webfont_prwjwi2tk2.woff') format('woff'), /* chrome、firefox */
  url('//at.alicdn.com/t/webfont_prwjwi2tk2.ttf') format('truetype'), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
  url('//at.alicdn.com/t/webfont_prwjwi2tk2.svg#NotoSansHans-Black') format('svg'); /* iOS 4.1- */
}
</style>
