<template>
  <div class="page-container">
    <div class="gray-container">
      <img class="icon" src="/static/icon/cards.png">
      <div class="title">My Card</div>
    </div>
    <div v-if="cards.length>0" :class="[{'up':cardShow},'content-container']">
      <countcard v-for="(card,index) in cards" :key="index" :cardInfo="card"></countcard>
    </div>
  </div>
</template>

<script>
import countcard from '@/components/countcard'
import config from '@/config'
export default {
  data () {
    return {
      cards: [],
      cardShow: false
    }
  },
  components: {
    countcard
  },
  computed: {
  },
  methods: {
    // 获取卡片列表
    async getMyCards () {
      const openId = wx.getStorageSync('userInfo').openId
      const res = await this.$request(`${config.host}/mycard?openId=${openId}`)
      this.cards = res.cards
      // this.cardShow = true
    }
  },
  async mounted () {
    wx.showLoading({
      title: 'Loading...'
    })
    await this.getMyCards()
    wx.hideLoading()
    wx.loadFontFace({
      family: 'Bold',
      source: 'url("https://img.xhfkindergarten.cn/ADAM.CG%20PRO.otf")'
    })
    this.cardShow = true
  }
}
</script>
<style lang="less" scoped>
.up{
  top:0 !important;
}
.page-container{
  .content-container{
    transition: all 1s;
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



