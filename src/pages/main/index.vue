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
      <div v-if="isCreate&&!realPath" @click="uploadImg" class="img-container">
        <Icon icon="add1"></Icon>
      </div>
      <div v-if="isCreate&&realPath" @click="uploadImg" class="img-preview">
        <img class="preview" :src="realPath">
      </div>
      <div v-if="isCreate" class="img-tip">为获得最佳显示效果,请尽量上传比例为3:2的横版图片</div>
      <div v-if="isCreate" class="add-tip">卡片正面文字
        <div class="font-num">{{frontWord.length}}/80</div>
      </div>
      <div v-if="isCreate" class="front">
        <textarea v-model="frontWord" class="front-input" cols="10" rows="3" maxlength="80"></textarea>
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
      // 卡片前面的文字
      frontWord: '',
      // 卡片背面文字
      backWord: ''
    }
  },
  components: {
    Icon
  },
  computed: {
  },
  onShow () {
    this.realPath = ''
    this.getNum()
  },
  methods: {
    // 提交卡片
    async submitCard () {
      if (!this.realPath || !this.frontWord || !this.backWord) {
        this.$message.warning('请输入完整信息')
        return
      }
      const openId = wx.getStorageSync('userInfo').openId
      const res = await this.$request(`${config.host}/word/addCard`, 'POST', {
        openId,
        isFree: 0,
        img: this.realPath,
        freeFront: this.frontWord,
        freeBack: this.backWord
      })
      console.log(res)
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
    },
    // 获取七牛云临时token
    async getToken () {
      const res = await this.$request(`${config.host}/getQnToken`)
      this.QiniuToken = res.token
    },
    // 图片上传到七牛云
    uploadQiniu () {
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
          setTimeout(() => {
            wx.hideLoading()
          }, 1000)
          that.realPath = `${config.imgHost}/${JSON.parse(res.data).key}`
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
          that.uploadQiniu()
        }
      })
    },
    // 点击添加自定义卡片
    addCard () {
      this.isCreate = true
      this.getToken()
    },
    // 点击开始学习
    begin () {
      const mode = wx.getStorageSync('mode')
      if (mode) {
        wx.navigateTo({
          url: '/pages/test/main'
        })
      } else {
        wx.navigateTo({
          url: '/pages/remember/main'
        })
      }
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
    this.getNum()
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
  height:1400rpx !important;
  justify-content: flex-start;
} 
.page-container{
  transition: all 1s;
  height: 700rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 110rpx 40rpx 100rpx;
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
  .add-tip{
    margin: 20rpx;
    font-size: 32rpx;
    width: 60%;
    text-align: left;
    .font-num{
      display: inline-block;
      float: right;
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
