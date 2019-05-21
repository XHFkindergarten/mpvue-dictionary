<template> 
  <div>
    <div class="search-container">
      <input class="search" placeholder-style="font-size:14px;font-family:'thin';" @focus="searchFocus" placeholder="请输入搜索单词" type="text">
    </div>
    <div class="page-container">
      <div class="num-container">
        <div class="main-num">{{task.length}}</div>
        <div class="explain">Cards to memorize</div>
      </div>
    </div>
    <div class="btn-container">
      <button @click="begin" class="begin">开 始</button>
    </div>
  </div>
  
</template>

<script>
import config from '@/config'
export default {
  data () {
    return {
      task: ''
    }
  },
  computed: {
  },
  methods: {
    // 点击开始学习
    begin () {
      wx.navigateTo({
        url: '/pages/vocGroup/main'
      })
    },
    searchFocus () {
      wx.navigateTo({
        url: '/pages/search/main'
      })
    },
    // 获取待背单词
    async getTask () {
      const openId = await wx.getStorageSync('userInfo').openId
      const res = await this.$request(`${config.host}/word/getMyTask?openId=${openId}`)
      this.task = res.cards
    }
  },
  onShow () {
    this.getTask(0)
  },
  mounted () {
    // await wx.loadFontFace({
    //   family: 'comfortaBold',
    //   source: 'url("http://img.xhfkindergarten.cn/ComfortaBold")'
    // })
    wx.loadFontFace({
      family: 'Bold',
      source: 'url("http://img.xhfkindergarten.cn/ADAM.CG%20PRO.otf")'
    })
  }
}
</script>

<style lang="less" scoped>
.search-container{
  padding: 0 40rpx;
  position: fixed;
  top:0;
  margin: 20rpx 0;
  width: 90%;
  text-align: center;
  .search{
    font-size: 16px;
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

.page-container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 110rpx 40rpx 200rpx;
  background: #e6e5e3;
  border-bottom-left-radius: 100rpx;
  border-bottom-right-radius: 100rpx;
  .num-container{
    width: 80%;
    height: 400rpx;
    margin-top: 40rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .main-num{
      font-size: 100px;
      font-family: 'Bold',
    }
    .explain{
      color: #64656a;
      font-size: 20px;
      font-family: 'Bold'
    }
    // // background: #D2D1CD;
    // // border-radius: 50rpx;
    // font-family: 'Bold';
    // font-size: 100px;
    // font-weight: bolder;
  }
}
.btn-container{
  margin-top: 100rpx;
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
  src: url('//at.alicdn.com/t/webfont_mqpbqez4b1r.eot'); /* IE9*/
  src: url('//at.alicdn.com/t/webfont_mqpbqez4b1r.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('//at.alicdn.com/t/webfont_mqpbqez4b1r.woff') format('woff'), /* chrome、firefox */
  url('//at.alicdn.com/t/webfont_mqpbqez4b1r.ttf') format('truetype'), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
  url('//at.alicdn.com/t/webfont_mqpbqez4b1r.svg#思源黑体-极细') format('svg'); /* iOS 4.1- */
}
@font-face {font-family: 'begin';
  src: url('//at.alicdn.com/t/webfont_prwjwi2tk2.eot'); /* IE9*/
  src: url('//at.alicdn.com/t/webfont_prwjwi2tk2.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('//at.alicdn.com/t/webfont_prwjwi2tk2.woff') format('woff'), /* chrome、firefox */
  url('//at.alicdn.com/t/webfont_prwjwi2tk2.ttf') format('truetype'), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
  url('//at.alicdn.com/t/webfont_prwjwi2tk2.svg#NotoSansHans-Black') format('svg'); /* iOS 4.1- */
}
</style>
