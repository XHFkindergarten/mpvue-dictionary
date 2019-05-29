<template>
  <div :class="[{'background':toEnd||!hasTask}, 'page-container']" :style="'min-height:'+windowHeight+'px;'">
    <div :class="[{'down':down},{'left':left},{'right':right},'card-container']">
      <wordcard v-if="cardInfo&&task[index].isFree==1" :test="false" :wordInfo="cardInfo"></wordcard>
      <freecard v-if="cardInfo&&task[index].isFree==0" :wordInfo="cardInfo"></freecard>
    </div>
    <div v-if="toEnd || !hasTask" class="bird-container">
      <div class="wrapper">
        <img class="bird" src="https://img.xhfkindergarten.cn/boxer-bird.png">
        <div class="word">恭喜完成所有卡片</div>
      </div>
      <div class="btn-container">
        <button @click="backTo" class="back">返回</button>
      </div>
    </div>
    <div :class="[{fadein:!toEnd&&task.length>0}, 'bottom-container']">
      <button @click="nextCard(0)">
        <Icon icon="sad"></Icon>
        <div class="text">{{timeGapList[timeGap]}}</div>
      </button>
      <button v-if="timeGap+1<timeGapList.length" @click="nextCard(1)">
        <Icon icon="Happy"></Icon>
        <div class="text">{{timeGapList[timeGap+1]}}</div>
      </button>
      <button v-if="timeGap+2<timeGapList.length" @click="nextCard(2)">
        <Icon icon="sohappy"></Icon>
        <div class="text">{{timeGapList[timeGap+2]}}</div>
      </button>
      <!-- <button @click="setTime" v-show="next">
        <Icon size='mid-lar' icon="time"></Icon>
      </button>
      <button @click="nextCard" v-show="next">
        <Icon size='mid-lar' icon="array"></Icon>
      </button> -->
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
      // // 是否可以进入下一卡片
      // next: false,
      // timeGap的意思就是当前经过了这个时间段才加入队列
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
      down: false,
      left: false,
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
      console.log('index change')
      this.cardInfo = ''
      this.down = false
      this.right = false
      let cardInfo
      // isFree=1说明是单词卡片
      if (this.task[newValue].isFree === 1) {
        wx.showLoading({
          title: 'falling...'
        })
        cardInfo = await this.$request(`${config.host}/word/oneWord?word=${this.task[newValue].voc}`)
        this.cardInfo = cardInfo.word
        wx.hideLoading()
      } else {
        this.cardInfo = this.task[newValue]
      }
      this.down = true
      this.next = false
      this.timeGap = this.task[newValue].nextGap
    }
  },
  onShow () {

  },
  methods: {
    // 返回
    backTo () {
      this.$store.route = 'main'
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
    // // 设置提醒时间
    // setTime () {
    //   const self = this
    //   wx.showActionSheet({
    //     itemList: this.showTimeGapList,
    //     success (res) {
    //       console.log('index', res.tapIndex)
    //       console.log(self.timeGap)
    //       self.timeGap += res.tapIndex
    //       console.log('timeGap', self.timeGap)
    //     }
    //   })
    // },

    // 提交卡片
    async nextCard (gap) {
      wx.vibrateShort()
      // 启动左移动画
      this.right = true
      setTimeout(() => {
        this.right = false
        this.index++
      }, 600)
      console.log(`提交第${this.index + 1}张卡片,总共${this.task.length}张`)
      const res = await this.$request(`${config.host}/word/updateTimeGap`, 'POST', {
        id: this.task[this.index].id,
        timeGap: this.timeGap + gap
      })
      console.log(`当前gap${this.timeGap}, 提交gap${this.timeGap + gap}`)
      console.log(res)
    }
  },
  async mounted () {
    this.initPage()
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
// @-webkit-keyframes enter {
//   from {
//     position: relative;
//     top:-800px;
//   }
//   to {
//     position: relative;
//     top:0;
//   }
// }
// @-webkit-keyframes leave {
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
.left{
  left: -700rpx !important;
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
  padding-bottom: 160rpx;
  z-index: 50;
  width: 80%;
  margin: 0 auto;
  position: relative;
  transition: all 0.2s;
  left: 0;
  top: -800rpx;
  // animation: down 1s ease-in-out forwards;
}
.bottom-container{
  z-index: 51;
  transition: opacity 1s;
  opacity: 0;
  height: 160rpx;
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
    height: 100%;
    background: #F6F6F6;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .text{
    height:14px;
    font-size: 14px;
    color: #707070;
  }
}
// .hasCard{
//   // animation: show 1s ease-in forwards;
// }
// @keyframes show {
//   from {height: 0; opacity: 0;}
//   to {height:160rpx; opacity: 1;}
// }
// .noCard{
//   display:none;
//   // animation: show 1s backwards;
// }
.page-container{
  // padding-bottom: 200rpx;
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



