<template>
  <div class="page-container">
    <div class="search-container">
      <input v-model="searchText" @input="searchInput" :focus="autoFocus" class="search" placeholder-style="font-size:14px;" comfirm-type="search" placeholder="请输入搜索单词" type="text">
      <button class="cancel">取消</button>
    </div>
    <div @click="chooseItem(word)" v-for="word in suggestList" :key="word.word" class="search-item">
      <searchItem :word="word"></searchItem>
    </div>
  </div>
</template>

<script>
import searchItem from '@/components/searchItem'
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
      wordInfo: ''
    }
  },
  components: {
    searchItem
  },
  computed: {
  },
  methods: {
    async chooseItem (word) {
      this.searchText = ''
      this.suggestList = []
      console.log(word.word)
      const res = await this.$request(`${config.host}/word/oneWord?word=${word.word}`)
      console.log(res.word)
    },
    async searchInput () {
      const res = await this.$request(`${config.host}/word/searchWord?text=${this.searchText}`)
      this.suggestList = res.words
      console.log(this.suggestList)
    }
  }
}
</script>

<style lang="less" scoped>
.page-container{
  padding: 0 40rpx;
  .search-container{
    padding: 0 0 20rpx;
    border-bottom: 1px solid #EEE;
    margin: 40rpx 0 0;
    width: 100%;
    display: flex;
    justify-content: space-around;
    .search{
      width: 70%;
      font-size: 16px;
      padding: 0 40rpx;
      height: 70rpx;
      border-radius: 35rpx;
      background: #EEE;
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
}
@font-face {
  font-family: 'cancel';
  src: url('//at.alicdn.com/t/webfont_8ky1ej1f4hj.eot'); /* IE9*/
  src: url('//at.alicdn.com/t/webfont_8ky1ej1f4hj.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('//at.alicdn.com/t/webfont_8ky1ej1f4hj.woff') format('woff'), /* chrome、firefox */
  url('//at.alicdn.com/t/webfont_8ky1ej1f4hj.ttf') format('truetype'), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
  url('//at.alicdn.com/t/webfont_8ky1ej1f4hj.svg#思源黑体-极细') format('svg'); /* iOS 4.1- */
}
</style>
