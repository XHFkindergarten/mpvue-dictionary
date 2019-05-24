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
        <div class="switch">
          <div class="text">Test Mode</div>
          <switch style="margin-top:20rpx;" :checked="isTest" v-model="isTest" color="#587AA5" @change="toggleMode"></switch>
        </div>
        
      </div>
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
        avatarUrl: '/static/images/default-avatar.png'
      },
      isTest: false,
      // 今天学习过的卡片数量
      cardNum: 0
    }
  },

  components: {
    Icon
  },

  methods: {
    toMyCard () {
      wx.navigateTo({
        url: '/pages/myCard/main'
      })
    },
    // 获取今天学习的卡片信息
    async getToday () {
      const res = await this.$request(`${config.host}/word/getToday?openId=${this.userinfo.openId}`)
      this.cardNum = res.num
    },
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
  mounted () {
    // let app = getApp()
    // 获取用户信息
    let userInfo = wx.getStorageSync('userInfo')
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
    .left-container{
      width: 49%;
      float: left;
      .today{
        width: 100%;
        padding: 100rpx 0;
        background: #fff;
        margin-top: 16rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
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
    }
    .right-container{
      width: 49%;
      float: right;
      .switch{
        border-top-right-radius: 40rpx;
        // height: 200rpx;
        padding: 80rpx 0 80rpx;
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        .text{
          font-family: 'Bold';
          text-align: center;
          color: #707070;
        }
      }

    }
  }
}

</style>