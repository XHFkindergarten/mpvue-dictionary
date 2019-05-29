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
      <div v-if="isCreate" class="choose-container">
        <button @click="toCommon" :class="['left-btn',{'choose-type':commonType}]">常规</button>
        <button @click="toQues" :class="['right-btn',{'choose-type':!commonType}]">问答</button>
      </div>
      <div v-if="isCreate&&commonType" class="common-card">
        <div class="add-tip">标题</div>
        <div class="title-container">
          <input type="text" v-model="title">
        </div>
        <div class="add-tip">正面媒体</div>
        <div class="media-container">
          <div @click="beginRecord(1)">
            <Icon icon="mic"></Icon>
          </div>
          <div @click="uploadImg(1)">
            <Icon icon="image"></Icon>
          </div>
        </div>
        <div v-if="isRecording" class="record-tip">
          <button @click="stopRecord(1)">
            <Icon icon="dot-red" size="mid"></Icon>
          </button>
          <button @click="toggleRecord">
            <Icon :icon="pauseRecord?'start-white':'pause'" size="mid"></Icon>
          </button>
          <button @click="cancelRecord(1)">
            <Icon icon="cross" size="mid"></Icon>
          </button>
        </div>
        <div v-if="realRecordPath" :class="['existRecord',{'red-bg':isReadingRec1}]" @click="readAudio1">
          录音1 长度:{{recordDuration1}}
          <div @click.stop="deleteRecord(1)" style="display:flex;justify-content:center;">
            <Icon icon="cross-white" size="mini"></Icon>
          </div>
        </div>
        <div v-if="isCreate&&realPath" class="img-preview">
          <div @click="removeImg(1)" class="removeimg">
            <Icon icon="cross-white" size="mini"></Icon>
          </div>
          <image class="preview" :src="realPath" mode="aspectFill"></image>
        </div>
        <div class="add-tip">正面文字
          <div class="font-num">{{frontWord.length}}/80</div>
        </div>
        <div class="front">
          <textarea v-model="frontWord" class="front-input" cols="10" rows="3" maxlength="80"></textarea>
        </div>
        <div class="add-tip">背面媒体</div>
        <!-- <div v-if="isCreate&&!realPath2" @click="uploadImg2" class="img-container">
          <Icon icon="add1"></Icon>
        </div> -->
        <div class="media-container">
          <div @click="beginRecord(2)">
            <Icon icon="mic"></Icon>
          </div>
          <div @click="uploadImg(2)">
            <Icon icon="image"></Icon>
          </div>
        </div>
        <div v-if="isRecording2" class="record-tip">
          <button @click="stopRecord(2)">
            <Icon icon="dot-red" size="mid"></Icon>
          </button>
          <button @click="toggleRecord">
            <Icon :icon="pauseRecord?'start-white':'pause'" size="mid"></Icon>
          </button>
          <button @click="cancelRecord(2)">
            <Icon icon="cross" size="mid"></Icon>
          </button>
        </div>
        <div v-if="realRecordPath2" :class="['existRecord',{'red-bg':isReadingRec2}]" @click="readAudio2">
          录音2 长度:{{recordDuration2}}
          <div @click.stop="deleteRecord(2)" style="display:flex;justify-content:center;">
            <Icon icon="cross-white" size="mini"></Icon>
          </div>
        </div>
        <div v-if="isCreate&&realPath2" class="img-preview">
          <div @click="removeImg(2)" class="removeimg">
            <Icon icon="cross-white" size="mini"></Icon>
          </div>
          <image class="preview" :src="realPath2" mode="aspectFill"></image>
        </div>
        <div class="add-tip">背面文字
          <div class="font-num">{{backWord.length}}/80</div>
        </div>
        <div class="front">
          <textarea v-model="backWord" class="front-input" cols="10" rows="3" maxlength="80"></textarea>
        </div>
        <div @click="submitCard" class="submit-container">
          <button class="submit">create</button>
        </div>
      </div>
      <div v-if="isCreate&&!commonType" class="common-card">
        <div class="add-tip">标题</div>
        <div class="title-container">
          <input type="text" v-model="title2">
        </div>
        <div class="add-tip">问题媒体</div>
        <div class="media-container">
          <div @click="beginRecord(3)">
            <Icon icon="mic"></Icon>
          </div>
          <div @click="uploadImg(3)">
            <Icon icon="image"></Icon>
          </div>
        </div>
        <div v-if="isRecording3" class="record-tip">
          <button @click="stopRecord(3)">
            <Icon icon="dot-red" size="mid"></Icon>
          </button>
          <button @click="toggleRecord">
            <Icon :icon="pauseRecord?'start-white':'pause'" size="mid"></Icon>
          </button>
          <button @click="cancelRecord(3)">
            <Icon icon="cross" size="mid"></Icon>
          </button>
        </div>
        <div v-if="realRecordPath3" :class="['existRecord',{'red-bg':isReadingRec3}]" @click="readAudio3">
          录音1 长度:{{recordDuration3}}
          <div @click.stop="deleteRecord(3)" style="display:flex;justify-content:center;">
            <Icon icon="cross-white" size="mini"></Icon>
          </div>
        </div>
        <div v-if="isCreate&&realPath3" class="img-preview">
          <div @click="removeImg(3)" class="removeimg">
            <Icon icon="cross-white" size="mini"></Icon>
          </div>
          <image class="preview" :src="realPath3" mode="aspectFill"></image>
        </div>
        <div class="add-tip">描述问题
          <div class="font-num">{{question.length}}/80</div>
        </div>
        <div class="front">
          <textarea v-model="question" class="front-input" cols="10" rows="3" maxlength="80"></textarea>
        </div>
        <div class="add-tip">答案媒体</div>
        <!-- <div v-if="isCreate&&!realPath2" @click="uploadImg2" class="img-container">
          <Icon icon="add1"></Icon>
        </div> -->
        <div class="media-container">
          <div @click="beginRecord(4)">
            <Icon icon="mic"></Icon>
          </div>
          <div @click="uploadImg(4)">
            <Icon icon="image"></Icon>
          </div>
        </div>
        <div v-if="isRecording4" class="record-tip">
          <button @click="stopRecord(4)">
            <Icon icon="dot-red" size="mid"></Icon>
          </button>
          <button @click="toggleRecord">
            <Icon :icon="pauseRecord?'start-white':'pause'" size="mid"></Icon>
          </button>
          <button @click="cancelRecord(4)">
            <Icon icon="cross" size="mid"></Icon>
          </button>
        </div>
        <div v-if="realRecordPath4" :class="['existRecord',{'red-bg':isReadingRec4}]" @click="readAudio4">
          录音2 长度:{{recordDuration4}}
          <div @click.stop="deleteRecord(4)" style="display:flex;justify-content:center;">
            <Icon icon="cross-white" size="mini"></Icon>
          </div>
        </div>
        <div v-if="isCreate&&realPath4" class="img-preview">
          <div @click="removeImg(4)" class="removeimg">
            <Icon icon="cross-white" size="mini"></Icon>
          </div>
          <image class="preview" :src="realPath4" mode="aspectFill"></image>
        </div>
        <div class="add-tip">答案
          <div class="font-num">{{answer.length}}/80</div>
        </div>
        <div class="front">
          <textarea v-model="answer" class="front-input" cols="10" rows="3" maxlength="80"></textarea>
        </div>
        <div @click="submitQuesCard" class="submit-container">
          <button class="submit">create</button>
        </div>
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
      title: '',
      title2: '',
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
      realPath3: '',
      realPath4: '',
      // 卡片前面的文字
      frontWord: '',
      // 卡片背面文字
      backWord: '',
      // 问题卡片的问题和答案
      question: '',
      answer: '',
      // 是否正在录音
      isRecording: false,
      isRecording2: false,
      isRecording3: false,
      isRecording4: false,
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
      // 七牛云录音地址3
      realRecordPath3: '',
      // 七牛云录音地址4
      realRecordPath4: '',
      // 是否准备上传录音
      ready2uploadRec: false,
      // 是否准备上传录音2
      ready2uploadRec2: false,
      // 是否准备上传录音3
      ready2uploadRec3: false,
      // 是否准备上传录音4
      ready2uploadRec4: false,
      // 录音1的长度
      recordDuration1: '',
      // 录音2的长度
      recordDuration2: '',
      // 录音3的长度
      recordDuration3: '',
      // 录音4的长度
      recordDuration4: '',
      // 音频实例
      audioContext1: '',
      audioContext2: '',
      audioContext3: '',
      audioContext4: '',
      // 是否暂停
      isReadingRec1: false,
      isReadingRec2: false,
      isReadingRec3: false,
      isReadingRec4: false,
      // 选择的卡片类型
      commonType: true
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
    // 提交问题卡片
    submitQuesCard () {
      console.log('提交问题卡片')
    },
    toCommon () {
      this.commonType = true
    },
    toQues () {
      this.commonType = false
    },
    // 播放录音
    readAudio1 () {
      if (this.isReadingRec2 || this.isReadingRec3 || this.isReadingRec4) {
        return
      }
      if (this.audioContext1 && this.audioContext1.paused) {
        this.audioContext1.play()
        return
      } else if (this.audioContext1) {
        this.audioContext1.pause()
        return
      }
      wx.showLoading({
        title: '咳咳..'
      })
      const audio = wx.createInnerAudioContext()
      audio.autoplay = true
      // 播放事件
      audio.onPlay(() => {
        this.isReadingRec1 = true
        // 播放时执行
        wx.hideLoading()
        console.log('开始播放')
      })
      // 暂停事件
      audio.onPause(() => {
        this.isReadingRec1 = false
        console.log('暂停')
      })
      // 结束事件
      audio.onEnded(() => {
        this.isReadingRec1 = false
        this.audioContext1 = ''
      })
      // 错误事件
      audio.onError((res) => {
        this.$message.error(res)
      })
      // 设置audio的src
      audio.src = this.realRecordPath
      this.audioContext1 = audio
    },
    readAudio2 () {
      if (this.isReadingRec1 || this.isReadingRec3 || this.isReadingRec4) {
        return
      }
      if (this.audioContext2 && this.audioContext2.paused) {
        this.audioContext2.play()
        return
      } else if (this.audioContext2) {
        this.audioContext2.pause()
        return
      }
      wx.showLoading({
        title: '咳咳..'
      })
      const audio = wx.createInnerAudioContext()
      audio.autoplay = true
      // 播放事件
      audio.onPlay(() => {
        this.isReadingRec2 = true
        // 播放时执行
        wx.hideLoading()
        console.log('开始播放')
      })
      // 暂停事件
      audio.onPause(() => {
        this.isReadingRec2 = false
        console.log('暂停')
      })
      // 结束事件
      audio.onEnded(() => {
        this.isReadingRec2 = false
        this.audioContext2 = ''
      })
      // 错误事件
      audio.onError((res) => {
        this.$message.error(res)
      })
      // 设置audio的src
      audio.src = this.realRecordPath2
      this.audioContext2 = audio
    },
    readAudio3 () {
      if (this.isReadingRec1 || this.isReadingRec2 || this.isReadingRec4) {
        return
      }
      if (this.audioContext3 && this.audioContext3.paused) {
        this.audioContext3.play()
        return
      } else if (this.audioContext3) {
        this.audioContext3.pause()
        return
      }
      wx.showLoading({
        title: '咳咳..'
      })
      const audio = wx.createInnerAudioContext()
      audio.autoplay = true
      // 播放事件
      audio.onPlay(() => {
        this.isReadingRec3 = true
        // 播放时执行
        wx.hideLoading()
        console.log('开始播放')
      })
      // 暂停事件
      audio.onPause(() => {
        this.isReadingRec3 = false
        console.log('暂停')
      })
      // 结束事件
      audio.onEnded(() => {
        this.isReadingRec3 = false
        this.audioContext3 = ''
      })
      // 错误事件
      audio.onError((res) => {
        this.$message.error(res)
      })
      // 设置audio的src
      audio.src = this.realRecordPath3
      this.audioContext3 = audio
    },
    readAudio4 () {
      if (this.isReadingRec1 || this.isReadingRec2 || this.isReadingRec3) {
        return
      }
      if (this.audioContext4 && this.audioContext4.paused) {
        this.audioContext4.play()
        return
      } else if (this.audioContext4) {
        this.audioContext4.pause()
        return
      }
      wx.showLoading({
        title: '咳咳..'
      })
      const audio = wx.createInnerAudioContext()
      audio.autoplay = true
      // 播放事件
      audio.onPlay(() => {
        this.isReadingRec4 = true
        // 播放时执行
        wx.hideLoading()
        console.log('开始播放')
      })
      // 暂停事件
      audio.onPause(() => {
        this.isReadingRec4 = false
        console.log('暂停')
      })
      // 结束事件
      audio.onEnded(() => {
        this.isReadingRec4 = false
        this.audioContext4 = ''
      })
      // 错误事件
      audio.onError((res) => {
        this.$message.error(res)
      })
      // 设置audio的src
      audio.src = this.realRecordPath4
      this.audioContext4 = audio
    },
    // 删除图片
    removeImg (num = 1) {
      if (num === 1) {
        this.realPath = ''
      } else if (num === 2) {
        this.realPath2 = ''
      } else if (num === 3) {
        this.realPath3 = ''
      } else {
        this.realPath4 = ''
      }
    },
    // 删除录音
    deleteRecord (num) {
      if (num === 1) {
        console.log('删除录音1')
        this.audioContext1 = ''
        this.realRecordPath = ''
        this.recordDuration1 = ''
      } else if (num === 2) {
        console.log('删除录音2')
        this.audioContext2 = ''
        this.realRecordPath2 = ''
        this.recordDuration2 = ''
      } else if (num === 3) {
        console.log('删除录音3')
        this.audioContext3 = ''
        this.realRecordPath3 = ''
        this.recordDuration3 = ''
      } else {
        console.log('删除录音4')
        this.audioContext4 = ''
        this.realRecordPath4 = ''
        this.recordDuration4 = ''
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
    cancelRecord (num = 1) {
      if (num === 1) {
        this.isRecording = false
      } else if (num === 2) {
        this.isRecording2 = false
      } else if (num === 3) {
        this.isRecording3 = false
      } else if (num === 4) {
        this.isRecording4 = false
      }
      this.pauseRecord = false
      console.log('取消录音')
      this.recorderManager.stop()
    },
    // 完成录音
    stopRecord (num = 1) {
      if (num === 1) {
        this.isRecording = false
        this.ready2uploadRec = true
      } else if (num === 2) {
        this.isRecording2 = false
        this.ready2uploadRec2 = true
      } else if (num === 3) {
        this.isRecording3 = false
        this.ready2uploadRec3 = true
      } else {
        this.isRecording4 = false
        this.ready2uploadRec4 = true
      }
      this.pauseRecord = false
      this.recorderManager.stop()
    },

    // 开始录音
    beginRecord (num = 1) {
      if (this.isRecording) {
        return
      }
      if (num === 1) {
        this.isRecording = true
      } else if (num === 2) {
        this.isRecording2 = true
      } else if (num === 3) {
        this.isRecording3 = true
      } else if (num === 4) {
        this.isRecording4 = true
      }
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
        title: this.title,
        openId,
        isFree: 0,
        img: this.realPath,
        img2: this.realPath2,
        freeFront: this.frontWord,
        freeBack: this.backWord,
        rec1: this.realRecordPath,
        rec2: this.realRecordPath2
      })
      wx.hideLoading()
      if (res.success) {
        this.$message.success('添加卡片成功!')
        this.cancelCreate()
      }
    },
    // 取消创建
    cancelCreate () {
      this.title = ''
      this.isCreate = false
      this.backWord = ''
      this.frontWord = ''
      this.question = ''
      this.answer = ''
      this.realPath = ''
      this.realPath2 = ''
      this.realPath3 = ''
      this.realPath4 = ''
      this.recordTempPath = ''
      this.realRecordPath = ''
      this.realRecordPath2 = ''
      this.realRecordPath3 = ''
      this.realRecordPath4 = ''
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
          } else if (num === 2) {
            that.realRecordPath2 = `${config.imgHost}/${JSON.parse(res.data).key}`
          } else if (num === 3) {
            that.realRecordPath3 = `${config.imgHost}/${JSON.parse(res.data).key}`
          } else {
            that.realRecordPath4 = `${config.imgHost}/${JSON.parse(res.data).key}`
          }
          that.ready2uploadRec = false
          that.ready2uploadRec2 = false
          that.ready2uploadRec3 = false
          that.ready2uploadRec4 = false
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
          } else if (num === 2) {
            that.realPath2 = `${config.imgHost}/${JSON.parse(res.data).key}`
          } else if (num === 3) {
            that.realPath3 = `${config.imgHost}/${JSON.parse(res.data).key}`
          } else if (num === 4) {
            that.realPath4 = `${config.imgHost}/${JSON.parse(res.data).key}`
          }
        }
      })
    },
    // 上传图片
    uploadImg (num = 1) {
      let that = this
      wx.chooseImage({
        count: 2,
        size: ['original'],
        sourceType: ['album', 'camera'],
        success (res) {
          that.tempPath = res.tempFilePaths[0]
          that.uploadImgToQiniu(num)
        }
      })
    },
    // 点击添加自定义卡片
    addCard () {
      this.isCreate = true
    },
    // 点击开始学习
    begin () {
      this.$store.route = 'remember'
      wx.navigateTo({
        url: '/pages/remember/main'
      })
    },
    searchFocus () {
      this.$store.route = 'search'
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
    },
    // async getTask () {
    //   wx.showNavigationBarLoading()
    //   const openId = await wx.getStorageSync('userInfo').openId
    //   const res = await this.$request(`${config.host}/word/getMyTask?openId=${openId}`)
    //   this.task = res.cards
    //   setTimeout(() => {
    //     wx.hideNavigationBarLoading()
    //   }, 500)
    // }
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
          this.recordDuration1 = `${Math.ceil(res.duration / 1000)}s`
          this.uploadRecordToQiniu(1)
        } else if (this.ready2uploadRec2) {
          this.recordDuration2 = `${Math.ceil(res.duration / 1000)}s`
          this.uploadRecordToQiniu(2)
        } else if (this.ready2uploadRec3) {
          this.recordDuration3 = `${Math.ceil(res.duration / 1000)}s`
          this.uploadRecordToQiniu(3)
        } else {
          this.recordDuration4 = `${Math.ceil(res.duration / 1000)}s`
          this.uploadRecordToQiniu(4)
        }
      })
      // recorderManager.onFrameRecorded((res) => {
      //   const { frameBuffer } = res
      //   console.log('frameBuffer.byteLength', frameBuffer.byteLength)
      // })
      this.recorderManager = recorderManager
    }
  },
  mounted () {
    wx.showShareMenu({
      withShareTicket: true
    })
    // 获取卡片数量
    this.getNum()
    // 获取七牛云token
    this.getToken()
    this.createAudioManager()

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
.common-card{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  .img-preview{
    margin: 30rpx 0;
    width: 420rpx;
    height: 280rpx;
    overflow: hidden;
    position: relative;
    .preview{
      // display: inline;
      width: 420rpx;
      border-radius: 20rpx;
    }
    .removeimg{
      position: absolute;
      right: 20rpx;
      top:20rpx;
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
  .title-container{
    width: 460rpx;
    input{
      width: 400rpx;
      height: 60rpx;
      padding: 5rpx 30rpx;
      border-radius: 35rpx;
      font-size: 32rpx;
      background: #EEE;
    }
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
}
.choose-type{
  background: #EEE;
}
.choose-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30rpx 0;
  button{
    font-size: 32rpx;
    text-align: right;
  }
  .left-btn{
    border-top-left-radius: 30rpx;
    border-bottom-left-radius: 30rpx;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .right-btn{
    border-top-right-radius: 30rpx;
    border-bottom-right-radius: 30rpx;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}
.red-bg{
  background: red !important;
}
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
  margin-bottom: 30rpx;
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
  height:2300rpx !important;
  justify-content: flex-start;
} 
.page-container{
  transition: all 0.6s;
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
      min-height: 200rpx;
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
