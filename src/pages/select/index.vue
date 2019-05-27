<template>
  <div class="page-container">
    <div class="title">
      <span style="color:#413E49">Concent</span><span style="color:#cbcac8">rate on</span>
      <div class="comfirm-container">
        <button @click="comfirm" class="comfirm">GKD</button>
      </div>
    </div>
    <div class="card-container">
      <div class="half-container">
        <card
          v-for="item in leftCardList"
          :key="item.title"
          :cardInfo="item"
          @select="select"
          ></card>
      </div>
      <div class="half-container">
        <card
          v-for="item in rightCardList"
          :key="item.title"
          :cardInfo="item"
          @select="select"
          ></card>
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/config'
import Card from '@/components/card'
export default {
  data () {
    return {
      leftCardList: [
        {
          title: 'CET4',
          type: '大学英语四级',
          explain: 'Collage Englist Test Band4',
          selected: false
        },
        {
          title: 'TEM4',
          type: '大学专业四级',
          explain: 'Test for English Majors-4',
          selected: false
        },
        {
          title: 'NEEP',
          type: '研究生入学考试',
          explain: 'the national entrance examination for postgraduate',
          selected: false
        },
        {
          title: 'TOFEL',
          type: '托福',
          explain: 'The Test of English as a Foreign Language',
          selected: false
        }
      ],
      rightCardList: [
        {
          title: 'WDNMD',
          type: '不选了，随便背了，有什么好说哒',
          explain: 'Give me some words whatever it is',
          selected: false
        },
        {
          title: 'CET6',
          type: '大学英语六级',
          explain: 'Collage Englist Test Band6',
          selected: false
        },
        {
          title: 'TEM8',
          type: '大学专业八级',
          explain: 'Test for English Majors-8',
          selected: false
        },
        {
          title: 'IELTS',
          type: '雅思',
          explain: 'International English Language Testing System',
          selected: false
        }
      ],
      // 被选中的卡片
      selectedCard: ''
    }
  },
  components: {
    Card
  },
  computed: {
  },
  methods: {
    select (option) {
      this.selectedCard = option
      this.formatList()
    },
    formatList () {
      this.leftCardList.forEach(item => {
        if (item.title === this.selectedCard.title) {
          item.selected = true
          return
        }
        item.selected = false
      })
      this.rightCardList.forEach(item => {
        if (item.title === this.selectedCard.title) {
          item.selected = true
          return
        }
        item.selected = false
      })
    },
    // 确认
    async comfirm () {
      console.log(this.selectedCard)
      if (!this.selectedCard) {
        this.$message.warning('请选择学习类别:)')
      } else if (this.selectedCard.title === 'WDNMD') {
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
        const openId = wx.getStorageSync('userInfo').openId
        const res = await this.$request(`${config.host}/wdnmd?openId=${openId}`)
        console.log(res.userInfo)
        wx.setStorageSync('userInfo', res.userInfo)
        wx.reLaunch({
          url: '/pages/main/main'
        })
      } else {
        console.log('go')
        wx.navigateTo({
          url: `/pages/book/main?title=${this.selectedCard.title}&type=${this.selectedCard.type}&explain=${this.selectedCard.explain}`
        })
      }
    }
  },
  mounted () {
    wx.loadFontFace({
      family: 'worksans',
      source: 'url("https://img.xhfkindergarten.cn/WorkSans-Thin.woff.ttf")'
    })
    wx.loadFontFace({
      family: 'Bold',
      source: 'url("https://img.xhfkindergarten.cn/ADAM.CG%20PRO.otf")'
    })
    wx.loadFontFace({
      family: 'Eng',
      source: 'url("https://img.xhfkindergarten.cn/NeuropolXRg-Regular.ttf")'
    })
  }
}
</script>
<style lang="less" scoped>
.page-container{
  .title{
    font-family: 'Eng';
    font-size: 50rpx;
    margin: 40rpx 0 0 30rpx;
    font-weight: bold;
    height: 100rpx;
    line-height: 100rpx;
    .comfirm-container{
      height: 100%;
      display: flex;
      align-items: center;
      float: right;
      margin-right: 40rpx;
      .comfirm{
        border: 0;
        background: #587AA5;
        color: #fff !important;
        border-radius: 35rpx;
        line-height: 80rpx;
        font-family: 'Bold';
        font-weight: normal;
        height: 70rpx;
        width: 120rpx;
        font-size: 28rpx;
        color: #413E49;
      }
    }
  }
  .card-container {
    margin-top: 60rpx;
    padding: 0 20rpx;
    .half-container{
      width: 50%;
      display: flex;
      align-items: center;
      flex-direction: column;
      float: left;
    }
    .half-container:last-child {
      margin-top: 150rpx;
    }
  }
}
</style>



