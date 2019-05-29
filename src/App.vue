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
              wx.setStorageSync('userInfo', res.data.userInfo)
            }
          }
        })
      }
    })
    // wx.loadFontFace({
    //   family: 'worksans',
    //   source: 'url("http://img.xhfkindergarten.cn/WorkSans-Thin.woff.ttf")'
    // })
    wx.loadFontFace({
      family: 'Bold',
      source: 'url("https://img.xhfkindergarten.cn/ADAM.CG%20PRO.otf")'
    })
    // wx.loadFontFace({
    //   family: 'Eng',
    //   source: 'url("http://img.xhfkindergarten.cn/NeuropolXRg-Regular.ttf")'
    // })
  },
  onHide () {
    console.log(this.$store.route)
    if (!this.$store.previewImg && (this.$store.route === 'vocGroup' || this.$store.route === 'remember')) {
      wx.navigateBack({
        delta: 1
      })
    }
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
