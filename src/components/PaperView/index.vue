<template>
  <div>
    <!-- 试卷详情 -->
    <el-drawer title="试卷详情" :size="size" :visible.sync="pageShowCache" :wrapper-closable="closable">
      试卷详情
    </el-drawer>
  </div>
</template>
<script>
export default {
  name: 'PaperView',
  props: {
    pageShow: {
      type: Boolean,
      required: true,
      default: false
    },
    closable: {
      type: Boolean,
      required: false,
      default: false
    },
    size: {
      type: String,
      required: false,
      default: '60%'
    },
    paperInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      pageShowCache: this.pageShow,
      paperInfoCache: this.paperInfo
    }
  },
  watch: {
    pageShow(val) {
      this.pageShowCache = val
    },
    pageShowCache(val) {
      this.$emit('showChange', val)
    }
  }
}
</script>
