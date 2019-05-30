<template>
  <div class="page-container">
    <div class="userinfo">
      <img class="userinfo-avatar" :src="userinfo.avatarUrl" background-size="cover" />
      <div class="userinfo-nickname">
        <button v-if="!hasLogin" class="primary-btn" open-type="getUserInfo" @getuserinfo="doLogin">{{userinfo.nickName}}</button>
        <p class="nick-name" v-else>{{userinfo.nickName}}</p>
      </div>
    </div>
    <div class="big-container">
      <div class="left-container">
        <div class="my-card" @click="toMyCard">
          <Icon icon="cards" size="large"></Icon>
          <div class="text">My Cards</div>
        </div>
        <div class="today">
          <div class="text">Today Cards</div>
          <div class="num">{{cardNum}}</div>
        </div>
      </div>
      <div class="right-container">
        <!-- <div class="switch">
          <div class="text">Test Mode</div>
          <switch style="margin-top:20rpx;" :checked="isTest" v-model="isTest" color="#587AA5" @change="toggleMode"></switch>
        </div> -->
        <div class="reselect" @click="reSelect">
          <Icon icon="bookmark" size="large"></Icon>
          <div class="text">reselect book</div>
        </div>
        <div @click="share" class="punch">
          <Icon icon="share" size="mid-lar"></Icon>
          <div class="text">share</div>
        </div>
      </div>
    </div>
    
    <div v-if="showPic" class="share-container" @click="clickoutside">
      
      <div class="canvas-container">
        <canvas @click.stop="clickCanvas"  canvas-id="shareCanvas" style="height:533px;width:300px;"></canvas>
      </div>
      <!-- <cover-image src="/static/icon/download.png" style="height:50rpx;width:50rpx;"></cover-image> -->
      <cover-view :class="['btn-container']">
        <button v-if="showBtn" @click.stop="saveImg">save</button>
      </cover-view>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/Icon'
// import store from '@/vuex/store'
import config from '@/config'

export default {
  data () {
    return {
      hasLogin: false,
      userinfo: {
        nickName: '用户授权',
        avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEJ8Joib2X9MCDFEwBk7hfyfV8EdQyxJTYUzAXc49uIARhSRU8rJkTrl3G4vtNHsT3rMQbgecdp4Vsg/132'
      },
      isTest: false,
      // 今天学习过的卡片数量
      cardNum: 0,
      backgroundImg: [
        'https://img.xhfkindergarten.cn/share2.png',
        'https://img.xhfkindergarten.cn/ksdjklfkjdsflk.png',
        'https://img.xhfkindergarten.cn/sdfavcxfd.png',
        'https://img.xhfkindergarten.cn/sdgyjtkter.png',
        'https://img.xhfkindergarten.cn/dsagd.png'
      ],
      canvas: '',
      // 打卡天数
      punchNum: 0,
      // 是否显示获取打卡图片
      showPic: false,
      // 是否显示保存按钮
      showBtn: false,
      hasPunch: false
    }
  },
  // directives: {clickoutside},
  components: {
    Icon
  },
  methods: {
    // 点击分享
    async share () {
      this.showPic = true
      await this.submitPunch()
      await this.canvasgo()
    },
    clickCanvas (e) {
      console.log('click canvas')
    },
    // 点击画布以外
    clickoutside (e) {
      wx.hideLoading()
      this.showPic = false
      this.showBtn = false
      this.canvas = ''
    },
    // 打卡
    async submitPunch () {
      const openId = wx.getStorageSync('userInfo').openId
      const res = await this.$request(`${config.host}/punch?openId=${openId}`)
      console.log(res)
      this.hasPunch = res.hasPunch
      this.punchNum = res.punchNum
    },
    // 绘制打卡图片
    canvasgo () {
      let that = this
      wx.showLoading({
        title: '画图ing...'
      })
      wx.getImageInfo({
        src: that.userinfo.avatarUrl,
        success: res1 => {
          console.log('res1')
          const avatar = res1.path
          const rand = Math.floor(Math.random() * 5)
          wx.getImageInfo({
            src: this.backgroundImg[rand],
            success: res2 => {
              console.log('res2')
              const ctx = wx.createCanvasContext('shareCanvas')
              ctx.scale(300 / res2.width, 300 / res2.width)
              ctx.drawImage(res2.path, 0, 0, 600, 1057)
              // 写用户名
              ctx.setTextAlign('left')
              ctx.setFillStyle('#553F2A')
              ctx.font = '30px Arial'
              ctx.fillText(that.userinfo.nickName, 150, 90)
              ctx.restore()
              // 绘制打卡天数
              ctx.setTextAlign('left')
              ctx.setFillStyle('#553F2A')
              ctx.font = '26px Bold'
              ctx.fillText(`累计打卡${that.punchNum}天`, 150, 140)
              ctx.restore()
              // 写时间
              const date = new Date()
              ctx.fillText(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`, 150, 190)
              ctx.restore()
              // 写卡片数量
              ctx.setTextAlign('center')
              ctx.setFillStyle('#553F2A')
              ctx.font = '80px Bold'
              ctx.fillText(that.cardNum, 300, 470)
              ctx.restore()

              // 绘制用户头像
              ctx.arc(90, 95, 40, 0, 2 * Math.PI)
              ctx.clip()
              ctx.drawImage(avatar, 50, 55, 80, 80)
              ctx.draw()
              console.log('draw')
              wx.hideLoading()
              if (that.hasPunch) {
                this.$message.success('你打过卡了崽种')
              } else {
                this.$message.success('打卡成功!')
              }
              this.showBtn = true
            }
          })
        }
      })
    },
    // 点击保存打卡图片
    saveImg () {
      wx.showLoading({
        title: '保存图片中...'
      })
      wx.canvasToTempFilePath({
        canvasId: 'shareCanvas',
        success: res3 => {
          const tempFilePath = res3.tempFilePath
          console.log(tempFilePath)
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success: res4 => {
              wx.hideLoading()
              this.$message.success('保存成功')
              this.showPic = false
              this.showBtn = false
            }
          })
        }
      })
    },
    // 重新选择资料书
    reSelect () {
      const that = this
      wx.showModal({
        title: 'info',
        content: '重新选择资料书,Abandon依然会为你保留当前资料书的进度(*＾ワ＾*)',
        success (res) {
          if (res.confirm) {
            console.log('confirm reselect')
            that.$store.route = 'select'
            wx.navigateTo({
              url: '/pages/select/main'
            })
          }
        }
      })
    },
    // 点击我的卡片
    toMyCard () {
      this.$store.route = 'myCard'
      wx.navigateTo({
        url: '/pages/myCard/main'
      })
    },
    // 获取今天学习的卡片信息
    async getToday () {
      const res = await this.$request(`${config.host}/word/getToday?openId=${this.userinfo.openId}`)
      this.cardNum = res.num
    },
    // 切换模式
    toggleMode (e) {
      if (e.target.value) {
        this.$message.success('测试模式已开启', 1000)
        this.isTest = true
        wx.setStorageSync('mode', true)
      } else {
        this.isTest = false
        wx.setStorageSync('mode', false)
      }
    },
    // 获取之前是否开启测试模式
    getMode () {
      const mode = wx.getStorageSync('mode')
      if (mode) {
        this.isTest = true
      }
      console.log(this.isTest)
    }
  },
  onPullDownRefresh () {
    this.getToday()
  },
  async mounted () {
    wx.showShareMenu({
      withShareTicket: true
    })
    // let app = getApp()
    // 获取用户信息
    let userInfo = await wx.getStorageSync('userInfo')
    if (userInfo) {
      this.hasLogin = true
      this.userinfo = userInfo
    }
    this.getToday()
    wx.loadFontFace({
      family: 'Bold',
      source: 'url("https://img.xhfkindergarten.cn/ADAM.CG%20PRO.otf")'
    })
    this.getMode()
    // await this.submitPunch()
    // await this.canvasgo()
  },
  onShow () {
    this.getToday()
  }
}
</script>
<style lang="less" scoped>
.page-container{
  min-height: 100vh;
  background: #e6e5e3;
  display: flex;
  flex-direction: column;
  align-items: center;
  .share-container{
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top:0;
    left:0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .showBtn{
      opacity: 1 !important;
    }
    .btn-container{
      width: 100%;
      position: absolute;
      bottom: 40rpx;
      button{
        width: 200rpx;
        height: 100rpx;
        border-radius: 50rpx;
      }
    }
    .canvas-container{
      position: absolute;
      top:0;
      width: 100%;
      display: flex;
      justify-content: center;
      canvas{
        opacity: 1;
        margin-top: 60rpx;
      }
    }
  }
  .userinfo {
    width: 80%;
    background: #fff;
    border-radius: 50rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 80rpx;
    margin-bottom: 30rpx;
    padding: 20rpx 0;
    .userinfo-avatar {
      width: 180rpx;
      height: 180rpx;
      margin: 20rpx 0 40rpx;
      border-radius: 50%;
    }
    .userinfo-nickname {
      .nick-name {
        font-size: 30rpx;
        font-weight: bolder;
      }
    }
    .primary-btn {
      width: 200rpx;
      border: 0px;
      background: #fff;
    }
  }
  .big-container{
    padding-bottom: 160rpx;
    width: 80%;
    min-height: 600rpx;
    overflow: hidden;
    .my-card{
      border-top-left-radius: 40rpx;
      width: 100%;
      padding: 100rpx 0 100rpx;
      background: #fff;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-item: center;
      .text{
        font-family: 'Bold';
        text-align:center;
        color: #707070;
        margin-top: 40rpx;
      }
    }
    .today{
      width: 100%;
      padding: 100rpx 0;
      background: #fff;
      margin-top: 16rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      border-bottom-left-radius: 40rpx;
      .text{
        font-family: 'Bold';
        text-align: center;
        color: #707070;
      }
      .num{
        font-family: 'Bold';
        text-align: center;
        font-size: 60rpx;
        margin-top: 30rpx;
      }
    }
    .punch{
      margin-top: 16rpx;
      width: 100%;
      padding: 93rpx 0;
      background: #fff;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      border-bottom-right-radius: 40rpx;
      .text{
        font-family: 'Bold';
        text-align:center;
        color: #707070;
        margin-top: 40rpx;
      }
    }
    .reselect{
      // margin-top: 16rpx;
      border-top-right-radius: 40rpx;
      width: 100%;
      padding: 80rpx 0;
      background: #fff;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-item: center;
      .text{
        font-family: 'Bold';
        text-align:center;
        color: #707070;
        margin-top: 40rpx;
      }
    }
    // .switch{
    //   border-top-right-radius: 40rpx;
    //   // height: 200rpx;
    //   padding: 80rpx 0 80rpx;
    //   background: #fff;
    //   display: flex;
    //   justify-content: center;
    //   align-items: center;
    //   flex-direction: column;
    //   .text{
    //     font-family: 'Bold';
    //     text-align: center;
    //     color: #707070;
    //   }
    // }
    .left-container{
      width: 49%;
      float: left;
    }
    .right-container{
      width: 49%;
      float: right;

    }
  }
}

</style>