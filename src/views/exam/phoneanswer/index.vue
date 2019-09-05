<template>
  <div v-if="visible" id="phoneanswer">
    <h4>手机答卷</h4>
    <!-- <el-image class="qrcode" :src="qrImage" :preview-src-list="[qrImage]" /> -->
    <img v-bind="{src:''+qrImage }" class="qrcode">
    <!-- <div id="qrCode" ref="qrcode" class="qrcode" />-->
    <!-- <canvas id="canvas" style="width:400px;height:400px;" class="qrcode" ref="canva" /> -->
    <h4>提示:扫描二维码，填写个人信息(手机号、姓名、姓名)点确定开始进行答卷倒计时</h4>
  </div>
</template>
<script>
import QRCode from 'qrcode'

export default {
  name: 'PhoneAnswer',
  data() {
    return {
      visible: false,
      qrImage: '',
      qrCodeUrl: 'http://long95288.github.io/'
    }
  },
  mounted() {
    this.$nextTick(() => {
      const reQrCodeUrl = this.$route.params.qrCodeUrl
      console.log(reQrCodeUrl)
      if (!reQrCodeUrl) {
        this.goBack()
      } else {
        this.qrCodeUrl = reQrCodeUrl
        this.qrcode()
      }
    })
  },
  methods: {
    goBack() {
      this.$confirm(
        '请选择已发布的考试生成二维码',
        '警告',
        {
          confirmButtonText: '确定'
        }
      ).then(() => {
        this.$router.push({ name: 'examPublish' })
      }).catch(() => {
        this.$router.push({ name: 'examPublish' })
      })
    },
    async qrcode() {
      // 配置文件
      const opts = {
        errorCorrectionLevel: 'H',
        type: 'image/jpeg'
      }
      // 获得二维码的图片
      await QRCode.toDataURL(this.qrCodeUrl, opts)
        .then(url => {
          this.qrImage = url
          this.visible = true
        }).catch(err => {
          this.$message({
            type: 'error',
            message: `生成二维码失败${err}`
          })
        })
    }
  }
}
</script>
<style>
#phoneanswer {
  /* text-align: -webkit-center; */
  text-align: center;
  margin-top: 10%;
}
.qrcode {
  /* padding-left: 40%; */
  width: 400px;
  height: auto;
  text-align: center;
}
</style>
