<template>
  <div class="card-container">
    <div class="pic-container">
      <img class="pic" :src="picUrl">
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
        <div class="sent-container" v-for="sent in wordInfo.sentense" :key="sent.orig">
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
      usAudio: ''
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
    wx.loadFontFace({
      family: 'worksans',
      source: 'url("http://img.xhfkindergarten.cn/WorkSans-Thin.woff.ttf")'
    })
  }
}
</script>
<style lang="less" scoped>
.max-height{
  max-height: 1000rpx !important;
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
    .sent-container{
      width: 90%;
      .en{
        margin: 40rpx 0;
        font-weight: bolder;
        font-family: 'worksans';
        font-size: 14px;
        color: #8A8A8A;
      }
      .cn{
        font-size: 14px;
        color: #8A8A8A;
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
</style>
