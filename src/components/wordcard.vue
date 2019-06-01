<template>
  <div class="card-container" @click="changeSide">
    <!-- <div class="pic-container">
      <image class="pic" :src="wordInfo.labelImg" mode="widthFill"></image>
    </div> -->
    <div class="word-name">{{wordInfo.vocName}}</div>

    <div :class="cardSide?'content-container':'content-container max-height'">
      
      <div v-if="!cardSide">
        <div class="pron">
          <div @click.stop="audioUk()" class="uk">英 {{wordInfo.phEn}}<img v-if="wordInfo.phEn_mp3" src="/static/icon/sound.png"></div>
          <div @click.stop="audioUs()" class="uk">美 {{wordInfo.phAm}}<img v-if="wordInfo.phAm_mp3" src="/static/icon/sound.png"></div>
          <div v-for="part in meaning" :key="part.type" class="meaning">
            {{part.type}} {{part.means}}
          </div>
        </div>
        <div class="word-status">
          <div v-show="wordInfo.vocPl" class="word-pl">复数:{{wordInfo.vocPl}}</div>
          <div v-show="wordInfo.vocPast" class="word-pl">过去式:{{wordInfo.vocPast}}</div>
          <div v-show="wordInfo.vocDone" class="word-pl">完成时:{{wordInfo.vocDone}}</div>
          <div v-show="wordInfo.vocIng" class="word-pl">进行时:{{wordInfo.vocIng}}</div>
          <div v-show="wordInfo.vocEr" class="word-pl">比较级:{{wordInfo.vocEr}}</div>
          <div v-show="wordInfo.vocEst" class="word-pl">最高级:{{wordInfo.vocEst}}</div>
        </div>
        <div @click.stop="toggleSent" class="but-container">
          <div :class="showSent?'down':'up'">
            <Icon size="mini" icon="down"></Icon>
          </div>
        </div>
        <div v-show="showSent" class="sent-container" v-for="sent in sentenses" :key="sent.sent">
          <div class="en"><span v-html="sent.sent"></span></div>
          <div class="cn">{{sent.sentCn}}</div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import Icon from '@/components/Icon'
export default {
  data () {
    return {
      picUrl: 'https://img.xhfkindergarten.cn/default_label_img.jpg',
      // 音频实例
      ukAudio: '',
      usAudio: '',
      // 是否显示sentense
      showSent: false,
      // 卡片正反面
      cardSide: true
    }
  },
  computed: {
    // 对返回的单词信息进行重新组装
    sentenses () {
      return [
        {
          sent: this.wordInfo.sent1,
          sentCn: this.wordInfo.sent1Cn
        }, {
          sent: this.wordInfo.sent2,
          sentCn: this.wordInfo.sent2Cn
        }
      ]
    },
    meaning () {
      let arr1, arr2, type
      const res = []
      if (!this.wordInfo) {
        return []
      } else {
        arr1 = this.wordInfo.means.split('lzk1')
        arr1.forEach(line => {
          arr2 = line.split('lzk2')
          type = arr2.shift()
          res.push({
            type,
            means: arr2.join('、')
          })
        })
      }
      return res
    }
  },
  props: [
    'wordInfo'
  ],
  components: {
    Icon
  },
  methods: {
    // 点击卡片body就翻面
    changeSide () {
      this.cardSide = !this.cardSide
    },
    toggleSent () {
      // 显示/隐藏例句
      this.showSent = !this.showSent
    },
    audioUk () {
      if (!this.wordInfo.phEn_mp3) {
        this.$message.warning('暂无音频')
        return
      }
      wx.vibrateShort({
        success: () => {
          console.log('震动')
        }
      })
      console.log('播放音频')
      wx.showLoading({
        title: '...咳咳'
      })
      // 创建音频实例
      const audio = wx.createInnerAudioContext()
      audio.autoplay = true
      audio.src = this.wordInfo.phEn_mp3
      audio.onPlay(() => {
        wx.hideLoading()
        // 播放时执行
        console.log('播放suc')
      })
      audio.onError((res) => {
        wx.hideLoading()
        this.$message.error(res)
      })
    },
    audioUs () {
      if (!this.wordInfo.phAm_mp3) {
        this.$message.warning('暂无音频')
        return
      }
      wx.vibrateShort({
        success: () => {
          console.log('震动')
        }
      })
      wx.showLoading({
        title: '...咳咳'
      })
      // 创建音频实例
      const audio = wx.createInnerAudioContext()
      audio.autoplay = true
      audio.src = this.wordInfo.phAm_mp3
      audio.onPlay(() => {
        wx.hideLoading()
        console.log('播放')
      })
      audio.onError((res) => {
        wx.hideLoading()
        this.$message.error(res)
      })
    }
  },
  mounted () {
    wx.loadFontFace({
      family: 'nolan',
      source: 'url("https://img.xhfkindergarten.cn/Nolan-Bold_0.ttf")'
    })
  },
  onShow () {
    wx.loadFontFace({
      family: 'nolan',
      source: 'url("https://img.xhfkindergarten.cn/Nolan-Bold_0.ttf")'
    })
  }
}
</script>
<style lang="less" scoped>
.none{
  display: none;
}
.down {
  transform: rotate(180deg);
  transition: all 0.6s;
}
.up {
  transform: rotate(0deg);
  transition: all 0.6s;
}
.max-height{
  max-height: 1300rpx !important;
}
.card-container{
  margin-top: 30rpx;
  height: auto;
  width: 100%;
  border-radius: 60rpx;
  overflow: hidden;
  // .pic-container{
  //   overflow: hidden;
  //   height: 400rpx;
  //   width: 100%;
  //   .pic{
  //     width: 100%;
  //     min-height: 100%;
  //     object-fit: cover;
  //   }
  // }
  .word-name{
    width: 90%;
    font-family: 'nolan';
    font-size: 60rpx;
    padding: 60rpx 30rpx 30rpx;
    background: #F6F6F6;
    margin-bottom: 6rpx;
  }
  .word-name2{
    width: 90%;
    font-size: 40rpx;
    margin-bottom: 6rpx;
    padding: 60rpx 30rpx 30rpx;
    background: #F6F6F6;
  }
  .content-container{
    // width: 90%;
    overflow: hidden;
    max-height: 100rpx;
    transition: max-height 1s;
    padding: 30rpx 30rpx 60rpx;
    font-size: 32rpx;
    background: #F6F6F6;
    width: 100%;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    .word-mean{
      width: 90%;
      font-family: 'nolan';
      font-size: 32rpx;
      margin-bottom: 10rpx;
    }
    .word-status{
      overflow: hidden;
      .word-pl{
        width: 45%;
        float: left;
        margin: 10rpx 0;
        font-size: 26rpx;
        color: #8A8A8A;
      }
    }
    .but-container{
      width: 90%;
      height: 70rpx;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    .sent-container{
      width: 90%;
      .en{
        margin: 10rpx 0 40rpx;
        font-weight: bolder;
        // font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        // font-family: 'Times New Roman', Times, serif;
        font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
        font-size: 28rpx;
        color: #8A8A8A;
      }
      .cn{
        font-size: 28rpx;
        color: #8A8A8A;
        margin-bottom: 30rpx;
      }
    }
    .pron{
      font-size: 32rpx;
      color: #8A8A8A;
      .uk{
        margin-right: 10rpx;
        display: inline-flex;
        align-items: center;
        img{
          width:40rpx;
          height: 40rpx;
        }
      }
      .meaning{
        width: 90%;
        margin: 10rpx 0;
      }
    }
  }
}
@font-face {font-family: 'English';
  src: url('//at.alicdn.com/t/webfont_s6tnn2d2j0h.eot'); /* IE9*/
  src: url('//at.alicdn.com/t/webfont_s6tnn2d2j0h.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('//at.alicdn.com/t/webfont_s6tnn2d2j0h.woff') format('woff'), /* chrome、firefox */
  url('//at.alicdn.com/t/webfont_s6tnn2d2j0h.ttf') format('truetype'), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
  url('//at.alicdn.com/t/webfont_s6tnn2d2j0h.svg#NotoSansHans-DemiLight') format('svg'); /* iOS 4.1- */
}
</style>
