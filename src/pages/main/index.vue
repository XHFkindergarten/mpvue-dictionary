<template>
  <div class="page-container">
    <div class="search-container">
      <input class="search" placeholder-style="font-size:14px;" @focus="searchFocus" placeholder="请输入搜索单词" type="text">
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
    searchFocus () {
      wx.navigateTo({
        url: '/pages/search/main'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.page-container{
  display: flex;
  justify-content: center;
  padding: 0 40rpx;
  .search-container{
    margin: 40rpx 0;
    width: 100%;
    .search{
      font-size: 16px;
      padding: 0 40rpx;
      height: 70rpx;
      border-radius: 35rpx;
      background: #EEE;
    }
    .button{
      display: absolute;
      right: 0;
      width: 40rpx;
      height: 40rpx;
    }
  }
}

</style>
