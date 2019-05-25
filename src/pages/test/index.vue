<template>
  <div :class="[{'background':toEnd||!hasTask}, {'page-container':!toEnd}]" style="min-height:100vh;">
    <div :class="[{'down':down},{'right':right},'card-container']">
      <wordcard v-if="cardInfo&&task[index].isFree==1" :test="true" :cardSide="!next" :wordInfo="cardInfo"></wordcard>
      <freecard v-if="cardInfo&&task[index].isFree==0" :cardSide="!next" :wordInfo="cardInfo"></freecard>
    </div>
    <div v-if="task.length>0" :class="[{'fadein':task.length>0},'answer-tip']">
      Your answer:
    </div>
    <div :class="[{'fadein':task.length>0},{'down':down},'input-container']">
      <input v-model="inputAnswer" disable class="single-input" type="text" maxlength="-1">
    </div>
    <div v-if="toEnd||!hasTask" class="bird-container">
      <div class="wrapper">
        <img class="bird" src="https://img.xhfkindergarten.cn/boxer-bird.png">
        <div class="word">恭喜完成所有卡片</div>
      </div>
      <div class="btn-container">
        <button @click="backTo" class="back">返回</button>
      </div>
    </div>
    <div :class="['bottom-container',{fadein:task.length>0}]">
      <button @click="checkAns" v-show="!next">
        <Icon icon="correct"></Icon>
      </button>
      <!-- <button v-show="!next" @click="no">
        <Icon icon="sad"></Icon>
      </button>
      <button v-show="!next" @click="yes">
        <Icon icon="happy"></Icon>
      </button> -->
      <button @click="setTime" v-show="next">
        <Icon size='mid-lar' icon="time"></Icon>
      </button>
      <button @click="nextCard" v-show="next">
        <Icon size='mid-lar' icon="array"></Icon>
      </button>
    </div>
  </div>
</template>

<script>
import freecard from '@/components/freecard'
import Icon from '@/components/Icon'
import wordcard from '@/components/wordcard'
import config from '@/config'
export default {
  data () {
    return {
      task: [],
      cardInfo: '',
      // 当前卡片张数
      index: '',
      // 当前显示卡片的哪一面
      cardSide: false,
      // 是否可以进入下一卡片
      next: false,
      timeGap: 0,
      timeGapList: [
        '5分钟',
        '30分钟',
        '1小时',
        '12小时',
        '1天',
        '2天',
        '4天',
        '7天',
        '15天'
      ],
      enter: false,
      leave: false,
      inputAnswer: '',
      // 动画控制变量
      down: false,
      right: false,
      hasTask: true

    }
  },
  computed: {
    windowHeight () {
      return wx.getSystemInfoSync().windowHeight
    },
    toEnd () {
      return this.index === this.task.length
    },
    showTimeGapList () {
      const arr = []
      let index
      for (let i = 0; i < 3; i++) {
        index = this.timeGap + i
        if (index < this.timeGapList.length) {
          arr.push(this.timeGapList[index])
        }
      }
      return arr
    }
  },
  components: {
    wordcard,
    freecard,
    Icon
  },
  watch: {
    async index (newValue, oldValue) {
      this.cardInfo = ''
      // this.enter = true
      this.down = false
      this.right = false
      this.answer = ''
      this.inputAnswer = ''
      let cardInfo
      if (this.task[newValue].isFree === 1) {
        wx.showLoading({
          title: '卡片正在掉落...'
        })
        cardInfo = await this.$request(`${config.host}/word/oneWord?word=${this.task[newValue].voc}`)
        this.cardInfo = cardInfo.word
        wx.hideLoading()
      } else {
        this.cardInfo = this.task[newValue]
      }
      this.next = false
      this.down = true
      this.timeGap = this.task[newValue].nextGap
      if (this.task[newValue].isFree === 0) {
        this.answer = this.cardInfo.freeBack
      } else {
        this.answer = this.cardInfo.word_name
      }
    }
  },
  onShow () {

  },

  methods: {
    inputSth () {
      this.$nextTick(() => {
        this.$refs.text3.focus()
      })
    },
    // 返回
    backTo () {
      wx.switchTab({
        url: '/pages/main/main'
      })
    },
    // 重置页面
    async initPage () {
      this.index = ''
      this.cardSide = false
      this.next = false
      this.timeGap = 0
      this.task = []
      this.cardInfo = ''
      const openId = await wx.getStorageSync('userInfo').openId
      wx.showLoading({
        title: '正在获取卡片流...'
      })
      const res = await this.$request(`${config.host}/word/getMyTask?openId=${openId}`)
      this.task = res.cards
      wx.hideLoading()
      if (!res || res.cards.length === 0) {
        this.hasTask = false
        return
      }
      this.index = 0
    },
    // 设置提醒时间
    setTime () {
      const self = this
      wx.showActionSheet({
        itemList: this.showTimeGapList,
        success (res) {
          console.log('index', res.tapIndex)
          console.log(self.timeGap)
          self.timeGap += res.tapIndex
          console.log('timeGap', self.timeGap)
        }
      })
    },
    // 下一张卡片
    async nextCard () {
      this.right = true
      setTimeout(() => {
        this.right = false
        this.index++
      }, 1000)
      if (this.index === this.task.length) {
        console.log('Cards out')
        // console.log('更新', this.timeGap)
        // const res = await this.$request(`${config.host}/word/updateTimeGap`, 'POST', {
        //   id: this.task[this.index].id,
        //   timeGap: this.timeGap
        // })
        // console.log(res)
      } else {
        console.log('更新', this.timeGap)
        const res = await this.$request(`${config.host}/word/updateTimeGap`, 'POST', {
          id: this.task[this.index].id,
          timeGap: this.timeGap
        })
        console.log(res)
      }
    },
    // 检查答案
    checkAns () {
      if (!this.inputAnswer) {
        this.$message.warning('请输入答案')
        return
      }
      this.next = true
      this.cardSide = false
    },
    // // 记不住这个单词
    // no () {
    //   this.next = true
    //   this.cardSide = false
    // },
    // yes () {
    //   // 记录这个单词
    //   this.next = true
    //   this.cardSide = false
    //   this.timeGap++
    // },
    reverse () {
      this.cardSide = !this.cardSide
    }
  },
  async mounted () {
    this.initPage()
    wx.loadFontFace({
      family: 'worksans',
      source: 'url("https://img.xhfkindergarten.cn/WorkSans-Thin.woff.ttf")'
    })
  }
}
</script>
<style lang="less" scoped>
// .enter {
//   animation: enter 1s ease-in-out forwards !important;
// }
// .leave{
//   animation: leave 0.8s ease-in-out forwards !important;
// }
// @keyframes enter {
//   from {
//     position: relative;
//     top:-800px;
//   }
//   to {
//     position: relative;
//     top:0;
//   }
// }
// @keyframes leave {
//   from {
//     position: relative;
//     left:0;
//   }
//   to {
//     position: relative;
//     left: -800rpx;
//   }
// }
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
      font-family: 'siyuanBold';
      text-align: center;
      position: absolute;
      bottom: 0;
      width: 100%;
      font-size: 60rpx;
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
      background: #587AA5;
      color: #fff;
      font-size: 32rpx;
      line-height: 100rpx;
    }
  }
}
.right{
  left: 700rpx !important;
}
.down{
  top: 0 !important;
}
.fadein{
  opacity: 1 !important;
}
.card-container{
  position: relative;
  left: 0;
  top: -800rpx;
  z-index: -1;
  width: 80%;
  margin: 0 auto;
  transition: all 1s;
  // position: relative; top: -200rpx;
  // animation: down 1s ease-in-out forwards;
}
.answer-tip{
  opacity: 0;
  font-size: 14px;
  font-family: 'worksans';
  padding-left: 100rpx;
  padding-bottom: 30rpx;
  font-weight: bolder;
  color: #999;
  margin-top: 100rpx;
  // animation: slowup 1s ease-in-out forwards;
}
.input-container{
  position: relative;
  top: -800rpx;
  opacity: 0;
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  .single-input{
    z-index:0;
    // animation: slowup 1s ease-in-out forwards;
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    padding: 0 30rpx;
    font-size: 30rpx;
    background: #EEE;
    text-align: center;
    margin: 0 10rpx 0;
  }
  // @keyframes slowup {
  //   from {
  //     opacity: 0;
  //   }
  //   to {
  //     opacity: 1;
  //   }
  // }
}
.fadein{
  opacity: 1 !important;
}
.bottom-container{
  height: 140rpx;
  display: flex;
  opacity: 0;
  justify-content: space-around;
  border-top-left-radius: 40rpx;
  border-top-right-radius: 40rpx;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #F6F6F6;
  button{
    height: 100%;
    background: #F6F6F6;
    display: flex;
    align-items: center;
  }
}
// .hasCard{
//   animation: show 1s ease-in forwards;
// }
// @keyframes show {
//   from {height: 0; opacity: 0;}
//   to {height:160rpx; opacity: 1;}
// }
// .noCard{
//   display:none;
//   animation: show 1s backwards;
// }
.page-container{
  padding-bottom: 200rpx;
}
@font-face {font-family: 'siyuanBold';
  src: url('//at.alicdn.com/t/webfont_xiycqi2lgj.eot'); /* IE9*/
  src: url('//at.alicdn.com/t/webfont_xiycqi2lgj.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('//at.alicdn.com/t/webfont_xiycqi2lgj.woff') format('woff'), /* chrome、firefox */
  url('//at.alicdn.com/t/webfont_xiycqi2lgj.ttf') format('truetype'), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
  url('//at.alicdn.com/t/webfont_xiycqi2lgj.svg#NotoSansHans-Black') format('svg'); /* iOS 4.1- */
}
.background {
  background-image: url('https://img.xhfkindergarten.cn/toptal-blog-image-1501178946393-ce513b02e7d488a192ed06a88c2f2759.png')
}
</style>



