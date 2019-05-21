<template>
  <div class="page-container">
    <div class="gray-container">
      <div @click="removeDetail" v-show="hasDetail" class="remove">
        <Icon icon="circle-cross"></Icon>
      </div>
      <div @click="startLearning" class="circle">
        <div :class="hasDetail?'title2':'title'">
          {{hasDetail?vocDetail.word_name:typeInfo.title}}
        </div>
        <div v-show="!hasDetail" class="start">tap to start</div>
      </div>
      <div v-if="hasDetail" style="width:90%;">
        <div class="pron" v-for="pron in vocDetail.symbols" :key="pron.ph_en">
          <div @click="audioUk(pron)" class="uk">英 {{pron.ph_en}}<img src="/static/icon/sound.png"></div>
          <div @click="audioUs(pron)" class="uk">美 {{pron.ph_am}}<img src="/static/icon/sound.png"></div>
          <div v-for="(part,_index) in pron.parts" :key="_index" class="meaning">
            {{part.part}} {{part.means}}
          </div>
        </div>
        <div class="word-status">
          <div v-show="vocDetail.exchange.word_pl" class="word-pl">复数:{{vocDetail.exchange.word_pl}}</div>
          <div v-show="vocDetail.exchange.word_past" class="word-pl">过去式:{{vocDetail.exchange.word_past}}</div>
          <div v-show="vocDetail.exchange.word_done" class="word-pl">完成时:{{vocDetail.exchange.word_done}}</div>
          <div v-show="vocDetail.exchange.word_ing" class="word-pl">进行时:{{vocDetail.exchange.word_ing}}</div>
          <div v-show="vocDetail.exchange.word_er" class="word-pl">比较级:{{vocDetail.exchange.word_er}}</div>
          <div v-show="vocDetail.exchange.word_est" class="word-pl">最高级:{{vocDetail.exchange.word_est}}</div>
        </div>
        <div @click="toggleSent" class="but-container">
          <div :class="showSent?'down':'up'">
            <Icon size="mini" icon="down"></Icon>
          </div>
        </div>
        <div v-show="showSent" class="sent-container" v-for="sent in vocDetail.sentense" :key="sent.orig">
          <div class="en"><span v-html="sent.orig"></span></div>
          <div class="cn">{{sent.trans}}</div>
        </div>
      </div>
      
      <div v-show="!hasDetail" class="type">
        {{typeInfo.type}}
      </div>
      <div v-show="!hasDetail" class="explain">
        {{typeInfo.explain}}
      </div>
    </div>
    <div class="pre">今日的单词列表</div>
    <div v-for="voc in vocList" :key="voc.id" @click="showDetail(voc)" class="voc-container">
      {{voc.vocInfo.vocabulary}}
    </div>
  </div>
</template>

<script>
import Icon from '@/components/Icon'
import config from '@/config'
export default {
  data () {
    return {
      typeList: [
        {
          title: 'CET4',
          type: '大学英语四级',
          explain: 'Collage Englist Test Band4'
        },
        {
          title: 'TEM4',
          type: '大学专业四级',
          explain: 'Test for English Majors-4'
        },
        {
          title: 'NEEP',
          type: '研究生入学考试',
          explain: 'the national entrance examination for postgraduate'
        },
        {
          title: 'TOFEL',
          type: '托福',
          explain: 'The Test of English as a Foreign Language'
        },
        {
          title: 'WDNMD',
          type: '不选了，随便背了，有什么好说哒',
          explain: 'Give me some words whatever it is'
        },
        {
          title: 'CET6',
          type: '大学英语六级',
          explain: 'Collage Englist Test Band6'
        },
        {
          title: 'TEM8',
          type: '大学专业八级',
          explain: 'Test for English Majors-8'
        },
        {
          title: 'IELTS',
          type: '雅思',
          explain: 'International English Language Testing System'
        }
      ],
      // 单词列表
      vocList: [],
      // 展示的单个单词信息
      vocDetail: '',
      showSent: false
    }
  },
  components: {
    Icon
  },
  computed: {
    typeInfo () {
      const typename = wx.getStorageSync('userInfo').selected
      return this.typeList.filter(t => {
        return t.title === typename
      })[0]
    },
    hasDetail () {
      if (!this.vocDetail) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    // 开始学习
    startLearning () {
      if (!this.vocDetail) {
        wx.navigateTo({
          url: '/pages/vocGroup/main'
        })
      }
    },
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
    },
    removeDetail () {
      this.vocDetail = ''
    },
    // 获取单个单词的信息
    async showDetail (voc) {
      const res = await this.$request(`${config.host}/word/oneWord?word=${voc.vocInfo.vocabulary}`)
      console.log(res)
      this.vocDetail = res.word
    },
    async getVocrecords () {
      wx.showLoading({
        title: '加载中'
      })
      const openId = wx.getStorageSync('userInfo').openId
      const res = await this.$request(`${config.host}/word/getVocRecords?openId=${openId}`)
      wx.hideLoading()
      this.vocList = res.words
    }
  },
  mounted () {
    this.getVocrecords()
    wx.loadFontFace({
      family: 'Bold',
      source: 'url("http://img.xhfkindergarten.cn/ADAM.CG%20PRO.otf")'
    })
    wx.loadFontFace({
      family: 'worksans',
      source: 'url("http://img.xhfkindergarten.cn/WorkSans-Thin.woff.ttf")'
    })
  }
}
</script>
<style lang="less" scoped>
.page-container{
  padding-bottom: 140rpx;
  .gray-container{
    padding-bottom: 80rpx;
    min-height: 800rpx;
    width: 100%;
    background: #e6e5e3;
    flex-direction: column;
    align-items: center;
    display: flex;
    justify-content: center;
    border-bottom-left-radius: 100rpx;
    border-bottom-right-radius: 100rpx;
    position: relative;
    .remove{
      width: 60rpx;
      height: 60rpx;
      position: absolute;
      left: 30rpx;
      top: 30rpx;
    }
    .circle{
      // box-shadow: 2px 2px 5px #333;
      margin-top: 100rpx;
      border-radius: 50%;
      width: 500rpx;
      height: 500rpx;
      background: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .title{
        font-family: 'Bold';
        font-size: 56px;
        text-align: center;
        color: #706F74;
      }
      .title2{
        font-family: 'Bold';
        font-size: 45px;
        text-align: center;
        color: #706F74;
      }
      .start{
        font-family: 'worksans';
        font-size: 22px;
      }
    }
    .pron{
      margin-top: 40rpx;
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
        width: 100%;
        margin: 40rpx 0;
      }
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
      width: 100%;
      height: 70rpx;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .down {
        transform: rotate(180deg);
        transition: all 0.6s;
      }
      .up {
        transform: rotate(0deg);
        transition: all 0.6s;
      }
    }
    .sent-container{
      width: 100%;
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
    .type{
      font-weight: bolder;
      text-align: center;
      color: #413E49;
      font-weight: bolder;
      font-size: 24px;
      margin-top: 30rpx;
    }
    .explain {
      font-family: 'worksans';
      font-size: 14px;
      width: 80%;
      margin: 14rpx 0 40rpx;
      text-align: center;
    }
  }
  .pre{
    width: 100%;
    padding: 30rpx;
    text-align: left;
    color: #706F74;
    font-family: 'boldfont';
  }
  .voc-container{
    width: 100%;
    padding: 60rpx 0;
    text-align: center;
    font-family: 'Bold';
    font-size: 20px;
  }
}
@font-face {font-family: 'boldfont';
  src: url('//at.alicdn.com/t/webfont_vczne23jpvh.eot'); /* IE9*/
  src: url('//at.alicdn.com/t/webfont_vczne23jpvh.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('//at.alicdn.com/t/webfont_vczne23jpvh.woff') format('woff'), /* chrome、firefox */
  url('//at.alicdn.com/t/webfont_vczne23jpvh.ttf') format('truetype'), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
  url('//at.alicdn.com/t/webfont_vczne23jpvh.svg#NotoSansHans-Black') format('svg'); /* iOS 4.1- */
}
</style>



