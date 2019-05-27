<template>
  <div class="page-container">
    <div class="gray-container">
      <div class="circle">
        <div class="title">
          {{typeInfo.title}}
        </div>
      </div>
      <div class="type">
        {{typeInfo.type}}
      </div>
      <div class="explain">
        {{typeInfo.explain}}
      </div>
    </div>
    <div class="white-container">
      <div class="title">Word Sources:</div>
    </div>
    <div class="book-container">
      <booklist @select="select" @unselect="unselect" v-for="item in bookList" :key="item.id" :bookInfo="item"></booklist>
    </div>
    <div class="bottom-container">
      <button @click="backTo" class="left">
        <img class="leftbtn" src="/static/icon/back.png">
      </button>
      <button @click="comfirm" class="right">
        <img class="rightpic" src="/static/icon/right.png">确认
      </button>
    </div>
  </div>
</template>
<script>
import config from '@/config'
import booklist from '@/components/booklist'
export default {
  data () {
    return {
      // 之前选择的类别
      typeInfo: '',
      // 书籍列表
      bookList: [],
      // 被选中的书籍列表
      selectedBooks: []
    }
  },
  components: {
    booklist
  },
  onLoad (options) {
    console.log(options)
    this.typeInfo = {
      ...options
    }
  },
  computed: {
  },
  methods: {
    // 确认
    async comfirm () {
      if (this.selectedBooks.length === 0) {
        this.$message.warning('选书啊崽种', 1000)
        return
      }
      const openId = wx.getStorageSync('userInfo').openId
      console.log(openId)
      wx.showLoading({
        title: '拿书ing...'
      })
      const res = await this.$request(`${config.host}/word/addBook`, 'POST', {
        openId,
        bookList: this.selectedBooks,
        selected: this.typeInfo.title
      }).catch(err => {
        this.$message.error(err)
      })
      if (res.success) {
        wx.hideLoading()
        this.$message.success('选择成功')
        // 更新信息， 主要是选择的类别信息放入localStorage
        wx.login({
          success (res) {
            wx.request({
              url: `${config.host}/login`,
              method: 'POST',
              data: {
                code: res.code
              },
              success (res) {
                if (res.data.success) {
                  console.log(res)
                  wx.setStorageSync('userInfo', res.data.userInfo)
                }
              }
            })
          }
        })
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/main/main'
          })
        }, 1000)
      }
    },
    // 返回
    backTo () {
      this.selectedBooks = []
      wx.navigateBack({
        delta: 1
      })
    },
    unselect (options) {
      this.selectedBooks.forEach((item, index) => {
        if (item === options.id) {
          this.selectedBooks.splice(index, 1)
        }
      })
    },
    select (options) {
      this.selectedBooks.push(options.id)
    },
    async getBookList () {
      wx.showLoading({
        title: '加载资料列表'
      })
      // 获取图书列表
      const res = await this.$request(`${config.host}/word/getBookList?type=${this.typeInfo.title}`)
        .catch(err => {
          throw err
        })
      this.bookList = res.bookList
      this.formatBookList(this.bookList)
      wx.hideLoading()
    },
    formatBookList (arr) {
      arr.forEach(item => {
        item.selected = false
      })
    }
  },
  async mounted () {
    wx.loadFontFace({
      family: 'Bold',
      source: 'url("https://img.xhfkindergarten.cn/ADAM.CG%20PRO.otf")'
    })
    wx.loadFontFace({
      family: 'worksans',
      source: 'url("https://img.xhfkindergarten.cn/WorkSans-Thin.woff.ttf")'
    })
    this.getBookList()
  },
  onShow () {
    this.bookList = []
  }
}
</script>
<style lang="less" scoped>
.page-container{
  padding-bottom: 140rpx;
  .gray-container{
    height: 800rpx;
    width: 100%;
    background: #e6e5e3;
    flex-direction: column;
    align-items: center;
    display: flex;
    justify-content: center;
    border-bottom-left-radius: 100rpx;
    border-bottom-right-radius: 100rpx;
    .circle{
      margin-top: 100rpx;
      border-radius: 50%;
      width: 500rpx;
      height: 500rpx;
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      .title{
        font-family: 'Bold';
        font-size: 112rpx;
        text-align: center;
        color: #706F74;
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
  .white-container{
    padding: 50rpx 40rpx;
    .title{
      font-family: 'Bold';
      font-size: 32rpx;
    }
  }
  .book-container{
    padding: 0 40rpx;
  }
}
.bottom-container{
  padding: 0 30rpx;
  height: 140rpx;
  background: #FFF;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  .left{
    background: #F7F6FB;
    width: 25%;
    height: 100rpx;
    border-radius: 50rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    .leftbtn{
      height:50rpx;
      width:50rpx;
    }
  }
  .right{
    background: #6497D7;
    width: 60%;
    height: 100rpx;
    border-radius: 50rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    .rightpic{
      height: 50rpx;
      width: 50rpx;
      margin: 0 10rpx;
    }
  }
}
</style>



