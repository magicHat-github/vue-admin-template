<template>
  <!-- 组卷提示框 -->
  <el-dialog title="提示" width="30%" :visible.sync="dialogShowValue" :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
    <div class="dialog-content">
      <div><el-progress type="dashboard" :percentage="percentage" :color="colors" /></div>
      <span style="color: red">{{ message }}</span>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="cancelEnable" type="danger" :disabled="btnDisable" @click="manualStopComposition">取消组卷</el-button>
      <el-button v-if="btnDisable" type="primary" @click="dialogShowValue = false">关闭弹窗</el-button>
    </div>
  </el-dialog>
</template>
<script>
/**
 * 组卷时，进度加载组件
 */
export default {
  name: 'CompositionLoading',
  props: {
    dialogShow: {
      type: Boolean,
      required: true,
      default: false
    },
    cancelEnable: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      dialogShowValue: this.dialogShow,
      percentage: 0,
      colors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ],
      message: '正在组卷.....',
      btnDisable: false,
      closeTime: 5000,
      timeOut: null,
      timeInterval: null
    }
  },
  watch: {
    dialogShow(val) {
      this.dialogShowValue = val
    },
    dialogShowValue(val) {
      this.$emit('showChange', val)
    }
  },
  methods: {
    /**
     * 页面初始化
     */
    init() {
      this.percentage = 1
      this.timeInterval = null
      this.message = '正在组卷.....'
      this.btnDisable = false
      this.startCount()
      if (this.timeOut != null) {
        clearTimeout(this.timeOut)
      }
    },
    /**
     * 开始计时，增加进度条
     */
    startCount() {
      this.timeInterval = setInterval(this.addPercentage, 1000)
    },
    /**
     * 增加进度条
     */
    addPercentage() {
      if (this.percentage >= 100) {
        this.stopComposition('组卷超时...请稍后再试，即将关闭窗口！', false)
        // 取消请求的传递
        this.$emit('cancelRequest')
      } else {
        this.percentage += 2
      }
    },
    /**
     * 停止计时
     */
    stopCount() {
      clearInterval(this.timeInterval)
    },
    /**
     * 停止组卷
     */
    stopComposition(message, success) {
      this.stopCount()
      this.btnDisable = true
      this.percentage = success ? 100 : this.percentage
      this.message = message
      this.timeOut = setTimeout(() => {
        this.dialogShowValue = false
      }, this.closeTime)
    },
    /**
     * 手动进行关闭组卷
     */
    manualStopComposition() {
      this.stopComposition('您已停止了组卷，弹窗即将关闭！', false)
      // 取消请求的传递
      this.$emit('cancelRequest')
    }
  }
}
</script>
<style>
.dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
