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
// import store from '@/vuex/store'
// import config from '@/config'
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

  },
  mounted () {
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
      font-size: 40rpx;
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