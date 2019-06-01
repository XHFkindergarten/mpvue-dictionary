<template>
  <div class="item-container">
    {{word.vocabulary}}
  </div>
</template>
<script>
export default {
  props: ['word']
}
</script>
<style lang="less" scoped>
.item-container{
  padding-left: 30rpx;
  width:100%;
  line-height: 80rpx;
}
</style>
