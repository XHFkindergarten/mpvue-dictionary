<template>
  <div class="container">
    <image :src="mainImg" mode="aspectFit"></image>
  </div>
</template>

<script>

export default {
  data () {
    return {
      mainImg: 'http://img.xhfkindergarten.cn/default-bird.png'
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.container{
  display: flex;
  flex-direction: column;
  align-items: center;
  .mainImg{
    width: 200rpx;
  }
}
</style>
