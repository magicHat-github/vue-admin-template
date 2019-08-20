<template>
  <div id="phoneanswer">
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
      qrImage: '',
      qrCodeUrl: 'http://long95288.github.io/'
    }
  },
  mounted() {
    this.$nextTick(() => {
      // this.qrcode()
      this.qrcode()
    })
  },
  methods: {
    // qrcode() {
    //   const qrcode = new QRCode('qrCode', {
    //     text: `${this.qrCodeUrl}`,
    //     render: 'canvas',
    //     width: 400,
    //     height: 400,
    //     colorDark: '#000',
    //     colorLight: '#fff'
    //   })
    //   console.log(qrcode)
    // },
    async qrcode() {
      // 配置文件
      const opts = {
        errorCorrectionLevel: 'H',
        type: 'image/jpeg'
      }

      // const canva = this.$refs.canva
      // QRCode.toCanvas(canva,`${this.qrCodeUrl}`,error => {
      //   if (error) {
      //     this.$message({
      //       type: 'error',
      //       message: '生成二维码失败'
      //     })
      //   } else {
      //     this.$message({
      //       type: 'success',
      //       message: '生成二维码成功'
      //     })
      //   }
      // })
      // 获得二维码的图片
      await QRCode.toDataURL(this.qrCodeUrl, opts)
        .then(url => {
          console.log(url)
          // alert('生成成功')
          this.qrImage = url
        }).catch(err => {
          console.log(err)
        })
      // QRCode.toDataURL(
      //   'text',
      //   opts,
      //   function (err, url) {
      //     // if (err) {
      //     //   this.$message({
      //     //     type: 'error',
      //     //     message: '生成二维码失败'
      //     //   })
      //     // } else {
      //     //   this.$message({
      //     //     type: 'success',
      //     //     message: '生成二维码成功'
      //     //   })
      //       console.log(url)
      //       this.qrImage = url;
      //   // }
      //   }
      // )
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
