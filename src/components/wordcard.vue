<template>
  <div class="card-container">
    <div class="pic-container">
      <img class="pic" :src="wordInfo.labelImg" :onload="onLoad">
    </div>
    <div :class="cardSide?'content-container':'content-container max-height'">
      <div class="word-name">{{wordInfo.word_name}}</div>
      <!-- <div class="word-mean">
        <span v-for="pron in wordInfo.symbols" :key="pron.ph_en">
          <span v-for="(part,_index) in pron.parts" :key="_index">
            {{part.means}}
          </span>
        </span>
      </div> -->
      <div v-if="!cardSide">
        <div class="pron" v-for="pron in wordInfo.symbols" :key="pron.ph_en">
          <div @click="audioUk(pron)" class="uk">英 {{pron.ph_en}}<img src="/static/icon/sound.png"></div>
          <div @click="audioUs(pron)" class="uk">美 {{pron.ph_am}}<img src="/static/icon/sound.png"></div>
          <div v-for="(part,_index) in pron.parts" :key="_index" class="meaning">
            {{part.part}} {{part.means}}
          </div>
        </div>
        <div class="word-status">
          <div v-show="wordInfo.exchange.word_pl" class="word-pl">复数:{{wordInfo.exchange.word_pl}}</div>
          <div v-show="wordInfo.exchange.word_past" class="word-pl">过去式:{{wordInfo.exchange.word_past}}</div>
          <div v-show="wordInfo.exchange.word_done" class="word-pl">完成时:{{wordInfo.exchange.word_done}}</div>
          <div v-show="wordInfo.exchange.word_ing" class="word-pl">进行时:{{wordInfo.exchange.word_ing}}</div>
          <div v-show="wordInfo.exchange.word_er" class="word-pl">比较级:{{wordInfo.exchange.word_er}}</div>
          <div v-show="wordInfo.exchange.word_est" class="word-pl">最高级:{{wordInfo.exchange.word_est}}</div>
        </div>
        <div @click="toggleSent" class="but-container">
          <div :class="showSent?'down':'up'">
            <Icon size="mini" icon="down"></Icon>
          </div>
        </div>
        <div v-show="showSent" class="sent-container" v-for="sent in wordInfo.sentense" :key="sent.orig">
          <div class="en"><span v-html="sent.orig"></span></div>
          <div class="cn">{{sent.trans}}</div>
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
      picUrl: 'http://img.xhfkindergarten.cn/default_label_img.jpg',
      // 音频实例
      ukAudio: '',
      usAudio: '',
      // 是否显示sentense
      showSent: false
    }
  },
  props: [
    'wordInfo',
    'cardSide'
  ],
  components: {
    Icon
  },
  methods: {
    toggleSent () {
      this.showSent = !this.showSent
    },
    audioUk (pron) {
      // 创建音频实例
      const audio = wx.createInnerAudioContext()
      audio.autoplay = true
      audio.src = pron.ph_en_mp3
      audio.onPlay(() => {
        // 播放时执行
      })
      audio.onError((res) => {
        this.$message.error(res)
      })
    },
    audioUs (pron) {
      // 创建音频实例
      const audio = wx.createInnerAudioContext()
      audio.autoplay = true
      audio.src = pron.ph_am_mp3
      audio.onError((res) => {
        this.$message.error(res)
      })
    }
  },
  mounted () {
    wx.loadFontFace({
      family: 'nolan',
      source: 'url("http://img.xhfkindergarten.cn/Nolan-Bold_0.ttf")'
    })
  }
}
</script>
<style lang="less" scoped>
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
  .pic-container{
    overflow: hidden;
    height: 400rpx;
    width: 100%;
    .pic{
      object-fit: cover;
    }
  }
  .content-container{
    overflow: hidden;
    max-height: 100rpx;
    transition: max-height 1s;
    padding: 30rpx 30rpx 60rpx;
    font-size: 16px;
    background: #F6F6F6;
    width: 100%;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    .word-name{
      width: 90%;
      font-family: 'nolan';
      font-size: 20px;
      margin-bottom: 10rpx;
    }
    .word-mean{
      width: 90%;
      font-family: 'nolan';
      font-size: 16px;
      margin-bottom: 10rpx;
    }
    .word-status{
      overflow: hidden;
      .word-pl{
        width: 45%;
        float: left;
        margin: 10rpx 0;
        font-size: 13px;
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
        font-family: 'English';
        font-size: 14px;
        color: #8A8A8A;
      }
      .cn{
        font-size: 14px;
        color: #8A8A8A;
        margin-bottom: 30rpx;
      }
    }
    .pron{
      font-size: 15px;
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
