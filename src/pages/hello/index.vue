<template>
  <div class="page-container" :style="'background-image:url('+wallpaperUrl[index]+');'">
    <div class="title-container" :style="'color:'+titleColor[index]+';'">Abandon单词</div>
    <div class="explain-container" :style="'color:'+titleColor[index]+';'">fantastic tool for memorize</div>
    <div class="login-container">
      <button class="button" open-type="getUserInfo" @getuserinfo="doLogin" :style="'background:'+buttonColor[index]+';color:'+beginColor[index]+';'">开始学习</button>
    </div>
  </div>
</template>

<script>
import store from '@/vuex/store'
import config from '@/config'
export default {
  data () {
    return {
      wallpaperUrl: [
        'http://img.xhfkindergarten.cn/wallpaper1',
        'http://img.xhfkindergarten.cn/wallpaper2',
        'http://img.xhfkindergarten.cn/wallpaper3',
        'http://img.xhfkindergarten.cn/wallpape4',
        'http://img.xhfkindergarten.cn/wallpaper5',
        'http://img.xhfkindergarten.cn/wallpaper6',
        'http://img.xhfkindergarten.cn/wallpaper77'
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
      index: ''
    }
  },
  computed: {
  },
  methods: {
    async doLogin (e) {
      let userInfo = wx.getStorageSync('userInfo')
      if (!userInfo) {
        // 获取登录参数
        userInfo = e.target.userInfo
        // 获取登录码
        const code = await this.login()
        // 将用户信息发送至服务器，存储到用户表中
        const openId = await this.$request(`${config.host}/register`, 'POST', {
          ...userInfo,
          code
        })
        // 存储本地
        wx.setStorageSync('userInfo', {
          ...userInfo,
          openId
        })
        // 修改vuex
        store.state.userinfo = {
          ...userInfo,
          openId
        }
      }
      wx.switchTab({
        url: '/pages/main/main'
      })
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
  mounted () {
    this.index = Math.ceil(Math.random() * this.wallpaperNum)
  }
}
</script>

<style lang="less" scoped>
@font-face {font-family: 'thin';
  src: url('//at.alicdn.com/t/webfont_zlrahtysk3q.eot'); /* IE9*/
  src: url('//at.alicdn.com/t/webfont_zlrahtysk3q.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('//at.alicdn.com/t/webfont_zlrahtysk3q.woff') format('woff'), /* chrome、firefox */
  url('//at.alicdn.com/t/webfont_zlrahtysk3q.ttf') format('truetype'), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
  url('//at.alicdn.com/t/webfont_zlrahtysk3q.svg#NotoSansHans-DemiLight') format('svg'); /* iOS 4.1- */
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
    // font-family: 'webfont';
    margin-top: 200rpx;
    color: #3F4C50;
    text-align: left;
    width: 100%;
    padding: 0 40rpx;
    font-size: 40px;
    font-weight: bold;
  }
  .explain-container{
    font-family: 'thin';
    font-size: 16px;
    font-weight:thin;
    padding: 0 40rpx;
  }
  .login-container{
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
