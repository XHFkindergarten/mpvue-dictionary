<template>
  <div class="container">
    <image :src="mainImg" mode="aspectFit"></image>
  </div>
</template>

<script>

export default {
  data () {
    return {
      mainImg: 'http://www.xhfkindergarten.cn:3000/assets/default-bird.png'
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
