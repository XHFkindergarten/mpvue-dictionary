<template>
  <div class="page-container">
    <div class="card-container">
      <wordcard v-if="hasTask" :cardSide="cardSide" :wordInfo="cardInfo"></wordcard>
    </div>
    <div :class="hasTask?'bottom-container hasCard':'noCard'">
      <button v-show="!next">
        <Icon icon="sad"></Icon>
      </button>
      <button v-show="!next" @click="yes">
        <Icon icon="happy"></Icon>
      </button>
      <button v-show="next">
        <Icon size='mid-lar' icon="time"></Icon>
      </button>
      <button v-show="next">
        <Icon size='mid-lar' icon="array"></Icon>
      </button>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/Icon'
import wordcard from '@/components/wordcard'
import config from '@/config'
export default {
  data () {
    return {
      task: [],
      cardInfo: '',
      // 当前显示卡片的哪一面
      cardSide: true,
      // 是否可以进入下一卡片
      next: false
    }
  },
  components: {
    wordcard,
    Icon
  },
  computed: {
    hasTask () {
      return this.task.length > 0
    }
  },
  // wx.showActionSheet({
  //   itemList: ['A', 'B', 'C'],
  //   success (res) {
  //     console.log(res.tapIndex)
  //   },
  //   fail (res) {
  //     console.log(res.errMsg)
  //   }
  // })
  methods: {
    yes () {
      // 记录这个单词
      this.next = true
    },
    reverse () {
      this.cardSide = !this.cardSide
    }
  },
  async mounted () {
    const openId = await wx.getStorageSync('userInfo').openId
    const res = await this.$request(`${config.host}/word/getMyTask?openId=${openId}`)
    this.task = res.cards
    if (!this.hasTask) {
      return
    }
    const cardInfo = await this.$request(`${config.host}/word/oneWord?word=${this.task[0].voc}`)
    console.log(cardInfo)
    this.cardInfo = cardInfo.word
  }
}
</script>
<style lang="less" scoped>
.card-container{
  z-index: -1;
  width: 80%;
  margin: 0 auto;
  // position: relative; top: -200rpx;
  animation: down 1s ease-in-out forwards;
}
.bottom-container{
  display: flex;
  justify-content: space-around;
  border-top-left-radius: 40rpx;
  border-top-right-radius: 40rpx;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #F6F6F6;
  button{
    background: #F6F6F6;
    display: flex;
    align-items: center;
  }
}
.hasCard{
  animation: show 1s ease-in forwards;
}
@keyframes show {
  from {height: 0; opacity: 0;}
  to {height:160rpx; opacity: 1;}
}
.noCard{
  display:none;
  animation: show 1s backwards;
}
@keyframes down {
  from {position: relative; top: -500rpx;}
  to {position: relative; top: 0;}
}
.page-container{
  padding-bottom: 200rpx;
}
</style>



