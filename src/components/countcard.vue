<template>
  <div @click="editCard" :class="['card-container',{'noPic':cardInfo.isFree===1||!cardInfo.img}]">
    <div v-if="(cardInfo.isFree===0||cardInfo.isFree===2)&&cardInfo.img" class="pic-container">
      <image class="pic" :src="cardInfo.img" mode="aspectFill"></image>
    </div>
    <div class="content-container">
      <div v-if="cardInfo.title" class="title">{{cardInfo.title}}</div>
      <div :class="[{'freeword':(cardInfo.isFree===0||cardInfo.isFree===2)}]">{{cardInfo.isFree===1?cardInfo.voc:frontWord}}</div>
      <div class="time">{{cardInfo.countTime}}</div>
    </div>
    <div @click.stop="deleteCard" :class="['delete-container', {'delete-show':isDelete&&cardInfo.isFree==1}]">
      <Icon icon="trash"></Icon>
    </div>
  </div>
</template>
<script>
import config from '@/config'
import Icon from '@/components/Icon'
export default {
  data () {
    return {
      isDelete: false
    }
  },
  components: {
    Icon
  },
  methods: {
    // 删除单词卡片
    async deleteCard () {
      const res = await this.$request(`${config.host}/word/deleteCard?id=${this.cardInfo.id}`)
      if (res.success) {
        this.isDelete = false
        this.$message.success('删除成功', 1000)
        this.$emit('deleteCard')
      }
    },
    editCard () {
      if (this.cardInfo.isFree === 1) {
        this.isDelete = !this.isDelete
        return
      }
      this.$store.route = 'voceditcardGroup'
      wx.navigateTo({
        url: `/pages/editcard/main?id=${this.cardInfo.id}`
      })
    },
    loadFonts () {
      wx.loadFontFace({
        family: 'general',
        source: 'url("https://img.xhfkindergarten.cn/PublicaPlay-Regular.otf")'
      })
    }
  },
  computed: {
    frontWord () {
      if (this.cardInfo.front) {
        if (this.cardInfo.front.length > 20) {
          return `${this.cardInfo.front.substring(0, 20)}...`
        } else {
          return this.cardInfo.front
        }
      } else {
        return ''
      }
    }
  },
  props: [
    'cardInfo'
  ],
  mounted () {
    this.loadFonts()
    // wx.loadFontFace({
    //   family: 'Bold',
    //   source: 'url("https://img.xhfkindergarten.cn/ADAM.CG%20PRO.otf")'
    // })
  },
  onShow () {
    this.loadFonts()
  }
}
</script>
<style lang="less" scoped>
.delete-show{
  opacity: 1 !important;
  width: 100rpx !important;
}
.delete-container {
  transition: all 0.5s;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  opacity: 0;
  width: 0;
  background: red;
  display: flex;
  align-items: center;
  justify-content: center;
}
.title{
  font-weight: bold;
  font-size: 50rpx;
}
.freeword{
  font-size: 34rpx;
}
.noPic{
  padding: 30rpx 0;
}
.card-container{
  position: relative;
  background: #F6F6F6;
  margin: 60rpx;
  height: auto;
  width: 100%;
  border-radius: 60rpx;
  overflow: hidden;
  .content-container{
    padding: 30rpx 60rpx;
    font-size: 60rpx;
    font-family: 'general';
    .time{
      font-size: 36rpx;
      color: #707070;
    }
  }
  .pic-container{
    overflow: hidden;
    height: 400rpx;
    width: 100%;
    .pic{
      width: 100%;
      min-height: 100%;
      object-fit: cover;
    }
  }

}
</style>
