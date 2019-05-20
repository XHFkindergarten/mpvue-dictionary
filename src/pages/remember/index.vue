<template>
  <div class="page-container">
    <div class="card-container">
      <wordcard v-if="hasTask" :wordInfo="cardInfo"></wordcard>
    </div>
  </div>
</template>

<script>
import wordcard from '@/components/wordcard'
import config from '@/config'
export default {
  data () {
    return {
      task: [],
      cardInfo: ''
    }
  },
  components: {
    wordcard
  },
  computed: {
    hasTask () {
      return this.task.length > 0
    }
  },
  methods: {
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
@keyframes down {
  from {position: relative; top: -500rpx;}
  to {position: relative; top: 0;}
}
</style>



