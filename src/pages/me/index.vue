<template>
  <div>

    <div class="userinfo">
      <img class="userinfo-avatar" :src="userinfo.avatarUrl" background-size="cover" />
      <div class="userinfo-nickname">
        <button v-if="!hasLogin" class="primary-btn" open-type="getUserInfo" @getuserinfo="doLogin">用户授权</button>
        <p class="nick-name" v-else>{{userinfo.nickName}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/vuex/store'
import config from '@/config'
export default {
  data () {
    return {
      hasLogin: false,
      userinfo: {
        nickName: '用户授权',
        avatarUrl: '/static/images/default-avatar.png'
      }
    }
  },

  components: {
  },

  methods: {
    // bindViewTap () {
    //   const url = '../logs/main'
    //   if (mpvuePlatform === 'wx') {
    //     mpvue.switchTab({ url })
    //   } else {
    //     mpvue.navigateTo({ url })
    //   }
    // },
    async doLogin (e) {
      // 获取登录参数
      let userInfo = e.target.userInfo
      // 获取登录码
      const code = await this.login()
      // 将用户信息发送至服务器，存储到用户表中
      await this.$request(`${config.host}/register`, 'POST', {
        ...userInfo,
        code
      })
      // 存储本地
      wx.setStorageSync('userInfo', userInfo)
      // 用户信息渲染到页面
      this.userinfo = userInfo
      // 修改vuex
      store.state.userinfo = userInfo
      // 修改登录状态
      this.hasLogin = true
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
    }
  },
  created () {
    // let app = getApp()
    // 获取用户信息
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.hasLogin = true
      this.userinfo = userInfo
    }
  }
}
</script>
<style lang="less" scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  .userinfo-avatar {
    width: 180rpx;
    height: 180rpx;
    margin: 20rpx 0 60rpx;
    border-radius: 50%;
  }
  .userinfo-nickname {
    .nick-name {
      font-size: 20px;
      font-weight: bolder;
    }
  }
  .primary-btn {
    width: 200rpx;
    border: 0px;
    background: #fff;
  }
}
</style>