<template>
  <div :class="info.selected?'book-container selected':'book-container'" @click="select">
    <div class="title">{{bookInfo.name}}</div> 
    <div class="info">{{bookInfo.author}} {{bookInfo.publisher}}</div> 
    <div class="info">{{bookInfo.version}}</div>
    <div class="info">单词量:{{bookInfo.itemNum}}</div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      info: this.bookInfo
    }
  },
  props: ['bookInfo'],
  methods: {
    select () {
      if (this.info.selected) {
        this.info.selected = false
        this.$emit('unselect', this.info)
      } else {
        this.info.selected = true
        this.$emit('select', this.info)
      }
      console.log(this.info.selected)
    }
  },
  computed: {

  },
  watch: {
    bookInfo: {
      handler: (newValue, oldValue) => {
        this.info = newValue
      },
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
.selected{
  background: #F2F1F0;
  // border: 2px solid #958D8A !important;
  
}
.book-container{
  // border: 2px solid #fff;
  border-radius: 10rpx;
  padding: 20rpx 10rpx;
  margin: 40rpx 0;
  .title{
    font-size: 16px;
    font-weight: thin;
  }
  .info {
    font-size: 12px;
    color: #999;
  }
}
</style>
