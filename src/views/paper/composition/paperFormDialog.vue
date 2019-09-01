<template>
  <!-- 组卷提示框 -->
  <el-dialog
    title="请填写试卷的基本信息"
    width="30%"
    :visible.sync="dialogShowValue"
    :close-on-click-modal="false"
    :show-close="false"
    :close-on-press-escape="false"
  >
    <div class="dialog-content">
      <el-form ref="paperForm" :model="paperData" :rules="paperRule" label-width="80px">
        <el-form-item label="试卷名称" prop="name">
          <el-input v-model="paperData.name" placeholder="请填写试卷名称..." />
        </el-form-item>
        <el-form-item label="试卷类型" prop="paperType">
          <el-select v-model="paperData.paperType" placeholder="请选择试卷类型..">
            <el-option v-for="item in paperTypeList" :key="item.id" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="试卷难度" prop="difficult">
          <el-select v-model="paperData.difficult" placeholder="请选择试卷难度..">
            <el-option v-for="item in difficultList" :key="item.id" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="试卷描述" prop="descript">
          <el-input v-model="paperData.descript" placeholder="请填写试卷描述.." autosize type="textarea" />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="closePaperDialog('paperForm')">取消</el-button>
      <el-button type="danger" @click="validatePaperForm('paperForm')">开始组卷</el-button>
    </div>
  </el-dialog>
</template>
<script>
/**
 * 填写组卷的表单组件
 */
export default {
  name: 'PaperFormDialog',
  props: {
    dialogShow: {
      type: Boolean,
      required: true,
      default: false
    },
    defaultPaperName: {
      type: String,
      required: true
    },
    paperTypeList: {
      type: Array,
      required: true
    },
    difficultList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      paperRule: {
        name: [
          { required: true, message: '请输入试卷名称', trigger: 'blur' }
        ],
        paperType: [
          { required: true, message: '试卷类型不能为空', trigger: 'change' }
        ],
        difficult: [
          { required: true, message: '试卷难度不能为空', trigger: 'change' }
        ]
      },
      dialogShowValue: this.dialogShow,
      paperData: {
        name: '',
        paperType: '',
        difficult: '',
        descript: ''
      }
    }
  },
  watch: {
    dialogShow(val) {
      this.dialogShowValue = val
    },
    dialogShowValue(val) {
      this.$emit('showChange', val)
    },
    defaultPaperName(val) {
      this.paperData.name = this.defaultPaperName
    }
  },
  methods: {
    /**
     * 校验表单
     */
    validatePaperForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogShowValue = false
          this.$emit('startComposition', JSON.parse(JSON.stringify(this.paperData)))
          this.resetForm(formName)
        } else {
          this.$message({
            type: 'error',
            message: '数据格式验证失败！'
          })
        }
      })
    },
    /**
     * 关闭弹窗
     * @param formName
     */
    closePaperDialog(formName) {
      this.dialogShowValue = false
      this.resetForm(formName)
    },
    /**
     * 重置表单
     * @param formName
     */
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
