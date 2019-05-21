<template>
  <div class="page-container">
    <div class="search-container">
      <div class="search-wrapper">
        <input v-model="searchText" @confirm="comfirmInput" @blur="searchBlur" @input="searchInput" :focus="autoFocus" class="search" placeholder-style="font-size:14px;font-family:'cancel';" comfirm-type="search" placeholder="请输入搜索单词" type="text">
        <button v-if="searchText" @click="cancel" class="clear">
          <img src="/static/icon/cross2.png" style="width:20rpx;height:20rpx;">
        </button>
      </div>
      <button @click="backTo" class="cancel">取消</button>
    </div>
    <div @click="chooseItem(word)" v-for="word in suggestList" :key="word.word" class="search-item">
      <searchItem :word="word"></searchItem>
    </div>
    <div v-show="hasCard" class="card-container">
      <wordcard :wordInfo="wordInfo" :cardSide="cardSide"></wordcard>
    </div>
    <div :class="hasCard?'bottom-container hasCard':'noCard'">
      <button @click="removeCard">
        <Icon icon="crossb"></Icon>
      </button>
      <button @click="reverse">
        <Icon icon="reverse"></Icon>
      </button>
      <button @click="addCard">
        <Icon icon="add"></Icon>
      </button>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/Icon'
import searchItem from '@/components/searchItem'
import wordcard from '@/components/wordcard'
import config from '@/config'
export default {
  data () {
    return {
      // 搜索框输入内容
      searchText: '',
      // 是否自动聚焦
      autoFocus: true,
      // 搜索建议
      suggestList: [],
      // 用于显示的单词信息
      wordInfo: '',
      // 卡片是否处于正面
      cardSide: true
    }
  },
  components: {
    Icon,
    searchItem,
    wordcard
  },
  computed: {
    hasCard () {
      return this.wordInfo !== ''
    }
  },
  methods: {
    // 添加卡片
    async addCard () {
      const openId = wx.getStorageSync('userInfo').openId
      console.log(openId)
      const isFree = 1
      const voc = this.wordInfo.word_name
      const res = await this.$request(`${config.host}/word/addCard`, 'POST', {
        openId,
        isFree,
        voc
      })
      console.log(res)
      if (res.success) {
        this.$message.success('添加卡片成功')
      } else {
        this.$message.warning(res.msg)
      }
    },
    // 返回
    backTo () {
      wx.switchTab({
        url: '/pages/main/main'
      })
    },
    // 清空搜索内容
    cancel () {
      this.searchText = ''
      this.suggestList = []
    },
    // 不需要这张卡片
    removeCard () {
      this.wordInfo = ''
    },
    // 翻转卡片
    reverse () {
      this.cardSide = !this.cardSide
    },
    async comfirmInput () {
      await this.searchWord(this.searchText)
      this.searchText = ''
      this.suggestList = []
    },
    async chooseItem (word) {
      this.searchText = ''
      this.suggestList = []
      await this.searchWord(word.word)
    },
    async searchWord (input) {
      const res = await this.$request(`${config.host}/word/oneWord?word=${input}`)
      if (res.word.word_name) {
        this.wordInfo = res.word
      } else {
        this.$message.warning('词库暂无该单词,请在单词本手动添加单词')
      }
    },
    async searchInput () {
      const res = await this.$request(`${config.host}/word/searchWord?text=${this.searchText}`)
      this.suggestList = res.words
    },
    searchBlur () {
      this.wordInfo = ''
      this.cardSide = true
    }
  }
}
</script>

<style lang="less" scoped>
.page-container{
  padding: 0 40rpx 200rpx;
  .search-container{
    position: relative;
    z-index: 20;
    background-color: #fff;
    padding: 40rpx 0 20rpx;
    border-bottom: 1px solid #EEE;
    width: 100%;
    display: flex;
    justify-content: space-around;
    .search-wrapper{
      width: 80%;
      position: relative;
      .clear{
        line-height: 70rpx;
        background: #EEE;
        position: absolute;
        right: 20rpx;
        top:0;
        width: 40rpx;
        height:70rpx;
      }
      .search{
        z-index: 1;
        font-size: 16px;
        padding: 0 40rpx;
        height: 70rpx;
        border-radius: 35rpx;
        background: #EEE;
      }
    }
    
    .cancel{
      font-family: 'cancel';
      font-size: 16px;
      line-height: 38px;
      background: #fff;
    }
    .button{
      display: absolute;
      right: 0;
      width: 40rpx;
      height: 40rpx;
    }
  }
  .search-item{
    width: 100%;
    height: 80rpx;
    border-bottom: 1px solid #EEE;
    border-radius: 20rpx;
  }
  .search-item:hover{
    background: #EEE;
  }
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
}
div{
  transition: all 1s;
}
@font-face {
  font-family: 'cancel';
  src: url('//at.alicdn.com/t/webfont_xvlyehysed.eot'); /* IE9*/
  src: url('//at.alicdn.com/t/webfont_xvlyehysed.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('//at.alicdn.com/t/webfont_xvlyehysed.woff') format('woff'), /* chrome、firefox */
  url('//at.alicdn.com/t/webfont_xvlyehysed.ttf') format('truetype'), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
  url('//at.alicdn.com/t/webfont_xvlyehysed.svg#思源黑体-极细') format('svg'); /* iOS 4.1- */
}
</style>
