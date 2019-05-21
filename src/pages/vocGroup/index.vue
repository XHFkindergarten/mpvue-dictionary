<template>
  <div class="page-container">
    <div :class="[{'leave':leave},{'enter':enter},'card-container']">
      <wordcard v-if="cardInfo" :cardSide="cardSide" :wordInfo="cardInfo"></wordcard>
    </div>
    <div v-if="index===20" class="bird-container">
      <div class="wrapper">
        <img class="bird" src="http://img.xhfkindergarten.cn/default-bird.png">
        <div class="word">恭喜你完成了一组单词:)</div>
      </div>
      
      <div class="btn-container">
        <button @click="backTo" class="back">返回</button>
        <button @click="re" class="refresh">
          <img class="icon" src="/static/icon/refresh.png">
        </button>
        <button @click="getMore" class="more">继续</button>
      </div>
    </div>
    <div :class="hasTask?'bottom-container hasCard':'noCard'">
      <button @click="remove">
        <Icon icon="cross2"></Icon>
      </button>
      <button @click="reverse">
        <Icon icon="reverse"></Icon>
      </button>
      <button @click="add">
        <Icon icon="add1"></Icon>
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
      next: false,
      // 加入动画
      enter: false,
      // 离开动画
      leave: false,
      // 背到了第几个单词
      index: '',
      // 指定书
      bookId: ''
    }
  },
  components: {
    wordcard,
    Icon
  },
  watch: {
    task: {
      async handler (newValue, oldValue) {
        this.cardInfo = ''
        const cardInfo = await this.$request(`${config.host}/word/oneWord?word=${newValue[this.index].vocabulary}`)
        console.log(cardInfo)
        this.leave = false
        this.cardInfo = cardInfo.word
      },
      deep: true
    },
    async index (newValue, oldValue) {
      if (this.task.length === 0) {
        return
      }
      if (newValue === 20) {
        this.updateSchedule()
        this.$message.success('congratuations!')
        wx.setStorageSync('index', 0)
        this.leave = false
        this.enter = false
        this.cardInfo = ''
        return
      }
      wx.setStorageSync('index', newValue)
      this.cardInfo = ''
      const cardInfo = await this.$request(`${config.host}/word/oneWord?word=${this.task[newValue].vocabulary}`)
      this.leave = false
      this.enter = false
      this.cardInfo = cardInfo.word
    }
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
    async updateSchedule () {
      if (!this.bookId) {
        return
      }
      const openId = wx.getStorageSync('userInfo').openId
      const res = await this.$request(`${config.host}/word/updateSchedule`, 'POST', {
        bookId: this.bookId,
        openId
      })
      console.log(res)
    },
    backTo () {
      wx.switchTab({
        url: '/pages/main/main'
      })
    },
    getMore () {
      this.getTask()
      this.index = 0
    },
    remove () {
      this.leave = true
      setTimeout(() => {
        this.index++
      }, 600)
      this.cardSide = true
    },
    async add () {
      this.enter = true
      const openId = wx.getStorageSync('userInfo').openId
      const res = await this.$request(`${config.host}/word/addCard`, 'POST', {
        openId,
        isFree: 1,
        voc: this.cardInfo.word_name
      })
      console.log(res)
      if (res.success) {
        this.$message.success('添加卡片成功', 1000)
      } else {
        this.$message.warning(res.msg)
      }
      setTimeout(() => {
        this.index++
      }, 600)
      this.cardSide = true
    },
    reverse () {
      this.cardSide = !this.cardSide
    },
    async getTask () {
      const openId = await wx.getStorageSync('userInfo').openId
      const res = await this.$request(`${config.host}/word/getVocGroup?openId=${openId}`)
      console.log(res)
      if (res.bookId) {
        this.bookId = res.bookId
      }
      this.task = res.data
    }
  },
  async mounted () {
    this.getTask()
    // 获取当前的index
    const index = wx.getStorageSync('index')
    if (index) {
      console.log(index, 1)
      this.index = index
    } else {
      console.log(index, 2)
      this.index = 0
    }
  }
}
</script>
<style lang="less" scoped>
.enter {
  animation: enter 0.8s ease-in-out forwards !important;
}
@keyframes enter {
  from {
    position: relative;
    left:0;
  }
  to {
    position: relative;
    left: 800rpx;
  }
}
.leave{
  animation: leave 0.8s ease-in-out forwards !important;
}
@keyframes leave {
  from {
    position: relative;
    left:0;
  }
  to {
    position: relative;
    left: -800rpx;
  }
}
.card-container{
  z-index: -1;
  width: 80%;
  margin: 0 auto;
  padding-top: 60rpx;
  // position: relative; top: -200rpx;
  animation: down 1s ease-in-out forwards;
}
@keyframes appear {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.bird-container{
  animation: appear 0.5s ease-in-out forwards;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  .wrapper{
    width: 500rpx;
    height: 500rpx;
    position: relative;
    margin-top: 160rpx;
    .bird{
      width: 500rpx;
      height: 500rpx;
    }
    .word{
      font-family: 'siyuanheiti';
      text-align: center;
      position: absolute;
      bottom: 0;
      width: 100%;
      font-size: 30px;
    }
  }
  .btn-container{
    margin-top: 50rpx;
    width: 80%;
    height: 100rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .back{
      padding: 0 40rpx;
      height: 100rpx;
      border-radius: 50rpx;
      background: #e6e5e3;
      color: #000;
      font-size: 16px;
      line-height: 100rpx;
    }
    .refresh{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100rpx;
      height: 100rpx;
      border-radius: 50rpx;
      background: #e6e5e3;
      line-height: 100rpx;
      .icon{
        height: 40rpx;
        width: 40rpx;
      }
    }
    .more{
      padding: 0 40rpx;
      height: 100rpx;
      border-radius: 50rpx;
      background: #587AA5;
      color: #fff;
      font-size: 16px;
      line-height: 100rpx;
    }
  }
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
@font-face {font-family: 'siyuanheiti';
  src: url('//at.alicdn.com/t/webfont_1aw5gdz0gry.eot'); /* IE9*/
  src: url('//at.alicdn.com/t/webfont_1aw5gdz0gry.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('//at.alicdn.com/t/webfont_1aw5gdz0gry.woff') format('woff'), /* chrome、firefox */
  url('//at.alicdn.com/t/webfont_1aw5gdz0gry.ttf') format('truetype'), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
  url('//at.alicdn.com/t/webfont_1aw5gdz0gry.svg#NotoSansHans-Black') format('svg'); /* iOS 4.1- */
}
</style>



