<script>
import config from '@/config'
export default {
  created () {
    wx.login({
      success (res) {
        wx.request({
          url: `${config.host}/login`,
          method: 'POST',
          data: {
            code: res.code
          },
          success (res) {
            if (res.data.success) {
              console.log('1', res)
              wx.setStorageSync('userInfo', res.data.userInfo)
            }
          }
        })
      }
    })
    wx.loadFontFace({
      family: 'worksans',
      source: 'url("http://img.xhfkindergarten.cn/WorkSans-Thin.woff.ttf")'
    })
    wx.loadFontFace({
      family: 'Bold',
      source: 'url("http://img.xhfkindergarten.cn/ADAM.CG%20PRO.otf")'
    })
    wx.loadFontFace({
      family: 'Eng',
      source: 'url("http://img.xhfkindergarten.cn/NeuropolXRg-Regular.ttf")'
    })
    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     */

    // let logs
    // if (mpvuePlatform === 'my') {
    //   logs = mpvue.getStorageSync({key: 'logs'}).data || []
    //   logs.unshift(Date.now())
    //   mpvue.setStorageSync({
    //     key: 'logs',
    //     data: logs
    //   })
    // } else {
    //   logs = mpvue.getStorageSync('logs') || []
    //   logs.unshift(Date.now())
    //   mpvue.setStorageSync('logs', logs)
    // }
  },
  log () {
    console.log(`log at:${Date.now()}`)
  }
}
</script>

<style>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
button::after{
  border: none;
}

</style>
