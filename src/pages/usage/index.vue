<template>
  <div class="page-container">
    <div class="gray-container">
      <div @click="removeDetail" v-show="hasDetail" class="remove">
        <Icon icon="circle-cross"></Icon>
      </div>
      <div @click="startLearning" class="circle">
        <div :class="hasDetail?'title2':'title'">
          {{hasDetail?vocDetail.vocName:typeInfo.title}}
        </div>
        <div v-show="!hasDetail" class="start">tap to start</div>
      </div>
      <div v-if="hasDetail" style="width:90%;">
        <div class="pron">
          <div @click="audioUk()" class="uk">英 {{vocDetail.phEn}}<img v-if="vocDetail.phEn_mp3" src="/static/icon/sound.png"></div>
          <div @click="audioUs()" class="uk">美 {{vocDetail.phAm}}<img v-if="vocDetail.phAm_mp3" src="/static/icon/sound.png"></div>
          <div v-for="part in meaning" :key="part.type" class="meaning">
            {{part.type}} {{part.means}}
          </div>
        </div>
        <div class="word-status">
          <div v-show="vocDetail.vocPl" class="word-pl">复数:{{vocDetail.vocPl}}</div>
          <div v-show="vocDetail.vocPast" class="word-pl">过去式:{{vocDetail.vocPast}}</div>
          <div v-show="vocDetail.vocDone" class="word-pl">完成时:{{vocDetail.vocDone}}</div>
          <div v-show="vocDetail.vocIng" class="word-pl">进行时:{{vocDetail.vocIng}}</div>
          <div v-show="vocDetail.vocEr" class="word-pl">比较级:{{vocDetail.vocEr}}</div>
          <div v-show="vocDetail.vocEst" class="word-pl">最高级:{{vocDetail.vocEst}}</div>
        </div>
        <div @click="toggleSent" class="but-container">
          <div :class="showSent?'down':'up'">
            <Icon size="mini" icon="down"></Icon>
          </div>
        </div>
        <div v-show="showSent" class="sent-container" v-for="sent in sentenses" :key="sent.sent">
          <div class="en"><span v-html="sent.sent"></span></div>
          <div class="cn">{{sent.sentCn}}</div>
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
    <div v-for="voc in showVocList" :key="voc.id" @click="showDetail(voc)" class="voc-container">
      {{voc.vocInfo.vocabulary}}
    </div>
    <div v-if="vocList.length!==vocListIndex*10" class="bottom-tip">
      {{bottomLoading?bottomTip2:bottomTip1}}
    </div>
    <div v-else class="bottom-tip">{{bottomTip3}}</div>
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
        }, {
          title: 'Null',
          type: '请选择单词参考书',
          explain: 'Plz choose ur book'
        }
      ],
      typeName: '',
      // 单词列表
      vocList: [],
      // 展示的单个单词信息
      vocDetail: '',
      showSent: false,
      vocListIndex: 1,
      bottomLoading: false,
      bottomTip1: 'Pull to get more:)',
      bottomTip2: 'Loading...(*╹▽╹*)',
      bottomTip3: 'No more Words'
    }
  },
  onReachBottom () {
    this.bottomLoading = true
    setTimeout(() => {
      this.bottomLoading = false
      if (this.vocList.length / 10 !== this.vocListIndex) {
        this.vocListIndex++
      }
    }, 1200)
  },
  components: {
    Icon
  },
  computed: {
    showVocList () {
      return this.vocList.slice(0, this.vocListIndex * 10)
    },
    typeInfo () {
      const typename = this.typeName
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
    },
    sentenses () {
      return [
        {
          sent: this.vocDetail.sent1,
          sentCn: this.vocDetail.sent1Cn
        }, {
          sent: this.vocDetail.sent2,
          sentCn: this.vocDetail.sent2Cn
        }
      ]
    },
    meaning () {
      let arr1, arr2, type
      const res = []
      if (!this.vocDetail) {
        return []
      } else {
        arr1 = this.vocDetail.means.split('lzk1')
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
  methods: {
    // 开始学习
    startLearning () {
      if (this.typeName === 'Null') {
        this.$store.route = 'select'
        wx.navigateTo({
          url: '/pages/select/main'
        })
        return
      }
      if (!this.vocDetail) {
        this.$store.route = 'vocGroup'
        wx.navigateTo({
          url: '/pages/vocGroup/main'
        })
      }
    },
    toggleSent () {
      this.showSent = !this.showSent
    },
    audioUk () {
      if (!this.vocDetail.phEn_mp3) {
        return
      }
      wx.showLoading({
        title: '咳咳..'
      })
      // 创建音频实例
      const audio = wx.createInnerAudioContext()
      audio.autoplay = true
      audio.src = this.vocDetail.phEn_mp3
      audio.onPlay(() => {
        // 播放时执行
        wx.hideLoading()
      })
      audio.onError((res) => {
        this.$message.error(res)
      })
    },
    audioUs () {
      if (!this.vocDetail.phAm_mp3) {
        return
      }
      wx.showLoading({
        title: '咳咳..'
      })
      // 创建音频实例
      const audio = wx.createInnerAudioContext()
      audio.autoplay = true
      audio.src = this.vocDetail.phAm_mp3
      audio.onPlay(() => {
        wx.hideLoading()
      })
      audio.onError((res) => {
        this.$message.error(res)
      })
    },
    removeDetail () {
      this.vocDetail = ''
    },
    // 获取单个单词的信息
    async showDetail (voc) {
      wx.showLoading({
        title: '获取单词信息ing'
      })
      const res = await this.$request(`${config.host}/word/oneWord?word=${voc.vocInfo.vocabulary}`)
      console.log(res)
      this.vocDetail = res.word
      wx.hideLoading()
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 500
      })
    },
    async getVocrecords () {
      wx.showLoading({
        title: '获取今日单词列表'
      })
      const openId = wx.getStorageSync('userInfo').openId
      const res = await this.$request(`${config.host}/word/getVocRecords?openId=${openId}`)
      console.log(res)
      wx.hideLoading()
      this.vocList = res.words
      this.typeName = res.typeName
    }
  },
  mounted () {
    this.getVocrecords()
    wx.loadFontFace({
      family: 'Bold',
      source: 'url("https://img.xhfkindergarten.cn/ADAM.CG%20PRO.otf")'
    })
    wx.loadFontFace({
      family: 'worksans',
      source: 'url("https://img.xhfkindergarten.cn/WorkSans-Thin.woff.ttf")'
    })
  },
  onShow () {
    this.getVocrecords()
  },
  onPullDownRefresh () {
    this.getVocrecords()
  }
}
</script>
<style lang="less" scoped>
.page-container{
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
        font-size: 112rpx;
        text-align: center;
        color: #706F74;
      }
      .title2{
        font-family: 'Bold';
        font-size: 90rpx;
        text-align: center;
        color: #706F74;
      }
      .start{
        font-family: 'worksans';
        font-size: 44rpx;
      }
    }
    .pron{
      margin-top: 40rpx;
      font-size: 30rpx;
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
        font-size: 26rpx;
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
        font-size: 28rpx;
        color: #8A8A8A;
      }
      .cn{
        font-size: 28rpx;
        color: #8A8A8A;
        margin-bottom: 30rpx;
      }
    }
    .type{
      font-weight: bolder;
      text-align: center;
      color: #413E49;
      font-weight: bolder;
      font-size: 48rpx;
      margin-top: 30rpx;
    }
    .explain {
      font-family: 'worksans';
      font-size: 28rpx;
      width: 80%;
      margin: 14rpx 0 40rpx;
      text-align: center;
    }
  }
  .pre{
    width: 90%;
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
    font-size: 40rpx;
  }
  .bottom-tip{
    font-family: 'worksans';
    font-size: 28rpx;
    text-align: center;
    color: #706F74;
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



