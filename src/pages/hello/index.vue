<template>
  <div class="page-container" :style="'background-image:url('+wallpaperUrl[index]+');'">
    <div :class="['title-container',{'fade-in':fadein}]" :animation="fadeAnimation" :style="'color:'+titleColor[index]+';'">Abandon</div>
    <div :class="['explain-container',{'fade-in':fadein}]" :style="'color:'+titleColor[index]+';'">fantastic tool for memorizing</div>
    <div :class="['login-container',{'fade-in':fadein}]">
      <button class="button" open-type="getUserInfo" @getuserinfo="doLogin" :style="'background:'+buttonColor[index]+';color:'+beginColor[index]+';'">开始学习</button>
    </div>
  </div>
</template>

<script>
// import store from '@/vuex/store'
import config from '@/config'
export default {
  data () {
    return {
      wallpaperUrl: [
        'https://img.xhfkindergarten.cn/IMG_5362.jpg',
        'https://img.xhfkindergarten.cn/wallpaper2',
        'https://img.xhfkindergarten.cn/wallpaper3',
        'https://img.xhfkindergarten.cn/wallpape4',
        'https://img.xhfkindergarten.cn/wallpaper5',
        'https://img.xhfkindergarten.cn/wallpaper6',
        'https://img.xhfkindergarten.cn/wallpaper77'
      ],
      // 墙纸张数
      wallpaperNum: 7,
      // 墙纸对应配色
      titleColor: [
        '#515D69',
        '#A3B4AE',
        '#273034',
        '#85200a',
        '#565e53',
        '#5d7963',
        '#414d3f'
      ],
      // btn对应配色
      buttonColor: [
        '#782619',
        '#38474B',
        '#516859',
        '#293040',
        '#565e53',
        '#bbc974',
        '#66758a'
      ],
      beginColor: [
        '#C7BAB4',
        '#C7C8BF',
        '#F4FFF9',
        '#e6d1b2',
        '#d9bfa8',
        '#414d3f',
        '#e4dae3'
      ],
      index: '',
      // 渐入动画
      fadein: false
    }
  },
  computed: {
  },
  methods: {
    async doLogin (e) {
      let userInfo = wx.getStorageSync('userInfo')
      if (!userInfo) {
        userInfo = e.target.userInfo
      }
      // 获取登录码
      const code = await this.login()
      // 发起注册
      const res = await this.$request(`${config.host}/register`, 'POST', {
        ...userInfo,
        code
      })
      console.log(res)
      if (res.hasRegister) {
        // 已经注册过了
        wx.switchTab({
          url: '/pages/main/main'
        })
      } else {
        wx.setStorageSync('userInfo', {
          ...userInfo,
          openId: res.openId
        })
        this.$message.success('register!')
      }
      // return
      // if (!userInfo) {
      //   console.log('register')
      //   // 获取登录参数
      //   userInfo = e.target.userInfo
      //   wx.showLoading({
      //     title: '正在注册'
      //   })
      //   // 获取登录码
      //   const code = await this.login()
      //   // 将用户信息发送至服务器，存储到用户表中
      //   const openId = await this.$request(`${config.host}/register`, 'POST', {
      //     ...userInfo,
      //     code
      //   })
      //   console.log(openId)
      //   // 存储本地
      //   wx.setStorageSync('userInfo', {
      //     ...userInfo,
      //     openId: openId.openId
      //   })
      //   wx.hideLoading()
      //   // // 修改vuex
      //   // store.state.userinfo = {
      //   //   ...userInfo,
      //   //   openId: openId.openId
      //   // }
      //   wx.navigateTo({
      //     url: '/pages/select/main'
      //   })
      // } else {
      //   console.log('login success')
      //   wx.switchTab({
      //     url: '/pages/main/main'
      //   })
      // }
    },
    // wx.login方法
    login () {
      return new Promise((resolve, reject) => {
        wx.login({
          success (res) {
            resolve(res.code)
          },
          fail (res) {
            reject(res.errMsg)
          }
        })
      })
    },
    fadein () {
      // 调用微信小程序动画接口
      const animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease-in-out'
      })
      // animation.opacity(0).step({duration: 0}).step()
      animation.opacity(1).step()
      this.fadeAnimation = animation
    }
  },
  mounted () {
    wx.loadFontFace({
      family: 'Bold',
      source: 'url("https://img.xhfkindergarten.cn/ADAM.CG%20PRO.otf")'
    })
    this.index = Math.floor(Math.random() * this.wallpaperNum)
    // this.fadein()
    setTimeout(() => {
      this.fadein = true
    }, 1000)
  },
  // 出现时
  onShow () {

  }
}
</script>

<style lang="less" scoped>
.fade-in{
  // animation: fade 2s ease-in-out forwards;
  opacity: 1 !important;
}
// @keyframes fade {
//   0% {
//     opacity: 0;
//   }
//   50% {
//     opacity: 0;
//   }
//   100% {
//     opacity: 1;
//   }
// }
div{
  transition: opacity 1s;
}
.page-container{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-size: cover;
  background-repeat: no-repeat;
  .title-container{
    opacity: 0;
    font-family: 'Bold';
    margin-top: 200rpx;
    color: #3F4C50;
    text-align: left;
    width: 100%;
    padding: 0 40rpx;
    font-size: 80rpx;
    font-weight: bolder;
  }
  .explain-container{
    opacity: 0;
    font-family: 'worksans';
    font-size: 32rpx;
    font-weight:thin;
    padding: 0 40rpx;
  }
  .login-container{
    opacity: 0;
    position: absolute;
    bottom: 150rpx;
    width: 100%;
    display: flex;
    justify-content: center;
    .button{
      height: 100rpx;
      width: 300rpx;
      border-radius: 50rpx;
      line-height: 100rpx;
    }
  }
}
</style>
