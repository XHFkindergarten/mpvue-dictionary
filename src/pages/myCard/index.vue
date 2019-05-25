<template>
  <div class="page-container">
    <div class="gray-container">
      <img class="icon" src="/static/icon/cards.png">
      <div class="title">My Card {{cards.length}}</div>
    </div>
    <div v-if="cards&&cards.length>0" :class="[{'up':cardShow},'content-container']">
      <countcard v-for="(card,index) in showList" :key="index" :cardInfo="card"></countcard>
    </div>
    <div v-if="!toEnd&&cards.length>0" class="bottom-tip">{{bottomLoading?tip2:tip1}}</div>
    <div v-if='toEnd&&cards.length>0' class="bottom-tip">{{tip3}}</div>
  </div>
</template>

<script>
import countcard from '@/components/countcard'
import config from '@/config'
export default {
  data () {
    return {
      cards: [],
      cardShow: false,
      index: 1,
      size: 10,
      bottomLoading: false,
      tip1: 'pull to load more<(▰˘◡˘▰)>',
      tip2: 'loading...(◑‿◐)(◑‿◐)(◑‿◐)',
      tip3: 'no more cards ༼༎ຶ෴༎ຶ༽'
    }
  },
  components: {
    countcard
  },
  computed: {
    showList () {
      return this.cards.slice(0, this.index * this.size)
    },
    toEnd () {
      return Math.ceil(this.cards.length / this.size) === this.index
    }
  },
  methods: {
    // 获取卡片列表
    async getMyCards () {
      wx.showLoading({
        title: 'Loading...'
      })
      const openId = wx.getStorageSync('userInfo').openId
      const res = await this.$request(`${config.host}/mycard?openId=${openId}`)
      this.cards = res.cards
      wx.hideLoading()
      // this.cardShow = true
    }
  },

  onReachBottom () {
    this.bottomLoading = true
    setTimeout(() => {
      this.bottomLoading = false
      if (Math.ceil(this.cards.length / 10) !== this.index) {
        this.index++
      }
    }, 500)
  },
  onPullDownRefresh () {
    this.getMyCards()
  },
  onShow () {
    this.cards = []
    this.getMyCards()
    this.index = 1
  },
  async mounted () {
    wx.loadFontFace({
      family: 'worksans',
      source: 'url("https://img.xhfkindergarten.cn/WorkSans-Thin.woff.ttf")'
    })
    wx.loadFontFace({
      family: 'Bold',
      source: 'url("https://img.xhfkindergarten.cn/ADAM.CG%20PRO.otf")'
    })

    await this.getMyCards()
    setTimeout(() => {
      this.cardShow = true
    }, 500)
    // this.cardShow = true
  }
}
</script>
<style lang="less" scoped>
.up{
  top:0 !important;
}
.page-container{
  padding-bottom: 20rpx;
  .bottom-tip{
    font-family: 'wordsans';
    font-size: 28rpx;
    text-align: center;
    color: #706F74;
  }
  .content-container{
    transition: top 1s;
    position: relative;
    top: 800rpx;
    margin: 0 auto;
    width: 80%;
    height: auto;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
  .gray-container{
    display:flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: #E6E5E3;
    border-bottom-left-radius: 100rpx;
    border-bottom-right-radius: 100rpx;
    padding-bottom: 100rpx;
    .icon{
      width: 200rpx;
      height: 200rpx;
      margin: 100rpx;
    }
    .title{
      font-family: 'Bold';
      font-size: 60rpx;
      text-align: center;
      color: #707070;
    }
  }
}
</style>



