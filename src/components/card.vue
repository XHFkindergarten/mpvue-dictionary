<template>
  <div @click="select" class="card-container" :class="cardInfo.selected?'selected':''">
    <div class="circle">
      <div class="title">{{cardInfo.title}}</div>
    </div>
    <div class="type-name">{{cardInfo.type}}</div>
    <div class="explain">{{cardInfo.explain}}</div>
  </div>
</template>

<script>
export default {
  props: ['cardInfo'],
  methods: {
    select () {
      this.$emit('select', this.cardInfo)
    }
  }
}
</script>

<style lang="less" scoped>
.selected{
  background: #CFDEE7 !important;
}
.card-container{
  background: #e6e5e3;
  border-radius: 30rpx;
  height: 580rpx;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30rpx;
  .circle{
    height: 240rpx;
    width: 240rpx;
    border-radius: 50%;
    background: #fff;
    margin-top: 60rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    .title {
      font-family: 'Bold';
      font-size: 72rpx;
      text-align: center;
      color: #706F74;
    }
  }
  .type-name {
    width: 80%;
    text-align: center;
    color: #413E49;
    font-weight: bolder;
    font-size: 36rpx;
    margin-top: 30rpx;
  }
  .explain {
    font-family: 'worksans';
    font-size: 28rpx;
    width: 80%;
    margin-top: 14rpx;
    text-align: center;
  }
}
@font-face {font-family: 'cn_ZH';
  src: url('//at.alicdn.com/t/webfont_yalomn31oaa.eot'); /* IE9*/
  src: url('//at.alicdn.com/t/webfont_yalomn31oaa.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('//at.alicdn.com/t/webfont_yalomn31oaa.woff') format('woff'), /* chrome、firefox */
  url('//at.alicdn.com/t/webfont_yalomn31oaa.ttf') format('truetype'), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
  url('//at.alicdn.com/t/webfont_yalomn31oaa.svg#思源黑体-极细') format('svg'); /* iOS 4.1- */
}
</style>

