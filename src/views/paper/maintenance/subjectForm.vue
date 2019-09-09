<template>
  <!-- 组卷提示框 -->
  <el-dialog
    :title="subjectTitle"
    width="60%"
    :visible.sync="dialogShowValue"
    :close-on-click-modal="false"
    :show-close="false"
    :close-on-press-escape="false"
  >
    <div class="dialog-content">
      <el-form ref="subjectData" :model="subjectData" :rules="subjectRule" label-width="80px" class="formClass">
        <el-row>
          <el-col v-if="dialogStatus" :span="12">
            <el-form-item label="题目类型" prop="category">
              <el-select v-model="subjectData.category" placeholder="请选择题目类型.." style="width:100%">
                <el-option v-for="item in categoryList" :key="item.id" :label="item.value" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="dialogStatus?12:24">
            <el-form-item label="题目分数" prop="score">
              <el-input v-model="subjectData.score" placeholder="请输入题目分数..." />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="题目" prop="name">
              <el-input v-model="subjectData.name" :rows="3" type="textarea" placeholder="请输入题目内容..." />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item
            v-for="(answer, index) in subjectData.answers"
            :key="answer.key"
            :label="'答案' + (index + 1)"
            :prop="'answers.' + index + '.answer'"
            :rules="{ required: true, message: '答案不能为空', trigger: 'blur' }"
          >
            <el-col :span="16"><el-input v-model="answer.answer" type="textarea" :rows="2" placeholder="请输入答案内容" /></el-col>
            <el-col :span="4" :offset="1"><el-switch v-model="answer.rightAnswer" active-color="#13ce66" inactive-color="#ff4949" active-text="正 确" inactive-text="错 误" /></el-col>
            <el-col :span="2" :offset="1"><el-button type="danger" size="mini" @click.prevent="removeAnswer(answer)">删除</el-button></el-col>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="warning" @click="addAnswer">新增答案</el-button>
      <el-button type="primary" @click="closePaperDialog('subjectData')">取消</el-button>
      <el-button type="danger" @click="validatePaperForm('subjectData')">提交题目</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { questionType } from '@/utils/subjectType'
/**
 * 填写组卷的表单组件
 */
export default {
  name: 'SubjectForm',
  props: {
    dialogShow: {
      type: Boolean,
      required: true,
      default: false
    },
    dialogStatus: {
      type: Boolean,
      required: false,
      default: true
    },
    subjectTitle: {
      type: String,
      required: false,
      default: '自定义添加题目'
    },
    categoryList: {
      type: Array,
      required: true,
      default: null
    },
    defaultSubjectInfo: {
      type: Object,
      required: false,
      default: null
    }
  },
  data() {
    return {
      subjectRule: {
        name: [
          { required: true, message: '请输入题目内容', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择题目类型', trigger: 'change' }
        ],
        score: [
          { required: true, message: '请输入题目分值', trigger: 'blur' }
        ]
      },
      dialogShowValue: this.dialogShow,
      isNewSubject: false,
      result: {},
      subjectData: {
        name: '',
        category: '',
        score: '',
        answers: [
          {
            id: (new Date()).getTime().toString(),
            answer: '',
            rightAnswer: false
          }
        ]
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
    defaultSubjectInfo(val) {
      // 如果是修改弹框，处理回显数据
      if (!this.dialogStatus) {
        this.subjectData = {
          name: val.subject,
          category: val.categoryId,
          score: val.score,
          answers: val.answers
        }
        if (val.new != null && val.new) {
          this.isNewSubject = true
        }
        this.categoryList.forEach(item => {
          if (item.id === val.categoryId) {
            this.subjectData.category = item.value
          }
        })
      }
    }
  },
  methods: {
    /**
     * 校验表单
     */
    validatePaperForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.result = {
            id: this.dialogStatus ? (new Date()).getTime().toString() : this.defaultSubjectInfo.id,
            score: this.subjectData.score,
            subject: this.subjectData.name,
            answers: this.subjectData.answers
          }
          if (this.dialogStatus || this.isNewSubject) {
            this.result.new = true
          }
          this.categoryList.forEach(item => {
            if (item.value === this.subjectData.category) {
              this.result.categoryId = item.id
              this.result.type = item.attribute
              this.result.typeName = item.value
            }
          })
          if (!this.dealWithAnswer()) { return }
          this.dialogShowValue = false
          this.$emit('submitForm', JSON.parse(JSON.stringify(this.result)))
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
      this.subjectData = {
        name: '',
        category: '',
        score: '',
        answers: [
          {
            id: (new Date()).getTime().toString(),
            answer: '',
            rightAnswer: false
          }
        ]
      }
      this.result = null
    },
    /**
     * 添加答案
     */
    addAnswer() {
      this.subjectData.answers.push({
        id: (new Date()).getTime().toString(),
        answer: '',
        rightAnswer: false
      })
    },
    /**
     * 删除答案
     * @param answer
     */
    removeAnswer(answer) {
      const index = this.subjectData.answers.indexOf(answer)
      if (index !== -1) {
        this.subjectData.answers.splice(index, 1)
      }
    },
    /**
     * 处理答案
     * @returns {boolean}
     */
    dealWithAnswer() {
      if (this.result.answers.length === 0) {
        this.$message({
          type: 'error',
          message: '请添加正确答案！！'
        })
        return false
      }
      let count = 0
      // 单选题
      if (this.result.type === questionType.QUESTION_SINGLE_CHOICE) {
        this.result.answers.forEach(answer => {
          if (answer.rightAnswer) {
            count += 1
            this.result.userAnswer = answer.id
          }
        })
        if (count !== 1) {
          this.$message({
            type: 'error',
            message: '单选题只能存在一个正确答案！！'
          })
          return false
        }
      } else if (this.result.type === questionType.QUESTION_MULTIPLE_CHOICE) {
        this.result.userAnswer = []
        this.result.answers.forEach(answer => {
          if (answer.rightAnswer) { this.result.userAnswer.push(answer.id) }
        })
      } else {
        if (this.result.answers.length !== 1) {
          this.$message({
            type: 'error',
            message: this.result.type + '只能存在一种答案！！'
          })
          return false
        }
        this.result.userAnswer = this.result.answers[0].answer
      }
      return true
    }
  }
}
</script>
<style>
.formClass{
  width: 100%;
}
</style>
